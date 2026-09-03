export type UserRole = 'farmer' | 'officer';

export type ScanStatus = 'pending' | 'diagnosed' | 'escalated' | 'reviewed';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ReviewStatus = 'pending' | 'approved' | 'corrected';

export type NotificationType =
  | 'scan_complete'
  | 'review_assigned'
  | 'review_complete'
  | 'review_updated'
  | 'general';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string | null;
  phone: string | null;
  state: string | null;
  district: string | null;
  village: string | null;
  crops: string[] | null;
  land_size_acres: number | null;
  preferred_language: string | null;
  mobile: string | null;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location: string | null;
  size_acres: number | null;
  state: string | null;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  farm_id: string;
  crop_type: string;
  variety: string | null;
  growth_stage: string;
  planted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CropScan {
  id: string;
  user_id: string;
  farm_id: string;
  crop_id: string;
  image_url: string;
  image_path: string;
  growth_stage: string;
  notes: string | null;
  status: ScanStatus;
  created_at: string;
  updated_at: string;
}

export interface Diagnosis {
  id: string;
  scan_id: string;
  disease_name: string;
  confidence_score: number;
  confidence_level: ConfidenceLevel;
  description: string | null;
  severity: 'mild' | 'moderate' | 'severe' | null;
  affected_region: { x: number; y: number; width: number; height: number } | null;
  treatment: string[] | null;
  source: 'ai' | 'officer';
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: string;
  scan_id: string;
  symptom: string;
  created_at: string;
}

export interface WeatherContext {
  id: string;
  scan_id: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  rainfall_mm: number | null;
  conditions: string | null;
  recorded_at: string;
}

export interface ExpertReview {
  id: string;
  scan_id: string;
  officer_id: string;
  status: ReviewStatus;
  assigned_at: string;
  reviewed_at: string | null;
  corrected_diagnosis: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  related_scan_id: string | null;
  read: boolean;
  created_at: string;
}

export interface ScanWithRelations extends CropScan {
  diagnoses: Diagnosis[];
  symptoms: Symptom[];
  weather_context: WeatherContext[];
  expert_reviews: ExpertReview[];
}

export interface SchemeBookmark {
  id: string;
  user_id: string;
  scheme_id: string;
  created_at: string;
}
