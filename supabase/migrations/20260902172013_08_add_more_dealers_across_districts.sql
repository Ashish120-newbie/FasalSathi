-- Add more seed dealers across additional real districts to demonstrate cascading location filter
-- New dealers in: Ahmedabad (Gujarat), Bangalore Urban (Karnataka), Amritsar (Punjab),
-- Purba Bardhaman (West Bengal), Hyderabad (Telangana), Visakhapatnam (Andhra Pradesh)

INSERT INTO dealers (business_name, owner_name, phone, address, district, state, lat, lng, categories, verified) VALUES
('Gujarat Krishi Kendra', 'Bhavesh Patel', '9825012345', 'Shop 14, Relief Road', 'Ahmedabad', 'Gujarat', 23.0258, 72.5873, ARRAY['seeds','fertilizer','pesticide'], true),
('Sabarmati Agro Supplies', 'Nilesh Desai', '9825023456', 'Shop 8, Naroda GIDC', 'Ahmedabad', 'Gujarat', 23.0630, 72.6450, ARRAY['fertilizer','equipment'], false),
('Bangalore Agro Mart', 'Chandra Shekhar', '9845012345', 'Shop 5, KR Market', 'Bangalore Urban', 'Karnataka', 12.9719, 77.5937, ARRAY['seeds','fertilizer','pesticide','equipment'], true),
('Karnataka Seed Agency', 'Lakshmi Devi', '9845023456', 'Shop 22, Malleshwaram', 'Bangalore Urban', 'Karnataka', 13.0035, 77.5647, ARRAY['seeds','pesticide'], true),
('Punjab Agro Centre', 'Harpreet Singh', '9815012345', 'Shop 10, Hall Bazaar', 'Amritsar', 'Punjab', 31.6340, 74.8723, ARRAY['seeds','fertilizer','equipment'], true),
('Beas Krishi Supplies', 'Gurpreet Kaur', '9815023456', 'Shop 15, GT Road', 'Amritsar', 'Punjab', 31.6490, 74.8950, ARRAY['fertilizer','pesticide'], false),
('Bardhaman Krishi Kendra', 'Soumitra Roy', '9830012345', 'Shop 7, GT Road', 'Purba Bardhaman', 'West Bengal', 23.2340, 87.8675, ARRAY['seeds','fertilizer','pesticide'], true),
('Damodar Agro Inputs', 'Pradip Das', '9830023456', 'Shop 3, Station Road', 'Purba Bardhaman', 'West Bengal', 23.2410, 87.8550, ARRAY['seeds','equipment'], false),
('Telangana Agro Depot', 'Srinivas Reddy', '9849012345', 'Shop 12, Ameerpet', 'Hyderabad', 'Telangana', 17.3850, 78.4867, ARRAY['seeds','fertilizer','pesticide','equipment'], true),
('Godavari Krishi Bhandar', 'Anjali Rao', '9849023456', 'Shop 9, Kukatpally', 'Hyderabad', 'Telangana', 17.4840, 78.4138, ARRAY['fertilizer','pesticide'], false),
('Coastal Agro Mart', 'Appa Rao', '9848012345', 'Shop 4, Jagadamba Junction', 'Visakhapatnam', 'Andhra Pradesh', 17.6868, 83.2185, ARRAY['seeds','fertilizer','equipment'], true),
('Bay Krishi Supplies', 'Venkata Rao', '9848023456', 'Shop 18, Dwaraka Nagar', 'Visakhapatnam', 'Andhra Pradesh', 17.7230, 83.3020, ARRAY['seeds','pesticide'], false)
ON CONFLICT DO NOTHING;

-- Seed products for the new dealers
INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Groundnut Seed (GG-20)', 'seeds', 75.00, 'per kg' FROM dealers d WHERE d.business_name = 'Gujarat Krishi Kendra'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1340.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Gujarat Krishi Kendra'
UNION ALL SELECT d.id, 'Imidacloprid 17.8% SL', 'pesticide', 470.00, 'per 500ml' FROM dealers d WHERE d.business_name = 'Gujarat Krishi Kendra'
UNION ALL SELECT d.id, 'Castor Seed (GCH-7)', 'seeds', 120.00, 'per kg' FROM dealers d WHERE d.business_name = 'Gujarat Krishi Kendra';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 270.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Sabarmati Agro Supplies'
UNION ALL SELECT d.id, 'Tractor Trailer', 'equipment', 45000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Sabarmati Agro Supplies';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Rice Seed (Jaya)', 'seeds', 42.00, 'per kg' FROM dealers d WHERE d.business_name = 'Bangalore Agro Mart'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1330.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Bangalore Agro Mart'
UNION ALL SELECT d.id, 'Azadirachtin 0.3% (Neem Oil)', 'pesticide', 230.00, 'per litre' FROM dealers d WHERE d.business_name = 'Bangalore Agro Mart'
UNION ALL SELECT d.id, 'Power Sprayer', 'equipment', 5200.00, 'per unit' FROM dealers d WHERE d.business_name = 'Bangalore Agro Mart';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Maize Seed (NAH-1137)', 'seeds', 160.00, 'per kg' FROM dealers d WHERE d.business_name = 'Karnataka Seed Agency'
UNION ALL SELECT d.id, 'Trichoderma viride', 'pesticide', 160.00, 'per kg' FROM dealers d WHERE d.business_name = 'Karnataka Seed Agency';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Wheat Seed (HD-3226)', 'seeds', 45.00, 'per kg' FROM dealers d WHERE d.business_name = 'Punjab Agro Centre'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 268.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Punjab Agro Centre'
UNION ALL SELECT d.id, 'Zero Till Drill', 'equipment', 35000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Punjab Agro Centre';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1100.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Beas Krishi Supplies'
UNION ALL SELECT d.id, 'Mancozeb 75% WP', 'pesticide', 200.00, 'per kg' FROM dealers d WHERE d.business_name = 'Beas Krishi Supplies';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Paddy Seed (MTU-7029)', 'seeds', 40.00, 'per kg' FROM dealers d WHERE d.business_name = 'Bardhaman Krishi Kendra'
UNION ALL SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1335.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Bardhaman Krishi Kendra'
UNION ALL SELECT d.id, 'Carbendazim 50% WP', 'pesticide', 175.00, 'per kg' FROM dealers d WHERE d.business_name = 'Bardhaman Krishi Kendra';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Mustard Seed (Varuna)', 'seeds', 50.00, 'per kg' FROM dealers d WHERE d.business_name = 'Damodar Agro Inputs'
UNION ALL SELECT d.id, 'Paddy Thresher', 'equipment', 28000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Damodar Agro Inputs';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Cotton Seed (Bunny)', 'seeds', 1750.00, 'per 450g pack' FROM dealers d WHERE d.business_name = 'Telangana Agro Depot'
UNION ALL SELECT d.id, 'Urea (NPK 46-0-0)', 'fertilizer', 272.00, 'per 45kg bag' FROM dealers d WHERE d.business_name = 'Telangana Agro Depot'
UNION ALL SELECT d.id, 'Profenofos 50% EC', 'pesticide', 530.00, 'per litre' FROM dealers d WHERE d.business_name = 'Telangana Agro Depot'
UNION ALL SELECT d.id, 'Drip Irrigation Kit', 'equipment', 13000.00, 'per acre set' FROM dealers d WHERE d.business_name = 'Telangana Agro Depot';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'DAP Fertilizer', 'fertilizer', 1325.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Godavari Krishi Bhandar'
UNION ALL SELECT d.id, 'Chlorpyrifos 20% EC', 'pesticide', 315.00, 'per litre' FROM dealers d WHERE d.business_name = 'Godavari Krishi Bhandar';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Rice Seed (BPT-5204)', 'seeds', 38.00, 'per kg' FROM dealers d WHERE d.business_name = 'Coastal Agro Mart'
UNION ALL SELECT d.id, 'MOP Fertilizer', 'fertilizer', 1095.00, 'per 50kg bag' FROM dealers d WHERE d.business_name = 'Coastal Agro Mart'
UNION ALL SELECT d.id, 'Power Tiller (7HP)', 'equipment', 67000.00, 'per unit' FROM dealers d WHERE d.business_name = 'Coastal Agro Mart';

INSERT INTO dealer_products (dealer_id, name, category, price, unit)
SELECT d.id, 'Black Gram Seed (LBG-752)', 'seeds', 65.00, 'per kg' FROM dealers d WHERE d.business_name = 'Bay Krishi Supplies'
UNION ALL SELECT d.id, 'Emamectin Benzoate 5% SG', 'pesticide', 390.00, 'per 100g' FROM dealers d WHERE d.business_name = 'Bay Krishi Supplies';
