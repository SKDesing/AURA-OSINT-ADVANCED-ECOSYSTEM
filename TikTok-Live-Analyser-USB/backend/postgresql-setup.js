const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

class PostgreSQLSetup {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'aura_user',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'aura_investigations',
            password: process.env.DB_PASSWORD || 'aura_secure_2024',
            port: process.env.DB_PORT || 5432,
        });
        
        this.initDatabase();
    }

    async initDatabase() {
        try {
            await this.createTables();
            console.log('✅ Base de données PostgreSQL initialisée');
        } catch (error) {
            console.log('⚠️ PostgreSQL non disponible, utilisation du mode fichier');
            this.useFileMode = true;
        }
    }

    async createTables() {
        const tables = {
            // Table des profils utilisateurs
            profiles: `
                CREATE TABLE IF NOT EXISTS profiles (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    username VARCHAR(255) UNIQUE NOT NULL,
                    display_name VARCHAR(255),
                    bio TEXT,
                    followers_count INTEGER DEFAULT 0,
                    following_count INTEGER DEFAULT 0,
                    hearts_count BIGINT DEFAULT 0,
                    videos_count INTEGER DEFAULT 0,
                    verified BOOLEAN DEFAULT FALSE,
                    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
                    risk_score INTEGER DEFAULT 0,
                    profile_image_url TEXT,
                    last_active TIMESTAMP,
                    forensic_hash VARCHAR(64),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des sessions de capture
            sessions: `
                CREATE TABLE IF NOT EXISTS sessions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    profile_id UUID REFERENCES profiles(id),
                    live_url TEXT NOT NULL,
                    title VARCHAR(500),
                    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped', 'completed')),
                    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    end_time TIMESTAMP,
                    duration_seconds INTEGER DEFAULT 0,
                    max_viewers INTEGER DEFAULT 0,
                    total_comments INTEGER DEFAULT 0,
                    total_screenshots INTEGER DEFAULT 0,
                    video_file_path TEXT,
                    video_file_size BIGINT,
                    video_hash VARCHAR(64),
                    investigator_id VARCHAR(255),
                    case_reference VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des commentaires capturés
            comments: `
                CREATE TABLE IF NOT EXISTS comments (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id UUID REFERENCES sessions(id),
                    username VARCHAR(255),
                    user_id VARCHAR(255),
                    message TEXT NOT NULL,
                    timestamp_capture TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    timestamp_original TIMESTAMP,
                    flagged BOOLEAN DEFAULT FALSE,
                    flag_reason TEXT,
                    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
                    toxicity_score FLOAT,
                    language_detected VARCHAR(10),
                    contains_hate_speech BOOLEAN DEFAULT FALSE,
                    contains_threats BOOLEAN DEFAULT FALSE,
                    contains_harassment BOOLEAN DEFAULT FALSE,
                    forensic_hash VARCHAR(64),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des preuves numériques
            evidence: `
                CREATE TABLE IF NOT EXISTS evidence (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id UUID REFERENCES sessions(id),
                    evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN ('video', 'screenshot', 'audio', 'document', 'metadata')),
                    filename VARCHAR(500) NOT NULL,
                    file_path TEXT NOT NULL,
                    file_size BIGINT,
                    mime_type VARCHAR(100),
                    file_hash VARCHAR(64) NOT NULL,
                    thumbnail_path TEXT,
                    metadata JSONB,
                    chain_of_custody JSONB,
                    integrity_verified BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_by VARCHAR(255)
                );
            `,

            // Table des logs forensiques
            forensic_logs: `
                CREATE TABLE IF NOT EXISTS forensic_logs (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id UUID REFERENCES sessions(id),
                    log_level VARCHAR(20) DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
                    action VARCHAR(100) NOT NULL,
                    details TEXT,
                    user_id VARCHAR(255),
                    ip_address INET,
                    user_agent TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    forensic_hash VARCHAR(64)
                );
            `,

            // Table des utilisateurs investigateurs
            investigators: `
                CREATE TABLE IF NOT EXISTS investigators (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    username VARCHAR(255) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE,
                    full_name VARCHAR(255),
                    organization VARCHAR(255),
                    role VARCHAR(100),
                    permissions JSONB,
                    last_login TIMESTAMP,
                    active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des cas d'enquête
            cases: `
                CREATE TABLE IF NOT EXISTS cases (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    case_number VARCHAR(255) UNIQUE NOT NULL,
                    title VARCHAR(500) NOT NULL,
                    description TEXT,
                    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'archived')),
                    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
                    assigned_to UUID REFERENCES investigators(id),
                    created_by UUID REFERENCES investigators(id),
                    start_date DATE DEFAULT CURRENT_DATE,
                    end_date DATE,
                    tags TEXT[],
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des rapports générés
            reports: `
                CREATE TABLE IF NOT EXISTS reports (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    case_id UUID REFERENCES cases(id),
                    session_id UUID REFERENCES sessions(id),
                    report_type VARCHAR(50) CHECK (report_type IN ('summary', 'detailed', 'forensic', 'legal')),
                    title VARCHAR(500),
                    content TEXT,
                    file_path TEXT,
                    file_format VARCHAR(20),
                    generated_by UUID REFERENCES investigators(id),
                    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    report_hash VARCHAR(64)
                );
            `,

            // Table des alertes automatiques
            alerts: `
                CREATE TABLE IF NOT EXISTS alerts (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id UUID REFERENCES sessions(id),
                    alert_type VARCHAR(50) NOT NULL,
                    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    triggered_by TEXT,
                    acknowledged BOOLEAN DEFAULT FALSE,
                    acknowledged_by UUID REFERENCES investigators(id),
                    acknowledged_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `,

            // Table des configurations système
            system_config: `
                CREATE TABLE IF NOT EXISTS system_config (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    config_key VARCHAR(255) UNIQUE NOT NULL,
                    config_value JSONB,
                    description TEXT,
                    updated_by UUID REFERENCES investigators(id),
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `
        };

        // Créer les tables
        for (const [tableName, createSQL] of Object.entries(tables)) {
            try {
                await this.pool.query(createSQL);
                console.log(`✅ Table ${tableName} créée/vérifiée`);
            } catch (error) {
                console.error(`❌ Erreur création table ${tableName}:`, error.message);
            }
        }

        // Créer les index pour les performances
        await this.createIndexes();
        
        // Insérer les données par défaut
        await this.insertDefaultData();
    }

    async createIndexes() {
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);',
            'CREATE INDEX IF NOT EXISTS idx_profiles_risk_level ON profiles(risk_level);',
            'CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);',
            'CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);',
            'CREATE INDEX IF NOT EXISTS idx_comments_session_id ON comments(session_id);',
            'CREATE INDEX IF NOT EXISTS idx_comments_flagged ON comments(flagged);',
            'CREATE INDEX IF NOT EXISTS idx_comments_timestamp ON comments(timestamp_capture);',
            'CREATE INDEX IF NOT EXISTS idx_evidence_session_id ON evidence(session_id);',
            'CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(evidence_type);',
            'CREATE INDEX IF NOT EXISTS idx_logs_session_id ON forensic_logs(session_id);',
            'CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON forensic_logs(timestamp);',
            'CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);',
            'CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);'
        ];

        for (const indexSQL of indexes) {
            try {
                await this.pool.query(indexSQL);
            } catch (error) {
                // Ignorer les erreurs d'index déjà existants
            }
        }
        
        console.log('✅ Index de performance créés');
    }

    async insertDefaultData() {
        try {
            // Insérer un investigateur par défaut
            await this.pool.query(`
                INSERT INTO investigators (username, email, full_name, organization, role, permissions)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (username) DO NOTHING
            `, [
                'admin',
                'admin@scis.local',
                'Administrateur SCIS',
                'SCIS Forensics',
                'Administrator',
                JSON.stringify({
                    create_cases: true,
                    manage_users: true,
                    access_all_data: true,
                    generate_reports: true
                })
            ]);

            // Insérer une configuration par défaut
            await this.pool.query(`
                INSERT INTO system_config (config_key, config_value, description)
                VALUES ($1, $2, $3)
                ON CONFLICT (config_key) DO NOTHING
            `, [
                'app_version',
                JSON.stringify({ version: '1.0.0', build: 'final' }),
                'Version de l\'application SCIS'
            ]);

            console.log('✅ Données par défaut insérées');
        } catch (error) {
            console.error('Erreur insertion données par défaut:', error);
        }
    }

    async getStats() {
        try {
            const stats = {};
            
            const tables = ['profiles', 'sessions', 'comments', 'evidence', 'forensic_logs', 'cases', 'reports', 'alerts'];
            
            for (const table of tables) {
                const result = await this.pool.query(`SELECT COUNT(*) as count FROM ${table}`);
                stats[table] = parseInt(result.rows[0].count);
            }
            
            return { success: true, stats };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async query(sql, params = []) {
        try {
            const result = await this.pool.query(sql, params);
            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = PostgreSQLSetup;