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

// Endpoint: Recherche cross-plateforme avec scraping réel
app.post('/api/analytics/cross-platform-search', async (req, res) => {
    try {
        const { query, platforms, analysisType, options } = req.body;
        
        // Créer une cible dans la base
        const targetResult = await createTarget(query, platforms[0] || 'tiktok');
        const targetId = targetResult.target_id;
        
        // Lancer le scraping TikTok si c'est la plateforme demandée
        if (platforms.includes('tiktok')) {
            const TikTokForensicScraper = require('./live-tracker/tiktok-scraper-advanced');
            const scraper = new TikTokForensicScraper();
            
            const profileData = await scraper.scrapeProfile(query);
            
            // Stocker les données en base
            await storeProfileData(targetId, profileData);
            
            res.json({
                success: true,
                target_id: targetId,
                matches: [{
                    platform: 'tiktok',
                    username: profileData.username,
                    bio: profileData.bio,
                    followers_count: profileData.followers,
                    confidence_score: 0.95,
                    collected_at: new Date().toISOString(),
                    target_id: targetId
                }],
                evidence_hash: profileData.evidence_hash,
                metadata: {
                    query_time: new Date().toISOString(),
                    platforms_searched: platforms,
                    analysis_type: analysisType
                }
            });
        } else {
            res.json({
                success: true,
                target_id: targetId,
                matches: [],
                message: 'Plateforme non supportée pour le scraping en temps réel'
            });
        }
    } catch (error) {
        console.error('Erreur recherche cross-platform:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Fonction pour créer une cible
async function createTarget(username, platform) {
    const { Pool } = require('pg');
    const db = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'aura_forensic',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || ''
    });
    
    const result = await db.query(
        'INSERT INTO targets (username, platform, url, created_at) VALUES ($1, $2, $3, NOW()) RETURNING target_id',
        [username, platform, `https://${platform}.com/@${username}`]
    );
    
    return result.rows[0];
}

// Fonction pour stocker les données de profil
async function storeProfileData(targetId, profileData) {
    const { Pool } = require('pg');
    const db = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'aura_forensic',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || ''
    });
    
    await db.query(`
        INSERT INTO profile_data (
            target_id, platform, username, bio, followers_count, 
            following_count, posts_count, profile_image_url, 
            evidence_hash, collected_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `, [
        targetId,
        'tiktok',
        profileData.username,
        profileData.bio,
        profileData.followers,
        profileData.following,
        profileData.posts,
        profileData.profileImage,
        profileData.evidence_hash
    ]);
}

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

// Endpoint dashboard simplifié
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const { Pool } = require('pg');
        const db = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'aura_forensic',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || ''
        });
        
        const profilesCount = await db.query('SELECT COUNT(*) as count FROM targets');
        const analysesCount = await db.query('SELECT COUNT(*) as count FROM profile_data');
        const recentActivity = await db.query(`
            SELECT 'Analyse OSINT' as type, username as target, 'success' as status, created_at as timestamp 
            FROM targets 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        
        res.json({
            profiles: profilesCount.rows[0]?.count || 0,
            analyses: analysesCount.rows[0]?.count || 0,
            correlations: 0,
            recent_activity: recentActivity.rows || []
        });
    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.json({ profiles: 0, analyses: 0, correlations: 0, recent_activity: [] });
    }
});

// Endpoint profils
app.get('/api/analytics/profiles', async (req, res) => {
    try {
        const { Pool } = require('pg');
        const db = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'aura_forensic',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || ''
        });
        
        const profiles = await db.query(`
            SELECT t.target_id, t.username, t.platform, t.created_at,
                   pd.bio, pd.followers_count, pd.profile_image_url
            FROM targets t
            LEFT JOIN profile_data pd ON t.target_id = pd.target_id
            ORDER BY t.created_at DESC
            LIMIT 50
        `);
        
        res.json(profiles.rows || []);
    } catch (error) {
        console.error('Erreur profils:', error);
        res.json([]);
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
    console.log(`   GET  /api/analytics/profiles`);
    console.log(`   POST /api/analytics/forensic-export`);
});

module.exports = app;