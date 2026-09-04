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

function formatTreatment(suggestion: KindwiseSuggestion): string {
  const treatment = suggestion.details?.treatment;
  if (!treatment) return '';
  const parts: string[] = [];
  if (treatment.chemical && treatment.chemical.length > 0) {
    parts.push(`Chemical: ${treatment.chemical.join('. ')}.`);
  }
  if (treatment.biological && treatment.biological.length > 0) {
    parts.push(`Biological: ${treatment.biological.join('. ')}.`);
  }
  if (treatment.prevention && treatment.prevention.length > 0) {
    parts.push(`Prevention: ${treatment.prevention.join('. ')}.`);
  }
  return parts.join(' ');
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

  console.log('Calling Kindwise crop.health API...');

  let response: Response;
  try {
    response = await fetch('https://crop.kindwise.com/api/v1/identification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        images: [imageBase64],
        details: 'treatment,common_names,taxonomy',
        language,
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
  const recommendation = formatTreatment(topDisease) || 'Consult your local agricultural officer for treatment advice.';

  return {
    result: {
      diseaseId: matchDiseaseId(topDisease.name, cropId),
      diseaseName: topDisease.name,
      confidence,
      level: getConfidenceLevel(confidence),
      recommendation,
      detectedCropName: topCrop.name,
      source: 'ai',
    },
  };
}
