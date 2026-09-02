/*
# Create marketplace tables for Local Marketplace feature

1. New Tables
- `dealers`: Stores vendor/dealer profiles for the local marketplace.
  - id (uuid, PK)
  - business_name (text, not null)
  - owner_name (text, not null)
  - phone (text, not null) — contact number for buyers to call/WhatsApp
  - address (text, not null)
  - district (text, not null) — used for location matching
  - state (text, not null) — used for location matching
  - lat (double precision, nullable) — geolocation for distance calc
  - lng (double precision, nullable)
  - categories (text[], not null) — seeds, fertilizer, pesticide, equipment
  - verified (boolean, default false) — placeholder for future KYC
  - created_at (timestamptz, default now())

- `dealer_products`: Products listed by each dealer.
  - id (uuid, PK)
  - dealer_id (uuid, FK to dealers, ON DELETE CASCADE)
  - name (text, not null)
  - category (text, not null) — seeds, fertilizer, pesticide, equipment
  - price (numeric, not null)
  - unit (text, not null) — e.g. "per kg", "per litre", "per bag"
  - in_stock (boolean, default true)
  - created_at (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- This is a no-auth app (anon-key client), so allow anon + authenticated full CRUD.
- USING(true) / WITH CHECK(true) is acceptable because marketplace data is intentionally public/shared.

3. Seed Data
- 18 sample dealers across Jaipur, Nagpur, Indore, Lucknow, and Coimbatore districts
- Each dealer has 2-5 product listings with realistic Indian agricultural product names and prices
*/

CREATE TABLE IF NOT EXISTS dealers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  lat double precision,
  lng double precision,
  categories text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dealer_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id uuid NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  unit text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dealer_products_dealer_id ON dealer_products(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealers_district ON dealers(district);
CREATE INDEX IF NOT EXISTS idx_dealers_categories ON dealers USING gin(categories);

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dealers" ON dealers;
CREATE POLICY "anon_select_dealers" ON dealers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dealers" ON dealers;
CREATE POLICY "anon_insert_dealers" ON dealers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dealers" ON dealers;
CREATE POLICY "anon_update_dealers" ON dealers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dealers" ON dealers;
CREATE POLICY "anon_delete_dealers" ON dealers FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_dealer_products" ON dealer_products;
CREATE POLICY "anon_select_dealer_products" ON dealer_products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dealer_products" ON dealer_products;
CREATE POLICY "anon_insert_dealer_products" ON dealer_products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dealer_products" ON dealer_products;
CREATE POLICY "anon_update_dealer_products" ON dealer_products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dealer_products" ON dealer_products;
CREATE POLICY "anon_delete_dealer_products" ON dealer_products FOR DELETE
  TO anon, authenticated USING (true);

-- Seed dealers
INSERT INTO dealers (business_name, owner_name, phone, address, district, state, lat, lng, categories, verified) VALUES
('Shri Krishna Krishi Kendra', 'Ramesh Yadav', '9414012345', 'Shop 12, MI Road, Civil Lines', 'Jaipur', 'Rajasthan', 26.9124, 75.7873, ARRAY['seeds','fertilizer','pesticide'], true),
('Rajasthan Seed Agency', 'Suresh Sharma', '9414023456', 'Shop 5, Station Road', 'Jaipur', 'Rajasthan', 26.9239, 75.8267, ARRAY['seeds','equipment'], true),
('Ganesh Fertilizer Depot', 'Ganesh Patil', '9876543210', 'Plot 8, Itwari Road', 'Nagpur', 'Maharashtra', 21.1458, 79.0882, ARRAY['fertilizer','pesticide'], true),
('Nagpur Agro Supplies', 'Prakash Deshmukh', '9876512345', 'Shop 22, Sadar Bazaar', 'Nagpur', 'Maharashtra', 21.1558, 79.0982, ARRAY['seeds','fertilizer','equipment'], false),
('Vidarbha Krishi Bhandar', 'Manoj Khaire', '9823456781', 'Plot 15, Wardha Road', 'Nagpur', 'Maharashtra', 21.1389, 79.0655, ARRAY['seeds','pesticide'], false),
('Malwa Agro Centre', 'Devendra Singh', '9755512345', 'Shop 7, MG Road', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577, ARRAY['seeds','fertilizer','pesticide','equipment'], true),
('Indore Krishi Seva Kendra', 'Kamal Jain', '9755523456', 'Shop 30, AB Road', 'Indore', 'Madhya Pradesh', 22.7244, 75.8839, ARRAY['fertilizer','pesticide'], false),
('Narmada Agro Inputs', 'Rajesh Tiwari', '9755534567', 'Plot 11, Dewas Road', 'Indore', 'Madhya Pradesh', 22.7096, 75.8398, ARRAY['seeds','equipment'], true),
('Awadh Krishi Kendra', 'Awadhesh Verma', '9415012345', 'Shop 14, Hazratganj', 'Lucknow', 'Uttar Pradesh', 26.8500, 80.9492, ARRAY['seeds','fertilizer','pesticide'], true),
('Gomti Agro Supplies', 'Sunita Mishra', '9415023456', 'Shop 8, Charbagh', 'Lucknow', 'Uttar Pradesh', 26.8310, 80.9210, ARRAY['fertilizer','equipment'], false),
('Barabanki Seed Centre', 'Rakesh Singh', '9415034567', 'Plot 20, Faizabad Road', 'Lucknow', 'Uttar Pradesh', 26.7720, 80.9980, ARRAY['seeds','pesticide'], false),
('Kovai Agro Mart', 'Murugan Subramanian', '9443012345', 'Shop 3, Avinashi Road', 'Coimbatore', 'Tamil Nadu', 11.0168, 76.9658, ARRAY['seeds','fertilizer','pesticide','equipment'], true),
('Noyyal Krishi Supplies', 'Karthik Raja', '9443023456', 'Shop 18, Trichy Road', 'Coimbatore', 'Tamil Nadu', 11.0258, 76.9458, ARRAY['fertilizer','pesticide'], true),
('Kongu Agro Inputs', 'Saravanan P', '9443034567', 'Plot 6, Peelamedu', 'Coimbatore', 'Tamil Nadu', 11.0338, 76.9716, ARRAY['seeds','equipment'], false),
('Pink City Agro Depot', 'Mohan Lal', '9414045678', 'Shop 9, Johari Bazaar', 'Jaipur', 'Rajasthan', 26.9190, 75.7890, ARRAY['fertilizer','pesticide','equipment'], false),
('Marwar Seed Store', 'Bhanwar Lal', '9414056789', 'Shop 2, Sanganer', 'Jaipur', 'Rajasthan', 26.8070, 75.7950, ARRAY['seeds','fertilizer'], true),
('Deccan Agro Centre', 'Anil Jadhav', '9876556789', 'Shop 11, Dharampeth', 'Nagpur', 'Maharashtra', 21.1480, 79.0920, ARRAY['seeds','fertilizer','equipment'], true),
('Bundelkhand Krishi Kendra', 'Vikram Parihar', '9755545678', 'Shop 4, South Tukoganj', 'Indore', 'Madhya Pradesh', 22.7050, 75.8650, ARRAY['pesticide','equipment'], false)
ON CONFLICT DO NOTHING;

-- Seed products for each dealer
INSERT INTO dealer_products (dealer_id, name, category, price, unit) 
SELECT d.id, 'Wheat Seed (HD-2967)', 'seeds', 45.00, 'per kg' FROM dealers d WHERE d.business_name = 'Shri Krishna Krishi Kendra'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1350.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Shri Krishna Krishi Kendra'
UNION ALL SELECT d.id, 'Chlorpyrifos 20% EC', 'pesticide', 320.00, 'per litre' FROM dealers d WHERE d.business_name = 'Shri Krishna Krishi Kendra'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 270.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Shri Krishna Krishi Kendra';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Mustard Seed (Pusa Bold)', 'seeds', 55.00, 'per kg' FROM dealers d WHERE d.business_name = 'Rajasthan Seed Agency'
UNION ALL SELECT d.id, 'Gram Seed (BG-2561)', 'seeds', 70.00, 'per kg' FROM dealers d WHERE d.business_name = 'Rajasthan Seed Agency'
UNION ALL SELECT d.id, 'Manual Seed Drill', 'equipment', 18500.00, 'per unit' FROM dealers d WHERE d.business_name = 'Rajasthan Seed Agency'
UNION ALL SELECT d.id, 'Spray Pump (Battery)', 'equipment', 4200.00, 'per unit' FROM dealers d WHERE d.business_name = 'Rajasthan Seed Agency';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1100.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Ganesh Fertilizer Depot'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 265.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Ganesh Fertilizer Depot'
UNION ALL SELECT d.id, 'Imidacloprid 17.8% SL', 'pesticide', 480.00, 'per 500ml' FROM dealers d WHERE d.business_name = 'Ganesh Fertilizer Depot'
UNION ALL SELECT d.id, 'Mancozeb 75% WP', 'pesticide', 210.00, 'per kg' FROM dealers d WHERE d.business_name = 'Ganesh Fertilizer Depot';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Cotton Seed (Bt Bunny)', 'seeds', 1800.00, 'per 450g pack' FROM dealers d WHERE d.business_name = 'Nagpur Agro Supplies'
UNION ALL SELECT d.id, 'Soybean Seed (JS-335)', 'seeds', 90.00, 'per kg' FROM dealers d WHERE d.business_name = 'Nagpur Agro Supplies'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1320.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Nagpur Agro Supplies'
UNION ALL SELECT d.id, 'Power Tiller (7HP)', 'equipment', 65000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Nagpur Agro Supplies';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Orange Sapling (Nagpur)', 'seeds', 25.00, 'per sapling' FROM dealers d WHERE d.business_name = 'Vidarbha Krishi Bhandar'
UNION ALL SELECT d.id, 'Tomato Seed (Pusa Ruby)', 'seeds', 350.00, 'per 10g pack' FROM dealers d WHERE d.business_name = 'Vidarbha Krishi Bhandar'
UNION ALL SELECT d.id, 'Carbendazim 50% WP', 'pesticide', 180.00, 'per kg' FROM dealers d WHERE d.business_name = 'Vidarbha Krishi Bhandar';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Wheat Seed (HI-8759)', 'seeds', 48.00, 'per kg' FROM dealers d WHERE d.business_name = 'Malwa Agro Centre'
UNION ALL SELECT d.id, 'Soybean Seed (JS-95-60)', 'seeds', 95.00, 'per kg' FROM dealers d WHERE d.business_name = 'Malwa Agro Centre'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1340.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Malwa Agro Centre'
UNION ALL SELECT d.id, 'Glyphosate 41% SL', 'pesticide', 290.00, 'per litre' FROM dealers d WHERE d.business_name = 'Malwa Agro Centre'
UNION ALL SELECT d.id, 'Drip Irrigation Kit', 'equipment', 12500.00, 'per acre set' FROM dealers d WHERE d.business_name = 'Malwa Agro Centre';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 272.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Indore Krishi Seva Kendra'
UNION ALL SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1120.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Indore Krishi Seva Kendra'
UNION ALL SELECT d.id, 'Profenofos 50% EC', 'pesticide', 540.00, 'per litre' FROM dealers d WHERE d.business_name = 'Indore Krishi Seva Kendra';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Chickpea Seed (JG-11)', 'seeds', 75.00, 'per kg' FROM dealers d WHERE d.business_name = 'Narmada Agro Inputs'
UNION ALL SELECT d.id, 'Maize Seed (Pioneer)', 'seeds', 180.00, 'per kg' FROM dealers d WHERE d.business_name = 'Narmada Agro Inputs'
UNION ALL SELECT d.id, 'Rotavator (5 ft)', 'equipment', 32000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Narmada Agro Inputs';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Wheat Seed (PBW-343)', 'seeds', 42.00, 'per kg' FROM dealers d WHERE d.business_name = 'Awadh Krishi Kendra'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1335.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Awadh Krishi Kendra'
UNION ALL SELECT d.id, 'Imidacloprid 17.8% SL', 'pesticide', 460.00, 'per 500ml' FROM dealers d WHERE d.business_name = 'Awadh Krishi Kendra'
UNION ALL SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1090.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Awadh Krishi Kendra';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 268.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Gomti Agro Supplies'
UNION ALL SELECT d.id, 'Tractor Sprayer', 'equipment', 8500.00, 'per unit' FROM dealers d WHERE d.business_name = 'Gomti Agro Supplies'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1345.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Gomti Agro Supplies';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Paddy Seed (PR-126)', 'seeds', 38.00, 'per kg' FROM dealers d WHERE d.business_name = 'Barabanki Seed Centre'
UNION ALL SELECT d.id, 'Trichoderma viride', 'pesticide', 150.00, 'per kg' FROM dealers d WHERE d.business_name = 'Barabanki Seed Centre'
UNION ALL SELECT d.id, 'Potato Seed (Kufri Pukhraj)', 'seeds', 32.00, 'per kg' FROM dealers d WHERE d.business_name = 'Barabanki Seed Centre';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Rice Seed (CO-51)', 'seeds', 40.00, 'per kg' FROM dealers d WHERE d.business_name = 'Kovai Agro Mart'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 275.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Kovai Agro Mart'
UNION ALL SELECT d.id, 'Azadirachtin 0.3% (Neem Oil)', 'pesticide', 220.00, 'per litre' FROM dealers d WHERE d.business_name = 'Kovai Agro Mart'
UNION ALL SELECT d.id, 'Brush Cutter', 'equipment', 9500.00, 'per unit' FROM dealers d WHERE d.business_name = 'Kovai Agro Mart';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1330.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Noyyal Krishi Supplies'
UNION ALL SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1110.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Noyyal Krishi Supplies'
UNION ALL SELECT d.id, 'Carbendazim 50% WP', 'pesticide', 175.00, 'per kg' FROM dealers d WHERE d.business_name = 'Noyyal Krishi Supplies';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Groundnut Seed (TMV-2)', 'seeds', 85.00, 'per kg' FROM dealers d WHERE d.business_name = 'Kongu Agro Inputs'
UNION ALL SELECT d.id, 'Power Weeder', 'equipment', 28000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Kongu Agro Inputs';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1085.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Pink City Agro Depot'
UNION ALL SELECT d.id, 'Chlorpyrifos 20% EC', 'pesticide', 310.00, 'per litre' FROM dealers d WHERE d.business_name = 'Pink City Agro Depot'
UNION ALL SELECT d.id, 'Hand Hoe', 'equipment', 350.00, 'per unit' FROM dealers d WHERE d.business_name = 'Pink City Agro Depot';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Bajra Seed (HHB-67)', 'seeds', 35.00, 'per kg' FROM dealers d WHERE d.business_name = 'Marwar Seed Store'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 268.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Marwar Seed Store';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Cotton Seed (Bt Ankur)', 'seeds', 1750.00, 'per 450g pack' FROM dealers d WHERE d.business_name = 'Deccan Agro Centre'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1325.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Deccan Agro Centre'
UNION ALL SELECT d.id, 'Diesel Engine Pump 5HP', 'equipment', 22000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Deccan Agro Centre';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Emamectin Benzoate 5% SG', 'pesticide', 380.00, 'per 100g' FROM dealers d WHERE d.business_name = 'Bundelkhand Krishi Kendra'
UNION ALL SELECT d.id, 'Cono Weeder', 'equipment', 1800.00, 'per unit' FROM dealers d WHERE d.business_name = 'Bundelkhand Krishi Kendra';
