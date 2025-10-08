-- Base de données AURA Forensic - Données OSINT & Investigation
-- Création: $(date)

-- Table principale des utilisateurs TikTok (déjà créée)
CREATE TABLE utilisateurs_tiktok (
    -- Identifiants
    id_utilisateur SERIAL PRIMARY KEY,
    pseudo_tiktok VARCHAR(255) UNIQUE NOT NULL,
    
    -- Informations personnelles
    nom_complet VARCHAR(255),
    prenom VARCHAR(100),
    nom_famille VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    ville VARCHAR(100),
    pays VARCHAR(100),
    code_postal VARCHAR(20),
    
    -- Données TikTok spécifiques
    date_creation_compte TIMESTAMP,
    nombre_abonnes BIGINT DEFAULT 0,
    nombre_suivis BIGINT DEFAULT 0,
    nombre_publications BIGINT DEFAULT 0,
    nombre_likes_recus BIGINT DEFAULT 0,
    nombre_vues_totales BIGINT DEFAULT 0,
    nombre_partages BIGINT DEFAULT 0,
    nombre_commentaires_recus BIGINT DEFAULT 0,
    verification_compte BOOLEAN DEFAULT FALSE,
    type_compte VARCHAR(50) DEFAULT 'personnel',
    
    -- Métadonnées enrichies
    bio_description TEXT,
    lien_externe VARCHAR(500),
    photo_profil_url VARCHAR(500),
    langue_principale VARCHAR(10) DEFAULT 'fr',
    fuseau_horaire VARCHAR(50),
    derniere_activite TIMESTAMP,
    statut_compte VARCHAR(50) DEFAULT 'actif',
    score_engagement DECIMAL(5,2) DEFAULT 0.00,
    categories_contenu JSONB,
    
    -- Données OSINT forensiques
    date_premiere_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_collecte VARCHAR(100) DEFAULT 'AURA-Engine',
    fiabilite_donnees INTEGER CHECK (fiabilite_donnees >= 1 AND fiabilite_donnees <= 10) DEFAULT 5,
    hash_profil VARCHAR(64),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des corrélations entre profils
CREATE TABLE correlations (
    id_correlation SERIAL PRIMARY KEY,
    id_utilisateur_1 INTEGER REFERENCES utilisateurs_tiktok(id_utilisateur) ON DELETE CASCADE,
    id_utilisateur_2 INTEGER REFERENCES utilisateurs_tiktok(id_utilisateur) ON DELETE CASCADE,
    type_correlation VARCHAR(50) NOT NULL, -- username/bio/location/behavior/network
    score_confiance DECIMAL(5,4) NOT NULL CHECK (score_confiance >= 0 AND score_confiance <= 1),
    details_correlation JSONB,
    methode_calcul VARCHAR(100),
    statut_validation VARCHAR(20) DEFAULT 'automatique', -- automatique/manuelle/validee/rejetee
    id_validateur INTEGER, -- Référence vers aura_users.utilisateurs_app
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des investigations
CREATE TABLE investigations (
    id_investigation SERIAL PRIMARY KEY,
    nom_investigation VARCHAR(255) NOT NULL,
    description TEXT,
    statut VARCHAR(20) DEFAULT 'ouverte', -- ouverte/en_cours/fermee/archivee
    priorite VARCHAR(20) DEFAULT 'normale', -- basse/normale/haute/critique
    id_enqueteur INTEGER, -- Référence vers aura_users.utilisateurs_app
    date_ouverture TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fermeture TIMESTAMP,
    tags JSONB,
    notes_investigation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison investigation-utilisateurs
CREATE TABLE investigation_utilisateurs (
    id_liaison SERIAL PRIMARY KEY,
    id_investigation INTEGER REFERENCES investigations(id_investigation) ON DELETE CASCADE,
    id_utilisateur INTEGER REFERENCES utilisateurs_tiktok(id_utilisateur) ON DELETE CASCADE,
    role_dans_investigation VARCHAR(50), -- suspect/temoin/victime/contact
    notes TEXT,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des preuves/evidence
CREATE TABLE evidence (
    id_evidence SERIAL PRIMARY KEY,
    id_investigation INTEGER REFERENCES investigations(id_investigation) ON DELETE CASCADE,
    id_utilisateur INTEGER REFERENCES utilisateurs_tiktok(id_utilisateur),
    type_evidence VARCHAR(50) NOT NULL, -- screenshot/video/profile_data/correlation/document
    nom_fichier VARCHAR(255),
    chemin_fichier VARCHAR(500),
    hash_fichier VARCHAR(64), -- SHA-256
    taille_fichier BIGINT,
    description TEXT,
    metadata JSONB,
    chain_of_custody JSONB, -- Chaîne de possession
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    collecte_par INTEGER, -- Référence vers aura_users.utilisateurs_app
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commentaires/publications collectés
CREATE TABLE publications_collectees (
    id_publication SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES utilisateurs_tiktok(id_utilisateur) ON DELETE CASCADE,
    id_publication_tiktok VARCHAR(100), -- ID TikTok de la publication
    type_contenu VARCHAR(50), -- video/comment/bio/live
    contenu_texte TEXT,
    url_media VARCHAR(500),
    nombre_likes BIGINT DEFAULT 0,
    nombre_commentaires BIGINT DEFAULT 0,
    nombre_partages BIGINT DEFAULT 0,
    nombre_vues BIGINT DEFAULT 0,
    hashtags JSONB,
    mentions JSONB,
    date_publication TIMESTAMP,
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rapports d'export
CREATE TABLE rapports_export (
    id_rapport SERIAL PRIMARY KEY,
    id_investigation INTEGER REFERENCES investigations(id_investigation),
    type_rapport VARCHAR(50), -- pdf/json/csv/xml
    nom_fichier VARCHAR(255),
    chemin_fichier VARCHAR(500),
    parametres_export JSONB,
    nombre_enregistrements INTEGER,
    taille_fichier BIGINT,
    hash_fichier VARCHAR(64),
    genere_par INTEGER, -- Référence vers aura_users.utilisateurs_app
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_expiration TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_utilisateurs_pseudo ON utilisateurs_tiktok(pseudo_tiktok);
CREATE INDEX idx_utilisateurs_hash ON utilisateurs_tiktok(hash_profil);
CREATE INDEX idx_correlations_score ON correlations(score_confiance);
CREATE INDEX idx_correlations_type ON correlations(type_correlation);
CREATE INDEX idx_investigations_statut ON investigations(statut);
CREATE INDEX idx_evidence_investigation ON evidence(id_investigation);
CREATE INDEX idx_evidence_type ON evidence(type_evidence);
CREATE INDEX idx_publications_utilisateur ON publications_collectees(id_utilisateur);
CREATE INDEX idx_publications_date ON publications_collectees(date_publication);

-- Triggers pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_timestamp_forensic()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF TG_TABLE_NAME = 'utilisateurs_tiktok' THEN
        NEW.derniere_mise_a_jour = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_utilisateurs_tiktok
    BEFORE UPDATE ON utilisateurs_tiktok
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_forensic();

CREATE TRIGGER trigger_update_correlations
    BEFORE UPDATE ON correlations
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_forensic();

CREATE TRIGGER trigger_update_investigations
    BEFORE UPDATE ON investigations
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_forensic();

-- Contraintes d'intégrité
ALTER TABLE correlations ADD CONSTRAINT unique_correlation 
    UNIQUE (id_utilisateur_1, id_utilisateur_2, type_correlation);

ALTER TABLE investigation_utilisateurs ADD CONSTRAINT unique_investigation_user 
    UNIQUE (id_investigation, id_utilisateur);

-- Commentaires
COMMENT ON TABLE utilisateurs_tiktok IS 'Profils TikTok collectés pour analyse OSINT';
COMMENT ON TABLE correlations IS 'Corrélations calculées entre profils utilisateurs';
COMMENT ON TABLE investigations IS 'Dossiers d''investigation forensique';
COMMENT ON TABLE evidence IS 'Preuves et éléments collectés';
COMMENT ON TABLE publications_collectees IS 'Publications et contenus TikTok collectés';
COMMENT ON TABLE rapports_export IS 'Historique des exports et rapports générés';