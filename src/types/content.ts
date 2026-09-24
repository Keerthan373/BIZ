export type ContentType = 'todays_special' | 'new_arrival' | 'special_offer' | 'announcement';

export interface ContentItem {
  id: string;
  content_type: ContentType;
  title: string | null;
  description: string | null;
  image_path: string | null;
  price: string | null;
  category: string | null;
  availability: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItemInput {
  content_type: ContentType;
  title?: string | null;
  description?: string | null;
  image_path?: string | null;
  price?: string | null;
  category?: string | null;
  availability?: string | null;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
}
