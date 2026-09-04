-- Grant UPDATE on all profiles columns to authenticated role
-- Previously only display_name, phone, state were updatable, causing
-- profile saves to silently fail when editing village, district, crops, etc.
GRANT UPDATE (display_name, phone, mobile, state, district, village, crops, land_size_acres, preferred_language, updated_at) ON profiles TO authenticated;
