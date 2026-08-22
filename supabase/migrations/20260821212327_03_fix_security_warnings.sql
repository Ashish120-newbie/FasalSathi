/*
# Fix Security Advisor Warnings

## Changes
1. Add `SET search_path = public` to `set_updated_at()` trigger function.
2. Revoke EXECUTE on `handle_new_user()` from anon and authenticated — it's a trigger, not callable by clients.
3. The `assign_review`, `create_review`, and `get_user_role` functions already have EXECUTE revoked from anon and
   granted to authenticated in migration 01. The advisor still flags them as "callable by authenticated" which is
   intentional — these are the authorized RPC endpoints. No change needed for those.
*/

-- Fix 1: set_updated_at needs a fixed search_path
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Fix 2: handle_new_user is a trigger function, not a client-callable RPC
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM authenticated;
