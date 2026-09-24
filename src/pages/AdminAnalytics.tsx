import { useEffect, useState } from 'react';
import { BarChart3, Eye, Instagram, MapPin, MessageCircle, Phone, RefreshCw } from 'lucide-react';
import { getAnalyticsSummary } from '../lib/analyticsService';
import { AdminButton, AdminSection } from '../components/admin/AdminUI';

type Summary = Awaited<ReturnType<typeof getAnalyticsSummary>>;

const cards = [
  ['visitors', 'Visitors', Eye],
  ['newArrivalsViews', 'New Arrivals views', Eye],
  ['whatsappClicks', 'WhatsApp clicks', MessageCircle],
  ['callClicks', 'Call clicks', Phone],
  ['directionsClicks', 'Directions clicks', MapPin],
  ['instagramClicks', 'Instagram clicks', Instagram],
] as const;

export default function AdminAnalytics() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const load = async () => {
    try { setError(''); setSummary(await getAnalyticsSummary()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load analytics.'); }
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="admin-page">
      <AdminSection label="05" title="Analytics">
        <div className="admin-page-toolbar">
          <p className="admin-section-desc">Online intent only — this tracks website actions, not confirmed physical walk-ins.</p>
          <AdminButton onClick={load} variant="secondary"><RefreshCw size={15} /> Refresh</AdminButton>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-metric-grid">
          {cards.map(([key, label, Icon]) => (
            <div className="admin-metric-card" key={key}>
              <Icon size={18} />
              <span>{label}</span>
              <strong>{summary?.[key] ?? '—'}</strong>
            </div>
          ))}
        </div>
        {!error && <div className="admin-info-card"><BarChart3 size={18} /><span>Use these numbers to see which online actions are generating interest. A QR code or in-store question is needed to measure actual walk-ins from the site.</span></div>}
      </AdminSection>
    </div>
  );
}
