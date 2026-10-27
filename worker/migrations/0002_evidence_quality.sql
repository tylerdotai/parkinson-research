ALTER TABLE pipeline_runs ADD COLUMN source_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE pipeline_runs ADD COLUMN duplicate_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE pipeline_runs ADD COLUMN translation_quality_score INTEGER;

ALTER TABLE reports ADD COLUMN translation_status TEXT NOT NULL DEFAULT 'validated';
ALTER TABLE reports ADD COLUMN quality_score INTEGER NOT NULL DEFAULT 0;

ALTER TABLE findings ADD COLUMN evidence_type TEXT NOT NULL DEFAULT 'Research study';
ALTER TABLE findings ADD COLUMN evidence_level TEXT NOT NULL DEFAULT 'early';
ALTER TABLE findings ADD COLUMN study_design TEXT;
ALTER TABLE findings ADD COLUMN source_quality TEXT NOT NULL DEFAULT 'indexed research record';
ALTER TABLE findings ADD COLUMN why_it_matters TEXT;
ALTER TABLE findings ADD COLUMN limitations TEXT;

CREATE INDEX IF NOT EXISTS findings_evidence_idx ON findings(evidence_type, evidence_level);
