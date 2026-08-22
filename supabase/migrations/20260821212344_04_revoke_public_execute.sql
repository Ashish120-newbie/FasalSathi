/*
# Revoke EXECUTE from PUBLIC on SECURITY DEFINER functions

PostgreSQL grants EXECUTE on functions to PUBLIC by default, which includes the anon role.
REVOKE FROM anon alone is insufficient — must REVOKE FROM PUBLIC, then grant only to authenticated.

## Changes
- Revoke EXECUTE on assign_review, create_review, get_user_role, handle_new_user FROM PUBLIC.
- Grant EXECUTE on assign_review, create_review, get_user_role TO authenticated only.
- handle_new_user is a trigger — no grants needed (runs as owner).
*/

REVOKE EXECUTE ON FUNCTION assign_review(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION create_review(uuid, text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION get_user_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION assign_review(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_review(uuid, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
