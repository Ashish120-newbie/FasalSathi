/*
# Create fertilizers table for Fertilizer Recommendation API

1. New Tables
   - `fertilizers` — stores 180 fertilizer records for the recommendation engine.
     - `id` (serial, primary key)
     - `name` (text, not null) — fertilizer product name
     - `category` (text, not null) — e.g. Nitrogen, Phosphorus, Potassium, Complex, Micronutrient, Organic, Bio-fertilizer
     - `nitrogen_pct` (numeric, default 0) — nitrogen percentage
     - `phosphorus_pct` (numeric, default 0) — phosphorus percentage
     - `potassium_pct` (numeric, default 0) — potassium percentage
     - `sulphur_pct` (numeric, default 0) — sulphur percentage
     - `secondary_nutrients` (text, nullable) — e.g. "Calcium 8%, Magnesium 4%"
     - `micronutrients` (text, nullable) — e.g. "Zinc 2%, Boron 0.5%"
     - `brand` (text, nullable) — manufacturer/brand name
     - `dosage_reference` (text, nullable) — recommended dosage text
     - `application_method` (text, nullable) — how to apply
     - `primary_benefit` (text, nullable) — main benefit description
     - `source_note` (text, nullable) — data source attribution
     - `deficiency_tags` (text[], nullable) — array of deficiency tags e.g. ['nitrogen','phosphorus']
     - `suitable_crops` (text[], nullable) — array of crop names e.g. ['wheat','rice','tomato']
     - `safety_note` (text, nullable) — safety warning

2. Indexes
   - `idx_fertilizers_category` on `category` — filter by category
   - `idx_fertilizers_deficiency_tags` on `deficiency_tags` (GIN) — array containment queries
   - `idx_fertilizers_suitable_crops` on `suitable_crops` (GIN) — array containment queries

3. Security
   - RLS enabled.
   - SELECT is public (TO anon, authenticated) — fertilizer data is reference data, not user-specific.
   - No INSERT/UPDATE/DELETE policies — data is managed via migrations only.
*/

CREATE TABLE IF NOT EXISTS fertilizers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  nitrogen_pct numeric NOT NULL DEFAULT 0,
  phosphorus_pct numeric NOT NULL DEFAULT 0,
  potassium_pct numeric NOT NULL DEFAULT 0,
  sulphur_pct numeric NOT NULL DEFAULT 0,
  secondary_nutrients text,
  micronutrients text,
  brand text,
  dosage_reference text,
  application_method text,
  primary_benefit text,
  source_note text,
  deficiency_tags text[],
  suitable_crops text[],
  safety_note text
);

ALTER TABLE fertilizers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_fertilizers" ON fertilizers;
CREATE POLICY "public_read_fertilizers"
ON fertilizers FOR SELECT
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_fertilizers_category ON fertilizers(category);
CREATE INDEX IF NOT EXISTS idx_fertilizers_deficiency_tags ON fertilizers USING GIN (deficiency_tags);
CREATE INDEX IF NOT EXISTS idx_fertilizers_suitable_crops ON fertilizers USING GIN (suitable_crops);
