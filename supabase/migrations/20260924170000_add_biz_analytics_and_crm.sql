/*
  BIZ Premium Outlet — analytics + lightweight CRM
  Run this migration against the same Supabase project used by the Vercel app.
*/

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'page_view',
    'new_arrivals_view',
    'whatsapp_click',
    'call_click',
    'directions_click',
    'instagram_click'
  )),
  created_at timestamptz not null default now()
);

create index if not exists site_events_event_type_idx on public.site_events(event_type);
create index if not exists site_events_created_at_idx on public.site_events(created_at desc);

alter table public.site_events enable row level security;

drop policy if exists "Public can record site events" on public.site_events;
create policy "Public can record site events"
  on public.site_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated admins can read site events" on public.site_events;
create policy "Authenticated admins can read site events"
  on public.site_events for select
  to authenticated
  using (true);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text,
  enquiry text,
  status text not null default 'New' check (status in ('New','Contacted','Interested','Visited')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_leads_status_idx on public.crm_leads(status);
create index if not exists crm_leads_created_at_idx on public.crm_leads(created_at desc);

alter table public.crm_leads enable row level security;

drop policy if exists "Authenticated admins manage CRM leads" on public.crm_leads;
create policy "Authenticated admins manage CRM leads"
  on public.crm_leads for all
  to authenticated
  using (true)
  with check (true);

drop trigger if exists crm_leads_updated_at on public.crm_leads;
create trigger crm_leads_updated_at
  before update on public.crm_leads
  for each row execute function public.update_updated_at();
