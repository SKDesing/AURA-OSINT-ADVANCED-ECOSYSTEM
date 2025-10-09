-- AURA OSINT ML Advanced Schema
-- Extension du schema existant pour Machine Learning

-- Extensions requises pour ML
CREATE EXTENSION IF NOT EXISTS vector; -- pgvector pour embeddings
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Recherche trigram
CREATE EXTENSION IF NOT EXISTS btree_gin; -- Index GIN optimisés

-- Extension des tables existantes
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS risk_score FLOAT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS threat_indicators JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS behavioral_patterns JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS network_metrics JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vector_embedding VECTOR(512);
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
    threat_level INTEGER NOT NULL CHECK (threat_level >= 0 AND threat_level <= 2), -- 0: safe, 1: suspicious, 2: dangerous
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    features JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    prediction_probabilities JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des features extraites
CREATE TABLE IF NOT EXISTS extracted_features (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    feature_type VARCHAR(50) NOT NULL, -- temporal, network, content, behavioral
    feature_vector VECTOR(256),
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

-- Table des graphes de réseaux
CREATE TABLE IF NOT EXISTS network_graphs (
    id BIGSERIAL PRIMARY KEY,
    graph_name VARCHAR(100) NOT NULL,
    graph_type VARCHAR(50) NOT NULL, -- social, correlation, temporal
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    graph_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des modèles ML
CREATE TABLE IF NOT EXISTS ml_models (
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_type VARCHAR(50) NOT NULL, -- classification, correlation, anomaly_detection
    model_version VARCHAR(20) NOT NULL,
    model_path VARCHAR(255),
    hyperparameters JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    training_data_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des expérimentations ML
CREATE TABLE IF NOT EXISTS ml_experiments (
    id BIGSERIAL PRIMARY KEY,
    experiment_name VARCHAR(100) NOT NULL,
    model_id BIGINT REFERENCES ml_models(id),
    dataset_info JSONB NOT NULL,
    hyperparameters JSONB NOT NULL,
    metrics JSONB NOT NULL,
    cross_validation_scores JSONB DEFAULT '{}',
    feature_importance JSONB DEFAULT '{}',
    confusion_matrix JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'running', -- running, completed, failed
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Indexes optimisés pour ML
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_risk_score ON profiles(risk_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_vector_embedding ON profiles USING ivfflat (vector_embedding vector_cosine_ops) WITH (lists = 1000);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_last_analyzed ON profiles(last_analyzed DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_similarity ON entity_correlations(similarity_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_type ON entity_correlations(correlation_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_entity_correlations_confidence ON entity_correlations(confidence DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_level ON threat_classifications(threat_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_confidence ON threat_classifications(confidence DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_threat_classifications_model ON threat_classifications(model_version);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extracted_features_type ON extracted_features(feature_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_extracted_features_vector ON extracted_features USING ivfflat (feature_vector vector_cosine_ops) WITH (lists = 500);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_score ON anomaly_detections(anomaly_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_type ON anomaly_detections(anomaly_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anomaly_detections_is_anomaly ON anomaly_detections(is_anomaly);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_network_graphs_type ON network_graphs(graph_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_network_graphs_updated ON network_graphs(updated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_models_active ON ml_models(is_active) WHERE is_active = TRUE;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_models_type ON ml_models(model_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_experiments_status ON ml_experiments(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ml_experiments_started ON ml_experiments(started_at DESC);

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

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION update_profile_risk_score(profile_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
    new_risk_score FLOAT := 0;
    threat_level INT;
    anomaly_count INT;
BEGIN
    -- Récupérer le niveau de menace le plus récent
    SELECT tc.threat_level INTO threat_level
    FROM threat_classifications tc
    WHERE tc.profile_id = update_profile_risk_score.profile_id
    ORDER BY tc.created_at DESC
    LIMIT 1;
    
    -- Compter les anomalies
    SELECT COUNT(*) INTO anomaly_count
    FROM anomaly_detections ad
    WHERE ad.profile_id = update_profile_risk_score.profile_id
    AND ad.is_anomaly = TRUE;
    
    -- Calculer le score de risque
    new_risk_score := COALESCE(threat_level * 30, 0) + (anomaly_count * 10);
    new_risk_score := LEAST(new_risk_score, 100);
    
    -- Mettre à jour le profil
    UPDATE profiles 
    SET risk_score = new_risk_score, 
        last_analyzed = CURRENT_TIMESTAMP
    WHERE id = update_profile_risk_score.profile_id;
    
    RETURN new_risk_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mise à jour automatique du risk_score
CREATE OR REPLACE FUNCTION trigger_update_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_profile_risk_score(NEW.profile_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_risk_score_on_threat_classification
    AFTER INSERT OR UPDATE ON threat_classifications
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_risk_score();

CREATE TRIGGER update_risk_score_on_anomaly_detection
    AFTER INSERT OR UPDATE ON anomaly_detections
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_risk_score();

-- Commentaires pour documentation
COMMENT ON TABLE entity_correlations IS 'Stockage des corrélations entre entités calculées par les algorithmes ML';
COMMENT ON TABLE threat_classifications IS 'Classifications de menaces générées par les modèles ML';
COMMENT ON TABLE extracted_features IS 'Features extraites des profils pour l''entraînement ML';
COMMENT ON TABLE anomaly_detections IS 'Détections d''anomalies par les autoencodeurs variationnels';
COMMENT ON TABLE network_graphs IS 'Graphes de réseaux pour analyse GNN';
COMMENT ON TABLE ml_models IS 'Métadonnées des modèles ML déployés';
COMMENT ON TABLE ml_experiments IS 'Historique des expérimentations ML avec métriques';

COMMENT ON FUNCTION update_profile_risk_score IS 'Calcule et met à jour le score de risque d''un profil basé sur les classifications et anomalies';