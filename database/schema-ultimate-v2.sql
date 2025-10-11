-- ═══════════════════════════════════════════════════════════════════
-- AURA OSINT ECOSYSTEM - DATABASE SCHEMA ULTIMATE v2.0
-- PostgreSQL 16 + TimescaleDB + PostGIS
-- Architecture: Multi-tenant, Scalable, GDPR-Compliant
-- ═══════════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Recherche fuzzy
CREATE EXTENSION IF NOT EXISTS "timescaledb"; -- Séries temporelles
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Géolocalisation
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Performance monitoring
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Chiffrement

-- ═══════════════════════════════════════════════════════════════════
-- 1. UTILISATEURS & AUTHENTIFICATION
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    api_key VARCHAR(255) UNIQUE,
    rate_limit INTEGER DEFAULT 100,
    storage_limit_gb INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user', 'api')),
    organization_id UUID REFERENCES organizations(id),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════
-- 2. INVESTIGATIONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    case_number VARCHAR(100) UNIQUE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════
-- 3. TARGETS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN (
        'person', 'organization', 'domain', 'email', 'phone', 
        'ip_address', 'username', 'vehicle', 'cryptocurrency'
    )),
    identifier VARCHAR(500) NOT NULL,
    display_name VARCHAR(255),
    aliases TEXT[] DEFAULT '{}',
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(investigation_id, target_type, identifier)
);

-- ═══════════════════════════════════════════════════════════════════
-- 4. OSINT SCANS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE osint_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    scan_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    results_count INTEGER DEFAULT 0,
    error_message TEXT,
    raw_output TEXT,
    parsed_results JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════
-- 5. SOCIAL MEDIA PROFILES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE social_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL,
    platform_user_id VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    profile_url TEXT,
    avatar_url TEXT,
    bio TEXT,
    followers_count BIGINT,
    following_count BIGINT,
    posts_count INTEGER,
    is_verified BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    account_created_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,
    location VARCHAR(255),
    location_coords GEOGRAPHY(POINT),
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(target_id, platform, username)
);

-- ═══════════════════════════════════════════════════════════════════
-- 6. SOCIAL MEDIA POSTS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
    post_id VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    post_type VARCHAR(50),
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    location VARCHAR(255),
    location_coords GEOGRAPHY(POINT),
    views_count BIGINT,
    likes_count BIGINT,
    comments_count INTEGER,
    shares_count INTEGER,
    engagement_rate DECIMAL(5,2),
    posted_at TIMESTAMPTZ,
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(profile_id, platform, post_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- 7. EMAIL ACCOUNTS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE email_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    is_valid BOOLEAN,
    domain VARCHAR(255),
    services_found TEXT[] DEFAULT '{}',
    data_breaches TEXT[] DEFAULT '{}',
    breach_count INTEGER DEFAULT 0,
    last_breach_date DATE,
    reputation_score INTEGER CHECK (reputation_score BETWEEN 0 AND 100),
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(target_id, email)
);

-- ═══════════════════════════════════════════════════════════════════
-- 8. PHONE NUMBERS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE phone_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    country_code VARCHAR(5),
    country VARCHAR(100),
    carrier VARCHAR(255),
    line_type VARCHAR(50),
    is_valid BOOLEAN,
    social_media_accounts TEXT[] DEFAULT '{}',
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(target_id, phone_number)
);

-- ═══════════════════════════════════════════════════════════════════
-- 9. DOMAINS & SUBDOMAINS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    is_subdomain BOOLEAN DEFAULT false,
    parent_domain_id UUID REFERENCES domains(id),
    ip_addresses INET[] DEFAULT '{}',
    nameservers TEXT[] DEFAULT '{}',
    mx_records TEXT[] DEFAULT '{}',
    txt_records TEXT[] DEFAULT '{}',
    ssl_issuer VARCHAR(255),
    ssl_valid_from DATE,
    ssl_valid_to DATE,
    whois_data JSONB,
    technologies TEXT[] DEFAULT '{}',
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_scanned_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(target_id, domain)
);

-- ═══════════════════════════════════════════════════════════════════
-- 10. IP ADDRESSES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE ip_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    ip_type VARCHAR(20) CHECK (ip_type IN ('ipv4', 'ipv6')),
    asn INTEGER,
    asn_organization VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(255),
    coordinates GEOGRAPHY(POINT),
    isp VARCHAR(255),
    hosting_provider VARCHAR(255),
    is_proxy BOOLEAN DEFAULT false,
    is_vpn BOOLEAN DEFAULT false,
    is_tor BOOLEAN DEFAULT false,
    open_ports INTEGER[] DEFAULT '{}',
    services JSONB DEFAULT '{}',
    vulnerabilities TEXT[] DEFAULT '{}',
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    last_scanned_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(target_id, ip_address)
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES OPTIMISÉS
-- ═══════════════════════════════════════════════════════════════════

-- Users & Organizations
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);

-- Investigations
CREATE INDEX idx_investigations_user ON investigations(user_id);
CREATE INDEX idx_investigations_org ON investigations(organization_id);
CREATE INDEX idx_investigations_status ON investigations(status);
CREATE INDEX idx_investigations_tags ON investigations USING GIN(tags);

-- Targets
CREATE INDEX idx_targets_investigation ON targets(investigation_id);
CREATE INDEX idx_targets_type ON targets(target_type);
CREATE INDEX idx_targets_identifier ON targets(identifier);

-- OSINT Scans
CREATE INDEX idx_scans_target ON osint_scans(target_id);
CREATE INDEX idx_scans_investigation ON osint_scans(investigation_id);
CREATE INDEX idx_scans_tool ON osint_scans(tool_name);
CREATE INDEX idx_scans_status ON osint_scans(status);
CREATE INDEX idx_scans_created ON osint_scans(created_at DESC);

-- Social Profiles
CREATE INDEX idx_social_target ON social_profiles(target_id);
CREATE INDEX idx_social_platform ON social_profiles(platform);
CREATE INDEX idx_social_username ON social_profiles(username);

-- Social Posts
CREATE INDEX idx_posts_profile ON social_posts(profile_id);
CREATE INDEX idx_posts_platform ON social_posts(platform);
CREATE INDEX idx_posts_posted_at ON social_posts(posted_at DESC);
CREATE INDEX idx_posts_hashtags ON social_posts USING GIN(hashtags);
CREATE INDEX idx_posts_mentions ON social_posts USING GIN(mentions);

-- Email Accounts
CREATE INDEX idx_email_target ON email_accounts(target_id);
CREATE INDEX idx_email_email ON email_accounts(email);
CREATE INDEX idx_email_domain ON email_accounts(domain);

-- Phone Numbers
CREATE INDEX idx_phone_target ON phone_numbers(target_id);
CREATE INDEX idx_phone_number ON phone_numbers(phone_number);

-- Domains
CREATE INDEX idx_domains_target ON domains(target_id);
CREATE INDEX idx_domains_domain ON domains(domain);

-- IP Addresses
CREATE INDEX idx_ip_target ON ip_addresses(target_id);
CREATE INDEX idx_ip_address ON ip_addresses(ip_address);

-- ═══════════════════════════════════════════════════════════════════
-- TIMESCALEDB HYPERTABLES
-- ═══════════════════════════════════════════════════════════════════

SELECT create_hypertable('osint_scans', 'created_at', if_not_exists => TRUE);
SELECT create_hypertable('social_posts', 'posted_at', if_not_exists => TRUE);

-- ═══════════════════════════════════════════════════════════════════
-- FONCTIONS UTILES
-- ═══════════════════════════════════════════════════════════════════

-- Trigger mise à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON investigations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_targets_updated_at BEFORE UPDATE ON targets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════
-- DONNÉES INITIALES
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO organizations (id, name, slug, plan) VALUES
('00000000-0000-0000-0000-000000000001', 'Default Organization', 'default', 'enterprise');

INSERT INTO users (email, username, password_hash, role, organization_id) VALUES
('admin@aura-osint.local', 'admin', '$2b$10$dummy_hash', 'admin', '00000000-0000-0000-0000-000000000001');