import { useEffect, useState, useCallback } from 'react';
import { getPublishedContent, getPublishedSingle, getImageUrl } from '../lib/contentService';
import type { ContentItem } from '../types/content';

export interface TodaysSpecialData {
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  hasContent: boolean;
}

export interface NewArrivalData {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  featured: boolean;
}

export interface SpecialOfferData {
  title: string;
  description: string;
  imageUrl: string | null;
  hasContent: boolean;
}

export interface AnnouncementData {
  title: string;
  description: string;
  imageUrl: string | null;
  hasContent: boolean;
}

const FALLBACK_SPECIAL: TodaysSpecialData = {
  title: 'Discover Something New',
  description: 'Explore our latest pieces in store.',
  price: '',
  imageUrl: null,
  hasContent: false,
};

const FALLBACK_OFFER: SpecialOfferData = {
  title: '',
  description: '',
  imageUrl: null,
  hasContent: false,
};

const FALLBACK_ANNOUNCEMENT: AnnouncementData = {
  title: '',
  description: '',
  imageUrl: null,
  hasContent: false,
};

export function usePublishedContent() {
  const [special, setSpecial] = useState<TodaysSpecialData>(FALLBACK_SPECIAL);
  const [arrivals, setArrivals] = useState<NewArrivalData[]>([]);
  const [offer, setOffer] = useState<SpecialOfferData>(FALLBACK_OFFER);
  const [announcement, setAnnouncement] = useState<AnnouncementData>(FALLBACK_ANNOUNCEMENT);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [specialItem, arrivalItems, offerItem, annItem] = await Promise.all([
      getPublishedSingle('todays_special'),
      getPublishedContent('new_arrival'),
      getPublishedSingle('special_offer'),
      getPublishedSingle('announcement'),
    ]);

    setSpecial(
      specialItem
        ? {
            title: specialItem.title ?? 'Discover Something New',
            description: specialItem.description ?? 'Explore our latest pieces in store.',
            price: specialItem.price ?? '',
            imageUrl: specialItem.image_path ? getImageUrl(specialItem.image_path) : null,
            hasContent: true,
          }
        : FALLBACK_SPECIAL,
    );

    setArrivals(
      arrivalItems.map((item: ContentItem) => ({
        id: item.id,
        title: item.title ?? '',
        description: item.description ?? '',
        category: item.category ?? '',
        imageUrl: item.image_path ? getImageUrl(item.image_path) : null,
        featured: item.featured,
      })),
    );

    setOffer(
      offerItem
        ? {
            title: offerItem.title ?? '',
            description: offerItem.description ?? '',
            imageUrl: offerItem.image_path ? getImageUrl(offerItem.image_path) : null,
            hasContent: true,
          }
        : FALLBACK_OFFER,
    );

    setAnnouncement(
      annItem
        ? {
            title: annItem.title ?? '',
            description: annItem.description ?? '',
            imageUrl: annItem.image_path ? getImageUrl(annItem.image_path) : null,
            hasContent: true,
          }
        : FALLBACK_ANNOUNCEMENT,
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { special, arrivals, offer, announcement, loading, reload: load };
}
