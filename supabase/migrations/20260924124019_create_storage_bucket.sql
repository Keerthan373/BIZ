/*
# Create storage bucket for content images

1. Storage
- Creates a public storage bucket 'content-images' for owner-uploaded images
- Sets public read access so the public website can display images
- Authenticated users can upload, update, and delete objects
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read all objects in content-images bucket
DROP POLICY IF EXISTS "public_read_content_images" ON storage.objects;
CREATE POLICY "public_read_content_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'content-images');

-- Authenticated can upload to content-images bucket
DROP POLICY IF EXISTS "auth_upload_content_images" ON storage.objects;
CREATE POLICY "auth_upload_content_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content-images');

-- Authenticated can update objects in content-images bucket
DROP POLICY IF EXISTS "auth_update_content_images" ON storage.objects;
CREATE POLICY "auth_update_content_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content-images') WITH CHECK (bucket_id = 'content-images');

-- Authenticated can delete objects in content-images bucket
DROP POLICY IF EXISTS "auth_delete_content_images" ON storage.objects;
CREATE POLICY "auth_delete_content_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'content-images');