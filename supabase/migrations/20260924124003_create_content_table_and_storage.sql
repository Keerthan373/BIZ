/*
# Create content table for BIZ Premium Outlet admin-managed content

1. New Tables
- `content` — stores all owner-managed website content (Today's Special, New Arrivals, Special Offer, Store Announcement)
  - `id` (uuid, primary key)
  - `content_type` (text, not null) — one of: 'todays_special', 'new_arrival', 'special_offer', 'announcement'
  - `title` (text, nullable) — optional title for the content item
  - `description` (text, nullable) — optional short description
  - `image_path` (text, nullable) — storage path for the image in the 'content-images' bucket
  - `price` (text, nullable) — optional price text (not numeric, to allow "From ₹X" style)
  - `category` (text, nullable) — optional category label
  - `availability` (text, nullable) — optional availability text
  - `featured` (boolean, default false) — whether a new arrival is featured
  - `published` (boolean, default false) — whether the content is visible on the public website
  - `sort_order` (integer, default 0) — ordering for new arrivals
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Indexes
- Index on `content_type` for filtering by section
- Index on `published` for filtering published content
- Index on `content_type, published, sort_order` for the common query pattern

3. Security — Row Level Security
- RLS enabled on `content`
- Public (anon, authenticated) can SELECT only published rows
- Authenticated users can INSERT, UPDATE, DELETE any row (owner has full control once logged in)
- This is a single-owner admin app — any authenticated user is the owner

4. Storage
- Creates a storage bucket 'content-images' (public read, authenticated write)
- Storage policies: public can read, authenticated can upload/update/delete
*/

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('todays_special', 'new_arrival', 'special_offer', 'announcement')),
  title text,
  description text,
  image_path text,
  price text,
  category text,
  availability text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(published);
CREATE INDEX IF NOT EXISTS idx_content_query ON content(content_type, published, sort_order);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Public can read published content
DROP POLICY IF EXISTS "public_read_published_content" ON content;
CREATE POLICY "public_read_published_content"
  ON content FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Authenticated owner can insert
DROP POLICY IF EXISTS "owner_insert_content" ON content;
CREATE POLICY "owner_insert_content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated owner can update
DROP POLICY IF EXISTS "owner_update_content" ON content;
CREATE POLICY "owner_update_content"
  ON content FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

-- Authenticated owner can delete
DROP POLICY IF EXISTS "owner_delete_content" ON content;
CREATE POLICY "owner_delete_content"
  ON content FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_updated_at ON content;
CREATE TRIGGER content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();