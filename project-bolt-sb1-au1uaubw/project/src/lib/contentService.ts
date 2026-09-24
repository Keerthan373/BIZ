import { supabase, STORAGE_BUCKET } from './supabase';
import type { ContentItem, ContentItemInput, ContentType } from '../types/content';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, or WebP image.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image is too large. Maximum size is 10 MB.';
  }
  return null;
}

export async function uploadImage(file: File, folder: string): Promise<{ path: string; url: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = getFileExtension(file.name);
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error('Upload failed. Please try again.');
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return { path: fileName, url: urlData.publicUrl };
}

export async function deleteImage(imagePath: string): Promise<void> {
  if (!imagePath) return;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([imagePath]);
  if (error) {
    // Don't throw — the DB row still needs to be updated
    console.warn('Failed to delete image from storage:', error.message);
  }
}

export async function getPublishedContent(contentType: ContentType): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', contentType)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching published content:', error.message);
    return [];
  }
  return (data as ContentItem[]) ?? [];
}

export async function getPublishedSingle(contentType: ContentType): Promise<ContentItem | null> {
  const items = await getPublishedContent(contentType);
  return items.length > 0 ? items[0] : null;
}

export async function getAllContent(contentType: ContentType): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_type', contentType)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching content:', error.message);
    return [];
  }
  return (data as ContentItem[]) ?? [];
}

export async function createContent(input: ContentItemInput): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content')
    .insert(input)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data as ContentItem | null;
}

export async function updateContent(id: string, updates: Partial<ContentItemInput>): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data as ContentItem | null;
}

export async function deleteContent(id: string): Promise<void> {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function publishSingleContent(contentType: ContentType, id: string): Promise<void> {
  // Unpublish all other items of the same type, then publish the selected one
  const { error: unpublishError } = await supabase
    .from('content')
    .update({ published: false })
    .eq('content_type', contentType)
    .neq('id', id);

  if (unpublishError) {
    throw new Error(unpublishError.message);
  }

  const { error: publishError } = await supabase
    .from('content')
    .update({ published: true })
    .eq('id', id);

  if (publishError) {
    throw new Error(publishError.message);
  }
}

export async function unpublishAll(contentType: ContentType): Promise<void> {
  const { error } = await supabase
    .from('content')
    .update({ published: false })
    .eq('content_type', contentType);

  if (error) {
    throw new Error(error.message);
  }
}

export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(imagePath);
  return data.publicUrl;
}
