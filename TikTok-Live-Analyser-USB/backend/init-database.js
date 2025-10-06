#!/usr/bin/env node

const PostgreSQLSetup = require('./postgresql-setup');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    console.log('🚀 Initialisation de la base de données SCIS...');
    console.log('===============================================');

    try {
        // Créer le fichier .env s'il n'existe pas
        const envPath = path.join(__dirname, '.env');
        try {
            await fs.access(envPath);
        } catch {
            const envContent = `
# Configuration Base de Données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura_investigations
DB_USER=aura_user
DB_PASSWORD=aura_secure_2024

# Configuration Application
NODE_ENV=production
JWT_SECRET=scis_forensic_secret_key_2024
UPLOAD_DIR=../evidence/uploads
LOG_LEVEL=info
`;
            await fs.writeFile(envPath, envContent.trim());
            console.log('✅ Fichier .env créé');
        }

        // Charger les variables d'environnement
        require('dotenv').config();

        // Initialiser PostgreSQL
        console.log('📊 Connexion à PostgreSQL...');
        const db = new PostgreSQLSetup();
        
        // Attendre l'initialisation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Vérifier les statistiques
        const stats = await db.getStats();
        if (stats.success) {
            console.log('\n📈 Statistiques de la base de données:');
            Object.entries(stats.stats).forEach(([table, count]) => {
                console.log(`  📋 ${table}: ${count} enregistrements`);
            });
        }

        // Créer les répertoires nécessaires
        const directories = [
            '../evidence/uploads',
            '../evidence/videos',
            '../evidence/screenshots',
            '../evidence/documents',
            '../logs/database',
            '../logs/forensic',
            '../logs/system'
        ];

        for (const dir of directories) {
            const fullPath = path.join(__dirname, dir);
            try {
                await fs.mkdir(fullPath, { recursive: true });
                console.log(`✅ Répertoire créé: ${dir}`);
            } catch (error) {
                console.log(`⚠️ Répertoire existe déjà: ${dir}`);
            }
        }

        console.log('\n🎯 Base de données SCIS initialisée avec succès !');
        console.log('================================================');
        console.log('');
        console.log('📊 Tables créées:');
        console.log('  👥 profiles - Profils utilisateurs TikTok');
        console.log('  📡 sessions - Sessions de capture live');
        console.log('  💬 comments - Commentaires capturés');
        console.log('  📁 evidence - Preuves numériques');
        console.log('  📝 forensic_logs - Logs forensiques');
        console.log('  👮 investigators - Utilisateurs investigateurs');
        console.log('  📋 cases - Cas d\'enquête');
        console.log('  📊 reports - Rapports générés');
        console.log('  🚨 alerts - Alertes automatiques');
        console.log('  ⚙️ system_config - Configuration système');
        console.log('');
        console.log('🔧 Prêt pour utilisation avec l\'interface SCIS !');

        await db.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        console.log('');
        console.log('💡 Solutions possibles:');
        console.log('  1. Vérifier que PostgreSQL est installé et démarré');
        console.log('  2. Créer la base de données: createdb aura_investigations');
        console.log('  3. Créer l\'utilisateur: createuser -P aura_user');
        console.log('  4. Vérifier les paramètres de connexion dans .env');
        console.log('');
        console.log('🐳 Alternative: Utiliser Docker Compose pour PostgreSQL');
        process.exit(1);
    }
}

// Exécuter l'initialisation
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;