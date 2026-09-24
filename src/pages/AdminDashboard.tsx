import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ImageUp, LogOut, Plus, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
  uploadImage,
  deleteImage,
  validateImageFile,
  publishSingleContent,
  getImageUrl,
} from '../lib/contentService';
import type { ContentItem } from '../types/content';
import {
  AdminSection,
  AdminUploadButton,
  AdminButton,
  AdminTextInput,
  AdminTextArea,
  ImagePreview,
} from '../components/admin/AdminUI';

type Toast = { message: string; type: 'success' | 'error' } | null;

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<Toast>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  // Today's Special
  const [special, setSpecial] = useState<ContentItem | null>(null);
  const [specialTitle, setSpecialTitle] = useState('');
  const [specialDesc, setSpecialDesc] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [specialImage, setSpecialImage] = useState<string | null>(null);
  const [specialImagePath, setSpecialImagePath] = useState<string | null>(null);

  // New Arrivals
  const [arrivals, setArrivals] = useState<ContentItem[]>([]);

  // Special Offer
  const [offer, setOffer] = useState<ContentItem | null>(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerImage, setOfferImage] = useState<string | null>(null);
  const [offerImagePath, setOfferImagePath] = useState<string | null>(null);

  // Announcement
  const [announcement, setAnnouncement] = useState<ContentItem | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annImage, setAnnImage] = useState<string | null>(null);
  const [annImagePath, setAnnImagePath] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAll = useCallback(async () => {
    const [specialItems, arrivalItems, offerItems, annItems] = await Promise.all([
      getAllContent('todays_special'),
      getAllContent('new_arrival'),
      getAllContent('special_offer'),
      getAllContent('announcement'),
    ]);

    const sp = specialItems[0] ?? null;
    setSpecial(sp);
    setSpecialTitle(sp?.title ?? '');
    setSpecialDesc(sp?.description ?? '');
    setSpecialPrice(sp?.price ?? '');
    setSpecialImage(sp?.image_path ? getImageUrl(sp.image_path) : null);
    setSpecialImagePath(sp?.image_path ?? null);

    setArrivals(arrivalItems);

    const of = offerItems[0] ?? null;
    setOffer(of);
    setOfferTitle(of?.title ?? '');
    setOfferDesc(of?.description ?? '');
    setOfferImage(of?.image_path ? getImageUrl(of.image_path) : null);
    setOfferImagePath(of?.image_path ?? null);

    const an = annItems[0] ?? null;
    setAnnouncement(an);
    setAnnTitle(an?.title ?? '');
    setAnnDesc(an?.description ?? '');
    setAnnImage(an?.image_path ? getImageUrl(an.image_path) : null);
    setAnnImagePath(an?.image_path ?? null);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // ===== Today's Special =====
  const handleSpecialFile = async (file: File) => {
    const err = validateImageFile(file);
    if (err) { showToast(err, 'error'); return; }
    setUploading('special');
    try {
      const { path, url } = await uploadImage(file, 'todays_special');
      if (specialImagePath) await deleteImage(specialImagePath);
      setSpecialImagePath(path);
      setSpecialImage(url);
      showToast('Image uploaded. Remember to publish.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Upload failed.', 'error');
    }
    setUploading(null);
  };

  const handleRemoveSpecialImage = async () => {
    if (specialImagePath) await deleteImage(specialImagePath);
    setSpecialImagePath(null);
    setSpecialImage(null);
  };

  const handlePublishSpecial = async () => {
    try {
      if (special) {
        await updateContent(special.id, {
          title: specialTitle || null,
          description: specialDesc || null,
          price: specialPrice || null,
          image_path: specialImagePath,
        });
        await publishSingleContent('todays_special', special.id);
      } else {
        const created = await createContent({
          content_type: 'todays_special',
          title: specialTitle || null,
          description: specialDesc || null,
          price: specialPrice || null,
          image_path: specialImagePath,
          published: true,
        });
        if (!created) throw new Error('Failed to create content');
        await publishSingleContent('todays_special', created.id);
      }
      showToast("Today's Special published successfully.");
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Publish failed.', 'error');
    }
  };

  const handleRemoveSpecial = async () => {
    if (!special) return;
    try {
      if (specialImagePath) await deleteImage(specialImagePath);
      await deleteContent(special.id);
      setSpecial(null);
      setSpecialTitle('');
      setSpecialDesc('');
      setSpecialPrice('');
      setSpecialImage(null);
      setSpecialImagePath(null);
      showToast("Today's Special removed.");
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Remove failed.', 'error');
    }
  };

  // ===== New Arrivals =====
  const handleAddArrival = async (file: File) => {
    const err = validateImageFile(file);
    if (err) { showToast(err, 'error'); return; }
    setUploading('arrival');
    try {
      const { path } = await uploadImage(file, 'new_arrival');
      const created = await createContent({
        content_type: 'new_arrival',
        image_path: path,
        published: true,
        sort_order: arrivals.length,
      });
      if (!created) throw new Error('Failed to create arrival');
      showToast('New arrival added and published.');
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Upload failed.', 'error');
    }
    setUploading(null);
  };

  const handleRemoveArrival = async (item: ContentItem) => {
    try {
      if (item.image_path) await deleteImage(item.image_path);
      await deleteContent(item.id);
      showToast('Arrival removed.');
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Remove failed.', 'error');
    }
  };

  const handleToggleArrivalFeatured = async (item: ContentItem) => {
    try {
      await updateContent(item.id, { featured: !item.featured });
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Update failed.', 'error');
    }
  };

  // ===== Special Offer =====
  const handleOfferFile = async (file: File) => {
    const err = validateImageFile(file);
    if (err) { showToast(err, 'error'); return; }
    setUploading('offer');
    try {
      const { path, url } = await uploadImage(file, 'special_offer');
      if (offerImagePath) await deleteImage(offerImagePath);
      setOfferImagePath(path);
      setOfferImage(url);
      showToast('Image uploaded. Remember to publish.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Upload failed.', 'error');
    }
    setUploading(null);
  };

  const handleRemoveOfferImage = async () => {
    if (offerImagePath) await deleteImage(offerImagePath);
    setOfferImagePath(null);
    setOfferImage(null);
  };

  const handlePublishOffer = async () => {
    try {
      if (offer) {
        await updateContent(offer.id, {
          title: offerTitle || null,
          description: offerDesc || null,
          image_path: offerImagePath,
        });
        await publishSingleContent('special_offer', offer.id);
      } else {
        const created = await createContent({
          content_type: 'special_offer',
          title: offerTitle || null,
          description: offerDesc || null,
          image_path: offerImagePath,
          published: true,
        });
        if (!created) throw new Error('Failed to create offer');
        await publishSingleContent('special_offer', created.id);
      }
      showToast('Special Offer published successfully.');
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Publish failed.', 'error');
    }
  };

  const handleRemoveOffer = async () => {
    if (!offer) return;
    try {
      if (offerImagePath) await deleteImage(offerImagePath);
      await deleteContent(offer.id);
      setOffer(null);
      setOfferTitle('');
      setOfferDesc('');
      setOfferImage(null);
      setOfferImagePath(null);
      showToast('Special Offer removed.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Remove failed.', 'error');
    }
  };

  // ===== Announcement =====
  const handleAnnFile = async (file: File) => {
    const err = validateImageFile(file);
    if (err) { showToast(err, 'error'); return; }
    setUploading('announcement');
    try {
      const { path, url } = await uploadImage(file, 'announcement');
      if (annImagePath) await deleteImage(annImagePath);
      setAnnImagePath(path);
      setAnnImage(url);
      showToast('Image uploaded. Remember to publish.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Upload failed.', 'error');
    }
    setUploading(null);
  };

  const handleRemoveAnnImage = async () => {
    if (annImagePath) await deleteImage(annImagePath);
    setAnnImagePath(null);
    setAnnImage(null);
  };

  const handlePublishAnnouncement = async () => {
    try {
      if (announcement) {
        await updateContent(announcement.id, {
          title: annTitle || null,
          description: annDesc || null,
          image_path: annImagePath,
        });
        await publishSingleContent('announcement', announcement.id);
      } else {
        const created = await createContent({
          content_type: 'announcement',
          title: annTitle || null,
          description: annDesc || null,
          image_path: annImagePath,
          published: true,
        });
        if (!created) throw new Error('Failed to create announcement');
        await publishSingleContent('announcement', created.id);
      }
      showToast('Announcement published successfully.');
      await loadAll();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Publish failed.', 'error');
    }
  };

  const handleRemoveAnnouncement = async () => {
    if (!announcement) return;
    try {
      if (annImagePath) await deleteImage(annImagePath);
      await deleteContent(announcement.id);
      setAnnouncement(null);
      setAnnTitle('');
      setAnnDesc('');
      setAnnImage(null);
      setAnnImagePath(null);
      showToast('Announcement removed.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Remove failed.', 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-brand">
          <span className="brand-mark">BIZ</span>
          <span className="admin-header-subtitle">Premium Outlet · Admin</span>
        </div>
        <nav className="admin-header-nav">
            <Link to="/admin">Content</Link>
            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/admin/crm">CRM</Link>
          </nav>
        <div className="admin-header-right">
          <span className="admin-header-user">{user?.email}</span>
          <button className="admin-logout-btn" onClick={handleSignOut}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? <Check size={16} /> : <span>!</span>}
          {toast.message}
        </div>
      )}

      <div className="admin-body">
        {/* Today's Special */}
        <AdminSection label="01" title="Today's Special">
          <p className="admin-section-desc">Feature one standout piece. Upload a photo, add optional details, then publish.</p>
          {specialImage ? (
            <ImagePreview src={specialImage} alt="Today's Special" onRemove={handleRemoveSpecialImage} />
          ) : (
            <div className="admin-image-placeholder">
              {uploading === 'special' ? <span>Uploading…</span> : <span>No photo yet</span>}
            </div>
          )}
          <div className="admin-form-row">
            <AdminTextInput label="Title" value={specialTitle} onChange={setSpecialTitle} placeholder="e.g. The Heritage Blazer" optional />
            <AdminTextInput label="Price" value={specialPrice} onChange={setSpecialPrice} placeholder="e.g. From ₹2,499" optional />
          </div>
          <AdminTextArea label="Short description" value={specialDesc} onChange={setSpecialDesc} placeholder="A few words about this piece…" optional />
          <div className="admin-actions">
            <AdminUploadButton onFile={handleSpecialFile}>
              <Upload size={15} /> {specialImage ? 'Replace Picture' : 'Upload Picture'}
            </AdminUploadButton>
            <AdminButton onClick={handlePublishSpecial} variant="primary">
              <Check size={15} /> Publish
            </AdminButton>
            {special && (
              <AdminButton onClick={handleRemoveSpecial} variant="danger">
                <Trash2 size={15} /> Remove
              </AdminButton>
            )}
          </div>
        </AdminSection>

        {/* New Arrivals */}
        <AdminSection label="02" title="New Arrivals">
          <p className="admin-section-desc">Upload photos of your latest pieces. They appear on the public website in a lookbook style.</p>
          {arrivals.length > 0 ? (
            <div className="admin-arrivals-grid">
              {arrivals.map((item) => (
                <div key={item.id} className="admin-arrival-card">
                  {item.image_path && (
                    <img src={getImageUrl(item.image_path) ?? ''} alt={item.title ?? 'New arrival'} />
                  )}
                  <div className="admin-arrival-info">
                    {item.title && <strong>{item.title}</strong>}
                    {item.published && <span className="admin-badge">Published</span>}
                  </div>
                  <div className="admin-arrival-actions">
                    <button
                      className={`admin-btn admin-btn-sm ${item.featured ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                      onClick={() => handleToggleArrivalFeatured(item)}
                    >
                      {item.featured ? 'Featured' : 'Feature'}
                    </button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleRemoveArrival(item)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-image-placeholder">
              <span>No arrivals yet</span>
            </div>
          )}
          <div className="admin-actions">
            <AdminUploadButton onFile={handleAddArrival}>
              <Plus size={15} /> Add New Arrival
            </AdminUploadButton>
            {uploading === 'arrival' && <span className="admin-uploading-text">Uploading…</span>}
          </div>
        </AdminSection>

        {/* Special Offer */}
        <AdminSection label="03" title="Special Offer">
          <p className="admin-section-desc">Highlight a current offer or promotion. Optional — leave empty if none.</p>
          {offerImage ? (
            <ImagePreview src={offerImage} alt="Special Offer" onRemove={handleRemoveOfferImage} />
          ) : (
            <div className="admin-image-placeholder">
              {uploading === 'offer' ? <span>Uploading…</span> : <span>No photo yet</span>}
            </div>
          )}
          <AdminTextInput label="Title" value={offerTitle} onChange={setOfferTitle} placeholder="e.g. Festive Edit" optional />
          <AdminTextArea label="Short description" value={offerDesc} onChange={setOfferDesc} placeholder="Describe the offer…" optional />
          <div className="admin-actions">
            <AdminUploadButton onFile={handleOfferFile}>
              <Upload size={15} /> {offerImage ? 'Replace Picture' : 'Upload Picture'}
            </AdminUploadButton>
            <AdminButton onClick={handlePublishOffer} variant="primary">
              <Check size={15} /> Publish
            </AdminButton>
            {offer && (
              <AdminButton onClick={handleRemoveOffer} variant="danger">
                <Trash2 size={15} /> Remove
              </AdminButton>
            )}
          </div>
        </AdminSection>

        {/* Store Announcement */}
        <AdminSection label="04" title="Store Announcement">
          <p className="admin-section-desc">Share a brief update with your visitors — new collection, new pieces, etc.</p>
          {annImage ? (
            <ImagePreview src={annImage} alt="Announcement" onRemove={handleRemoveAnnImage} />
          ) : (
            <div className="admin-image-placeholder">
              {uploading === 'announcement' ? <span>Uploading…</span> : <span>No image yet</span>}
            </div>
          )}
          <AdminTextInput label="Title" value={annTitle} onChange={setAnnTitle} placeholder="e.g. New collection has arrived" optional />
          <AdminTextArea label="Short description" value={annDesc} onChange={setAnnDesc} placeholder="A brief message for your visitors…" optional />
          <div className="admin-actions">
            <AdminUploadButton onFile={handleAnnFile}>
              <Upload size={15} /> {annImage ? 'Replace Image' : 'Upload Image'}
            </AdminUploadButton>
            <AdminButton onClick={handlePublishAnnouncement} variant="primary">
              <Check size={15} /> Publish
            </AdminButton>
            {announcement && (
              <AdminButton onClick={handleRemoveAnnouncement} variant="danger">
                <Trash2 size={15} /> Remove
              </AdminButton>
            )}
          </div>
        </AdminSection>

        <div className="admin-footer-note">
          <ImageUp size={15} />
          <span>All changes go live on the website immediately after publishing.</span>
        </div>
      </div>
    </div>
  );
}
