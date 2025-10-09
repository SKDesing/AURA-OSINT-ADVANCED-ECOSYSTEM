-- Base de données AURA System - Logs & Configuration
-- Création: $(date)

-- Table des logs système
CREATE TABLE logs_systeme (
    id_log SERIAL PRIMARY KEY,
    niveau VARCHAR(20) NOT NULL, -- DEBUG/INFO/WARN/ERROR/FATAL
    service VARCHAR(50) NOT NULL, -- gui/api/engine/chromium/security
    message TEXT NOT NULL,
    details JSONB,
    stack_trace TEXT,
    id_utilisateur INTEGER, -- Référence vers aura_users.utilisateurs_app
    adresse_ip INET,
    timestamp_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des configurations système
CREATE TABLE configurations (
    id_config SERIAL PRIMARY KEY,
    cle_config VARCHAR(100) UNIQUE NOT NULL,
    valeur_config TEXT,
    type_config VARCHAR(20) DEFAULT 'string', -- string/number/boolean/json
    description_config TEXT,
    modifiable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des jobs de collecte
CREATE TABLE jobs_collecte (
    id_job SERIAL PRIMARY KEY,
    nom_job VARCHAR(100) NOT NULL,
    type_job VARCHAR(50) NOT NULL, -- tiktok_profile/correlation/export
    statut VARCHAR(20) DEFAULT 'en_attente', -- en_attente/en_cours/termine/erreur
    parametres JSONB,
    resultat JSONB,
    message_erreur TEXT,
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    duree_execution INTEGER, -- en secondes
    id_utilisateur_lanceur INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des métriques de performance
CREATE TABLE metriques_performance (
    id_metrique SERIAL PRIMARY KEY,
    nom_metrique VARCHAR(100) NOT NULL,
    valeur_metrique DECIMAL(15,4),
    unite VARCHAR(20), -- ms/mb/count/percent
    service VARCHAR(50),
    timestamp_metrique TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Table des alertes système
CREATE TABLE alertes_systeme (
    id_alerte SERIAL PRIMARY KEY,
    type_alerte VARCHAR(50) NOT NULL, -- performance/security/error/maintenance
    niveau_alerte VARCHAR(20) NOT NULL, -- LOW/MEDIUM/HIGH/CRITICAL
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    statut VARCHAR(20) DEFAULT 'ouverte', -- ouverte/en_cours/resolue/fermee
    service_concerne VARCHAR(50),
    donnees_alerte JSONB,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_resolution TIMESTAMP,
    id_utilisateur_assigne INTEGER
);

-- Index pour performances
CREATE INDEX idx_logs_niveau ON logs_systeme(niveau);
CREATE INDEX idx_logs_service ON logs_systeme(service);
CREATE INDEX idx_logs_timestamp ON logs_systeme(timestamp_log);
CREATE INDEX idx_jobs_statut ON jobs_collecte(statut);
CREATE INDEX idx_jobs_type ON jobs_collecte(type_job);
CREATE INDEX idx_jobs_date ON jobs_collecte(created_at);
CREATE INDEX idx_metriques_nom ON metriques_performance(nom_metrique);
CREATE INDEX idx_metriques_timestamp ON metriques_performance(timestamp_metrique);
CREATE INDEX idx_alertes_statut ON alertes_systeme(statut);
CREATE INDEX idx_alertes_niveau ON alertes_systeme(niveau_alerte);

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_timestamp_system()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_configurations
    BEFORE UPDATE ON configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_system();

-- Fonction pour calculer la durée d'exécution des jobs
CREATE OR REPLACE FUNCTION calculate_job_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.date_fin IS NOT NULL AND NEW.date_debut IS NOT NULL THEN
        NEW.duree_execution = EXTRACT(EPOCH FROM (NEW.date_fin - NEW.date_debut));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_job_duration
    BEFORE UPDATE ON jobs_collecte
    FOR EACH ROW
    EXECUTE FUNCTION calculate_job_duration();

-- Configurations par défaut
INSERT INTO configurations (cle_config, valeur_config, type_config, description_config) VALUES
('chromium_path', '/usr/bin/chromium-browser', 'string', 'Chemin vers l''exécutable Chromium'),
('max_concurrent_jobs', '5', 'number', 'Nombre maximum de jobs simultanés'),
('log_retention_days', '30', 'number', 'Durée de rétention des logs en jours'),
('api_rate_limit', '100', 'number', 'Limite de requêtes par minute par IP'),
('enable_debug_mode', 'false', 'boolean', 'Mode debug activé'),
('export_max_records', '10000', 'number', 'Nombre maximum d''enregistrements par export'),
('correlation_threshold', '0.8', 'number', 'Seuil de confiance pour les corrélations'),
('security_audit_enabled', 'true', 'boolean', 'Audit de sécurité activé');

-- Commentaires
COMMENT ON TABLE logs_systeme IS 'Logs centralisés de tous les services AURA';
COMMENT ON TABLE configurations IS 'Configuration système centralisée';
COMMENT ON TABLE jobs_collecte IS 'Historique et statut des jobs de collecte';
COMMENT ON TABLE metriques_performance IS 'Métriques de performance système';
COMMENT ON TABLE alertes_systeme IS 'Système d''alertes et notifications';