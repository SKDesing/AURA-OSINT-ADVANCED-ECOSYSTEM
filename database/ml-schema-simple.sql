-- AURA OSINT ML Schema (Sans pgvector)
-- Extension du schema existant pour Machine Learning

-- Extensions disponibles
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Extension des tables existantes
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS risk_score FLOAT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS threat_indicators JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS behavioral_patterns JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS network_metrics JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMP;

-- Table de corrélations d'entités
CREATE TABLE IF NOT EXISTS entity_correlations (
    id BIGSERIAL PRIMARY KEY,
    entity_a_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    entity_b_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    similarity_score FLOAT NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    correlation_type VARCHAR(50) NOT NULL,
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    features JSONB DEFAULT '{}',
    algorithm_version VARCHAR(20) DEFAULT 'v1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_a_id, entity_b_id, correlation_type)
);

-- Table de classifications de menaces
CREATE TABLE IF NOT EXISTS threat_classifications (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    threat_level INTEGER NOT NULL CHECK (threat_level >= 0 AND threat_level <= 2),
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    features JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    prediction_probabilities JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des features extraites (sans vecteurs)
CREATE TABLE IF NOT EXISTS extracted_features (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL,
    feature_data JSONB NOT NULL,
    extraction_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, feature_type, extraction_method)
);

-- Table des anomalies détectées
CREATE TABLE IF NOT EXISTS anomaly_detections (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(50) NOT NULL,
    anomaly_score FLOAT NOT NULL CHECK (anomaly_score >= 0),
    threshold FLOAT NOT NULL,
    is_anomaly BOOLEAN NOT NULL,
    detector_model VARCHAR(50) NOT NULL,
    detection_details JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des modèles ML
CREATE TABLE IF NOT EXISTS ml_models (
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_type VARCHAR(50) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    model_path VARCHAR(255),
    hyperparameters JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    training_data_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes optimisés
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_risk_score ON profiles(risk_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_last_analyzed ON profiles(last_analyzed DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_similarity ON entity_correlations(similarity_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_type ON entity_correlations(correlation_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_confidence ON entity_correlations(confidence DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_level ON threat_classifications(threat_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_confidence ON threat_classifications(confidence DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_model ON threat_classifications(model_version);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extracted_features_type ON extracted_features(feature_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_score ON anomaly_detections(anomaly_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_type ON anomaly_detections(anomaly_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_is_anomaly ON anomaly_detections(is_anomaly);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_models_active ON ml_models(is_active) WHERE is_active = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_models_type ON ml_models(model_type);

-- Vues pour analyses rapides
CREATE OR REPLACE VIEW high_risk_profiles AS
SELECT 
    p.*,
    tc.threat_level,
    tc.confidence as threat_confidence,
    ad.anomaly_score
FROM profiles p
LEFT JOIN threat_classifications tc ON p.id = tc.profile_id
LEFT JOIN anomaly_detections ad ON p.id = ad.profile_id
WHERE p.risk_score > 70 OR tc.threat_level >= 2 OR ad.is_anomaly = TRUE;

CREATE OR REPLACE VIEW correlation_network AS
SELECT 
    ec.*,
    pa.username as entity_a_username,
    pa.platform as entity_a_platform,
    pb.username as entity_b_username,
    pb.platform as entity_b_platform
FROM entity_correlations ec
JOIN profiles pa ON ec.entity_a_id = pa.id
JOIN profiles pb ON ec.entity_b_id = pb.id
WHERE ec.similarity_score > 0.8;

-- Fonction de mise à jour du risk_score
CREATE OR REPLACE FUNCTION update_profile_risk_score(profile_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
    new_risk_score FLOAT := 0;
    threat_level INT;
    anomaly_count INT;
BEGIN
    SELECT tc.threat_level INTO threat_level
    FROM threat_classifications tc
    WHERE tc.profile_id = update_profile_risk_score.profile_id
    ORDER BY tc.created_at DESC
    LIMIT 1;
    
    SELECT COUNT(*) INTO anomaly_count
    FROM anomaly_detections ad
    WHERE ad.profile_id = update_profile_risk_score.profile_id
    AND ad.is_anomaly = TRUE;
    
    new_risk_score := COALESCE(threat_level * 30, 0) + (anomaly_count * 10);
    new_risk_score := LEAST(new_risk_score, 100);
    
    UPDATE profiles 
    SET risk_score = new_risk_score, 
        last_analyzed = CURRENT_TIMESTAMP
    WHERE id = update_profile_risk_score.profile_id;
    
    RETURN new_risk_score;
END;
$$ LANGUAGE plpgsql;