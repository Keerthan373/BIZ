import { FormEvent, SyntheticEvent, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Quote,
  X,
} from 'lucide-react';
import { MoneyMindButton } from '@/components/MoneyMindButton';
import { usePublishedContent } from '../hooks/usePublishedContent';
import {
  TodaysSpecialSection,
  NewArrivalsSection,
  SpecialOfferSection,
  AnnouncementSection,
} from '../components/DynamicSections';

const phoneNumber = '098453 05785';
const whatsappNumber = '919845305785';
const fallbackImageUrl = 'https://images.pexels.com/photos/5865240/pexels-photo-5865240.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1800';

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImageUrl;
};

const gallery = [
  { src: '/images/image copy 2.png', label: 'The storefront' },
  { src: '/images/image copy.png', label: 'The edit' },
  { src: '/images/image copy 3.png', label: 'New arrivals' },
  { src: '/images/image copy 4.png', label: 'Your next look' },
];

const reviews = [
  {
    name: 'Lathish Babu',
    detail: 'Local Guide · 7 reviews · 85 photos',
    text: 'Clothes r superb affordable price collection r superb plz do visit all for ur style and comfortable wear',
    time: '2 months ago',
  },
  {
    name: 'Manoj',
    detail: '3 reviews',
    text: 'Awesome collections. I just loved it.',
    time: '2 months ago',
  },
  {
    name: 'Sufaid Chuppi',
    detail: '2 reviews',
    text: 'Good fabrics and a beautiful selection.',
    time: '3 months ago',
  },
];

function PublicSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { special, arrivals, offer, announcement } = usePublishedContent();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || 'there');
    const message = String(formData.get('message') || 'I would like to know more about your collection.');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi BIZ Premium Outlet, I'm ${name}. ${message}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setMessageSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="site-shell">
      <div className="announcement"><span>Premium menswear, considered differently</span><span className="announcement-divider" /><span>Kothanur · Bengaluru</span></div>

      <header className="topbar">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Back to top">
          <span className="brand-mark">BIZ</span>
          <span className="brand-name">Premium Outlet</span>
        </button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <button onClick={() => scrollTo('story')}>The story</button>
          <button onClick={() => scrollTo('collection')}>Collection</button>
          <button onClick={() => scrollTo('reviews')}>Reviews</button>
          <button onClick={() => scrollTo('visit')}>Visit us</button>
        </nav>
        <MoneyMindButton variant="black" size="sm" icon={<Phone size={14} />} className="header-cta-btn" onClick={() => { window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`; }}>
          Call the store
        </MoneyMindButton>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Bengaluru's considered menswear destination</p>
          <h1>Wear the<br /><em>difference.</em></h1>
          <p className="hero-text">Premium style, honest prices, and a space made for finding the pieces that become your signature.</p>
          <div className="hero-actions">
            <MoneyMindButton variant="black" size="lg" icon={<ArrowUpRight size={16} />} onClick={() => scrollTo('collection')}>
              Explore the edit
            </MoneyMindButton>
            <button className="text-button" onClick={() => scrollTo('visit')}>Plan your visit <ChevronRight size={16} /></button>
          </div>
          <div className="hero-note"><span>Open today</span><strong>Until 10:30 PM</strong><span className="note-dot" /><span>Walk-ins welcome</span></div>
        </div>
        <div className="hero-image-wrap"><img src="/images/image.png" alt="Warmly lit interior of BIZ Premium Outlet" className="hero-image" onError={handleImageError} /></div>
        <div className="hero-number">01 <span>/ 04</span></div>
      </section>

      <section className="ticker" aria-label="Store highlights"><div className="ticker-track"><span>Quality fabrics</span><span className="ticker-star">✦</span><span>Modern silhouettes</span><span className="ticker-star">✦</span><span>Outlet prices</span><span className="ticker-star">✦</span><span>Made for your everyday</span><span className="ticker-star">✦</span><span>Quality fabrics</span><span className="ticker-star">✦</span></div></section>

      <section className="story-section section-pad" id="story">
        <div className="section-label">01 / Our point of view</div>
        <div className="story-grid"><div><h2>Good style is<br /><span>always in season.</span></h2></div><div className="story-content"><p className="large-copy">At BIZ, we believe premium should feel personal. We bring together well-made menswear, a welcoming space, and the rare feeling of finding exactly what you were looking for.</p><p className="muted-copy">From an everyday essential to the piece that changes the way you walk into a room, our collection is curated for comfort, confidence, and the life you actually live.</p><button className="underline-button" onClick={() => scrollTo('visit')}>Come see for yourself <ArrowUpRight size={15} /></button></div></div>
        <div className="value-row"><div><span className="value-index">01</span><strong>Curated, not crowded</strong><p>A thoughtful edit of styles worth making room for.</p></div><div><span className="value-index">02</span><strong>Premium, made accessible</strong><p>Quality you can feel. Prices you can feel good about.</p></div><div><span className="value-index">03</span><strong>Service with a point of view</strong><p>Personal guidance, without the pressure.</p></div></div>
      </section>

      <AnnouncementSection data={announcement} />

      <TodaysSpecialSection data={special} />

      <section className="collection-section section-pad" id="collection"><div className="section-heading"><div><div className="section-label">02 / Inside BIZ</div><h2>The current <em>edit.</em></h2></div><p>Designed for the rhythm of modern Bengaluru.<br />Come in and find your next favourite.</p></div><div className="gallery-grid"><div className="gallery-feature"><img src={gallery[0].src} alt={gallery[0].label} onError={handleImageError} /><span>{gallery[0].label}</span></div><div className="gallery-tile"><img src={gallery[1].src} alt={gallery[1].label} onError={handleImageError} /><span>{gallery[1].label}</span></div><div className="gallery-tile"><img src={gallery[2].src} alt={gallery[2].label} onError={handleImageError} /><span>{gallery[2].label}</span></div><div className="gallery-tile gallery-tall"><img src={gallery[3].src} alt={gallery[3].label} onError={handleImageError} /><span>{gallery[3].label}</span></div></div></section>

      <NewArrivalsSection items={arrivals} />

      <SpecialOfferSection data={offer} />

      <section className="rating-band"><div className="rating-score">5.0<span>/5</span></div><div className="rating-stars">★★★★★<p>Google reviews</p></div><div className="rating-rule" /><p className="rating-quote">"Premium collection, good fabrics, affordable prices."</p><MoneyMindButton variant="white" size="md" icon={<ArrowUpRight size={15} />} onClick={() => scrollTo('reviews')}>Read the reviews</MoneyMindButton></section>

      <section className="reviews-section section-pad" id="reviews"><div className="section-heading"><div><div className="section-label">03 / Words from the community</div><h2>Good looks.<br /><em>Good company.</em></h2></div><div className="review-heading-right"><div className="mini-stars">★★★★★</div><p>Real words from the people<br />who have visited BIZ.</p></div></div><div className="reviews-grid">{reviews.map((review) => <article className="review-card" key={review.name}><Quote className="quote-icon" size={23} /><p className="review-text">{review.text}</p><div className="review-author"><div className="avatar">{review.name.charAt(0)}</div><div><strong>{review.name}</strong><small>{review.detail}</small></div><time>{review.time}</time></div></article>)}</div><div className="owner-note"><div className="owner-mark">B</div><div><span>From the owner</span><p>"Thank you for your support. We look forward to serving you again at BIZ Premium Outlet."</p></div></div></section>

      <section className="visit-section" id="visit"><div className="visit-image"><img src="/images/image copy 4.png" alt="BIZ Premium Outlet exterior at night" onError={handleImageError} /></div><div className="visit-panel"><div className="section-label">04 / Find your way here</div><h2>Make it a<br /><em>good visit.</em></h2><p>Drop by for a browse, stay for the details. Our team is here to help you find something that feels entirely yours.</p><div className="visit-details"><div><MapPin size={18} /><span><strong>6/1A1, Doddagubbi Main Rd</strong>Opp. SAM PALACE, CROSS, Kothanur<br />Bengaluru, Karnataka 560077</span></div><div><Clock3 size={18} /><span><strong>Open today</strong>Every day · 10:00 AM — 10:30 PM</span></div><div><Phone size={18} /><span><strong>{phoneNumber}</strong>Call us for a quick question</span></div></div><div className="visit-actions"><MoneyMindButton variant="black" size="lg" icon={<Compass size={16} />} onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=BIZ+Premium+Outlet+Kothanur+Bengaluru', '_blank', 'noopener,noreferrer')}>Get directions</MoneyMindButton><MoneyMindButton variant="white" size="lg" onClick={() => { window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`; }}>Call the store</MoneyMindButton></div></div></section>

      <section className="message-section section-pad"><div className="message-intro"><div className="section-label">A little help, personally</div><h2>Have a question?<br /><em>Message us.</em></h2><p>Looking for a size, a specific style, or just want to say hello? The BIZ team is a message away.</p><a className="whatsapp-link" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Message on WhatsApp <ArrowUpRight size={15} /></a></div><form className="message-form" onSubmit={handleMessage}><label>Your name<input name="name" required placeholder="What should we call you?" /></label><label>Your message<textarea name="message" required placeholder="Tell us what you're looking for..." rows={3} /></label><MoneyMindButton variant="black" size="lg" type="submit" className="form-submit" icon={messageSent ? <Check size={16} /> : <ArrowUpRight size={16} />}>{messageSent ? 'WhatsApp opened' : 'Send a message'}</MoneyMindButton>{messageSent && <p className="form-success">Your message is ready to send in WhatsApp.</p>}</form></section>

      <footer className="footer"><div className="footer-brand"><span className="brand-mark">BIZ</span><span>Premium Outlet</span></div><p>For the way you live. For the way you look.</p><div className="footer-links"><button onClick={() => scrollTo('top')}>Back to top ↑</button><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><Instagram size={16} /> Social</a></div><div className="footer-bottom"><span>© 2024 BIZ Premium Outlet</span><span>Kothanur, Bengaluru</span></div></footer>
    </main>
  );
}

export default PublicSite;
