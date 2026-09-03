/*
# Extend profiles table with farmer-specific fields

1. Modified Tables
   - `profiles` — add columns for farmer onboarding:
     - `district` (text, nullable) — farmer's district
     - `village` (text, nullable) — farmer's village (free text)
     - `crops` (text[], nullable) — array of crop IDs the farmer grows
     - `land_size_acres` (numeric, nullable) — land size in acres
     - `preferred_language` (text, nullable) — preferred app language code
     - `mobile` (text, nullable) — 10-digit mobile number

2. Security
   - No policy changes — existing RLS policies on profiles remain intact.
   - Users can still only read/update their own profile row.

3. Notes
   - All new columns are nullable so existing profile rows are unaffected.
   - `crops` uses text[] to store multiple crop IDs (e.g. ['wheat', 'rice']).
   - `land_size_acres` is numeric to support fractional acre values.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS village text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS crops text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS land_size_acres numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mobile text;
