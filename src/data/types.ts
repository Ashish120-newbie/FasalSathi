export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type GrowthStage =
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'grain-filling'
  | 'maturity';

export type CropId =
  | 'wheat'
  | 'rice'
  | 'cotton'
  | 'tomato'
  | 'potato'
  | 'sugarcane'
  | 'maize'
  | 'soybean'
  | 'groundnut'
  | 'mustard'
  | 'chickpea'
  | 'onion'
  | 'chili'
  | 'banana'
  | 'brinjal'
  | 'okra';

export interface Crop {
  id: CropId;
  name: string;
  emoji: string;
  stages: GrowthStage[];
}

export interface Disease {
  id: string;
  name: string;
  cropId: CropId;
  description: string;
  symptoms: string[];
  treatment: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export interface ClassifierResult {
  diseaseId: string;
  diseaseName: string;
  confidence: number;
  level: ConfidenceLevel;
  affectedRegion?: AffectedRegion;
  affectedArea?: string;
  recommendation?: string;
  description?: string;
  detectedCropName?: string;
  source: 'ai' | 'offline';
}

export interface AffectedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScanRecord {
  id: string;
  imageDataUrl: string;
  cropId: CropId;
  growthStage: GrowthStage;
  result: ClassifierResult;
  createdAt: number;
  escalated: boolean;
  officerReview?: OfficerReview;
}

export interface OfficerReview {
  status: 'pending' | 'approved' | 'corrected';
  officerName: string;
  correctedDiagnosis?: string;
  reviewedAt?: number;
  note?: string;
}

export interface StageResult {
  timing: string;
  note: string;
  n: number; p: number; k: number;
  ureaKg: number; dapKg: number; mopKg: number;
}
export interface FertilizerPlan {
  cropId: CropId;
  landSizeAcres: number;
  totalNpk: { n: number; p: number; k: number };
  totalFertilizerKg: { urea: number; dap: number; mop: number };
  stages: StageResult[];
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatContext {
  cropType?: string;
  growthStage?: string;
  diagnosis?: string;
  confidence?: number;
  confidenceLevel?: string;
  recommendation?: string;
  source?: string;
}


