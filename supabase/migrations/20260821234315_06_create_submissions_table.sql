/*
# Create submissions table for crop scan diagnoses

1. Purpose
   Stores every crop scan submission — the image path, crop metadata, and the
   AI diagnosis result (or "not a crop" rejection).  This is the persistent
   record the user asked for so every scan is saved to the database.

2. New Table: submissions
   - id            (uuid, primary key, auto-generated)
   - image_data    (text, base64 data URL of the uploaded photo)
   - crop_type     (text, crop name selected by the farmer, e.g. "Wheat")
   - growth_stage  (text, growth stage selected, e.g. "vegetative")
   - is_crop       (boolean, whether Gemini confirmed the image is a plant/crop)
   - diagnosis     (text, nullable — disease/deficiency name or null if not a crop)
   - confidence    (integer, nullable — 0-100 confidence score)
   - affected_area (text, nullable — description of affected leaf area)
   - recommendation(text, nullable — treatment advice)
   - language      (text, language code the user had selected, e.g. "hi")
   - status        (text, 'valid' if a crop diagnosis, 'rejected' if not a crop image)
   - created_at    (timestamptz, defaults to now())

3. Security
   - RLS enabled.
   - This app has NO sign-in screen, so policies are TO anon, authenticated
     (the anon-key frontend must be able to read and write its own data).
   - USING (true) / WITH CHECK (true) is acceptable here because the data
     is intentionally shared/public (single-tenant, no auth).

4. Notes
   - Idempotent: CREATE TABLE IF NOT EXISTS, policies dropped before create.
*/

CREATE TABLE IF NOT EXISTS submissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_data    text NOT NULL,
  crop_type     text NOT NULL,
  growth_stage  text NOT NULL,
  is_crop       boolean NOT NULL DEFAULT true,
  diagnosis     text,
  confidence    integer,
  affected_area text,
  recommendation text,
  language      text NOT NULL DEFAULT 'en',
  status        text NOT NULL DEFAULT 'valid',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_submissions" ON submissions;
CREATE POLICY "anon_select_submissions" ON submissions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_submissions" ON submissions;
CREATE POLICY "anon_insert_submissions" ON submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_submissions" ON submissions;
CREATE POLICY "anon_update_submissions" ON submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_submissions" ON submissions;
CREATE POLICY "anon_delete_submissions" ON submissions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);
