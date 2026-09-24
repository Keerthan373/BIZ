import { supabase } from './supabase';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Visited';

export interface Lead {
  id: string;
  customer_name: string;
  phone: string | null;
  enquiry: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('crm_leads').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function createLead(input: Pick<Lead, 'customer_name' | 'phone' | 'enquiry' | 'status' | 'notes'>) {
  const { data, error } = await supabase.from('crm_leads').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function updateLead(id: string, updates: Partial<Pick<Lead, 'customer_name' | 'phone' | 'enquiry' | 'status' | 'notes'>>) {
  const { data, error } = await supabase.from('crm_leads').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('crm_leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
