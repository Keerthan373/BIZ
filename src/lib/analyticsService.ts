import { supabase } from './supabase';

export type SiteEventType =
  | 'page_view'
  | 'new_arrivals_view'
  | 'whatsapp_click'
  | 'call_click'
  | 'directions_click'
  | 'instagram_click';

export async function trackEvent(eventType: SiteEventType): Promise<void> {
  const { error } = await supabase.from('site_events').insert({ event_type: eventType });
  if (error) {
    console.warn('Analytics event failed:', error.message);
  }
}

export async function getAnalyticsSummary() {
  const eventTypes: SiteEventType[] = [
    'page_view',
    'new_arrivals_view',
    'whatsapp_click',
    'call_click',
    'directions_click',
    'instagram_click',
  ];

  const results = await Promise.all(
    eventTypes.map(async (eventType) => {
      const { count, error } = await supabase
        .from('site_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', eventType);

      if (error) throw new Error(error.message);
      return [eventType, count ?? 0] as const;
    }),
  );

  const counts = Object.fromEntries(results) as Record<SiteEventType, number>;

  const { data, error: recentError } = await supabase
    .from('site_events')
    .select('event_type, created_at')
    .order('created_at', { ascending: false })
    .limit(25);

  if (recentError) throw new Error(recentError.message);

  return {
    visitors: counts.page_view,
    newArrivalsViews: counts.new_arrivals_view,
    whatsappClicks: counts.whatsapp_click,
    callClicks: counts.call_click,
    directionsClicks: counts.directions_click,
    instagramClicks: counts.instagram_click,
    recentEvents: data ?? [],
  };
}
