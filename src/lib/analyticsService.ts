import { supabase } from './supabase';

export type SiteEventType = 'page_view' | 'new_arrivals_view' | 'whatsapp_click' | 'call_click' | 'directions_click' | 'instagram_click';

export async function trackEvent(eventType: SiteEventType): Promise<void> {
  try {
    await supabase.from('site_events').insert({ event_type: eventType });
  } catch (error) {
    console.warn('Analytics event failed:', error);
  }
}

export async function getAnalyticsSummary() {
  const { data, error } = await supabase
    .from('site_events')
    .select('event_type, created_at')
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const count = (type: SiteEventType) => rows.filter((r) => r.event_type === type).length;

  return {
    visitors: count('page_view'),
    newArrivalsViews: count('new_arrivals_view'),
    whatsappClicks: count('whatsapp_click'),
    callClicks: count('call_click'),
    directionsClicks: count('directions_click'),
    instagramClicks: count('instagram_click'),
    recentEvents: rows.slice(0, 25),
  };
}
