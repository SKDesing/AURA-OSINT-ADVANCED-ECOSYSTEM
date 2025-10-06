// AURA Advanced Correlation Engine - Version "State-of-the-Art"
const crypto = require('crypto');
const { Pool } = require('pg');
const natural = require('natural'); // Pour NLP avancé
const levenshtein = require('fast-levenshtein');

class AdvancedCorrelationEngine {
    constructor(dbConfig) {
        this.db = new Pool(dbConfig);
        this.tfidf = new natural.TfIdf();
        this.stemmer = natural.PorterStemmer;
        
        // Cache pour optimiser les performances
        this.correlationCache = new Map();
        this.riskScoreCache = new Map();
    }

    // Génération de hash maître avec salt forensique
    generateMasterHash(identityMarkers, salt = 'AURA_FORENSIC_2024') {
        const sortedMarkers = Object.keys(identityMarkers)
            .sort()
            .map(key => `${key}:${this.normalizeValue(identityMarkers[key])}`)
            .join('|');
        
        const hashInput = `${salt}|${sortedMarkers}|${Date.now()}`;
        return crypto.createHash('sha256').update(hashInput).digest('hex');
    }

    // Normalisation avancée des valeurs
    normalizeValue(value) {
        if (typeof value === 'string') {
            return value.toLowerCase()
                .replace(/[^\w\s@.-]/g, '')
                .trim();
        }
        return String(value);
    }

    // Corrélation NLP avancée avec SBERT-like scoring
    calculateSemanticSimilarity(text1, text2) {
        if (!text1 || !text2) return 0;
        
        // Preprocessing
        const clean1 = this.preprocessText(text1);
        const clean2 = this.preprocessText(text2);
        
        // TF-IDF similarity
        this.tfidf.addDocument(clean1);
        this.tfidf.addDocument(clean2);
        
        const vector1 = this.tfidf.listTerms(0);
        const vector2 = this.tfidf.listTerms(1);
        
        return this.cosineSimilarity(vector1, vector2);
    }

    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .map(word => this.stemmer.stem(word))
            .join(' ');
    }

    cosineSimilarity(vec1, vec2) {
        const terms1 = new Map(vec1.map(t => [t.term, t.tfidf]));
        const terms2 = new Map(vec2.map(t => [t.term, t.tfidf]));
        
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;
        
        const allTerms = new Set([...terms1.keys(), ...terms2.keys()]);
        
        for (const term of allTerms) {
            const val1 = terms1.get(term) || 0;
            const val2 = terms2.get(term) || 0;
            
            dotProduct += val1 * val2;
            norm1 += val1 * val1;
            norm2 += val2 * val2;
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2)) || 0;
    }

    // Corrélation multi-dimensionnelle avancée
    async correlateProfileAdvanced(profileId) {
        const cacheKey = `profile_${profileId}`;
        if (this.correlationCache.has(cacheKey)) {
            return this.correlationCache.get(cacheKey);
        }

        const profile = await this.getProfile(profileId);
        const correlations = [];

        // 1. Corrélation exacte (email, phone)
        const exactMatches = await this.findExactMatches(profile);
        correlations.push(...exactMatches);

        // 2. Corrélation fuzzy (usernames, noms)
        const fuzzyMatches = await this.findFuzzyMatches(profile);
        correlations.push(...fuzzyMatches);

        // 3. Corrélation sémantique (bios, descriptions)
        const semanticMatches = await this.findSemanticMatches(profile);
        correlations.push(...semanticMatches);

        // 4. Corrélation comportementale (patterns temporels)
        const behavioralMatches = await this.findBehavioralMatches(profile);
        correlations.push(...behavioralMatches);

        // 5. Corrélation par réseau (amis communs, interactions)
        const networkMatches = await this.findNetworkMatches(profile);
        correlations.push(...networkMatches);

        const result = await this.processAdvancedCorrelations(profileId, correlations);
        this.correlationCache.set(cacheKey, result);
        
        return result;
    }

    // Détection de réseaux coordonnés avec algorithmes de graphe
    async detectAdvancedNetworks() {
        const networks = [];

        // 1. Détection temporelle (fenêtres glissantes)
        const temporalNetworks = await this.detectTemporalCoordination();
        networks.push(...temporalNetworks);

        // 2. Détection de contenu (hashing + similarité)
        const contentNetworks = await this.detectContentCoordination();
        networks.push(...contentNetworks);

        // 3. Détection comportementale (patterns ML)
        const behavioralNetworks = await this.detectBehavioralCoordination();
        networks.push(...behavioralNetworks);

        // 4. Détection de graphe social (centralité, communautés)
        const socialNetworks = await this.detectSocialGraphCoordination();
        networks.push(...socialNetworks);

        return this.rankNetworksByRisk(networks);
    }

    async detectTemporalCoordination() {
        const query = `
            WITH temporal_windows AS (
                SELECT 
                    ui.id,
                    DATE_TRUNC('minute', c.created_at) as time_window,
                    COUNT(*) as activity_count
                FROM comments c
                JOIN unified_identities ui ON c.unified_identity_id = ui.id
                WHERE c.created_at >= NOW() - INTERVAL '24 hours'
                GROUP BY ui.id, time_window
                HAVING COUNT(*) >= 3
            ),
            coordinated_groups AS (
                SELECT 
                    time_window,
                    ARRAY_AGG(id) as identity_group,
                    COUNT(*) as group_size
                FROM temporal_windows
                GROUP BY time_window
                HAVING COUNT(*) >= 3
            )
            SELECT 
                identity_group,
                'temporal_coordination' as network_type,
                group_size,
                time_window
            FROM coordinated_groups
            ORDER BY group_size DESC
        `;

        const result = await this.db.query(query);
        return result.rows;
    }

    // Scoring de risque avec Machine Learning
    async calculateAdvancedRiskScore(unifiedIdentityId) {
        const cacheKey = `risk_${unifiedIdentityId}`;
        if (this.riskScoreCache.has(cacheKey)) {
            return this.riskScoreCache.get(cacheKey);
        }

        const features = await this.extractRiskFeatures(unifiedIdentityId);
        const riskScore = this.computeMLRiskScore(features);
        
        // Mise à jour du cache avec TTL
        this.riskScoreCache.set(cacheKey, riskScore);
        setTimeout(() => this.riskScoreCache.delete(cacheKey), 300000); // 5 min TTL
        
        return riskScore;
    }

    async extractRiskFeatures(unifiedIdentityId) {
        const query = `
            SELECT 
                COUNT(DISTINCT p.platform_type) as platform_diversity,
                AVG(c.toxicity_score) as avg_toxicity,
                COUNT(DISTINCT c.id) as comment_volume,
                COUNT(DISTINCT a.id) as alert_count,
                EXTRACT(EPOCH FROM (MAX(c.created_at) - MIN(c.created_at))) / 3600 as activity_span_hours,
                COUNT(DISTINCT DATE_TRUNC('hour', c.created_at)) as active_hours,
                AVG(LENGTH(c.content)) as avg_comment_length,
                COUNT(DISTINCT c.content_hash) / NULLIF(COUNT(c.id), 0) as content_uniqueness
            FROM unified_identities ui
            LEFT JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN comments c ON c.unified_identity_id = ui.id
            LEFT JOIN alerts a ON a.unified_identity_id = ui.id
            WHERE ui.id = $1
            GROUP BY ui.id
        `;

        const result = await this.db.query(query, [unifiedIdentityId]);
        return result.rows[0] || {};
    }

    computeMLRiskScore(features) {
        // Modèle de scoring basé sur des poids appris
        const weights = {
            platform_diversity: 0.15,
            avg_toxicity: 0.30,
            comment_volume: 0.10,
            alert_count: 0.25,
            activity_intensity: 0.10,
            content_uniqueness: -0.10 // Moins d'unicité = plus de risque
        };

        let score = 0;
        
        // Normalisation et application des poids
        score += Math.min((features.platform_diversity || 0) / 5, 1) * weights.platform_diversity;
        score += (features.avg_toxicity || 0) * weights.avg_toxicity;
        score += Math.min((features.comment_volume || 0) / 100, 1) * weights.comment_volume;
        score += Math.min((features.alert_count || 0) / 10, 1) * weights.alert_count;
        
        // Intensité d'activité (volume / temps)
        const intensity = features.activity_span_hours > 0 ? 
            (features.comment_volume || 0) / features.activity_span_hours : 0;
        score += Math.min(intensity / 10, 1) * weights.activity_intensity;
        
        // Unicité du contenu (inverse)
        score += (1 - (features.content_uniqueness || 1)) * Math.abs(weights.content_uniqueness);

        return Math.min(Math.max(score, 0), 1);
    }

    // API pour requêtes analytiques GraphQL-style
    async executeAnalyticsQuery(queryObject) {
        const {
            select = ['*'],
            where = {},
            groupBy = [],
            orderBy = [],
            limit = 100,
            offset = 0
        } = queryObject;

        let query = `SELECT ${select.join(', ')} FROM unified_identities ui`;
        query += ` LEFT JOIN profiles p ON p.unified_identity_id = ui.id`;
        query += ` LEFT JOIN comments c ON c.unified_identity_id = ui.id`;
        query += ` LEFT JOIN alerts a ON a.unified_identity_id = ui.id`;

        const conditions = [];
        const params = [];
        let paramIndex = 1;

        // Construction dynamique des conditions WHERE
        for (const [field, value] of Object.entries(where)) {
            if (Array.isArray(value)) {
                conditions.push(`${field} = ANY($${paramIndex})`);
                params.push(value);
            } else if (typeof value === 'object' && value.operator) {
                conditions.push(`${field} ${value.operator} $${paramIndex}`);
                params.push(value.value);
            } else {
                conditions.push(`${field} = $${paramIndex}`);
                params.push(value);
            }
            paramIndex++;
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        if (groupBy.length > 0) {
            query += ` GROUP BY ${groupBy.join(', ')}`;
        }

        if (orderBy.length > 0) {
            query += ` ORDER BY ${orderBy.join(', ')}`;
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        return this.db.query(query, params);
    }

    // Helpers avancés
    async findExactMatches(profile) {
        const matches = [];
        
        if (profile.identity_markers?.email) {
            const emailMatches = await this.findByEmail(profile.identity_markers.email);
            matches.push(...emailMatches.map(m => ({
                type: 'email_exact',
                target_profile: m.id,
                confidence: 0.98,
                evidence: profile.identity_markers.email
            })));
        }

        return matches;
    }

    async findFuzzyMatches(profile) {
        const matches = [];
        
        if (profile.username) {
            const fuzzyMatches = await this.db.query(
                `SELECT id, username, 
                 1 - (levenshtein(username, $1)::float / GREATEST(length(username), length($1))) as similarity
                 FROM profiles 
                 WHERE levenshtein(username, $1) <= 3 AND id != $2
                 ORDER BY similarity DESC LIMIT 10`,
                [profile.username, profile.id]
            );

            matches.push(...fuzzyMatches.rows.map(m => ({
                type: 'username_fuzzy',
                target_profile: m.id,
                confidence: m.similarity,
                evidence: `${profile.username} ≈ ${m.username}`
            })));
        }

        return matches;
    }

    async findSemanticMatches(profile) {
        const matches = [];
        
        if (profile.bio) {
            const bioMatches = await this.db.query(
                `SELECT id, bio FROM profiles WHERE bio IS NOT NULL AND id != $1`,
                [profile.id]
            );

            for (const match of bioMatches.rows) {
                const similarity = this.calculateSemanticSimilarity(profile.bio, match.bio);
                if (similarity > 0.7) {
                    matches.push({
                        type: 'bio_semantic',
                        target_profile: match.id,
                        confidence: similarity,
                        evidence: `Bio similarity: ${similarity.toFixed(3)}`
                    });
                }
            }
        }

        return matches;
    }

    // Méthodes de nettoyage et maintenance
    async cleanupCache() {
        this.correlationCache.clear();
        this.riskScoreCache.clear();
        console.log('🧹 Cache nettoyé');
    }

    async getSystemHealth() {
        const stats = await this.db.query(`
            SELECT 
                COUNT(DISTINCT ui.id) as total_identities,
                COUNT(DISTINCT p.id) as total_profiles,
                COUNT(DISTINCT ic.id) as total_correlations,
                AVG(ui.risk_score) as avg_risk_score,
                COUNT(CASE WHEN ui.risk_score >= 0.8 THEN 1 END) as high_risk_count
            FROM unified_identities ui
            LEFT JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN identity_correlations ic ON ic.unified_identity_id = ui.id
        `);

        return {
            ...stats.rows[0],
            cache_size: this.correlationCache.size + this.riskScoreCache.size,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = AdvancedCorrelationEngine;