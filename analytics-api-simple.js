// AURA Analytics API Simplifié - Sans base de données pour test
const express = require('express');
const app = express();
app.use(express.json());

// Endpoint: Recherche cross-plateforme (simulation)
app.post('/api/analytics/cross-platform-search', async (req, res) => {
    try {
        const { query, platforms, analysisType, options } = req.body;
        
        console.log(`🔍 Analyse OSINT pour: ${query} sur ${platforms.join(', ')}`);
        
        // Simulation d'une analyse réussie
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResults = {
            success: true,
            target_id: `target_${Date.now()}`,
            matches: [{
                platform: platforms[0] || 'tiktok',
                username: query.replace('@', ''),
                bio: 'Profil utilisateur analysé par AURA',
                followers_count: Math.floor(Math.random() * 10000),
                confidence_score: 0.95,
                collected_at: new Date().toISOString(),
                target_id: `target_${Date.now()}`
            }],
            evidence_hash: `sha256_${Math.random().toString(36).substring(7)}`,
            metadata: {
                query_time: new Date().toISOString(),
                platforms_searched: platforms,
                analysis_type: analysisType
            }
        };
        
        console.log('✅ Analyse terminée avec succès');
        res.json(mockResults);
        
    } catch (error) {
        console.error('❌ Erreur analyse:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint dashboard
app.get('/api/analytics/dashboard', async (req, res) => {
    res.json({
        profiles: 5,
        analyses: 12,
        correlations: 3,
        recent_activity: [
            {
                type: 'Analyse OSINT',
                target: '@test_user',
                status: 'success',
                timestamp: new Date().toISOString()
            }
        ]
    });
});

// Endpoint profils
app.get('/api/analytics/profiles', async (req, res) => {
    res.json([
        {
            target_id: 'target_001',
            username: 'test_user',
            platform: 'tiktok',
            created_at: new Date().toISOString(),
            bio: 'Profil de test',
            followers_count: 1500
        }
    ]);
});

const PORT = 4002;
app.listen(PORT, () => {
    console.log(`🧠 AURA Analytics API (Simple) démarrée sur port ${PORT}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   POST /api/analytics/cross-platform-search`);
    console.log(`   GET  /api/analytics/dashboard`);
    console.log(`   GET  /api/analytics/profiles`);
});

module.exports = app;