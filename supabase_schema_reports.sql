-- Parkinson's Research Reports + Reviews Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query

-- Reports table: stores each daily generated report
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  language text not null check (language in ('en', 'es')),
  title text not null,
  content text not null,
  sources jsonb default '[]',
  category_counts jsonb default '{"clinical":0,"breakthrough":0,"lifestyle":0,"emerging":0,"tech":0}',
  generated_at timestamptz default now(),
  reviewed_at timestamptz,
  review_status text default 'pending' check (review_status in ('pending', 'approved', 'flagged', 'reviewed')),
  review_score integer check (review_score >= 1 and review_score <= 10)
);

-- Report reviews: AI reviewer feedback on each report
create table if not exists public.report_reviews (
  id uuid default gen_random_uuid() primary key,
  report_id uuid not null references public.reports(id) on delete cascade,
  reviewer_role text not null, -- 'clinical', 'credibility', 'accessibility'
  score integer check (score >= 1 and score <= 10),
  findings jsonb default '[]', -- array of {severity, category, text}
  flagged_claims jsonb default '[]', -- array of claims that need verification
  recommendation text, -- 'approve', 'flag', 'revision'
  notes text,
  reviewed_at timestamptz default now(),
  unique(report_id, reviewer_role)
);

-- Enable RLS
alter table public.reports enable row level security;
alter table public.report_reviews enable row level security;

-- Anyone can view reports
create policy "anyone_can_view_reports"
  on public.reports for select using (true);

-- Anyone can view reviews for approved reports
create policy "anyone_can_view_reviews"
  on public.report_reviews for select using (true);

-- Anon key (publishable) can insert/update reports (for cron job running on Hoss)
create policy "anon_reports_write"
  on public.reports for insert with check (true);

create policy "anon_reports_update"
  on public.reports for update using (true);

-- Anon key can write reviews (from Vercel server-side)
create policy "anon_reviews_write"
  on public.report_reviews for insert with check (true);

-- Indexes
create index if not exists reports_date_idx on public.reports(date);
create index if not exists reports_status_idx on public.reports(review_status);
create index if not exists report_reviews_report_idx on public.report_reviews(report_id);
