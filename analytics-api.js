// AURA Analytics API - API pour requêtes analytiques cross-plateforme
const express = require('express');
const CorrelationEngine = require('./correlation-engine');
const { config } = require('./config');

const app = express();
app.use(express.json());

const correlationEngine = new CorrelationEngine({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aura_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});

// Endpoint: Recherche cross-plateforme
app.post('/api/analytics/cross-platform-search', async (req, res) => {
    try {
        const { query, platforms, riskThreshold } = req.body;
        
        const results = await correlationEngine.analyticsQuery({
            platforms,
            riskThreshold: riskThreshold || 0.5
        });

        res.json({
            success: true,
            count: results.rows.length,
            data: results.rows,
            metadata: {
                query_time: new Date().toISOString(),
                platforms_searched: platforms,
                risk_threshold: riskThreshold
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Détection de réseaux coordonnés
app.get('/api/analytics/coordinated-networks', async (req, res) => {
    try {
        const networks = await correlationEngine.detectCoordinatedNetworks();
        
        res.json({
            success: true,
            networks_detected: networks.length,
            data: networks,
            risk_assessment: networks.map(network => ({
                network_id: network.identity_group,
                member_count: network.identity_group.length,
                risk_level: network.identity_group.length >= 5 ? 'high' : 'medium',
                network_type: network.network_type
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Score de risque en temps réel
app.get('/api/analytics/risk-score/:identityId', async (req, res) => {
    try {
        const { identityId } = req.params;
        const riskScore = await correlationEngine.calculateRiskScore(identityId);
        
        res.json({
            success: true,
            identity_id: identityId,
            risk_score: riskScore,
            risk_level: riskScore >= 0.8 ? 'critical' : 
                       riskScore >= 0.6 ? 'high' :
                       riskScore >= 0.4 ? 'medium' : 'low',
            calculated_at: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Corrélation d'un nouveau profil
app.post('/api/analytics/correlate-profile', async (req, res) => {
    try {
        const { profileId } = req.body;
        const correlations = await correlationEngine.correlateProfile(profileId);
        
        res.json({
            success: true,
            profile_id: profileId,
            correlations_found: correlations.length,
            unified_identity_id: correlations.unified_identity_id,
            confidence_scores: correlations.correlations?.map(c => ({
                type: c.type,
                confidence: c.confidence
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Dashboard analytics
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const stats = await correlationEngine.db.query(`
            SELECT 
                COUNT(DISTINCT ui.id) as total_unified_identities,
                COUNT(DISTINCT p.id) as total_profiles,
                COUNT(DISTINCT p.platform_type) as platforms_monitored,
                AVG(ui.risk_score) as avg_risk_score,
                COUNT(CASE WHEN ui.risk_score >= 0.8 THEN 1 END) as critical_identities,
                COUNT(DISTINCT sn.id) as active_networks
            FROM unified_identities ui
            LEFT JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN social_networks sn ON ui.id = ANY(sn.member_identities)
        `);

        const recentAlerts = await correlationEngine.db.query(`
            SELECT COUNT(*) as count, severity
            FROM alerts 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            GROUP BY severity
        `);

        res.json({
            success: true,
            overview: stats.rows[0],
            recent_alerts: recentAlerts.rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint: Export forensique
app.post('/api/analytics/forensic-export', async (req, res) => {
    try {
        const { identityIds, includeEvidence = true } = req.body;
        
        let query = `
            SELECT 
                ui.master_hash,
                ui.risk_score,
                p.username,
                p.platform_type,
                p.bio,
                c.content,
                c.toxicity_score,
                e.file_path,
                e.evidence_hash
            FROM unified_identities ui
            JOIN profiles p ON p.unified_identity_id = ui.id
            LEFT JOIN comments c ON c.unified_identity_id = ui.id
        `;

        if (includeEvidence) {
            query += ` LEFT JOIN evidence e ON e.profile_id = p.id`;
        }

        query += ` WHERE ui.id = ANY($1) ORDER BY ui.risk_score DESC`;

        const results = await correlationEngine.db.query(query, [identityIds]);

        res.json({
            success: true,
            export_type: 'forensic_report',
            identities_count: identityIds.length,
            records_count: results.rows.length,
            data: results.rows,
            chain_of_custody: {
                exported_by: req.headers['user-agent'] || 'unknown',
                export_timestamp: new Date().toISOString(),
                integrity_hash: require('crypto')
                    .createHash('sha256')
                    .update(JSON.stringify(results.rows))
                    .digest('hex')
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = config.backend.analyser || 4002;
app.listen(PORT, () => {
    console.log(`🧠 AURA Analytics API démarrée sur port ${PORT}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   POST /api/analytics/cross-platform-search`);
    console.log(`   GET  /api/analytics/coordinated-networks`);
    console.log(`   GET  /api/analytics/risk-score/:identityId`);
    console.log(`   POST /api/analytics/correlate-profile`);
    console.log(`   GET  /api/analytics/dashboard`);
    console.log(`   POST /api/analytics/forensic-export`);
});

module.exports = app;