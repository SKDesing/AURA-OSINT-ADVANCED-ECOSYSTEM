-- Indexes pour accélérer /api/osint/results
CREATE INDEX IF NOT EXISTS idx_osint_results_created_at ON osint_results (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_osint_results_entity_type ON osint_results (entity_type);
-- Si data est JSONB (selon votre schéma), activez GIN pour recherche plein-texte JSON
-- CREATE INDEX IF NOT EXISTS idx_osint_results_data_gin ON osint_results USING GIN (data);