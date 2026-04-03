-- Parkinson's Research Subscribers Table
-- Run this in: Supabase Dashboard > SQL Editor > New Query

create table if not exists public.subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  language text default 'en' check (language in ('en', 'es')),
  subscribed_at timestamptz default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text default 'website'
);

-- Enable RLS
alter table public.subscribers enable row level security;

-- Anyone can subscribe (insert)
create policy "anyone_can_subscribe"
  on public.subscribers for insert
  with check (true);

-- Anyone can view confirmed, non-unsubscribed (for checking if already subscribed)
create policy "anyone_can_view_subscribers"
  on public.subscribers for select
  using (confirmed_at is not null and unsubscribed_at is null);

-- Service role (for cron sending)
create policy "service_role_full_access"
  on public.subscribers for select
  using (true);

create policy "service_role_full_insert"
  on public.subscribers for insert
  with check (true);

create policy "service_role_full_update"
  on public.subscribers for update
  using (true)
  with check (true);

-- Indexes for common queries
create index if not exists subscribers_email_idx on public.subscribers(email);
create index if not exists subscribers_active_idx on public.subscribers(unsubscribed_at) where unsubscribed_at is null;
