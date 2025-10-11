-- AURA OSINT HYBRID DATABASE SCHEMA - FINAL VERSION
-- Combines specialized tables with JSONB flexibility for optimal performance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Core investigations table (unchanged)
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    username VARCHAR(100),
    phone VARCHAR(50),
    full_name VARCHAR(255),
    location VARCHAR(255),
    domain VARCHAR(255),
    ip_address INET,
    bitcoin_address VARCHAR(100),
    ethereum_address VARCHAR(100),
    image_url TEXT,
    custom_target TEXT,
    depth VARCHAR(20) CHECK (depth IN ('shallow', 'medium', 'deep')) DEFAULT 'medium',
    notes TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    summary JSONB,
    report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Central executions table for metadata
CREATE TABLE IF NOT EXISTS osint_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('email', 'social', 'network', 'darknet', 'crypto', 'phone', 'domain', 'image')),
    status VARCHAR(20) CHECK (status IN ('pending', 'running', 'success', 'failed', 'skipped')) DEFAULT 'pending',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds DECIMAL(10, 3),
    cpu_percent DECIMAL(5, 2),
    memory_mb DECIMAL(10, 2),
    confidence_score DECIMAL(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    error_message TEXT,
    raw_output JSONB, -- Complete backup of tool output
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Intelligence (HoleheTool + H8MailTool)
CREATE TABLE IF NOT EXISTS email_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    sites_found TEXT[], -- PostgreSQL array for performance
    total_sites INTEGER DEFAULT 0,
    high_value_sites TEXT[],
    breach_count INTEGER DEFAULT 0,
    first_breach_date DATE,
    last_breach_date DATE,
    leaked_passwords TEXT[],
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    confidence_score DECIMAL(3, 2),
    breach_details JSONB, -- Detailed breach information
    embedding vector(768), -- For Qdrant sync
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Intelligence (Twitter + Instagram + LinkedIn)
CREATE TABLE IF NOT EXISTS social_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'instagram', 'linkedin', 'facebook', 'tiktok')),
    username TEXT NOT NULL,
    display_name TEXT,
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    private_account BOOLEAN DEFAULT FALSE,
    bot_probability DECIMAL(3, 2) CHECK (bot_probability >= 0 AND bot_probability <= 1),
    sentiment_score DECIMAL(3, 2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    engagement_rate DECIMAL(5, 2),
    fake_followers_percent DECIMAL(5, 2),
    account_age_days INTEGER,
    last_activity TIMESTAMPTZ,
    profile_data JSONB, -- Complete profile details
    network_analysis JSONB, -- Connections, mentions, etc.
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Network Intelligence (ShodanTool + Nmap + DNS)
CREATE TABLE IF NOT EXISTS network_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    target_type VARCHAR(20) CHECK (target_type IN ('ip', 'domain', 'url')),
    ip_address INET,
    domain TEXT,
    ports_open INTEGER[],
    services_detected JSONB,
    vulnerabilities JSONB,
    threat_level VARCHAR(20) CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    organization TEXT,
    isp TEXT,
    asn TEXT,
    ssl_certificates JSONB,
    dns_records JSONB,
    geolocation JSONB,
    scan_results JSONB, -- Complete scan data
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Darknet Intelligence (OnionScanTool + TorBotTool)
CREATE TABLE IF NOT EXISTS darknet_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    onion_url TEXT NOT NULL,
    site_type VARCHAR(50) CHECK (site_type IN ('marketplace', 'forum', 'blog', 'service', 'private', 'search', 'unknown')),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'seized', 'moved', 'unknown')) DEFAULT 'unknown',
    services_detected JSONB DEFAULT '{}',
    vulnerabilities JSONB DEFAULT '{}',
    opsec_issues JSONB DEFAULT '{}',
    content_classification JSONB DEFAULT '{}',
    illegal_content_score INTEGER CHECK (illegal_content_score >= 0 AND illegal_content_score <= 100),
    opsec_score INTEGER CHECK (opsec_score >= 0 AND opsec_score <= 100),
    bitcoin_addresses TEXT[],
    email_addresses TEXT[],
    pgp_keys TEXT[],
    last_scan TIMESTAMPTZ,
    crawl_data JSONB, -- TorBot crawl results
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cryptocurrency Intelligence (BlockchainTool)
CREATE TABLE IF NOT EXISTS crypto_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    blockchain VARCHAR(20) NOT NULL CHECK (blockchain IN ('bitcoin', 'ethereum', 'monero', 'litecoin', 'dogecoin')),
    address TEXT NOT NULL,
    address_type VARCHAR(50), -- P2PKH, P2SH, Bech32, etc.
    total_received DECIMAL(20, 8) DEFAULT 0,
    total_sent DECIMAL(20, 8) DEFAULT 0,
    balance DECIMAL(20, 8) DEFAULT 0,
    balance_usd DECIMAL(15, 2),
    transactions_count INTEGER DEFAULT 0,
    first_seen TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    cluster_id TEXT,
    cluster_type VARCHAR(50), -- exchange, mixer, gambling, personal, etc.
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    aml_flags JSONB DEFAULT '{}',
    counterparties JSONB DEFAULT '{}', -- Frequent transaction partners
    transaction_patterns JSONB DEFAULT '{}',
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone Intelligence (PhoneNumbersTool)
CREATE TABLE IF NOT EXISTS phone_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    country_code VARCHAR(3),
    country_name VARCHAR(100),
    carrier TEXT,
    line_type VARCHAR(50), -- mobile, landline, voip, etc.
    is_valid BOOLEAN,
    is_possible BOOLEAN,
    timezone TEXT,
    region TEXT,
    location_data JSONB,
    social_media_accounts JSONB, -- Found on social platforms
    data_breaches JSONB, -- Phone found in breaches
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Domain Intelligence (WhoisTool + DNS)
CREATE TABLE IF NOT EXISTS domain_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    registrar TEXT,
    registrant_name TEXT,
    registrant_email TEXT,
    registrant_phone TEXT,
    registrant_organization TEXT,
    admin_contact JSONB,
    tech_contact JSONB,
    creation_date DATE,
    expiration_date DATE,
    last_updated DATE,
    name_servers TEXT[],
    dns_records JSONB,
    subdomains TEXT[],
    ssl_info JSONB,
    whois_history JSONB,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Image Intelligence (FaceRecognitionTool + Reverse Image Search)
CREATE TABLE IF NOT EXISTS image_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES osint_executions(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_hash TEXT,
    faces_detected INTEGER DEFAULT 0,
    face_encodings JSONB,
    reverse_search_results JSONB,
    metadata JSONB, -- EXIF data
    similar_images JSONB,
    social_media_matches JSONB,
    confidence_score DECIMAL(3, 2),
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_created ON investigations(created_at);

CREATE INDEX IF NOT EXISTS idx_executions_investigation ON osint_executions(investigation_id);
CREATE INDEX IF NOT EXISTS idx_executions_tool ON osint_executions(tool_name);
CREATE INDEX IF NOT EXISTS idx_executions_category ON osint_executions(category);
CREATE INDEX IF NOT EXISTS idx_executions_status ON osint_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_created ON osint_executions(created_at);

CREATE INDEX IF NOT EXISTS idx_email_intel_email ON email_intelligence(email);
CREATE INDEX IF NOT EXISTS idx_email_intel_risk ON email_intelligence(risk_level);
CREATE INDEX IF NOT EXISTS idx_email_intel_sites ON email_intelligence USING GIN(sites_found);

CREATE INDEX IF NOT EXISTS idx_social_platform_username ON social_profiles(platform, username);
CREATE INDEX IF NOT EXISTS idx_social_verified ON social_profiles(verified);
CREATE INDEX IF NOT EXISTS idx_social_bot_prob ON social_profiles(bot_probability);
CREATE INDEX IF NOT EXISTS idx_social_followers ON social_profiles(followers_count);

CREATE INDEX IF NOT EXISTS idx_network_ip ON network_intelligence(ip_address);
CREATE INDEX IF NOT EXISTS idx_network_domain ON network_intelligence(domain);
CREATE INDEX IF NOT EXISTS idx_network_threat ON network_intelligence(threat_level);
CREATE INDEX IF NOT EXISTS idx_network_country ON network_intelligence(country_code);

CREATE INDEX IF NOT EXISTS idx_darknet_url ON darknet_findings(onion_url);
CREATE INDEX IF NOT EXISTS idx_darknet_type ON darknet_findings(site_type);
CREATE INDEX IF NOT EXISTS idx_darknet_risk ON darknet_findings(risk_level);
CREATE INDEX IF NOT EXISTS idx_darknet_status ON darknet_findings(status);

CREATE INDEX IF NOT EXISTS idx_crypto_blockchain_address ON crypto_intelligence(blockchain, address);
CREATE INDEX IF NOT EXISTS idx_crypto_cluster ON crypto_intelligence(cluster_id);
CREATE INDEX IF NOT EXISTS idx_crypto_risk ON crypto_intelligence(risk_score);
CREATE INDEX IF NOT EXISTS idx_crypto_balance ON crypto_intelligence(balance);

CREATE INDEX IF NOT EXISTS idx_phone_number ON phone_intelligence(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_country ON phone_intelligence(country_code);
CREATE INDEX IF NOT EXISTS idx_phone_carrier ON phone_intelligence(carrier);

CREATE INDEX IF NOT EXISTS idx_domain_name ON domain_intelligence(domain);
CREATE INDEX IF NOT EXISTS idx_domain_registrar ON domain_intelligence(registrar);
CREATE INDEX IF NOT EXISTS idx_domain_creation ON domain_intelligence(creation_date);

CREATE INDEX IF NOT EXISTS idx_image_url ON image_intelligence(image_url);
CREATE INDEX IF NOT EXISTS idx_image_hash ON image_intelligence(image_hash);
CREATE INDEX IF NOT EXISTS idx_image_faces ON image_intelligence(faces_detected);

-- TimescaleDB hypertables for time-series data
SELECT create_hypertable('osint_executions', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('email_intelligence', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('social_profiles', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('network_intelligence', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('darknet_findings', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('crypto_intelligence', 'created_at', if_not_exists => TRUE);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_investigations_updated_at 
    BEFORE UPDATE ON investigations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analytics views
CREATE OR REPLACE VIEW investigation_summary AS
SELECT 
    i.id,
    i.status,
    i.created_at,
    COUNT(oe.id) as total_executions,
    COUNT(CASE WHEN oe.status = 'success' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN oe.status = 'failed' THEN 1 END) as failed_executions,
    AVG(oe.duration_seconds) as avg_duration,
    MAX(oe.completed_at) as last_execution
FROM investigations i
LEFT JOIN osint_executions oe ON i.id = oe.investigation_id
GROUP BY i.id, i.status, i.created_at;

CREATE OR REPLACE VIEW risk_distribution AS
SELECT 
    'email' as category, risk_level, COUNT(*) as count
FROM email_intelligence 
WHERE risk_level IS NOT NULL
GROUP BY risk_level
UNION ALL
SELECT 
    'network' as category, threat_level as risk_level, COUNT(*) as count
FROM network_intelligence 
WHERE threat_level IS NOT NULL
GROUP BY threat_level
UNION ALL
SELECT 
    'darknet' as category, risk_level, COUNT(*) as count
FROM darknet_findings 
WHERE risk_level IS NOT NULL
GROUP BY risk_level;

CREATE OR REPLACE VIEW tool_performance AS
SELECT 
    tool_name,
    category,
    COUNT(*) as total_executions,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_executions,
    ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate,
    AVG(duration_seconds) as avg_duration,
    AVG(confidence_score) as avg_confidence
FROM osint_executions
GROUP BY tool_name, category
ORDER BY success_rate DESC, avg_confidence DESC;