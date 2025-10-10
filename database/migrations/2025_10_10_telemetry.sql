CREATE TABLE IF NOT EXISTS telemetry_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  url_host TEXT,
  url_path_prefix TEXT,
  url_hash TEXT,
  session_id TEXT,
  payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON telemetry_events (created_at);
CREATE INDEX IF NOT EXISTS idx_telemetry_event_type ON telemetry_events (event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_host ON telemetry_events (url_host);