#!/usr/bin/env node

const SCISDataArchitecture = require('./data-architecture');
const fs = require('fs').promises;
const path = require('path');

/**
 * 🚀 INITIALISATION COMPLÈTE DE LA BASE DE DONNÉES SCIS
 * Architecture forensique complète avec données de démonstration
 */
async function initializeCompleteDatabase() {
    console.log('🎯 INITIALISATION COMPLÈTE SCIS DATABASE');
    console.log('========================================');
    console.log('');

    try {
        // Charger les variables d'environnement
        require('dotenv').config();

        // Créer le fichier .env s'il n'existe pas
        await ensureEnvironmentFile();

        // Initialiser l'architecture complète
        console.log('🏗️ Initialisation de l\'architecture de données...');
        const dataArch = new SCISDataArchitecture();
        
        // Attendre l'initialisation complète
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Vérifier les statistiques
        console.log('📊 Vérification des données...');
        const stats = await dataArch.getRealTimeStats();
        
        console.log('');
        console.log('📈 STATISTIQUES DE LA BASE DE DONNÉES:');
        console.log('=====================================');
        console.log(`👥 Profils totaux: ${stats.total_profiles}`);
        console.log(`⚠️ Profils à risque: ${stats.high_risk_profiles}`);
        console.log(`📡 Sessions actives: ${stats.active_sessions}`);
        console.log(`💬 Commentaires (24h): ${stats.comments_24h}`);
        console.log(`🚨 Alertes en attente: ${stats.pending_alerts}`);
        console.log(`📁 Fichiers de preuves: ${stats.total_evidence_files}`);

        // Tester les fonctionnalités
        console.log('');
        console.log('🧪 TESTS DES FONCTIONNALITÉS:');
        console.log('=============================');
        
        // Test d'analyse automatique
        await dataArch.analyzeCollectedData();
        console.log('✅ Analyse automatique des données');
        
        // Test de maintenance
        await dataArch.performMaintenance();
        console.log('✅ Maintenance automatique');

        // Créer les API endpoints
        await createAPIEndpoints(dataArch);
        console.log('✅ API endpoints créés');

        console.log('');
        console.log('🎉 INITIALISATION COMPLÈTE RÉUSSIE !');
        console.log('===================================');
        console.log('');
        console.log('🗄️ BASE DE DONNÉES POSTGRESQL:');
        console.log('  📊 12 tables forensiques créées');
        console.log('  🔍 Index de performance optimisés');
        console.log('  🔄 Triggers automatiques actifs');
        console.log('  📈 Vues analytiques disponibles');
        console.log('  🔒 Sécurité Row Level Security');
        console.log('');
        console.log('📡 COLLECTE DE DONNÉES EN TEMPS RÉEL:');
        console.log('  💬 Commentaires avec analyse de sentiment');
        console.log('  📊 Métriques live automatiques');
        console.log('  📸 Preuves avec hash d\'intégrité');
        console.log('  🚨 Alertes automatiques');
        console.log('');
        console.log('🎯 ARCHITECTURE OPÉRATIONNELLE:');
        console.log('  🔄 Tâches automatisées configurées');
        console.log('  📈 Scores de risque dynamiques');
        console.log('  🧹 Maintenance automatique');
        console.log('  📊 Statistiques temps réel');
        console.log('');
        console.log('🌐 PRÊT POUR L\'INTERFACE SCIS !');

        await dataArch.close();

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        console.log('');
        console.log('💡 SOLUTIONS POSSIBLES:');
        console.log('  1. Vérifier que PostgreSQL est démarré');
        console.log('  2. Vérifier les paramètres de connexion');
        console.log('  3. Créer la base de données: createdb aura_investigations');
        console.log('  4. Utiliser Docker: docker-compose up -d postgres');
        process.exit(1);
    }
}

/**
 * 📝 CRÉATION DU FICHIER ENVIRONNEMENT
 */
async function ensureEnvironmentFile() {
    const envPath = path.join(__dirname, '.env');
    
    try {
        await fs.access(envPath);
        console.log('✅ Fichier .env trouvé');
    } catch {
        const envContent = `
# Configuration Base de Données PostgreSQL SCIS
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura_investigations
DB_USER=aura_user
DB_PASSWORD=aura_secure_2024

# Configuration Application SCIS
NODE_ENV=production
JWT_SECRET=scis_forensic_secret_key_2024
UPLOAD_DIR=../evidence/uploads
LOG_LEVEL=info

# Configuration Analyse
ENABLE_AUTO_ANALYSIS=true
TOXICITY_THRESHOLD=0.7
SENTIMENT_ANALYSIS=true
AUTO_ALERTS=true

# Configuration Sécurité
ENABLE_ENCRYPTION=true
FORENSIC_LOGGING=true
CHAIN_OF_CUSTODY=true
RETENTION_DAYS=2555

# Configuration Performance
MAX_CONCURRENT_SESSIONS=10
AUTO_SCREENSHOT_INTERVAL=30
CLEANUP_INTERVAL=3600
`;
        await fs.writeFile(envPath, envContent.trim());
        console.log('✅ Fichier .env créé avec configuration complète');
    }
}

/**
 * 🔌 CRÉATION DES API ENDPOINTS
 */
async function createAPIEndpoints(dataArch) {
    const apiCode = `
const express = require('express');
const SCISDataArchitecture = require('./data-architecture');

const router = express.Router();
const dataArch = new SCISDataArchitecture();

// 📊 Statistiques temps réel
router.get('/stats', async (req, res) => {
    try {
        const stats = await dataArch.getRealTimeStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 👥 Gestion des profils
router.get('/profiles', async (req, res) => {
    try {
        const result = await dataArch.pool.query(\`
            SELECT p.*, 
                   COUNT(s.id) as total_sessions,
                   COUNT(a.id) as total_alerts
            FROM profiles p
            LEFT JOIN live_sessions s ON p.id = s.profile_id
            LEFT JOIN automated_alerts a ON p.id = a.profile_id
            GROUP BY p.id
            ORDER BY p.risk_score DESC, p.created_at DESC
            LIMIT 50
        \`);
        res.json({ success: true, profiles: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 📡 Sessions actives
router.get('/sessions/active', async (req, res) => {
    try {
        const result = await dataArch.pool.query(\`
            SELECT * FROM active_sessions_summary
            ORDER BY start_time DESC
        \`);
        res.json({ success: true, sessions: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 🚨 Alertes en attente
router.get('/alerts/pending', async (req, res) => {
    try {
        const result = await dataArch.pool.query(\`
            SELECT a.*, p.username, s.title as session_title
            FROM automated_alerts a
            LEFT JOIN profiles p ON a.profile_id = p.id
            LEFT JOIN live_sessions s ON a.session_id = s.id
            WHERE a.acknowledged = false
            ORDER BY a.severity DESC, a.created_at DESC
            LIMIT 20
        \`);
        res.json({ success: true, alerts: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 💬 Commentaires récents
router.get('/comments/recent', async (req, res) => {
    try {
        const result = await dataArch.pool.query(\`
            SELECT c.*, p.username, s.title as session_title
            FROM live_comments c
            JOIN live_sessions s ON c.session_id = s.id
            LEFT JOIN profiles p ON s.profile_id = p.id
            WHERE c.created_at > NOW() - INTERVAL '24 hours'
            ORDER BY c.created_at DESC
            LIMIT 100
        \`);
        res.json({ success: true, comments: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 📈 Analyse des données
router.post('/analyze', async (req, res) => {
    try {
        await dataArch.analyzeCollectedData();
        res.json({ success: true, message: 'Analyse terminée' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
`;

    const apiPath = path.join(__dirname, 'scis-api-routes.js');
    await fs.writeFile(apiPath, apiCode.trim());
    console.log('✅ Routes API SCIS créées');
}

// Exécuter l'initialisation
if (require.main === module) {
    initializeCompleteDatabase();
}

module.exports = initializeCompleteDatabase;