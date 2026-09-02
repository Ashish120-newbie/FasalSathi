import { supabase } from './supabase';
import type {
  Crop,
  CropScan,
  Diagnosis,
  ExpertReview,
  Farm,
  Notification,
  Profile,
  ScanWithRelations,
  SchemeBookmark,
  Symptom,
  WeatherContext,
} from './db-types';
import { schemes, type SchemeDetail, type FarmerCategory } from '@/data/schemes';
import type { CropId } from '@/data/types';

// ──────────────────────────────────────────────────────────────
// Profiles
// ──────────────────────────────────────────────────────────────

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, phone, state, created_at, updated_at')
    .maybeSingle();
  if (error) throw new Error('Could not load your profile.');
  return (data as Profile) ?? null;
}

export async function updateProfile(updates: {
  display_name?: string;
  phone?: string;
  state?: string;
}): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', (await supabase.auth.getUser()).data.user?.id);
  if (error) throw new Error('Could not update your profile.');
}

// ──────────────────────────────────────────────────────────────
// Farms
// ──────────────────────────────────────────────────────────────

export async function listFarms(): Promise<Farm[]> {
  const { data, error } = await supabase
    .from('farms')
    .select('id, user_id, name, location, size_acres, state, created_at, updated_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load your farms.');
  return (data as Farm[]) ?? [];
}

export async function createFarm(input: {
  name: string;
  location?: string;
  size_acres?: number;
  state?: string;
}): Promise<Farm> {
  const { data, error } = await supabase
    .from('farms')
    .insert(input)
    .select('id, user_id, name, location, size_acres, state, created_at, updated_at')
    .single();
  if (error) throw new Error('Could not create the farm.');
  return data as Farm;
}

export async function deleteFarm(id: string): Promise<void> {
  const { error } = await supabase.from('farms').delete().eq('id', id);
  if (error) throw new Error('Could not delete the farm.');
}

// ──────────────────────────────────────────────────────────────
// Crops
// ──────────────────────────────────────────────────────────────

export async function listCrops(farmId: string): Promise<Crop[]> {
  const { data, error } = await supabase
    .from('crops')
    .select('id, farm_id, crop_type, variety, growth_stage, planted_at, created_at, updated_at')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load crops.');
  return (data as Crop[]) ?? [];
}

export async function createCrop(input: {
  farm_id: string;
  crop_type: string;
  variety?: string;
  growth_stage: string;
  planted_at?: string;
}): Promise<Crop> {
  const { data, error } = await supabase
    .from('crops')
    .insert(input)
    .select('id, farm_id, crop_type, variety, growth_stage, planted_at, created_at, updated_at')
    .single();
  if (error) throw new Error('Could not create the crop record.');
  return data as Crop;
}

// ──────────────────────────────────────────────────────────────
// Scans — via edge function for image upload
// ──────────────────────────────────────────────────────────────

export interface CreateScanInput {
  farmId: string;
  cropId: string;
  growthStage: string;
  imageBase64: string;
  imageContentType: string;
  notes?: string;
  symptoms?: string[];
  weather?: {
    temperatureC?: number;
    humidityPct?: number;
    rainfallMm?: number;
    conditions?: string;
  };
}

export async function createScan(input: CreateScanInput): Promise<CropScan> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error('You must be signed in to create a scan.');

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-management`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Could not upload the scan. Please try again.');
  }

  const { scan } = await response.json();
  return scan as CropScan;
}

export async function listScans(limit = 20, offset = 0): Promise<ScanWithRelations[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error('You must be signed in to view scans.');

  const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-management`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Could not load your scans.');
  }

  const { scans } = await response.json();
  return scans as ScanWithRelations[];
}

export async function getScan(scanId: string): Promise<ScanWithRelations> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error('You must be signed in to view a scan.');

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-management/${scanId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) throw new Error('Scan not found.');
    throw new Error('Could not load the scan.');
  }

  const { scan } = await response.json();
  return scan as ScanWithRelations;
}

// ──────────────────────────────────────────────────────────────
// Diagnoses
// ──────────────────────────────────────────────────────────────

export async function createDiagnosis(input: {
  scan_id: string;
  disease_name: string;
  confidence_score: number;
  confidence_level: 'high' | 'medium' | 'low';
  description?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  affected_region?: { x: number; y: number; width: number; height: number };
  treatment?: string[];
  source?: 'ai' | 'officer';
}): Promise<Diagnosis> {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert({ ...input, source: input.source ?? 'ai' })
    .select('id, scan_id, disease_name, confidence_score, confidence_level, description, severity, affected_region, treatment, source, created_at, updated_at')
    .single();
  if (error) throw new Error('Could not save the diagnosis.');
  return data as Diagnosis;
}

// ──────────────────────────────────────────────────────────────
// Symptoms
// ──────────────────────────────────────────────────────────────

export async function listSymptoms(scanId: string): Promise<Symptom[]> {
  const { data, error } = await supabase
    .from('symptoms')
    .select('id, scan_id, symptom, created_at')
    .eq('scan_id', scanId);
  if (error) throw new Error('Could not load symptoms.');
  return (data as Symptom[]) ?? [];
}

// ──────────────────────────────────────────────────────────────
// Weather Context
// ──────────────────────────────────────────────────────────────

export async function getWeatherContext(scanId: string): Promise<WeatherContext | null> {
  const { data, error } = await supabase
    .from('weather_context')
    .select('id, scan_id, temperature_c, humidity_pct, rainfall_mm, conditions, recorded_at')
    .eq('scan_id', scanId)
    .maybeSingle();
  if (error) throw new Error('Could not load weather data.');
  return (data as WeatherContext) ?? null;
}

// ──────────────────────────────────────────────────────────────
// Expert Reviews — via RPC functions
// ──────────────────────────────────────────────────────────────

export async function assignReview(scanId: string): Promise<string> {
  const { data, error } = await supabase.rpc('assign_review', { p_scan_id: scanId });
  if (error) throw new Error('Could not assign the review.');
  return data as string;
}

export async function submitReview(input: {
  scanId: string;
  status: 'approved' | 'corrected';
  correctedDiagnosis?: string;
  note?: string;
}): Promise<string> {
  const { data, error } = await supabase.rpc('create_review', {
    p_scan_id: input.scanId,
    p_status: input.status,
    p_corrected_diagnosis: input.correctedDiagnosis ?? null,
    p_note: input.note ?? null,
  });
  if (error) throw new Error('Could not submit the review.');
  return data as string;
}

export async function listReviewsForOfficer(): Promise<ExpertReview[]> {
  const { data, error } = await supabase
    .from('expert_reviews')
    .select('id, scan_id, officer_id, status, assigned_at, reviewed_at, corrected_diagnosis, note, created_at, updated_at')
    .eq('officer_id', (await supabase.auth.getUser()).data.user?.id)
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load your review queue.');
  return (data as ExpertReview[]) ?? [];
}

export async function listEscalatedScans(): Promise<ScanWithRelations[]> {
  const { data, error } = await supabase
    .from('crop_scans')
    .select(`
      id, user_id, farm_id, crop_id, image_url, image_path, growth_stage, notes, status, created_at, updated_at,
      diagnoses (id, scan_id, disease_name, confidence_score, confidence_level, description, severity, affected_region, treatment, source, created_at, updated_at),
      expert_reviews (id, scan_id, officer_id, status, assigned_at, reviewed_at, corrected_diagnosis, note, created_at, updated_at)
    `)
    .eq('status', 'escalated')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load escalated cases.');
  return (data as ScanWithRelations[]) ?? [];
}

// ──────────────────────────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────────────────────────

export async function listNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, user_id, type, title, body, related_scan_id, read, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load notifications.');
  return (data as Notification[]) ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw new Error('Could not update the notification.');
}

// ──────────────────────────────────────────────────────────────
// Image URL helper — get a signed URL for private bucket images
// ──────────────────────────────────────────────────────────────

export async function getSignedImageUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('scan-images').createSignedUrl(path, 3600);
  if (error) throw new Error('Could not load the image.');
  return data.signedUrl;
}

// ──────────────────────────────────────────────────────────────
// Scheme Bookmarks — per-user saved schemes
// ──────────────────────────────────────────────────────────────

export async function listBookmarks(): Promise<SchemeBookmark[]> {
  const { data, error } = await supabase
    .from('scheme_bookmarks')
    .select('id, user_id, scheme_id, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Could not load your saved schemes.');
  return (data as SchemeBookmark[]) ?? [];
}

export async function addBookmark(schemeId: string): Promise<SchemeBookmark> {
  const { data, error } = await supabase
    .from('scheme_bookmarks')
    .insert({ scheme_id: schemeId })
    .select('id, user_id, scheme_id, created_at')
    .single();
  if (error) {
    if (error.code === '23505') throw new Error('You have already saved this scheme.');
    throw new Error('Could not save the scheme.');
  }
  return data as SchemeBookmark;
}

export async function removeBookmark(schemeId: string): Promise<void> {
  const { error } = await supabase
    .from('scheme_bookmarks')
    .delete()
    .eq('scheme_id', schemeId);
  if (error) throw new Error('Could not remove the saved scheme.');
}

// ──────────────────────────────────────────────────────────────
// Scheme Recommendations — structured matching, NOT AI-generated
// ──────────────────────────────────────────────────────────────

export interface FarmerContext {
  state: string | null;
  crop: CropId | null;
  farmSizeAcres: number | null;
  farmerCategory: FarmerCategory | null;
}

export function getRecommendedSchemes(ctx: FarmerContext): SchemeDetail[] {
  return schemes.filter((scheme) => {
    if (!scheme.isActive) return false;

    const stateMatch =
      scheme.applicableStates.includes('All India') ||
      (ctx.state ? scheme.applicableStates.includes(ctx.state) : false);
    if (!stateMatch) return false;

    const cropMatch =
      scheme.eligibleCrops === 'all' ||
      (ctx.crop ? (scheme.eligibleCrops as CropId[]).includes(ctx.crop) : true);
    if (!cropMatch) return false;

    const categoryMatch =
      ctx.farmerCategory === null ||
      scheme.eligibleFarmerCategories.includes('all') ||
      scheme.eligibleFarmerCategories.includes(ctx.farmerCategory);
    if (!categoryMatch) return false;

    return true;
  });
}
