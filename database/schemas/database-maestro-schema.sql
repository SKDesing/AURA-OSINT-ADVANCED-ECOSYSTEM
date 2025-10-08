-- AURA Database Maestro - Schema Forensique Unifié
-- Architecture d'Intelligence Cross-Plateforme World-Class

-- Table des identités unifiées (cœur du système)
CREATE TABLE unified_identities (
    id SERIAL PRIMARY KEY,
    master_hash VARCHAR(64) UNIQUE NOT NULL,
    risk_score DECIMAL(3,2) DEFAULT 0.00,
    confidence_level DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des profils par plateforme
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    unified_identity_id INTEGER REFERENCES unified_identities(id),
    platform_type VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    profile_image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform_type, username)
);

-- Table des corrélations détectées
CREATE TABLE correlations (
    id SERIAL PRIMARY KEY,
    profile_id_1 INTEGER REFERENCES profiles(id),
    profile_id_2 INTEGER REFERENCES profiles(id),
    correlation_type VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL,
    evidence_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des commentaires/posts pour analyse NLP
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    unified_identity_id INTEGER REFERENCES unified_identities(id),
    platform_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    toxicity_score DECIMAL(3,2),
    language_detected VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des preuves forensiques
CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id),
    evidence_type VARCHAR(50) NOT NULL,
    file_path TEXT,
    evidence_hash VARCHAR(64) NOT NULL,
    chain_of_custody JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tables pour le système forensique AURA
CREATE TABLE targets (
    target_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profile_data (
    id SERIAL PRIMARY KEY,
    target_id INTEGER REFERENCES targets(target_id),
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    profile_image_url TEXT,
    evidence_hash VARCHAR(64),
    collected_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_unified_identities_hash ON unified_identities(master_hash);
CREATE INDEX idx_profiles_platform_username ON profiles(platform_type, username);
CREATE INDEX idx_correlations_confidence ON correlations(confidence_score DESC);
CREATE INDEX idx_comments_sentiment ON comments(sentiment_score);
CREATE INDEX idx_evidence_hash ON evidence(evidence_hash);
CREATE INDEX idx_targets_platform_username ON targets(platform, username);
CREATE INDEX idx_profile_data_target ON profile_data(target_id);