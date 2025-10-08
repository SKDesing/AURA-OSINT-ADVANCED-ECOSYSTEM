-- Base de données AURA Users - Gestion Utilisateurs & Authentification
-- Création: $(date)

-- Table des utilisateurs de l'application AURA
CREATE TABLE utilisateurs_app (
    id_utilisateur SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255),
    role VARCHAR(50) DEFAULT 'analyste', -- admin/analyste/viewer
    statut VARCHAR(20) DEFAULT 'actif', -- actif/suspendu/inactif
    derniere_connexion TIMESTAMP,
    tentatives_connexion INTEGER DEFAULT 0,
    compte_verrouille BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions utilisateurs
CREATE TABLE sessions (
    id_session VARCHAR(128) PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs_app(id_utilisateur) ON DELETE CASCADE,
    adresse_ip INET,
    user_agent TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_expiration TIMESTAMP,
    actif BOOLEAN DEFAULT TRUE
);

-- Table des permissions par rôle
CREATE TABLE permissions (
    id_permission SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    ressource VARCHAR(100) NOT NULL, -- api/gui/export/admin
    action VARCHAR(50) NOT NULL, -- read/write/delete/execute
    autorise BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table d'audit des connexions
CREATE TABLE audit_connexions (
    id_audit SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs_app(id_utilisateur),
    nom_utilisateur VARCHAR(50),
    type_evenement VARCHAR(50), -- login/logout/failed_login/password_change
    adresse_ip INET,
    user_agent TEXT,
    succes BOOLEAN,
    details JSONB,
    timestamp_evenement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_utilisateurs_email ON utilisateurs_app(email);
CREATE INDEX idx_sessions_utilisateur ON sessions(id_utilisateur);
CREATE INDEX idx_sessions_actif ON sessions(actif);
CREATE INDEX idx_audit_utilisateur ON audit_connexions(id_utilisateur);
CREATE INDEX idx_audit_timestamp ON audit_connexions(timestamp_evenement);

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_timestamp_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_utilisateurs_app
    BEFORE UPDATE ON utilisateurs_app
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_users();

-- Données par défaut - Permissions
INSERT INTO permissions (role, ressource, action) VALUES
('admin', 'api', 'read'),
('admin', 'api', 'write'),
('admin', 'gui', 'read'),
('admin', 'gui', 'write'),
('admin', 'export', 'execute'),
('admin', 'admin', 'execute'),
('analyste', 'api', 'read'),
('analyste', 'gui', 'read'),
('analyste', 'export', 'execute'),
('viewer', 'gui', 'read');

-- Commentaires
COMMENT ON TABLE utilisateurs_app IS 'Utilisateurs de l''application AURA';
COMMENT ON TABLE sessions IS 'Sessions actives des utilisateurs';
COMMENT ON TABLE permissions IS 'Permissions par rôle utilisateur';
COMMENT ON TABLE audit_connexions IS 'Audit trail des connexions et actions';