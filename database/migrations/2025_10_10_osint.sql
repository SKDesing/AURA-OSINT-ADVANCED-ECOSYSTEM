-- Jobs
CREATE TABLE IF NOT EXISTS osint_jobs (
  id BIGSERIAL PRIMARY KEY,
  tool_id TEXT NOT NULL,
  params JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('queued','running','success','failed')) DEFAULT 'queued',
  error TEXT
);

-- Runs (optionnel)
CREATE TABLE IF NOT EXISTS osint_runs (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES osint_jobs(id) ON DELETE CASCADE,
  log TEXT,
  stats JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Résultats génériques
CREATE TABLE IF NOT EXISTS osint_results (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES osint_jobs(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Résultats typés
CREATE TABLE IF NOT EXISTS osint_subdomains (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES osint_jobs(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  ip INET,
  source TEXT,
  UNIQUE (job_id, subdomain)
);

CREATE INDEX IF NOT EXISTS idx_osint_subdomains_domain ON osint_subdomains(domain);