-- DARKNET INTELLIGENCE SCHEMA
-- Extension des tables principales pour layer darknet

-- Table découvertes Darknet
CREATE TABLE IF NOT EXISTS darknet_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    onion_url TEXT NOT NULL,
    site_type VARCHAR(50) CHECK (site_type IN ('marketplace', 'forum', 'blog', 'service', 'private', 'unknown')),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_scan TIMESTAMPTZ,
    services_detected JSONB DEFAULT '{}',
    content_classification JSONB DEFAULT '{}',
    vulnerabilities JSONB DEFAULT '{}',
    opsec_score INTEGER CHECK (opsec_score >= 0 AND opsec_score <= 100),
    embedding vector(768), -- Qdrant sync
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table transactions crypto
CREATE TABLE IF NOT EXISTS crypto_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    blockchain VARCHAR(20) CHECK (blockchain IN ('bitcoin', 'ethereum', 'monero', 'litecoin', 'dogecoin')),
    address TEXT NOT NULL,
    transaction_hash TEXT,
    amount DECIMAL(20, 8),
    amount_usd DECIMAL(15, 2),
    timestamp TIMESTAMPTZ,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    cluster_id TEXT,
    aml_flags JSONB DEFAULT '{}',
    counterparty_address TEXT,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('incoming', 'outgoing', 'internal')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table breaches email
CREATE TABLE IF NOT EXISTS email_breaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    breach_name TEXT NOT NULL,
    breach_date DATE,
    records_affected BIGINT,
    leaked_data JSONB DEFAULT '{}',
    source VARCHAR(50) CHECK (source IN ('hibp', 'dehashed', 'snusbase', 'local', 'pastebin')),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    verified BOOLEAN DEFAULT FALSE,
    sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table clustering crypto wallets
CREATE TABLE IF NOT EXISTS crypto_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id TEXT UNIQUE NOT NULL,
    blockchain VARCHAR(20) NOT NULL,
    addresses TEXT[] NOT NULL,
    cluster_type VARCHAR(50) CHECK (cluster_type IN ('exchange', 'mixer', 'gambling', 'marketplace', 'personal', 'unknown')),
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    total_balance DECIMAL(20, 8),
    first_seen TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    risk_indicators JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table monitoring Tor sites
CREATE TABLE IF NOT EXISTS tor_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onion_url TEXT UNIQUE NOT NULL,
    site_title TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'seized', 'moved', 'unknown')),
    last_check TIMESTAMPTZ DEFAULT NOW(),
    response_time_ms INTEGER,
    content_hash TEXT, -- Pour détecter changements
    screenshot_path TEXT,
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    alert_threshold INTEGER DEFAULT 24, -- heures
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_darknet_investigation ON darknet_findings(investigation_id);
CREATE INDEX IF NOT EXISTS idx_darknet_risk ON darknet_findings(risk_level);
CREATE INDEX IF NOT EXISTS idx_darknet_type ON darknet_findings(site_type);
CREATE INDEX IF NOT EXISTS idx_darknet_discovered ON darknet_findings(discovered_at);

CREATE INDEX IF NOT EXISTS idx_crypto_investigation ON crypto_transactions(investigation_id);
CREATE INDEX IF NOT EXISTS idx_crypto_address ON crypto_transactions(address);
CREATE INDEX IF NOT EXISTS idx_crypto_blockchain ON crypto_transactions(blockchain);
CREATE INDEX IF NOT EXISTS idx_crypto_risk ON crypto_transactions(risk_score);
CREATE INDEX IF NOT EXISTS idx_crypto_cluster ON crypto_transactions(cluster_id);

CREATE INDEX IF NOT EXISTS idx_breach_investigation ON email_breaches(investigation_id);
CREATE INDEX IF NOT EXISTS idx_breach_email ON email_breaches(email);
CREATE INDEX IF NOT EXISTS idx_breach_source ON email_breaches(source);
CREATE INDEX IF NOT EXISTS idx_breach_date ON email_breaches(breach_date);

CREATE INDEX IF NOT EXISTS idx_cluster_blockchain ON crypto_clusters(blockchain);
CREATE INDEX IF NOT EXISTS idx_cluster_type ON crypto_clusters(cluster_type);

CREATE INDEX IF NOT EXISTS idx_tor_status ON tor_monitoring(status);
CREATE INDEX IF NOT EXISTS idx_tor_check ON tor_monitoring(last_check);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_darknet_findings_updated_at BEFORE UPDATE ON darknet_findings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crypto_clusters_updated_at BEFORE UPDATE ON crypto_clusters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tor_monitoring_updated_at BEFORE UPDATE ON tor_monitoring FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vues pour analytics
CREATE OR REPLACE VIEW darknet_risk_summary AS
SELECT 
    risk_level,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM darknet_findings 
GROUP BY risk_level;

CREATE OR REPLACE VIEW crypto_risk_distribution AS
SELECT 
    blockchain,
    CASE 
        WHEN risk_score >= 75 THEN 'high'
        WHEN risk_score >= 50 THEN 'medium'
        WHEN risk_score >= 25 THEN 'low'
        ELSE 'minimal'
    END as risk_category,
    COUNT(*) as transaction_count,
    SUM(amount_usd) as total_value_usd
FROM crypto_transactions 
WHERE amount_usd IS NOT NULL
GROUP BY blockchain, risk_category;

CREATE OR REPLACE VIEW breach_timeline AS
SELECT 
    DATE_TRUNC('month', breach_date) as month,
    COUNT(*) as breach_count,
    COUNT(DISTINCT email) as unique_emails,
    SUM(records_affected) as total_records
FROM email_breaches 
WHERE breach_date IS NOT NULL
GROUP BY month
ORDER BY month DESC;