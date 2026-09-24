import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Plus, Search, Trash2, UserRound } from 'lucide-react';
import { createLead, deleteLead, getLeads, updateLead, type Lead, type LeadStatus } from '../lib/crmService';
import { AdminButton, AdminSection, AdminTextArea, AdminTextInput } from '../components/admin/AdminUI';

const statuses: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Visited'];

export default function AdminCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | LeadStatus>('All');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiry, setEnquiry] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { setError(''); setLeads(await getLeads()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load leads.'); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => leads.filter((lead) => {
    const matchesStatus = status === 'All' || lead.status === status;
    const q = search.trim().toLowerCase();
    return matchesStatus && (!q || [lead.customer_name, lead.phone, lead.enquiry, lead.notes].some((v) => (v ?? '').toLowerCase().includes(q)));
  }), [leads, search, status]);

  const addLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createLead({ customer_name: name.trim(), phone: phone.trim() || null, enquiry: enquiry.trim() || null, status: 'New', notes: notes.trim() || null });
      setName(''); setPhone(''); setEnquiry(''); setNotes('');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create lead.'); }
    finally { setSaving(false); }
  };

  const changeStatus = async (lead: Lead, next: LeadStatus) => {
    try {
      const updated = await updateLead(lead.id, { status: next });
      setLeads((items) => items.map((x) => x.id === lead.id ? updated : x));
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update lead.'); }
  };

  const remove = async (lead: Lead) => {
    if (!window.confirm('Remove this enquiry?')) return;
    try { await deleteLead(lead.id); setLeads((items) => items.filter((x) => x.id !== lead.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not remove lead.'); }
  };

  return (
    <div className="admin-page">
      <AdminSection label="06" title="Enquiries / CRM">
        <p className="admin-section-desc">A lightweight customer list for people who message, call, or ask about products. No complicated CRM.</p>
        <form className="admin-crm-form" onSubmit={addLead}>
          <AdminTextInput label="Customer name" value={name} onChange={setName} placeholder="e.g. Rahul" />
          <AdminTextInput label="Phone / WhatsApp" value={phone} onChange={setPhone} placeholder="e.g. 98xxxxxxx" optional />
          <AdminTextInput label="What they asked about" value={enquiry} onChange={setEnquiry} placeholder="e.g. linen shirts, size L" optional />
          <AdminTextArea label="Notes" value={notes} onChange={setNotes} placeholder="Anything useful to remember…" optional rows={2} />
          <AdminButton type="submit" disabled={saving} variant="primary"><Plus size={15} /> {saving ? 'Adding…' : 'Add enquiry'}</AdminButton>
        </form>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-crm-toolbar">
          <label className="admin-search"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search enquiries…" /></label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'All' | LeadStatus)}>{['All', ...statuses].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <div className="admin-leads-list">
          {filtered.length === 0 ? <div className="admin-image-placeholder"><UserRound size={20} /><span>No enquiries yet.</span></div> : filtered.map((lead) => (
            <article className="admin-lead-card" key={lead.id}>
              <div className="admin-lead-main"><strong>{lead.customer_name}</strong>{lead.phone && <span>{lead.phone}</span>}{lead.enquiry && <p>{lead.enquiry}</p>}{lead.notes && <small>{lead.notes}</small>}</div>
              <div className="admin-lead-actions">
                <select value={lead.status} onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(lead)} aria-label="Delete enquiry"><Trash2 size={14} /></button>
              </div>
            </article>
          ))}
        </div>
        {filtered.length > 0 && <div className="admin-info-card"><Check size={17} /><span>{filtered.length} enquir{filtered.length === 1 ? 'y' : 'ies'} shown. Statuses: New → Contacted → Interested → Visited.</span></div>}
      </AdminSection>
    </div>
  );
}
