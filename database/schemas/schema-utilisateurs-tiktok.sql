-- Table Utilisateurs TikTok - Schema Complet AURA
-- Création: $(date)

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
    type_compte VARCHAR(50) DEFAULT 'personnel', -- personnel/business/creator
    
    -- Métadonnées enrichies
    bio_description TEXT,
    lien_externe VARCHAR(500),
    photo_profil_url VARCHAR(500),
    langue_principale VARCHAR(10) DEFAULT 'fr',
    fuseau_horaire VARCHAR(50),
    derniere_activite TIMESTAMP,
    statut_compte VARCHAR(50) DEFAULT 'actif', -- actif/suspendu/privé
    score_engagement DECIMAL(5,2) DEFAULT 0.00,
    categories_contenu JSONB, -- Array des catégories
    
    -- Données OSINT forensiques
    date_premiere_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_collecte VARCHAR(100) DEFAULT 'AURA-Engine',
    fiabilite_donnees INTEGER CHECK (fiabilite_donnees >= 1 AND fiabilite_donnees <= 10) DEFAULT 5,
    hash_profil VARCHAR(64), -- SHA-256 pour détecter changements
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX idx_pseudo_tiktok ON utilisateurs_tiktok(pseudo_tiktok);
CREATE INDEX idx_date_creation ON utilisateurs_tiktok(date_creation_compte);
CREATE INDEX idx_nombre_abonnes ON utilisateurs_tiktok(nombre_abonnes);
CREATE INDEX idx_derniere_collecte ON utilisateurs_tiktok(date_premiere_collecte);
CREATE INDEX idx_hash_profil ON utilisateurs_tiktok(hash_profil);

-- Trigger pour mise à jour automatique
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.derniere_mise_a_jour = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_utilisateurs_tiktok
    BEFORE UPDATE ON utilisateurs_tiktok
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Commentaires pour documentation
COMMENT ON TABLE utilisateurs_tiktok IS 'Table principale des utilisateurs TikTok pour AURA OSINT';
COMMENT ON COLUMN utilisateurs_tiktok.hash_profil IS 'Hash SHA-256 du profil pour détecter les modifications';
COMMENT ON COLUMN utilisateurs_tiktok.fiabilite_donnees IS 'Score de fiabilité des données (1-10)';
COMMENT ON COLUMN utilisateurs_tiktok.categories_contenu IS 'Array JSON des catégories de contenu';