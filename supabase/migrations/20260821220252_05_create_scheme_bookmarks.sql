/*
# Create scheme_bookmarks Table for Government Schemes Directory

## Overview
This migration creates a `scheme_bookmarks` table that lets authenticated farmers
save/bookmark government schemes for later reference. Each bookmark belongs to
exactly one user and references a scheme by its string ID (schemes are stored as
static curated data in the application code, not in a database table).

## New Table
- **scheme_bookmarks**
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users ON DELETE CASCADE)
  - `scheme_id` (text, not null — matches the static scheme ID in application data)
  - `created_at` (timestamptz, defaults to now())
  - Unique constraint on (user_id, scheme_id) — a user can bookmark a scheme only once.

## Security
- RLS enabled on scheme_bookmarks.
- Users can only SELECT, INSERT, and DELETE their own bookmarks.
- No UPDATE policy — bookmarks are create/delete only (no partial updates needed).
- user_id defaults to auth.uid() so client inserts omitting user_id still satisfy WITH CHECK.

## Indexes
- Index on user_id for fast per-user listing.
- Unique index on (user_id, scheme_id) for deduplication.
*/

CREATE TABLE IF NOT EXISTS scheme_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, scheme_id)
);

CREATE INDEX IF NOT EXISTS idx_scheme_bookmarks_user_id ON scheme_bookmarks(user_id);

ALTER TABLE scheme_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookmarks_select_own" ON scheme_bookmarks;
CREATE POLICY "bookmarks_select_own" ON scheme_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "bookmarks_insert_own" ON scheme_bookmarks;
CREATE POLICY "bookmarks_insert_own" ON scheme_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "bookmarks_delete_own" ON scheme_bookmarks;
CREATE POLICY "bookmarks_delete_own" ON scheme_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
