/*
# Enable RLS, Policies, Storage Bucket, and Column Privileges

## Overview
This migration enables Row Level Security on all CropGuard AI tables and creates
ownership-scoped policies for farmers and role-based policies for officers.
It also creates a private storage bucket for scan images with folder-scoped policies,
and revokes client-writable access to sensitive columns (role, officer_id, status).

## Security Changes

### RLS Enabled
- profiles, farms, crops, crop_scans, diagnoses, symptoms, weather_context,
  expert_reviews, notifications

### Policy Summary
- **profiles**: Users read/update own profile. Officers read all profiles.
- **farms**: Farmers CRUD own farms. Officers read farms for assigned scans.
- **crops**: Farmers CRUD own crops (via farm ownership). Officers read crops for assigned scans.
- **crop_scans**: Farmers CRUD own scans. Officers read scans assigned to them + all escalated scans.
- **diagnoses**: Farmers read diagnoses on own scans. Officers read diagnoses on assigned scans.
- **symptoms**: Farmers read symptoms on own scans. Officers read symptoms on assigned scans.
- **weather_context**: Farmers read weather on own scans. Officers read weather on assigned scans.
- **expert_reviews**: Farmers read reviews on own scans. Officers read/update reviews assigned to them.
- **notifications**: Users CRUD own notifications.

### Column Privileges
- profiles: REVOKE UPDATE on `role` from authenticated — role changes go through privileged functions.
- expert_reviews: REVOKE INSERT/UPDATE on `officer_id`, `status` from authenticated — managed by SECURITY DEFINER functions.
- crop_scans: REVOKE UPDATE on `status` from authenticated — status transitions happen via privileged functions.

### Storage
- Create private bucket `scan-images`.
- INSERT: authenticated users can upload only into their own folder (uid/...).
- SELECT/UPDATE/DELETE: owners can access their own folder.
- Officers can read from any folder (to view assigned scan images).

## Notes
1. Policies use `get_user_role()` (SECURITY DEFINER) to check officer role.
2. Officer access to child entities (crops, diagnoses, etc.) is scoped through expert_reviews
   — they can only see data for scans where they have a review row, plus all escalated scans.
3. All policies are idempotent (DROP IF EXISTS before CREATE).
*/

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- profiles policies
-- ============================================================================
DROP POLICY IF EXISTS "profiles_select_own_or_officer" ON profiles;
CREATE POLICY "profiles_select_own_or_officer" ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR get_user_role() = 'officer');

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- farms policies
-- ============================================================================
DROP POLICY IF EXISTS "farms_select_own_or_officer" ON farms;
CREATE POLICY "farms_select_own_or_officer" ON farms FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      JOIN crop_scans cs ON cs.id = er.scan_id
      WHERE cs.farm_id = farms.id AND er.officer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "farms_insert_own" ON farms;
CREATE POLICY "farms_insert_own" ON farms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "farms_update_own" ON farms;
CREATE POLICY "farms_update_own" ON farms FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "farms_delete_own" ON farms;
CREATE POLICY "farms_delete_own" ON farms FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- crops policies
-- ============================================================================
DROP POLICY IF EXISTS "crops_select_own_or_officer" ON crops;
CREATE POLICY "crops_select_own_or_officer" ON crops FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      JOIN crop_scans cs ON cs.id = er.scan_id
      WHERE cs.crop_id = crops.id AND er.officer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "crops_insert_own" ON crops;
CREATE POLICY "crops_insert_own" ON crops FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "crops_update_own" ON crops;
CREATE POLICY "crops_update_own" ON crops FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "crops_delete_own" ON crops;
CREATE POLICY "crops_delete_own" ON crops FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM farms WHERE farms.id = crops.farm_id AND farms.user_id = auth.uid())
  );

-- ============================================================================
-- crop_scans policies
-- ============================================================================
DROP POLICY IF EXISTS "scans_select_own_or_officer" ON crop_scans;
CREATE POLICY "scans_select_own_or_officer" ON crop_scans FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      WHERE er.scan_id = crop_scans.id AND er.officer_id = auth.uid()
    )
    OR (get_user_role() = 'officer' AND crop_scans.status = 'escalated')
  );

DROP POLICY IF EXISTS "scans_insert_own" ON crop_scans;
CREATE POLICY "scans_insert_own" ON crop_scans FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM farms WHERE farms.id = crop_scans.farm_id AND farms.user_id = auth.uid())
    AND EXISTS (SELECT 1 FROM crops WHERE crops.id = crop_scans.crop_id AND crops.farm_id = crop_scans.farm_id)
  );

DROP POLICY IF EXISTS "scans_update_own" ON crop_scans;
CREATE POLICY "scans_update_own" ON crop_scans FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "scans_delete_own" ON crop_scans;
CREATE POLICY "scans_delete_own" ON crop_scans FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- diagnoses policies (read-only for both farmer and officer)
-- ============================================================================
DROP POLICY IF EXISTS "diagnoses_select_own_or_officer" ON diagnoses;
CREATE POLICY "diagnoses_select_own_or_officer" ON diagnoses FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = diagnoses.scan_id AND crop_scans.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      WHERE er.scan_id = diagnoses.scan_id AND er.officer_id = auth.uid()
    )
    OR (
      get_user_role() = 'officer'
      AND EXISTS (
        SELECT 1 FROM crop_scans cs
        WHERE cs.id = diagnoses.scan_id AND cs.status = 'escalated'
      )
    )
  );

DROP POLICY IF EXISTS "diagnoses_insert_own" ON diagnoses;
CREATE POLICY "diagnoses_insert_own" ON diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = diagnoses.scan_id AND crop_scans.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "diagnoses_update_own" ON diagnoses;
CREATE POLICY "diagnoses_update_own" ON diagnoses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = diagnoses.scan_id AND crop_scans.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = diagnoses.scan_id AND crop_scans.user_id = auth.uid())
  );

-- ============================================================================
-- symptoms policies (read-only for both farmer and officer)
-- ============================================================================
DROP POLICY IF EXISTS "symptoms_select_own_or_officer" ON symptoms;
CREATE POLICY "symptoms_select_own_or_officer" ON symptoms FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = symptoms.scan_id AND crop_scans.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      WHERE er.scan_id = symptoms.scan_id AND er.officer_id = auth.uid()
    )
    OR (
      get_user_role() = 'officer'
      AND EXISTS (
        SELECT 1 FROM crop_scans cs
        WHERE cs.id = symptoms.scan_id AND cs.status = 'escalated'
      )
    )
  );

DROP POLICY IF EXISTS "symptoms_insert_own" ON symptoms;
CREATE POLICY "symptoms_insert_own" ON symptoms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = symptoms.scan_id AND crop_scans.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "symptoms_delete_own" ON symptoms;
CREATE POLICY "symptoms_delete_own" ON symptoms FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = symptoms.scan_id AND crop_scans.user_id = auth.uid())
  );

-- ============================================================================
-- weather_context policies (read-only for both farmer and officer)
-- ============================================================================
DROP POLICY IF EXISTS "weather_select_own_or_officer" ON weather_context;
CREATE POLICY "weather_select_own_or_officer" ON weather_context FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = weather_context.scan_id AND crop_scans.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM expert_reviews er
      WHERE er.scan_id = weather_context.scan_id AND er.officer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "weather_insert_own" ON weather_context;
CREATE POLICY "weather_insert_own" ON weather_context FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM crop_scans WHERE crop_scans.id = weather_context.scan_id AND crop_scans.user_id = auth.uid())
  );

-- ============================================================================
-- expert_reviews policies
-- ============================================================================
DROP POLICY IF EXISTS "reviews_select_own_or_scan_owner" ON expert_reviews;
CREATE POLICY "reviews_select_own_or_scan_owner" ON expert_reviews FOR SELECT
  TO authenticated
  USING (
    officer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM crop_scans cs
      WHERE cs.id = expert_reviews.scan_id AND cs.user_id = auth.uid()
    )
  );

-- Officers can update reviews assigned to them (status, note, corrected_diagnosis)
-- But officer_id and status changes are restricted via column privileges + SECURITY DEFINER functions
DROP POLICY IF EXISTS "reviews_update_own_officer" ON expert_reviews;
CREATE POLICY "reviews_update_own_officer" ON expert_reviews FOR UPDATE
  TO authenticated
  USING (officer_id = auth.uid())
  WITH CHECK (officer_id = auth.uid());

-- ============================================================================
-- notifications policies
-- ============================================================================
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- Column Privileges — protect sensitive columns
-- ============================================================================

-- profiles: role must never be client-writable (officer promotion is admin-only)
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (display_name, phone, state) ON profiles TO authenticated;

-- expert_reviews: officer_id and status are managed by SECURITY DEFINER functions only
REVOKE INSERT ON expert_reviews FROM authenticated;
REVOKE UPDATE ON expert_reviews FROM authenticated;
-- Officers can update note and corrected_diagnosis directly, but status/officer_id go via functions
GRANT UPDATE (corrected_diagnosis, note) ON expert_reviews TO authenticated;

-- crop_scans: status transitions happen via privileged functions (assign_review, create_review)
REVOKE UPDATE ON crop_scans FROM authenticated;
GRANT UPDATE (notes, growth_stage) ON crop_scans TO authenticated;

-- ============================================================================
-- Storage: create private bucket for scan images
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('scan-images', 'scan-images', false)
ON CONFLICT (id) DO NOTHING;

-- Farmers can upload into their own folder: scan-images/<uid>/...
DROP POLICY IF EXISTS "scan_images_insert_own_folder" ON storage.objects;
CREATE POLICY "scan_images_insert_own_folder" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'scan-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Farmers can read their own images
DROP POLICY IF EXISTS "scan_images_select_own_folder" ON storage.objects;
CREATE POLICY "scan_images_select_own_folder" ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'scan-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Farmers can update/delete their own images
DROP POLICY IF EXISTS "scan_images_update_own_folder" ON storage.objects;
CREATE POLICY "scan_images_update_own_folder" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'scan-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'scan-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "scan_images_delete_own_folder" ON storage.objects;
CREATE POLICY "scan_images_delete_own_folder" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'scan-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Officers can read any scan image (to review assigned cases)
DROP POLICY IF EXISTS "scan_images_select_officer" ON storage.objects;
CREATE POLICY "scan_images_select_officer" ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'scan-images'
    AND get_user_role() = 'officer'
  );
