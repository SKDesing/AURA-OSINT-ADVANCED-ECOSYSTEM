-- ═══════════════════════════════════════════════════════════════════
-- AURA OSINT - SCHÉMA FINAL COMPLET
-- PostgreSQL 16 - Toutes les tables manquantes ajoutées
-- ═══════════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════
-- TABLES EXISTANTES (du schema-minimal-complete.sql)
-- ═══════════════════════════════════════════════════════════════════

-- users, sessions, investigations, targets, osint_scans, scan_results, audit_logs
-- (Reprendre le contenu du schema-minimal-complete.sql)

-- ═══════════════════════════════════════════════════════════════════
-- NOUVELLES TABLES CRITIQUES MANQUANTES
-- ═══════════════════════════════════════════════════════════════════

-- 1. API KEYS & TOKENS
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions TEXT[] DEFAULT '{}',
    rate_limit INTEGER DEFAULT 100,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NOTIFICATIONS & ALERTS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('scan_complete', 'alert', 'system', 'security')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WEBHOOKS
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] DEFAULT '{}',
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FILE STORAGE
CREATE TABLE file_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TOOL CONFIGURATIONS
CREATE TABLE tool_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_name VARCHAR(100) NOT NULL,
    config_name VARCHAR(100),
    settings JSONB DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tool_name, config_name)
);

-- 6. SCHEDULED TASKS
CREATE TABLE scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    schedule_cron VARCHAR(100),
    next_run_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DATA RETENTION POLICIES
CREATE TABLE retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL,
    retention_days INTEGER NOT NULL,
    auto_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PERMISSIONS GRANULAIRES
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    permission VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_type, resource_id, permission)
);

-- 9. SYSTEM SETTINGS
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RATE LIMITING
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL, -- IP, user_id, api_key
    endpoint VARCHAR(255) NOT NULL,
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(identifier, endpoint)
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES POUR NOUVELLES TABLES
-- ═══════════════════════════════════════════════════════════════════

-- API Keys
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Webhooks
CREATE INDEX idx_webhooks_user ON webhooks(user_id);
CREATE INDEX idx_webhooks_active ON webhooks(is_active);

-- File Attachments
CREATE INDEX idx_files_investigation ON file_attachments(investigation_id);
CREATE INDEX idx_files_hash ON file_attachments(file_hash);

-- Tool Configs
CREATE INDEX idx_tool_configs_user ON tool_configs(user_id);
CREATE INDEX idx_tool_configs_tool ON tool_configs(tool_name);

-- Scheduled Tasks
CREATE INDEX idx_scheduled_user ON scheduled_tasks(user_id);
CREATE INDEX idx_scheduled_next_run ON scheduled_tasks(next_run_at);
CREATE INDEX idx_scheduled_active ON scheduled_tasks(is_active);

-- Permissions
CREATE INDEX idx_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_permissions_resource ON user_permissions(resource_type, resource_id);

-- Rate Limits
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS POUR NOUVELLES TABLES
-- ═══════════════════════════════════════════════════════════════════

CREATE TRIGGER tool_configs_updated_at BEFORE UPDATE ON tool_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- DONNÉES INITIALES
-- ═══════════════════════════════════════════════════════════════════

-- Politiques de rétention par défaut
INSERT INTO retention_policies (resource_type, retention_days, auto_delete) VALUES
('audit_logs', 365, true),
('scan_results', 90, false),
('notifications', 30, true),
('sessions', 7, true);

-- Paramètres système par défaut
INSERT INTO system_settings (key, value, description, is_public) VALUES
('max_concurrent_scans', '10', 'Maximum concurrent OSINT scans per user', false),
('default_scan_timeout', '300', 'Default scan timeout in seconds', false),
('enable_notifications', 'true', 'Enable system notifications', true),
('maintenance_mode', 'false', 'System maintenance mode', true);