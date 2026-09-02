/*
# Create CropGuard AI Core Schema — Tables, Indexes, and Helper Functions

## Overview
This migration creates the foundational database schema for CropGuard AI, a crop disease
diagnosis platform. It establishes all entity tables with proper foreign keys, indexes,
timestamps, and helper functions for authorization.

## New Tables

1. **profiles** — Extends Supabase auth.users with a role (farmer/officer), display name, phone, and state.
2. **farms** — A farmer's farm record. Every farm belongs to an authenticated user.
3. **crops** — A crop planted on a farm. Every crop belongs to a farm.
4. **crop_scans** — A scan (photo + metadata) of a crop. Every scan belongs to a user, farm, and crop.
5. **diagnoses** — AI or manual diagnosis result for a scan. Every diagnosis belongs to a scan.
6. **symptoms** — Observed symptoms for a scan (multiple rows per scan).
7. **weather_context** — Weather metadata captured at scan time. One row per scan.
8. **expert_reviews** — An officer's review of a scan. Every review belongs to a scan and an officer.
9. **notifications** — User notifications (scan results, review updates, etc).

## Helper Functions

- **get_user_role()** — Returns the calling user's role from profiles (SECURITY DEFINER).
- **assign_review()** — Assigns a pending scan to the calling officer (SECURITY DEFINER).
- **create_review()** — Officer submits a review (approve/correct) for a scan (SECURITY DEFINER).
- **handle_new_user()** — Trigger: auto-creates a profile row when a new auth user signs up.

## Indexes
- Foreign key columns indexed for join performance.
- Composite indexes on frequently filtered columns (e.g., crop_scans by user + farm + crop).

## Notes
- All timestamps use timestamptz with DEFAULT now().
- All primary keys are uuid with DEFAULT gen_random_uuid().
- Foreign keys use ON DELETE CASCADE for child ownership chains.
- Roles are stored in profiles.role, which is NOT client-writable (enforced via column privileges in migration 02).
*/

-- ============================================================================
-- 1. profiles table
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'officer')),
  display_name text,
  phone text,
  state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================================
-- 2. farms table
-- ============================================================================
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  size_acres numeric(10,2),
  state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);

-- ============================================================================
-- 3. crops table
-- ============================================================================
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  variety text,
  growth_stage text NOT NULL DEFAULT 'seedling',
  planted_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crops_farm_id ON crops(farm_id);

-- ============================================================================
-- 4. crop_scans table
-- ============================================================================
CREATE TABLE IF NOT EXISTS crop_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  crop_id uuid NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_path text NOT NULL,
  growth_stage text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'diagnosed', 'escalated', 'reviewed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crop_scans_user_id ON crop_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_scans_farm_id ON crop_scans(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_scans_crop_id ON crop_scans(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_scans_status ON crop_scans(status);
CREATE INDEX IF NOT EXISTS idx_crop_scans_created_at ON crop_scans(created_at DESC);

-- ============================================================================
-- 5. diagnoses table
-- ============================================================================
CREATE TABLE IF NOT EXISTS diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES crop_scans(id) ON DELETE CASCADE,
  disease_name text NOT NULL,
  confidence_score integer NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  confidence_level text NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  description text,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  affected_region jsonb,
  treatment jsonb,
  source text NOT NULL DEFAULT 'ai' CHECK (source IN ('ai', 'officer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_scan_id ON diagnoses(scan_id);

-- ============================================================================
-- 6. symptoms table
-- ============================================================================
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES crop_scans(id) ON DELETE CASCADE,
  symptom text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_symptoms_scan_id ON symptoms(scan_id);

-- ============================================================================
-- 7. weather_context table
-- ============================================================================
CREATE TABLE IF NOT EXISTS weather_context (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL UNIQUE REFERENCES crop_scans(id) ON DELETE CASCADE,
  temperature_c numeric(5,2),
  humidity_pct numeric(5,2),
  rainfall_mm numeric(8,2),
  conditions text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_weather_context_scan_id ON weather_context(scan_id);

-- ============================================================================
-- 8. expert_reviews table
-- ============================================================================
CREATE TABLE IF NOT EXISTS expert_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES crop_scans(id) ON DELETE CASCADE,
  officer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'corrected')),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  corrected_diagnosis text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expert_reviews_scan_id ON expert_reviews(scan_id);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_officer_id ON expert_reviews(officer_id);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_status ON expert_reviews(status);

-- ============================================================================
-- 9. notifications table
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('scan_complete', 'review_assigned', 'review_complete', 'review_updated', 'general')),
  title text NOT NULL,
  body text,
  related_scan_id uuid REFERENCES crop_scans(id) ON DELETE SET NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- ============================================================================
-- Helper: updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all tables with updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_farms_updated_at ON farms;
CREATE TRIGGER trg_farms_updated_at BEFORE UPDATE ON farms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_crops_updated_at ON crops;
CREATE TRIGGER trg_crops_updated_at BEFORE UPDATE ON crops
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_crop_scans_updated_at ON crop_scans;
CREATE TRIGGER trg_crop_scans_updated_at BEFORE UPDATE ON crop_scans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_diagnoses_updated_at ON diagnoses;
CREATE TRIGGER trg_diagnoses_updated_at BEFORE UPDATE ON diagnoses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_expert_reviews_updated_at ON expert_reviews;
CREATE TRIGGER trg_expert_reviews_updated_at BEFORE UPDATE ON expert_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- Helper: auto-create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- Helper: get_user_role (SECURITY DEFINER — safe to call from policies)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION get_user_role FROM anon;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;

-- ============================================================================
-- Helper: assign_review — officer claims a pending escalated scan
-- ============================================================================
CREATE OR REPLACE FUNCTION assign_review(p_scan_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_review_id uuid;
  v_caller_role text;
BEGIN
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role <> 'officer' THEN
    RAISE EXCEPTION 'Only officers can claim reviews';
  END IF;

  INSERT INTO public.expert_reviews (scan_id, officer_id, status)
  VALUES (p_scan_id, auth.uid(), 'pending')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_review_id;

  IF v_review_id IS NOT NULL THEN
    UPDATE public.crop_scans SET status = 'escalated' WHERE id = p_scan_id;
  END IF;

  RETURN v_review_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION assign_review FROM anon;
GRANT EXECUTE ON FUNCTION assign_review TO authenticated;

-- ============================================================================
-- Helper: create_review — officer submits their review (approve or correct)
-- ============================================================================
CREATE OR REPLACE FUNCTION create_review(
  p_scan_id uuid,
  p_status text,
  p_corrected_diagnosis text DEFAULT NULL,
  p_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_review_id uuid;
  v_caller_role text;
BEGIN
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role <> 'officer' THEN
    RAISE EXCEPTION 'Only officers can submit reviews';
  END IF;

  IF p_status NOT IN ('approved', 'corrected') THEN
    RAISE EXCEPTION 'Invalid review status';
  END IF;

  -- Find the review assigned to this officer for this scan
  SELECT id INTO v_review_id FROM public.expert_reviews
  WHERE scan_id = p_scan_id AND officer_id = auth.uid();

  IF v_review_id IS NULL THEN
    RAISE EXCEPTION 'No review assigned to you for this scan';
  END IF;

  UPDATE public.expert_reviews
  SET status = p_status,
      reviewed_at = now(),
      corrected_diagnosis = p_corrected_diagnosis,
      note = p_note
  WHERE id = v_review_id;

  UPDATE public.crop_scans SET status = 'reviewed' WHERE id = p_scan_id;

  -- Notify the farmer
  INSERT INTO public.notifications (user_id, type, title, body, related_scan_id)
  SELECT cs.user_id, 'review_complete',
    CASE WHEN p_status = 'approved' THEN 'Expert confirmed your diagnosis' ELSE 'Expert updated your diagnosis' END,
    COALESCE(p_note, 'Your case has been reviewed by an agricultural officer.'),
    cs.id
  FROM public.crop_scans cs
  WHERE cs.id = p_scan_id;

  RETURN v_review_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION create_review FROM anon;
GRANT EXECUTE ON FUNCTION create_review TO authenticated;
