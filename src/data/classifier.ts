import { diseases } from './diseases';
import { cropById } from './crops';
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

interface AIDiagnosisResponse {
  is_crop: boolean;
  diagnosis?: string;
  confidence?: number;
  affected_area?: string;
  recommendation?: string;
}

interface AIErrorResponse {
  error: string;
  code: string;
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

export async function classifyCropImage(
  cropId: CropId,
  growthStage: string,
  imageDataUrl: string,
  language: string = 'en',
): Promise<ClassificationOutcome> {
  const base64Match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    return { error: new DiagnosisError('Could not read the image. Please try a different photo.', 'INVALID_IMAGE') };
  }
  const [, imageContentType, imageBase64] = base64Match;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: new DiagnosisError('SERVICE_UNAVAILABLE', 'SERVICE_UNAVAILABLE') };
  }

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/functions/v1/ai-diagnosis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        imageBase64,
        imageContentType,
        cropType: cropById(cropId).name,
        growthStage,
        language,
      }),
    });
  } catch {
    return { error: new DiagnosisError('NETWORK_ERROR', 'NETWORK_ERROR') };
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: '', code: 'UNKNOWN' }));
    const code = errorBody.code || 'DIAGNOSIS_FAILED';
    if (errorBody.debug) {
      console.error('[ai-diagnosis] raw debug info:', errorBody.debug);
    }
    return { error: new DiagnosisError(errorBody.error || code, code, errorBody.debug) };
  }

  const data: AIDiagnosisResponse = await response.json();

  if (data.is_crop === false) {
    return { notACrop: true };
  }

  const confidence = Math.max(0, Math.min(100, Math.round(data.confidence ?? 0)));

  return {
    result: {
      diseaseId: matchDiseaseId(data.diagnosis || 'Unknown', cropId),
      diseaseName: data.diagnosis || 'Unknown',
      confidence,
      level: getConfidenceLevel(confidence),
      affectedArea: data.affected_area || undefined,
      recommendation: data.recommendation || undefined,
      source: 'ai',
    },
  };
}
