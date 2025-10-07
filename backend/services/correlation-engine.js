// AURA Correlation Engine - Moteur de corrélation d'identités cross-plateforme
const crypto = require('crypto');
const { Pool } = require('pg');

class CorrelationEngine {
    constructor(dbConfig) {
        this.db = new Pool(dbConfig);
    }

    // Générer un hash maître pour une identité unifiée
    generateMasterHash(identityMarkers) {
        const sortedMarkers = Object.keys(identityMarkers)
            .sort()
            .map(key => `${key}:${identityMarkers[key]}`)
            .join('|');
        return crypto.createHash('sha256').update(sortedMarkers).digest('hex');
    }

    // Corréler un profil avec des identités existantes
    async correlateProfile(profileId) {
        const profile = await this.getProfile(profileId);
        const correlations = [];

        // Corrélation par email
        if (profile.identity_markers?.email) {
            const emailMatches = await this.findByEmail(profile.identity_markers.email);
            correlations.push(...emailMatches.map(match => ({
                type: 'email',
                target_profile: match.id,
                confidence: 0.95,
                value: profile.identity_markers.email
            })));
        }

        // Corrélation par similarité de bio
        if (profile.bio) {
            const bioMatches = await this.findSimilarBios(profile.bio);
            correlations.push(...bioMatches.map(match => ({
                type: 'bio_similarity',
                target_profile: match.id,
                confidence: match.similarity_score,
                value: match.bio
            })));
        }

        // Corrélation comportementale
        const behavioralMatches = await this.findBehavioralMatches(profileId);
        correlations.push(...behavioralMatches);

        return this.processCorrelations(profileId, correlations);
    }

    // Traiter les corrélations et unifier les identités
    async processCorrelations(profileId, correlations) {
        const highConfidenceCorrelations = correlations.filter(c => c.confidence >= 0.8);
        
        if (highConfidenceCorrelations.length === 0) {
            return this.createNewUnifiedIdentity(profileId);
        }

        // Trouver l'identité unifiée existante ou en créer une nouvelle
        const existingIdentities = await this.getExistingUnifiedIdentities(
            highConfidenceCorrelations.map(c => c.target_profile)
        );

        if (existingIdentities.length > 0) {
            return this.mergeWithExistingIdentity(profileId, existingIdentities[0], correlations);
        } else {
            return this.createUnifiedIdentityFromCorrelations(profileId, highConfidenceCorrelations);
        }
    }

    // Calculer le score de risque dynamique
    async calculateRiskScore(unifiedIdentityId) {
        const query = `
            SELECT 
                COUNT(DISTINCT p.platform_type) as platform_count,
                AVG(CASE WHEN c.toxicity_score > 0.7 THEN 1 ELSE 0 END) as toxicity_rate,
                COUNT(a.id) as alert_count,
                MAX(a.severity) as max_severity
            FROM unified_identities ui
            LEFT JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN comments c ON c.unified_identity_id = ui.id
            LEFT JOIN alerts a ON a.unified_identity_id = ui.id
            WHERE ui.id = $1
            GROUP BY ui.id
        `;

        const result = await this.db.query(query, [unifiedIdentityId]);
        const data = result.rows[0];

        let riskScore = 0;
        
        // Plus de plateformes = plus de risque potentiel
        riskScore += Math.min(data.platform_count * 0.1, 0.3);
        
        // Taux de toxicité
        riskScore += data.toxicity_rate * 0.4;
        
        // Nombre d'alertes
        riskScore += Math.min(data.alert_count * 0.05, 0.2);
        
        // Sévérité maximale
        const severityMultiplier = {
            'low': 0.1,
            'medium': 0.2,
            'high': 0.3,
            'critical': 0.5
        };
        riskScore += severityMultiplier[data.max_severity] || 0;

        return Math.min(riskScore, 1.0);
    }

    // Détecter les réseaux sociaux coordonnés
    async detectCoordinatedNetworks() {
        // Détecter les comptes avec des patterns temporels similaires
        const temporalQuery = `
            SELECT 
                array_agg(DISTINCT ui.id) as identity_group,
                COUNT(*) as interaction_count,
                'temporal_coordination' as network_type
            FROM comments c1
            JOIN comments c2 ON ABS(EXTRACT(EPOCH FROM c1.created_at - c2.created_at)) < 300
            JOIN unified_identities ui1 ON c1.unified_identity_id = ui1.id
            JOIN unified_identities ui2 ON c2.unified_identity_id = ui2.id
            WHERE ui1.id != ui2.id
            GROUP BY DATE_TRUNC('hour', c1.created_at)
            HAVING COUNT(DISTINCT ui1.id) >= 3
        `;

        // Détecter les comptes avec du contenu similaire
        const contentQuery = `
            SELECT 
                array_agg(DISTINCT ui.id) as identity_group,
                'content_similarity' as network_type
            FROM comments c1
            JOIN comments c2 ON c1.content_hash = c2.content_hash
            JOIN unified_identities ui1 ON c1.unified_identity_id = ui1.id
            JOIN unified_identities ui2 ON c2.unified_identity_id = ui2.id
            WHERE ui1.id != ui2.id
            GROUP BY c1.content_hash
            HAVING COUNT(DISTINCT ui1.id) >= 2
        `;

        const [temporalNetworks, contentNetworks] = await Promise.all([
            this.db.query(temporalQuery),
            this.db.query(contentQuery)
        ]);

        return [...temporalNetworks.rows, ...contentNetworks.rows];
    }

    // API pour requêtes analytiques complexes
    async analyticsQuery(params) {
        const {
            platforms = [],
            riskThreshold = 0.5,
            timeRange = '30 days',
            networkTypes = []
        } = params;

        let query = `
            SELECT 
                ui.id,
                ui.master_hash,
                ui.risk_score,
                COUNT(DISTINCT p.platform_type) as platform_count,
                ARRAY_AGG(DISTINCT p.platform_type) as platforms,
                COUNT(DISTINCT a.id) as alert_count,
                MAX(ds.current_score) as max_dynamic_score
            FROM unified_identities ui
            LEFT JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN alerts a ON a.unified_identity_id = ui.id
            LEFT JOIN dynamic_scores ds ON ds.unified_identity_id = ui.id
            WHERE ui.risk_score >= $1
        `;

        const queryParams = [riskThreshold];
        let paramIndex = 2;

        if (platforms.length > 0) {
            query += ` AND p.platform_type = ANY($${paramIndex})`;
            queryParams.push(platforms);
            paramIndex++;
        }

        if (timeRange) {
            query += ` AND ui.updated_at >= NOW() - INTERVAL '${timeRange}'`;
        }

        query += `
            GROUP BY ui.id, ui.master_hash, ui.risk_score
            ORDER BY ui.risk_score DESC, alert_count DESC
        `;

        return this.db.query(query, queryParams);
    }

    // Helpers
    async getProfile(profileId) {
        const result = await this.db.query('SELECT * FROM profiles WHERE id = $1', [profileId]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await this.db.query(
            "SELECT * FROM profiles WHERE identity_markers->>'email' = $1",
            [email]
        );
        return result.rows;
    }

    async findSimilarBios(bio) {
        // Implémentation simplifiée - en production, utiliser des algorithmes de similarité plus avancés
        const result = await this.db.query(
            "SELECT *, similarity(bio, $1) as similarity_score FROM profiles WHERE similarity(bio, $1) > 0.7",
            [bio]
        );
        return result.rows;
    }
}

module.exports = CorrelationEngine;