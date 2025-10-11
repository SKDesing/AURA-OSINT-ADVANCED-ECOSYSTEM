-- Migration: Add IP Intelligence Tables
-- Description: Add comprehensive IP intelligence and network analysis tables
-- Version: 1.0.0
-- Date: 2024-01-15

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- IP Intelligence Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS ip_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES osint_executions(id) ON DELETE CASCADE,
    
    -- IP Information
    ip_address INET NOT NULL,
    ip_version INTEGER CHECK (ip_version IN (4, 6)),
    
    -- Geolocation Data
    country_code CHAR(2),
    country_name VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    location_point GEOMETRY(POINT, 4326), -- PostGIS point for spatial queries
    
    -- Network Information
    asn INTEGER,
    asn_name VARCHAR(255),
    asn_description TEXT,
    network_cidr CIDR,
    network_name VARCHAR(255),
    organization VARCHAR(255),
    isp VARCHAR(255),
    connection_type VARCHAR(50), -- residential, hosting, mobile, etc.
    
    -- Reverse DNS
    ptr_record VARCHAR(255),
    hostnames TEXT[],
    hostname_count INTEGER DEFAULT 0,
    
    -- Threat Intelligence
    abuse_score INTEGER CHECK (abuse_score BETWEEN 0 AND 100) DEFAULT 0,
    is_vpn BOOLEAN DEFAULT FALSE,
    is_proxy BOOLEAN DEFAULT FALSE,
    is_tor BOOLEAN DEFAULT FALSE,
    is_hosting BOOLEAN DEFAULT FALSE,
    is_mobile BOOLEAN DEFAULT FALSE,
    blacklists TEXT[],
    threat_categories TEXT[],
    last_abuse_report TIMESTAMPTZ,
    
    -- Risk Assessment
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100) DEFAULT 0,
    risk_factors TEXT[],
    
    -- AI Embeddings
    embedding vector(768),
    
    -- Raw Data
    raw_geolocation JSONB,
    raw_network_info JSONB,
    raw_reputation JSONB,
    
    -- Metadata
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1) DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Port Scan Results Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS port_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES osint_executions(id) ON DELETE CASCADE,
    
    -- Target Information
    target_ip INET NOT NULL,
    target_hostname VARCHAR(255),
    
    -- Scan Configuration
    scan_type VARCHAR(50) NOT NULL, -- quick, full, custom, nmap
    port_range VARCHAR(100),
    timing_template VARCHAR(20), -- stealth, normal, aggressive
    
    -- Results
    open_ports INTEGER[],
    closed_ports INTEGER[],
    filtered_ports INTEGER[],
    total_ports_scanned INTEGER DEFAULT 0,
    open_ports_count INTEGER DEFAULT 0,
    
    -- Services Detection
    services JSONB, -- {port: {service, version, banner, confidence}}
    
    -- OS Detection
    os_detection JSONB,
    
    -- Vulnerabilities
    vulnerabilities JSONB,
    
    -- Scan Statistics
    scan_duration_seconds DECIMAL(10, 3),
    scan_start_time TIMESTAMPTZ,
    scan_end_time TIMESTAMPTZ,
    
    -- Raw Output
    raw_nmap_output TEXT,
    raw_scan_data JSONB,
    
    -- Metadata
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1) DEFAULT 0.8,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SSL Certificate Analysis Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS ssl_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES osint_executions(id) ON DELETE CASCADE,
    
    -- Target Information
    target_hostname VARCHAR(255) NOT NULL,
    target_port INTEGER DEFAULT 443,
    
    -- Certificate Chain
    certificate_chain JSONB, -- Array of certificate objects
    chain_length INTEGER DEFAULT 0,
    is_leaf_certificate BOOLEAN DEFAULT FALSE,
    
    -- Certificate Details
    serial_number VARCHAR(255),
    signature_algorithm VARCHAR(100),
    issuer JSONB,
    subject JSONB,
    
    -- Validity
    not_valid_before TIMESTAMPTZ,
    not_valid_after TIMESTAMPTZ,
    is_expired BOOLEAN DEFAULT FALSE,
    days_until_expiry INTEGER,
    
    -- Public Key
    public_key_algorithm VARCHAR(50),
    public_key_size INTEGER,
    
    -- Extensions
    subject_alt_names TEXT[],
    key_usage TEXT[],
    extended_key_usage TEXT[],
    basic_constraints JSONB,
    
    -- SSL Configuration
    ssl_protocol VARCHAR(20),
    cipher_suite VARCHAR(255),
    cipher_strength INTEGER,
    
    -- Certificate Transparency
    ct_logs JSONB,
    ct_log_count INTEGER DEFAULT 0,
    
    -- Vulnerabilities
    ssl_vulnerabilities JSONB,
    vulnerability_count INTEGER DEFAULT 0,
    
    -- Security Assessment
    security_grade CHAR(1) CHECK (security_grade IN ('A', 'B', 'C', 'D', 'F')),
    security_score INTEGER CHECK (security_score BETWEEN 0 AND 100),
    security_issues TEXT[],
    
    -- Raw Data
    raw_certificate_data JSONB,
    raw_ssl_config JSONB,
    
    -- Metadata
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1) DEFAULT 0.9,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Network Topology Table (for advanced network mapping)
-- ============================================================================

CREATE TABLE IF NOT EXISTS network_topology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES osint_executions(id) ON DELETE CASCADE,
    
    -- Source and Target
    source_ip INET NOT NULL,
    target_ip INET NOT NULL,
    
    -- Relationship Type
    relationship_type VARCHAR(50), -- same_asn, same_subnet, traceroute_hop, etc.
    
    -- Network Path (for traceroute)
    hop_number INTEGER,
    hop_ips INET[],
    hop_hostnames TEXT[],
    hop_latencies DECIMAL[],
    
    -- BGP Information
    bgp_prefix CIDR,
    bgp_as_path INTEGER[],
    bgp_origin_asn INTEGER,
    
    -- Metadata
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1) DEFAULT 0.7
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- IP Intelligence Indexes
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_ip ON ip_intelligence(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_execution ON ip_intelligence(execution_id);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_asn ON ip_intelligence(asn);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_country ON ip_intelligence(country_code);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_risk ON ip_intelligence(risk_level, risk_score);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_abuse ON ip_intelligence(abuse_score) WHERE abuse_score > 50;
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_threats ON ip_intelligence USING GIN(threat_categories);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_location ON ip_intelligence USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_embedding ON ip_intelligence USING ivfflat (embedding vector_cosine_ops);

-- Port Scan Indexes
CREATE INDEX IF NOT EXISTS idx_port_scan_target ON port_scan_results(target_ip);
CREATE INDEX IF NOT EXISTS idx_port_scan_execution ON port_scan_results(execution_id);
CREATE INDEX IF NOT EXISTS idx_port_scan_open_ports ON port_scan_results USING GIN(open_ports);
CREATE INDEX IF NOT EXISTS idx_port_scan_services ON port_scan_results USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_port_scan_vulns ON port_scan_results USING GIN(vulnerabilities);

-- SSL Certificate Indexes
CREATE INDEX IF NOT EXISTS idx_ssl_cert_hostname ON ssl_certificates(target_hostname);
CREATE INDEX IF NOT EXISTS idx_ssl_cert_execution ON ssl_certificates(execution_id);
CREATE INDEX IF NOT EXISTS idx_ssl_cert_expiry ON ssl_certificates(not_valid_after);
CREATE INDEX IF NOT EXISTS idx_ssl_cert_expired ON ssl_certificates(is_expired) WHERE is_expired = TRUE;
CREATE INDEX IF NOT EXISTS idx_ssl_cert_grade ON ssl_certificates(security_grade, security_score);
CREATE INDEX IF NOT EXISTS idx_ssl_cert_serial ON ssl_certificates(serial_number);
CREATE INDEX IF NOT EXISTS idx_ssl_cert_san ON ssl_certificates USING GIN(subject_alt_names);

-- Network Topology Indexes
CREATE INDEX IF NOT EXISTS idx_network_topo_source ON network_topology(source_ip);
CREATE INDEX IF NOT EXISTS idx_network_topo_target ON network_topology(target_ip);
CREATE INDEX IF NOT EXISTS idx_network_topo_relationship ON network_topology(relationship_type);
CREATE INDEX IF NOT EXISTS idx_network_topo_asn ON network_topology(bgp_origin_asn);

-- ============================================================================
-- Triggers for Auto-Updates
-- ============================================================================

-- Update timestamp trigger for ip_intelligence
CREATE OR REPLACE FUNCTION update_ip_intelligence_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ip_intelligence_updated_at
    BEFORE UPDATE ON ip_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_ip_intelligence_timestamp();

-- Update timestamp trigger for ssl_certificates
CREATE OR REPLACE FUNCTION update_ssl_certificates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ssl_certificates_updated_at
    BEFORE UPDATE ON ssl_certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_ssl_certificates_timestamp();

-- Auto-calculate location point from lat/lng
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ip_intelligence_location_point
    BEFORE INSERT OR UPDATE ON ip_intelligence
    FOR EACH ROW
    EXECUTE FUNCTION update_location_point();

-- ============================================================================
-- Views for Analytics
-- ============================================================================

-- IP Risk Summary View
CREATE OR REPLACE VIEW ip_risk_summary AS
SELECT 
    risk_level,
    COUNT(*) as ip_count,
    AVG(risk_score) as avg_risk_score,
    AVG(abuse_score) as avg_abuse_score,
    COUNT(*) FILTER (WHERE is_vpn = TRUE) as vpn_count,
    COUNT(*) FILTER (WHERE is_proxy = TRUE) as proxy_count,
    COUNT(*) FILTER (WHERE is_tor = TRUE) as tor_count,
    COUNT(*) FILTER (WHERE is_hosting = TRUE) as hosting_count
FROM ip_intelligence
GROUP BY risk_level
ORDER BY 
    CASE risk_level 
        WHEN 'critical' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 1
    END DESC;

-- Port Scan Summary View
CREATE OR REPLACE VIEW port_scan_summary AS
SELECT 
    target_ip,
    COUNT(*) as scan_count,
    MAX(scan_end_time) as last_scan,
    AVG(open_ports_count) as avg_open_ports,
    AVG(scan_duration_seconds) as avg_scan_duration,
    ARRAY_AGG(DISTINCT scan_type) as scan_types_used
FROM port_scan_results
GROUP BY target_ip
ORDER BY last_scan DESC;

-- SSL Certificate Expiry View
CREATE OR REPLACE VIEW ssl_expiry_monitoring AS
SELECT 
    target_hostname,
    target_port,
    not_valid_after,
    days_until_expiry,
    security_grade,
    security_score,
    CASE 
        WHEN days_until_expiry < 0 THEN 'EXPIRED'
        WHEN days_until_expiry <= 7 THEN 'CRITICAL'
        WHEN days_until_expiry <= 30 THEN 'WARNING'
        ELSE 'OK'
    END as expiry_status
FROM ssl_certificates
WHERE is_leaf_certificate = TRUE
ORDER BY days_until_expiry ASC;

-- Network ASN Summary View
CREATE OR REPLACE VIEW network_asn_summary AS
SELECT 
    asn,
    asn_name,
    asn_description,
    COUNT(*) as ip_count,
    COUNT(*) FILTER (WHERE risk_level IN ('high', 'critical')) as high_risk_ips,
    AVG(risk_score) as avg_risk_score,
    ARRAY_AGG(DISTINCT country_code) as countries,
    MAX(created_at) as last_seen
FROM ip_intelligence
WHERE asn IS NOT NULL
GROUP BY asn, asn_name, asn_description
HAVING COUNT(*) > 1
ORDER BY high_risk_ips DESC, ip_count DESC;

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE ip_intelligence IS 'Comprehensive IP intelligence data including geolocation, network info, and threat assessment';
COMMENT ON TABLE port_scan_results IS 'Results from port scanning operations including service detection and vulnerabilities';
COMMENT ON TABLE ssl_certificates IS 'SSL/TLS certificate analysis and security assessment data';
COMMENT ON TABLE network_topology IS 'Network relationship mapping and BGP topology information';

COMMENT ON COLUMN ip_intelligence.embedding IS 'Vector embedding for AI-powered similarity search and clustering';
COMMENT ON COLUMN ip_intelligence.location_point IS 'PostGIS geometry point for spatial queries and mapping';
COMMENT ON COLUMN ip_intelligence.risk_score IS 'Calculated risk score (0-100) based on multiple threat indicators';

-- ============================================================================
-- Grant Permissions
-- ============================================================================

-- Grant permissions to application user (adjust username as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ip_intelligence TO aura_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON port_scan_results TO aura_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ssl_certificates TO aura_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON network_topology TO aura_app_user;

-- Grant permissions on views
-- GRANT SELECT ON ip_risk_summary TO aura_app_user;
-- GRANT SELECT ON port_scan_summary TO aura_app_user;
-- GRANT SELECT ON ssl_expiry_monitoring TO aura_app_user;
-- GRANT SELECT ON network_asn_summary TO aura_app_user;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Log migration completion
INSERT INTO schema_migrations (version, description, applied_at) 
VALUES ('20240115_001', 'Add IP Intelligence and Network Analysis Tables', NOW())
ON CONFLICT (version) DO NOTHING;