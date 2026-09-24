import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { TodaysSpecialData, NewArrivalData, SpecialOfferData, AnnouncementData } from '../hooks/usePublishedContent';

const fallbackImageUrl = 'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallbackImageUrl;
}

export function TodaysSpecialSection({ data }: { data: TodaysSpecialData }) {
  return (
    <section className="todays-special section-pad">
      <div className="section-label">Today's Special</div>
      <div className="todays-special-grid">
        <div className="todays-special-image">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.title} onError={handleImgError} />
          ) : (
            <div className="todays-special-fallback">
              <Sparkles size={32} />
            </div>
          )}
        </div>
        <div className="todays-special-content">
          <h2>{data.title}</h2>
          {data.price && <p className="todays-special-price">{data.price}</p>}
          <p className="todays-special-desc">{data.description}</p>
          <button className="underline-button" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })}>
            Discover In Store <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function NewArrivalsSection({ items }: { items: NewArrivalData[] }) {
  if (items.length === 0) return null;

  return (
    <section className="new-arrivals section-pad">
      <div className="section-heading">
        <div>
          <div className="section-label">New Arrivals</div>
          <h2>The latest <em>edit.</em></h2>
        </div>
        <p>Fresh pieces, straight from the store.<br />Come in and explore.</p>
      </div>
      <div className="arrivals-grid">
        {items.map((item) => (
          <div key={item.id} className="arrival-card">
            <div className="arrival-image">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title || 'New arrival'} onError={handleImgError} />}
            </div>
            {(item.title || item.category) && (
              <div className="arrival-info">
                {item.category && <span className="arrival-category">{item.category}</span>}
                {item.title && <strong>{item.title}</strong>}
                {item.description && <p>{item.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="arrivals-cta">
        <button className="underline-button" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })}>
          Visit Us <ArrowUpRight size={15} />
        </button>
      </div>
    </section>
  );
}

export function SpecialOfferSection({ data }: { data: SpecialOfferData }) {
  if (!data.hasContent && !data.imageUrl && !data.title && !data.description) return null;

  return (
    <section className="special-offer-section section-pad">
      <div className="special-offer-grid">
        {data.imageUrl && (
          <div className="special-offer-image">
            <img src={data.imageUrl} alt={data.title || 'Special offer'} onError={handleImgError} />
          </div>
        )}
        <div className="special-offer-content">
          <div className="section-label">Special Offer</div>
          {data.title && <h2>{data.title}</h2>}
          {data.description && <p>{data.description}</p>}
          <button className="underline-button" onClick={() => document.getElementById('visit')?.scrollIntoView({ behavior: 'smooth' })}>
            Discover In Store <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function AnnouncementSection({ data }: { data: AnnouncementData }) {
  if (!data.hasContent && !data.imageUrl && !data.title && !data.description) return null;

  return (
    <section className="announcement-section">
      <div className="announcement-bar">
        {data.imageUrl && (
          <div className="announcement-image">
            <img src={data.imageUrl} alt={data.title || 'Announcement'} onError={handleImgError} />
          </div>
        )}
        <div className="announcement-content">
          {data.title && <strong>{data.title}</strong>}
          {data.description && <p>{data.description}</p>}
        </div>
      </div>
    </section>
  );
}
