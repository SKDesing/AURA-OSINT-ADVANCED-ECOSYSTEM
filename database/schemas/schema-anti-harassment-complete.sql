-- ============================================================
-- AURA TIKTOK ANTI-HARASSMENT DATABASE SCHEMA
-- Projet Cybersécurité - Tracking Harcèlement TikTok
-- ============================================================

-- --------------------------------------------------------
-- TABLE 1: PROFILS SUSPECTS
-- --------------------------------------------------------
CREATE TABLE suspect_profiles (
    suspect_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tiktok_user_id BIGINT UNIQUE NOT NULL,
    tiktok_username VARCHAR(100) NOT NULL,
    nickname VARCHAR(255),
    
    -- Données identité
    avatar_url TEXT,
    bio TEXT,
    account_created_date TIMESTAMP,
    
    -- Métriques comportementales
    total_harassment_incidents INT DEFAULT 0,
    severity_score INT DEFAULT 0, -- 0-100
    threat_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    
    -- Patterns détectés
    harassment_types JSON, -- ["verbal_abuse", "doxxing", "spam", "threats"]
    target_demographics JSON, -- {"gender": "female", "age_range": "18-25"}
    operating_hours JSON, -- {"peak_hours": [20, 21, 22], "timezone": "CET"}
    
    -- Statut investigation
    investigation_status ENUM('detected', 'under_review', 'confirmed', 'closed'),
    first_detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP,
    
    -- Preuves collectées
    evidence_count INT DEFAULT 0,
    pdf_reports_generated INT DEFAULT 0,
    
    INDEX idx_username (tiktok_username),
    INDEX idx_threat_level (threat_level),
    INDEX idx_status (investigation_status)
);

-- --------------------------------------------------------
-- TABLE 2: VICTIMES IDENTIFIÉES
-- --------------------------------------------------------
CREATE TABLE victim_profiles (
    victim_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tiktok_user_id BIGINT UNIQUE NOT NULL,
    tiktok_username VARCHAR(100) NOT NULL,
    nickname VARCHAR(255),
    
    -- Protection status
    protection_level ENUM('none', 'monitored', 'protected', 'high_risk'),
    harassment_received_count INT DEFAULT 0,
    unique_attackers_count INT DEFAULT 0,
    
    -- Impact analysis
    psychological_impact_score INT, -- 0-100
    account_activity_change DECIMAL(5,2), -- % changement d'activité
    
    -- Timeline
    first_harassment_date TIMESTAMP,
    last_harassment_date TIMESTAMP,
    
    -- Support
    support_contacted BOOLEAN DEFAULT FALSE,
    authorities_notified BOOLEAN DEFAULT FALSE,
    
    INDEX idx_protection (protection_level),
    INDEX idx_username (tiktok_username)
);

-- --------------------------------------------------------
-- TABLE 3: SESSIONS LIVE SURVEILLÉES
-- --------------------------------------------------------
CREATE TABLE monitored_live_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id VARCHAR(100) UNIQUE NOT NULL,
    
    -- Infos LIVE
    host_user_id BIGINT NOT NULL,
    host_username VARCHAR(100),
    live_title TEXT,
    
    -- Timeline
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INT,
    
    -- Métriques surveillance
    total_messages_captured INT DEFAULT 0,
    toxic_messages_detected INT DEFAULT 0,
    harassment_incidents_detected INT DEFAULT 0,
    unique_participants_count INT DEFAULT 0,
    unique_harassers_detected INT DEFAULT 0,
    
    -- Alertes déclenchées
    alerts_triggered JSON, -- [{"type": "mass_harassment", "timestamp": "...", "severity": "high"}]
    
    -- Status
    monitoring_active BOOLEAN DEFAULT TRUE,
    requires_immediate_action BOOLEAN DEFAULT FALSE,
    
    INDEX idx_host (host_user_id),
    INDEX idx_dates (started_at, ended_at)
);

-- --------------------------------------------------------
-- TABLE 4: MESSAGES COLLECTÉS (CŒUR DU SYSTÈME)
-- --------------------------------------------------------
CREATE TABLE captured_messages (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    
    -- Identification message
    tiktok_message_id VARCHAR(100) UNIQUE,
    sender_user_id BIGINT NOT NULL,
    sender_username VARCHAR(100) NOT NULL,
    sender_nickname VARCHAR(255),
    
    -- Contenu
    message_text TEXT NOT NULL,
    message_type ENUM('chat', 'gift', 'system', 'sticker', 'emoji'),
    
    -- Timestamp précis
    sent_at TIMESTAMP NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Analyse toxicité (NLP)
    toxicity_score DECIMAL(5,4), -- 0.0000 à 1.0000
    toxicity_category ENUM('benign', 'mild', 'moderate', 'severe', 'extreme'),
    
    -- Flags de détection
    contains_insults BOOLEAN DEFAULT FALSE,
    contains_threats BOOLEAN DEFAULT FALSE,
    contains_sexual_content BOOLEAN DEFAULT FALSE,
    contains_racism BOOLEAN DEFAULT FALSE,
    contains_doxxing BOOLEAN DEFAULT FALSE,
    contains_spam BOOLEAN DEFAULT FALSE,
    
    -- Contexte
    is_reply_to_message_id BIGINT,
    mentioned_users JSON, -- ["@username1", "@username2"]
    
    -- Preuves
    screenshot_path VARCHAR(500),
    video_capture_path VARCHAR(500),
    
    FOREIGN KEY (session_id) REFERENCES monitored_live_sessions(session_id),
    
    INDEX idx_session (session_id),
    INDEX idx_sender (sender_user_id),
    INDEX idx_toxicity (toxicity_score DESC),
    INDEX idx_timestamp (sent_at),
    INDEX idx_flags (contains_threats, contains_doxxing)
);

-- --------------------------------------------------------
-- TABLE 5: INCIDENTS DE HARCÈLEMENT CATALOGUÉS
-- --------------------------------------------------------
CREATE TABLE harassment_incidents (
    incident_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Acteurs
    aggressor_user_id BIGINT NOT NULL,
    victim_user_id BIGINT NOT NULL,
    session_id BIGINT,
    
    -- Caractérisation incident
    incident_type ENUM(
        'verbal_abuse', 
        'threats', 
        'doxxing', 
        'coordinated_harassment', 
        'sexual_harassment',
        'hate_speech',
        'spam_flooding'
    ) NOT NULL,
    
    severity INT NOT NULL, -- 1-10
    
    -- Preuves liées
    related_messages JSON, -- Array de message_ids
    evidence_count INT DEFAULT 0,
    
    -- Timeline
    incident_start TIMESTAMP NOT NULL,
    incident_end TIMESTAMP,
    
    -- Statut
    status ENUM('open', 'investigating', 'confirmed', 'resolved', 'false_positive'),
    investigated_by VARCHAR(100),
    investigation_notes TEXT,
    
    -- Actions prises
    reported_to_tiktok BOOLEAN DEFAULT FALSE,
    reported_to_authorities BOOLEAN DEFAULT FALSE,
    pdf_report_generated BOOLEAN DEFAULT FALSE,
    pdf_report_path VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES monitored_live_sessions(session_id),
    
    INDEX idx_aggressor (aggressor_user_id),
    INDEX idx_victim (victim_user_id),
    INDEX idx_type (incident_type),
    INDEX idx_severity (severity DESC),
    INDEX idx_status (status)
);

-- --------------------------------------------------------
-- TABLE 6: PREUVES NUMÉRIQUES (CHAIN OF CUSTODY)
-- --------------------------------------------------------
CREATE TABLE digital_evidence (
    evidence_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Lien incident
    incident_id BIGINT NOT NULL,
    message_id BIGINT,
    
    -- Type preuve
    evidence_type ENUM('screenshot', 'video', 'chat_log', 'profile_snapshot', 'metadata'),
    
    -- Fichiers
    file_path VARCHAR(500) NOT NULL,
    file_hash_sha256 CHAR(64) NOT NULL, -- Intégrité cryptographique
    file_size_bytes BIGINT,
    
    -- Chaîne de traçabilité
    captured_at TIMESTAMP NOT NULL,
    captured_by VARCHAR(100),
    verification_status ENUM('pending', 'verified', 'compromised'),
    
    -- Métadonnées
    original_metadata JSON,
    
    -- Utilisation légale
    admissible_in_court BOOLEAN DEFAULT FALSE,
    used_in_report BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (incident_id) REFERENCES harassment_incidents(incident_id),
    FOREIGN KEY (message_id) REFERENCES captured_messages(message_id),
    
    INDEX idx_incident (incident_id),
    INDEX idx_hash (file_hash_sha256),
    INDEX idx_type (evidence_type)
);

-- --------------------------------------------------------
-- TABLE 7: RAPPORTS PDF GÉNÉRÉS
-- --------------------------------------------------------
CREATE TABLE generated_reports (
    report_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Contenu rapport
    incident_ids JSON NOT NULL, -- Array d'incidents couverts
    suspect_ids JSON NOT NULL,
    victim_ids JSON,
    
    -- Fichier
    pdf_file_path VARCHAR(500) NOT NULL,
    pdf_file_hash CHAR(64) NOT NULL,
    page_count INT,
    file_size_kb INT,
    
    -- Métadonnées rapport
    report_type ENUM('incident_summary', 'suspect_dossier', 'victim_protection', 'legal_evidence'),
    report_title VARCHAR(300),
    report_period_start DATE,
    report_period_end DATE,
    
    -- Génération
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(100),
    generation_time_ms INT,
    
    -- Distribution
    sent_to_authorities BOOLEAN DEFAULT FALSE,
    sent_to_victim BOOLEAN DEFAULT FALSE,
    
    INDEX idx_type (report_type),
    INDEX idx_generated (generated_at DESC)
);

-- --------------------------------------------------------
-- TABLE 8: ALERTES TEMPS RÉEL
-- --------------------------------------------------------
CREATE TABLE realtime_alerts (
    alert_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    -- Déclencheur
    trigger_type ENUM('high_toxicity_burst', 'coordinated_attack', 'doxxing_detected', 'threat_detected', 'mass_flagging'),
    session_id BIGINT,
    message_ids JSON,
    
    -- Sévérité
    severity ENUM('info', 'warning', 'critical', 'emergency'),
    
    -- Détails
    alert_message TEXT NOT NULL,
    affected_users JSON, -- user_ids
    
    -- Timeline
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    
    -- Actions
    automated_actions_taken JSON,
    manual_intervention_required BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (session_id) REFERENCES monitored_live_sessions(session_id),
    
    INDEX idx_severity (severity),
    INDEX idx_triggered (triggered_at DESC),
    INDEX idx_unresolved (resolved_at)
);

-- --------------------------------------------------------
-- STORED PROCEDURES ESSENTIELLES
-- --------------------------------------------------------

-- Procédure: Détecter harceleur récurrent
DELIMITER $$
CREATE PROCEDURE detect_repeat_offender(IN user_id BIGINT)
BEGIN
    SELECT 
        sp.suspect_id,
        sp.tiktok_username,
        sp.total_harassment_incidents,
        sp.severity_score,
        COUNT(DISTINCT hi.victim_user_id) AS unique_victims,
        COUNT(hi.incident_id) AS total_incidents,
        AVG(hi.severity) AS avg_incident_severity,
        GROUP_CONCAT(DISTINCT hi.incident_type) AS attack_types
    FROM suspect_profiles sp
    JOIN harassment_incidents hi ON sp.tiktok_user_id = hi.aggressor_user_id
    WHERE sp.tiktok_user_id = user_id
    GROUP BY sp.suspect_id
    HAVING total_incidents >= 3 OR avg_incident_severity >= 7;
END$$
DELIMITER ;

-- Trigger: Auto-update threat level
DELIMITER $$
CREATE TRIGGER update_threat_level_after_incident
AFTER INSERT ON harassment_incidents
FOR EACH ROW
BEGIN
    UPDATE suspect_profiles
    SET 
        total_harassment_incidents = total_harassment_incidents + 1,
        severity_score = LEAST(100, severity_score + NEW.severity * 5),
        threat_level = CASE
            WHEN severity_score >= 80 THEN 'critical'
            WHEN severity_score >= 60 THEN 'high'
            WHEN severity_score >= 30 THEN 'medium'
            ELSE 'low'
        END,
        last_activity_at = NOW()
    WHERE tiktok_user_id = NEW.aggressor_user_id;
END$$
DELIMITER ;