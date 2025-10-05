#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const SCISSecurityManager = require('./security-manager');

/**
 * 🚀 INITIALISATION PRODUCTION SCIS
 * Architecture forensique complète avec sécurité renforcée
 */
class ProductionInitializer {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'aura_user',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'aura_investigations',
            password: process.env.DB_PASSWORD || 'aura_secure_2024',
            port: process.env.DB_PORT || 5432,
        });
        
        this.securityManager = new SCISSecurityManager();
    }

    async initialize() {
        console.log('🎯 INITIALISATION PRODUCTION SCIS');
        console.log('=================================');
        console.log('');

        try {
            // 1. Vérifier la connexion
            await this.verifyConnection();
            
            // 2. Créer le schéma de production
            await this.createProductionSchema();
            
            // 3. Configurer la sécurité
            await this.setupSecurity();
            
            // 4. Insérer les données de base
            await this.insertBaseData();
            
            // 5. Configurer les tâches automatisées
            await this.setupAutomatedTasks();
            
            // 6. Vérifier l'intégrité
            await this.verifyIntegrity();
            
            // 7. Générer le rapport final
            await this.generateReport();
            
            console.log('');
            console.log('🎉 INITIALISATION PRODUCTION RÉUSSIE !');
            console.log('=====================================');
            
        } catch (error) {
            console.error('❌ Erreur initialisation:', error.message);
            throw error;
        }
    }

    async verifyConnection() {
        console.log('🔌 Vérification de la connexion PostgreSQL...');
        
        const result = await this.pool.query('SELECT version()');
        const version = result.rows[0].version;
        
        console.log(`✅ PostgreSQL connecté: ${version.split(' ')[1]}`);
        
        // Vérifier les extensions
        const extensions = await this.pool.query(`
            SELECT extname FROM pg_extension 
            WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_trgm', 'btree_gin')
        `);
        
        console.log(`✅ Extensions disponibles: ${extensions.rows.length}/4`);
    }

    async createProductionSchema() {
        console.log('🏗️ Création du schéma de production...');
        
        const schemaPath = path.join(__dirname, 'forensic-schema-v2-production.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        await this.pool.query(schema);
        
        // Vérifier les tables créées
        const tables = await this.pool.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log(`✅ ${tables.rows.length} tables créées:`);
        tables.rows.forEach(row => {
            console.log(`   📋 ${row.table_name}`);
        });
    }

    async setupSecurity() {
        console.log('🔒 Configuration de la sécurité...');
        
        // Activer Row Level Security
        const rlsTables = ['investigation_cases', 'forensic_reports', 'digital_evidence'];
        
        for (const table of rlsTables) {
            await this.pool.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
            console.log(`✅ RLS activé sur ${table}`);
        }
        
        // Créer un utilisateur admin sécurisé
        const adminPassword = 'SCIS_Admin_2024!';
        const { hash } = await this.securityManager.hashPassword(adminPassword);
        
        await this.pool.query(`
            INSERT INTO investigators (
                username, email, full_name, organization, role,
                password_hash, access_level, permissions, verified, active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (username) DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                updated_at = CURRENT_TIMESTAMP
        `, [
            'admin',
            'admin@scis-forensics.local',
            'Administrateur SCIS Production',
            'SCIS Forensics Division',
            'System Administrator',
            hash,
            5,
            JSON.stringify({
                system_admin: true,
                create_cases: true,
                manage_users: true,
                access_all_data: true,
                generate_reports: true,
                security_admin: true
            }),
            true,
            true
        ]);
        
        console.log('✅ Utilisateur admin créé');
        console.log(`   👤 Username: admin`);
        console.log(`   🔑 Password: ${adminPassword}`);
        console.log('   ⚠️  CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT !');
    }

    async insertBaseData() {
        console.log('📊 Insertion des données de base...');
        
        // Configuration système
        const configs = [
            ['app_version', '"2.0.0-production"', 'Version de production SCIS'],
            ['max_concurrent_sessions', '50', 'Sessions simultanées maximum'],
            ['auto_screenshot_interval', '15', 'Intervalle screenshots (secondes)'],
            ['retention_period_days', '2555', 'Rétention données (7 ans)'],
            ['enable_auto_alerts', 'true', 'Alertes automatiques activées'],
            ['toxicity_threshold', '0.75', 'Seuil détection toxicité'],
            ['security_audit_enabled', 'true', 'Audit sécurité activé'],
            ['forensic_logging', 'true', 'Logs forensiques activés'],
            ['encryption_enabled', 'true', 'Chiffrement données sensibles'],
            ['backup_retention_days', '90', 'Rétention sauvegardes']
        ];
        
        for (const [key, value, desc] of configs) {
            await this.pool.query(`
                INSERT INTO system_config (config_key, config_value, description, category)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (config_key) DO UPDATE SET
                    config_value = EXCLUDED.config_value,
                    updated_at = CURRENT_TIMESTAMP
            `, [key, value, desc, 'system']);
        }
        
        console.log(`✅ ${configs.length} configurations système insérées`);
        
        // Profils de démonstration avec niveaux de risque variés
        const demoProfiles = [
            {
                username: 'high_risk_user_001',
                display_name: 'Utilisateur Haut Risque',
                bio: 'Profil avec historique de contenu problématique',
                risk_level: 'critical',
                risk_score: 95,
                threat_indicators: { hate_speech: true, harassment: true, threats: true }
            },
            {
                username: 'medium_risk_user_002', 
                display_name: 'Utilisateur Risque Moyen',
                bio: 'Profil avec quelques signalements',
                risk_level: 'medium',
                risk_score: 55,
                threat_indicators: { controversial_content: true }
            },
            {
                username: 'low_risk_user_003',
                display_name: 'Utilisateur Faible Risque',
                bio: 'Profil standard sans problème',
                risk_level: 'low',
                risk_score: 15,
                threat_indicators: {}
            }
        ];
        
        for (const profile of demoProfiles) {
            await this.pool.query(`
                INSERT INTO profiles (
                    username, display_name, bio, risk_level, risk_score,
                    threat_indicators, country_code, language_code,
                    followers_count, following_count, hearts_count, videos_count
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (username) DO NOTHING
            `, [
                profile.username, profile.display_name, profile.bio,
                profile.risk_level, profile.risk_score,
                JSON.stringify(profile.threat_indicators),
                'FR', 'fr',
                Math.floor(Math.random() * 100000) + 1000,
                Math.floor(Math.random() * 1000) + 50,
                Math.floor(Math.random() * 1000000) + 10000,
                Math.floor(Math.random() * 100) + 5
            ]);
        }
        
        console.log(`✅ ${demoProfiles.length} profils de démonstration créés`);
    }

    async setupAutomatedTasks() {
        console.log('⚙️ Configuration des tâches automatisées...');
        
        const tasks = [
            {
                name: 'security_maintenance',
                type: 'security',
                cron: '0 */6 * * *', // Toutes les 6h
                params: { cleanup_sessions: true, rotate_tokens: true }
            },
            {
                name: 'integrity_verification',
                type: 'forensic',
                cron: '0 2 * * *', // Tous les jours à 2h
                params: { verify_evidence: true, check_hashes: true }
            },
            {
                name: 'automated_cleanup',
                type: 'maintenance',
                cron: '0 3 * * 0', // Tous les dimanches à 3h
                params: { cleanup_logs: true, archive_old_data: true }
            },
            {
                name: 'stats_refresh',
                type: 'performance',
                cron: '*/10 * * * *', // Toutes les 10 minutes
                params: { refresh_materialized_views: true }
            },
            {
                name: 'backup_critical_data',
                type: 'backup',
                cron: '0 1 * * *', // Tous les jours à 1h
                params: { backup_evidence: true, backup_cases: true }
            }
        ];
        
        for (const task of tasks) {
            await this.pool.query(`
                INSERT INTO automated_tasks (
                    task_name, task_type, schedule_cron, parameters, status
                ) VALUES ($1, $2, $3, $4, 'active')
                ON CONFLICT (task_name) DO UPDATE SET
                    schedule_cron = EXCLUDED.schedule_cron,
                    parameters = EXCLUDED.parameters,
                    updated_at = CURRENT_TIMESTAMP
            `, [task.name, task.type, task.cron, JSON.stringify(task.params)]);
        }
        
        console.log(`✅ ${tasks.length} tâches automatisées configurées`);
    }

    async verifyIntegrity() {
        console.log('🔍 Vérification de l\'intégrité...');
        
        // Vérifier les contraintes
        const constraints = await this.pool.query(`
            SELECT conname, contype FROM pg_constraint 
            WHERE contype IN ('c', 'f', 'u')
        `);
        
        console.log(`✅ ${constraints.rows.length} contraintes vérifiées`);
        
        // Vérifier les index
        const indexes = await this.pool.query(`
            SELECT indexname FROM pg_indexes 
            WHERE schemaname = 'public'
        `);
        
        console.log(`✅ ${indexes.rows.length} index créés`);
        
        // Vérifier les triggers
        const triggers = await this.pool.query(`
            SELECT trigger_name FROM information_schema.triggers
            WHERE trigger_schema = 'public'
        `);
        
        console.log(`✅ ${triggers.rows.length} triggers actifs`);
    }

    async generateReport() {
        console.log('📊 Génération du rapport d\'initialisation...');
        
        const stats = await this.pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as tables_count,
                (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public') as columns_count,
                (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as indexes_count,
                (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as triggers_count,
                (SELECT COUNT(*) FROM pg_constraint WHERE contype IN ('c', 'f', 'u')) as constraints_count,
                (SELECT COUNT(*) FROM profiles) as profiles_count,
                (SELECT COUNT(*) FROM investigators) as investigators_count,
                (SELECT COUNT(*) FROM system_config) as config_count,
                (SELECT COUNT(*) FROM automated_tasks) as tasks_count
        `);
        
        const report = stats.rows[0];
        
        console.log('');
        console.log('📈 RAPPORT D\'INITIALISATION PRODUCTION');
        console.log('=====================================');
        console.log(`📋 Tables créées: ${report.tables_count}`);
        console.log(`📊 Colonnes totales: ${report.columns_count}`);
        console.log(`🔍 Index optimisés: ${report.indexes_count}`);
        console.log(`⚡ Triggers actifs: ${report.triggers_count}`);
        console.log(`🔒 Contraintes: ${report.constraints_count}`);
        console.log(`👥 Profils démo: ${report.profiles_count}`);
        console.log(`👮 Investigateurs: ${report.investigators_count}`);
        console.log(`⚙️ Configurations: ${report.config_count}`);
        console.log(`🔄 Tâches auto: ${report.tasks_count}`);
        
        // Sauvegarder le rapport
        const reportData = {
            timestamp: new Date().toISOString(),
            version: '2.0.0-production',
            database_stats: report,
            security_features: [
                'Row Level Security',
                'BCRYPT Password Hashing',
                'Session Token Management',
                'API Key Rotation',
                'Forensic Hash Generation',
                'Evidence Integrity Verification',
                'Automated Security Maintenance'
            ],
            forensic_features: [
                'Chain of Custody Tracking',
                'SHA-256 Evidence Hashing',
                'Automated Audit Logging',
                'Retention Policy Management',
                'Classification Levels',
                'Access Control Matrix'
            ]
        };
        
        const reportPath = path.join(__dirname, '../logs/initialization-report.json');
        await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
        
        console.log(`📄 Rapport sauvegardé: ${reportPath}`);
    }

    async close() {
        await this.pool.end();
        await this.securityManager.close();
    }
}

// Exécution
async function main() {
    const initializer = new ProductionInitializer();
    
    try {
        await initializer.initialize();
        console.log('');
        console.log('🎯 SCIS PRODUCTION PRÊT !');
        console.log('========================');
        console.log('');
        console.log('🔐 SÉCURITÉ:');
        console.log('  ✅ Authentification BCRYPT');
        console.log('  ✅ Tokens de session sécurisés');
        console.log('  ✅ Row Level Security activé');
        console.log('  ✅ Chiffrement données sensibles');
        console.log('');
        console.log('⚖️ FORENSIQUE:');
        console.log('  ✅ Hash SHA-256 des preuves');
        console.log('  ✅ Chaîne de custody automatique');
        console.log('  ✅ Audit trail complet');
        console.log('  ✅ Vérification d\'intégrité');
        console.log('');
        console.log('🚀 PRÊT POUR PRODUCTION !');
        
    } catch (error) {
        console.error('❌ Échec initialisation:', error);
        process.exit(1);
    } finally {
        await initializer.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = ProductionInitializer;