import { diseases } from './diseases';
import type { ClassifierResult, CropId } from './types';

export function getConfidenceLevel(confidence: number): ClassifierResult['level'] {
  if (confidence >= 75) return 'high';
  if (confidence >= 40) return 'medium';
  return 'low';
}

export class DiagnosisError extends Error {
  code: string;
  debug?: unknown;
  constructor(message: string, code: string = 'DIAGNOSIS_FAILED', debug?: unknown) {
    super(message);
    this.name = 'DiagnosisError';
    this.code = code;
    this.debug = debug;
  }
}

interface KindwiseSuggestion {
  name: string;
  probability: number;
  details?: {
    treatment?: {
      biological?: string[];
      chemical?: string[];
      prevention?: string[];
    };
    description?: string;
    common_names?: string[];
    taxonomy?: { class?: string; family?: string; genus?: string; species?: string };
    url?: string;
  };
}

interface KindwiseResponse {
  result?: {
    is_plant?: boolean;
    crop?: {
      suggestions: KindwiseSuggestion[];
    };
    disease?: {
      suggestions: KindwiseSuggestion[];
    };
  };
  error?: string;
}

export interface ClassificationOutcome {
  result?: ClassifierResult;
  notACrop?: boolean;
  error?: DiagnosisError;
}

// ── Language mapping: app language → Kindwise API language code ──
const KINDWISE_LANG_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  te: 'te',
  mr: 'mr',
  ta: 'ta',
};

function kindwiseLang(appLang: string): string {
  return KINDWISE_LANG_MAP[appLang] ?? 'en';
}

// ── Translation cache: keyed by `${originalTextHash}|${targetLang}` ──
interface CachedTranslation {
  description: string;
  treatment: string[];
  prevention: string[];
}
const translationCache = new Map<string, CachedTranslation>();

function cacheKey(description: string, treatment: string[], prevention: string[], lang: string): string {
  const combined = description + '||' + treatment.join('|') + '||' + prevention.join('|');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
  }
  return `${hash}|${lang}`;
}

// ── Heuristic: detect if text is likely English (for non-English app languages) ──
function looksLikeEnglish(text: string): boolean {
  if (!text) return false;
  const asciiLetters = (text.match(/[a-zA-Z]/g) ?? []).length;
  const totalLetters = text.replace(/[\s\d\p{P}]/gu, '').length;
  if (totalLetters === 0) return true;
  return asciiLetters / totalLetters > 0.7;
}

// ── Fallback translation via Gemini edge function ──
async function translateViaGemini(
  description: string,
  treatment: string[],
  prevention: string[],
  targetLang: string,
): Promise<CachedTranslation | null> {
  const textsToTranslate: string[] = [];
  const descIdx = 0;
  textsToTranslate.push(description);
  const treatmentIndices: number[] = [];
  treatment.forEach((t, i) => {
    treatmentIndices.push(textsToTranslate.length);
    textsToTranslate.push(t);
  });
  const preventionIndices: number[] = [];
  prevention.forEach((p, i) => {
    preventionIndices.push(textsToTranslate.length);
    textsToTranslate.push(p);
  });

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return null;

    const response = await fetch(`${supabaseUrl}/functions/v1/ai-translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ texts: textsToTranslate, targetLang }),
    });

    if (!response.ok) {
      console.warn('[Translation] Edge function returned non-OK:', response.status);
      return null;
    }

    const data = await response.json();
    const translations: string[] = data.translations ?? [];
    if (translations.length !== textsToTranslate.length) {
      console.warn('[Translation] Mismatch: expected', textsToTranslate.length, 'got', translations.length);
      return null;
    }

    return {
      description: translations[descIdx] || description,
      treatment: treatmentIndices.map((idx) => translations[idx] || treatment[idx - 1] || ''),
      prevention: preventionIndices.map((idx) => translations[idx] || prevention[idx - treatment.length - 1] || ''),
    };
  } catch (err) {
    console.warn('[Translation] Fallback failed:', err);
    return null;
  }
}

function matchDiseaseId(diagnosisName: string, cropId: CropId): string {
  const lower = diagnosisName.toLowerCase();
  const cropDiseases = diseases.filter((d) => d.cropId === cropId);
  const match = cropDiseases.find((d) => d.name.toLowerCase() === lower);
  if (match) return match.id;
  const partial = cropDiseases.find((d) => lower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lower));
  if (partial) return partial.id;
  const anyMatch = diseases.find((d) => lower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lower));
  if (anyMatch) return anyMatch.id;
  return 'unknown';
}

interface TreatmentData {
  prevention: string[];
  treatment: string[];
  description: string;
}

function extractTreatmentData(suggestion: KindwiseSuggestion): TreatmentData {
  const treatment = suggestion.details?.treatment;
  const prevention = treatment?.prevention ?? [];
  const treatmentSteps: string[] = [
    ...(treatment?.chemical ?? []),
    ...(treatment?.biological ?? []),
  ];
  const description = suggestion.details?.description ?? '';
  return { prevention, treatment: treatmentSteps, description };
}

export async function classifyCropImage(
  cropId: CropId,
  _growthStage: string,
  imageDataUrl: string,
  language: string = 'en',
): Promise<ClassificationOutcome> {
  const base64Match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    return { error: new DiagnosisError('Could not read the image. Please try a different photo.', 'INVALID_IMAGE') };
  }
  const [, , imageBase64] = base64Match;

  const apiKey = import.meta.env.VITE_KINDWISE_API_KEY;
  console.log('[Kindwise] VITE_KINDWISE_API_KEY found:', Boolean(apiKey), apiKey ? `starts with ${apiKey.slice(0, 4)}...` : '(empty)');
  if (!apiKey) {
    return { error: new DiagnosisError('API_KEY_MISSING', 'API_KEY_MISSING') };
  }

  const kwLang = kindwiseLang(language);
  console.log(`[Kindwise] Calling crop.health API with language=${kwLang} (app lang: ${language})`);

  let response: Response;
  try {
    response = await fetch(`https://crop.kindwise.com/api/v1/identification?details=treatment,description&language=${encodeURIComponent(kwLang)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        images: [imageBase64],
      }),
    });
  } catch {
    return { error: new DiagnosisError('KINDWISE_FETCH_FAILED', 'KINDWISE_FETCH_FAILED') };
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    return {
      error: new DiagnosisError(
        'KINDWISE_API_ERROR',
        'KINDWISE_API_ERROR',
        { status: response.status, body: errorBody.slice(0, 500) },
      ),
    };
  }

  const data: KindwiseResponse = await response.json();

  if (data.result?.is_plant === false) {
    return { notACrop: true };
  }

  const cropSuggestions = data.result?.crop?.suggestions ?? [];
  const diseaseSuggestions = data.result?.disease?.suggestions ?? [];

  if (cropSuggestions.length === 0 || (cropSuggestions[0].probability < 0.5 && !data.result?.is_plant)) {
    return { notACrop: true };
  }

  const topCrop = cropSuggestions[0];
  const topDisease = diseaseSuggestions[0];

  if (!topDisease || topDisease.probability < 0.1) {
    return {
      result: {
        diseaseId: 'unknown',
        diseaseName: 'Healthy',
        confidence: Math.round((topCrop.probability ?? 0) * 100),
        level: getConfidenceLevel(Math.round((topCrop.probability ?? 0) * 100)),
        detectedCropName: topCrop.name,
        recommendation: 'No issues detected. Your crop looks healthy!',
        source: 'ai',
      },
    };
  }

  const confidence = Math.round((topDisease.probability ?? 0) * 100);
  const { prevention, treatment, description } = extractTreatmentData(topDisease);

  let finalDescription = description;
  let finalTreatment = treatment;
  let finalPrevention = prevention;
  let translationPath = 'native';

  // ── If non-English app language, check if Kindwise actually localized the content ──
  if (language !== 'en' && kwLang !== 'en') {
    const descIsEnglish = looksLikeEnglish(description);
    const treatmentIsEnglish = treatment.some((t) => looksLikeEnglish(t));
    const needsFallback = descIsEnglish || treatmentIsEnglish;

    if (needsFallback) {
      console.log(`[Translation] Kindwise returned English content for lang=${kwLang}. Checking cache...`);

      const key = cacheKey(description, treatment, prevention, language);
      const cached = translationCache.get(key);

      if (cached) {
        console.log(`[Translation] Cache HIT for lang=${language}. Using cached translation.`);
        finalDescription = cached.description;
        finalTreatment = cached.treatment;
        finalPrevention = cached.prevention;
        translationPath = 'fallback-cached';
      } else {
        console.log(`[Translation] Cache MISS. Calling Gemini translation edge function...`);
        const translated = await translateViaGemini(description, treatment, prevention, language);

        if (translated) {
          console.log(`[Translation] Gemini fallback succeeded for lang=${language}.`);
          finalDescription = translated.description;
          finalTreatment = translated.treatment;
          finalPrevention = translated.prevention;
          translationCache.set(key, translated);
          translationPath = 'fallback-gemini';
        } else {
          console.warn(`[Translation] Gemini fallback FAILED for lang=${language}. Using original English text.`);
          translationPath = 'fallback-failed';
        }
      }
    } else {
      console.log(`[Translation] Kindwise natively localized content for lang=${kwLang}. No fallback needed.`);
      translationPath = 'native';
    }
  } else {
    console.log(`[Translation] English app language — no translation needed.`);
    translationPath = 'none';
  }

  console.log(`[Translation] Final path used: ${translationPath}`);

  const recommendation = [...finalPrevention, ...finalTreatment].join(' ') || 'Consult your local agricultural officer for treatment advice.';

  return {
    result: {
      diseaseId: matchDiseaseId(topDisease.name, cropId),
      diseaseName: topDisease.name,
      confidence,
      level: getConfidenceLevel(confidence),
      recommendation,
      preventionSteps: finalPrevention,
      treatmentSteps: finalTreatment,
      description: finalDescription,
      detectedCropName: topCrop.name,
      source: 'ai',
    },
  };
}
