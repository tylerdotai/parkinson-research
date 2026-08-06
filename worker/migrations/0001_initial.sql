CREATE TABLE IF NOT EXISTS pipeline_runs (
  id TEXT PRIMARY KEY,
  report_date TEXT NOT NULL,
  status TEXT NOT NULL,
  current_step TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  metrics_json TEXT NOT NULL DEFAULT '{}',
  error_code TEXT,
  error_message TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS pipeline_runs_date_idx ON pipeline_runs(report_date, started_at DESC);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  canonical_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  publication_date TEXT,
  fetched_at TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  content_hash TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  report_date TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published', 'draft', 'needs_review')),
  version INTEGER NOT NULL DEFAULT 1,
  run_id TEXT NOT NULL REFERENCES pipeline_runs(id),
  generated_at TEXT NOT NULL,
  published_at TEXT,
  UNIQUE(report_date, language, version)
);

CREATE INDEX IF NOT EXISTS reports_latest_idx ON reports(language, status, report_date DESC);

CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES sources(id),
  source_date TEXT,
  claim_status TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'es')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed')),
  token_hash TEXT NOT NULL,
  subscribed_at TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  last_delivery_at TEXT
);

CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL REFERENCES reports(id),
  subscriber_id TEXT NOT NULL REFERENCES subscribers(id),
  language TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  provider_message_id TEXT,
  attempted_at TEXT,
  delivered_at TEXT,
  error_message TEXT,
  UNIQUE(report_id, subscriber_id)
);
