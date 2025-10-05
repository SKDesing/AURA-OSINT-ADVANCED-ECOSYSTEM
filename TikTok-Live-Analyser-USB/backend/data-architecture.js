const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

/**
 * 🎯 SCIS DATA ARCHITECTURE MANAGER
 * Architecture complète pour investigations forensiques TikTok
 */
class SCISDataArchitecture {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'aura_user',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'aura_investigations',
            password: process.env.DB_PASSWORD || 'aura_secure_2024',
            port: process.env.DB_PORT || 5432,
        });
        
        this.dataCollectionNeeds = this.defineDataCollectionNeeds();
        this.initializeArchitecture();
    }

    /**
     * 📊 DÉFINITION DES BESOINS EN DONNÉES
     */
    defineDataCollectionNeeds() {
        return {
            // 👤 PROFILS TIKTOK - Données essentielles
            profiles: {
                identity: ['username', 'display_name', 'tiktok_id', 'bio'],
                metrics: ['followers_count', 'following_count', 'hearts_count', 'videos_count'],
                verification: ['verified', 'account_status', 'account_created_date'],
                risk_assessment: ['risk_level', 'risk_score', 'threat_indicators'],
                geolocation: ['country_code', 'region', 'language_code', 'timezone'],
                forensic: ['forensic_hash', 'chain_of_custody', 'first_detected']
            },

            // 📡 SESSIONS LIVE - Capture complète
            live_sessions: {
                technical: ['live_url', 'live_id', 'video_quality', 'audio_quality', 'frame_rate'],
                metrics: ['max_viewers', 'avg_viewers', 'total_comments', 'total_likes'],
                timing: ['start_time', 'end_time', 'duration_seconds'],
                files: ['video_file_path', 'video_hash', 'thumbnail_path'],
                investigation: ['investigator_id', 'case_reference', 'priority_level']
            },

            // 💬 COMMENTAIRES - Analyse comportementale
            live_comments: {
                content: ['message', 'message_type', 'language_detected'],
                author: ['commenter_username', 'commenter_id', 'commenter_verified'],
                timing: ['timestamp_capture', 'timestamp_original', 'live_timestamp'],
                analysis: ['sentiment', 'toxicity_score', 'keywords_detected'],
                threats: ['contains_hate_speech', 'contains_threats', 'contains_harassment'],
                forensic: ['forensic_hash', 'screenshot_path']
            },

            // 📸 PREUVES NUMÉRIQUES - Intégrité garantie
            digital_evidence: {
                file_info: ['filename', 'file_path', 'file_size', 'mime_type'],
                integrity: ['file_hash', 'hash_algorithm', 'integrity_verified'],
                metadata: ['technical_metadata', 'geolocation', 'device_info'],
                custody: ['chain_of_custody', 'access_log', 'created_by'],
                classification: ['evidence_type', 'classification_level', 'retention_period']
            },

            // 🔍 RECHERCHES OSINT - Intelligence ouverte
            osint_searches: {
                parameters: ['search_type', 'search_query', 'search_engine'],
                results: ['results_found', 'results_data', 'platforms_searched'],
                performance: ['search_duration_ms', 'started_at', 'completed_at'],
                forensic: ['search_hash', 'created_by']
            },

            // 🚨 ALERTES - Détection automatique
            automated_alerts: {
                classification: ['alert_type', 'alert_category', 'severity'],
                content: ['title', 'description', 'details'],
                trigger: ['triggered_by', 'trigger_conditions', 'confidence_score'],
                management: ['acknowledged', 'resolution_status', 'auto_actions_taken']
            }
        };
    }

    /**
     * 🏗️ INITIALISATION DE L'ARCHITECTURE
     */
    async initializeArchitecture() {
        try {
            console.log('🏗️ Initialisation de l\'architecture SCIS...');
            
            // Créer le schéma complet
            await this.createForensicSchema();
            
            // Insérer les données de démonstration
            await this.insertDemoData();
            
            // Configurer les tâches automatisées
            await this.setupAutomatedTasks();
            
            console.log('✅ Architecture SCIS initialisée avec succès');
        } catch (error) {
            console.error('❌ Erreur initialisation architecture:', error);
        }
    }

    /**
     * 📋 CRÉATION DU SCHÉMA FORENSIQUE
     */
    async createForensicSchema() {
        const schemaPath = path.join(__dirname, 'forensic-database-schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        await this.pool.query(schema);
        console.log('✅ Schéma forensique créé');
    }

    /**
     * 🎭 INSERTION DE DONNÉES DE DÉMONSTRATION
     */
    async insertDemoData() {
        // Profils de démonstration avec différents niveaux de risque
        const demoProfiles = [
            {
                username: 'suspect_user_001',
                display_name: 'Utilisateur Suspect',
                bio: 'Profil avec activité suspecte détectée',
                followers_count: 15420,
                following_count: 892,
                hearts_count: 234567,
                videos_count: 45,
                verified: false,
                risk_level: 'high',
                risk_score: 85,
                threat_indicators: JSON.stringify({
                    hate_speech: true,
                    harassment: true,
                    misinformation: false
                }),
                country_code: 'FR',
                language_code: 'fr'
            },
            {
                username: 'normal_user_002',
                display_name: 'Utilisateur Normal',
                bio: 'Profil standard sans activité suspecte',
                followers_count: 2340,
                following_count: 156,
                hearts_count: 12345,
                videos_count: 12,
                verified: false,
                risk_level: 'low',
                risk_score: 15,
                threat_indicators: JSON.stringify({}),
                country_code: 'FR',
                language_code: 'fr'
            },
            {
                username: 'influencer_003',
                display_name: 'Influenceur Vérifié',
                bio: 'Créateur de contenu vérifié',
                followers_count: 1250000,
                following_count: 234,
                hearts_count: 45678901,
                videos_count: 234,
                verified: true,
                risk_level: 'medium',
                risk_score: 35,
                threat_indicators: JSON.stringify({
                    controversial_content: true
                }),
                country_code: 'US',
                language_code: 'en'
            }
        ];

        for (const profile of demoProfiles) {
            await this.pool.query(`
                INSERT INTO profiles (
                    username, display_name, bio, followers_count, following_count,
                    hearts_count, videos_count, verified, risk_level, risk_score,
                    threat_indicators, country_code, language_code
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (username) DO NOTHING
            `, [
                profile.username, profile.display_name, profile.bio,
                profile.followers_count, profile.following_count, profile.hearts_count,
                profile.videos_count, profile.verified, profile.risk_level,
                profile.risk_score, profile.threat_indicators,
                profile.country_code, profile.language_code
            ]);
        }

        // Sessions de démonstration
        const profileIds = await this.pool.query('SELECT id FROM profiles LIMIT 3');
        
        for (let i = 0; i < profileIds.rows.length; i++) {
            const profileId = profileIds.rows[i].id;
            
            await this.pool.query(`
                INSERT INTO live_sessions (
                    profile_id, live_url, title, status, max_viewers,
                    total_comments, video_quality, case_reference
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                profileId,
                `https://tiktok.com/@demo_user_${i+1}/live`,
                `Session de démonstration ${i+1}`,
                i === 0 ? 'active' : 'completed',
                Math.floor(Math.random() * 5000) + 100,
                Math.floor(Math.random() * 200) + 10,
                'HD',
                `CASE-2024-${String(i+1).padStart(3, '0')}`
            ]);
        }

        // Commentaires de démonstration avec différents niveaux de toxicité
        const sessions = await this.pool.query('SELECT id FROM live_sessions LIMIT 3');
        
        const demoComments = [
            {
                message: 'Super live ! Merci pour le contenu',
                sentiment: 'positive',
                toxicity_score: 0.1,
                flagged: false
            },
            {
                message: 'Contenu inapproprié et offensant',
                sentiment: 'negative',
                toxicity_score: 0.8,
                flagged: true,
                contains_hate_speech: true
            },
            {
                message: 'Message neutre sans émotion particulière',
                sentiment: 'neutral',
                toxicity_score: 0.2,
                flagged: false
            }
        ];

        for (let i = 0; i < sessions.rows.length; i++) {
            const sessionId = sessions.rows[i].id;
            const comment = demoComments[i];
            
            await this.pool.query(`
                INSERT INTO live_comments (
                    session_id, commenter_username, message, sentiment,
                    toxicity_score, flagged, contains_hate_speech
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                sessionId,
                `demo_commenter_${i+1}`,
                comment.message,
                comment.sentiment,
                comment.toxicity_score,
                comment.flagged,
                comment.contains_hate_speech || false
            ]);
        }

        // Alertes de démonstration
        await this.pool.query(`
            INSERT INTO automated_alerts (
                session_id, alert_type, severity, title, description,
                triggered_by, confidence_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            sessions.rows[0].id,
            'hate_speech_detected',
            'high',
            'Discours haineux détecté',
            'Contenu potentiellement haineux identifié dans les commentaires',
            'AI_Content_Analyzer',
            0.87
        ]);

        console.log('✅ Données de démonstration insérées');
    }

    /**
     * ⚙️ CONFIGURATION DES TÂCHES AUTOMATISÉES
     */
    async setupAutomatedTasks() {
        const automatedTasks = [
            {
                task_name: 'cleanup_old_logs',
                task_type: 'maintenance',
                schedule_cron: '0 2 * * *', // Tous les jours à 2h
                parameters: JSON.stringify({ retention_days: 90 })
            },
            {
                task_name: 'generate_daily_reports',
                task_type: 'reporting',
                schedule_cron: '0 6 * * *', // Tous les jours à 6h
                parameters: JSON.stringify({ report_type: 'daily_summary' })
            },
            {
                task_name: 'backup_evidence',
                task_type: 'backup',
                schedule_cron: '0 1 * * 0', // Tous les dimanches à 1h
                parameters: JSON.stringify({ backup_location: '/backup/evidence' })
            },
            {
                task_name: 'update_risk_scores',
                task_type: 'analysis',
                schedule_cron: '*/30 * * * *', // Toutes les 30 minutes
                parameters: JSON.stringify({ algorithm: 'ml_risk_assessment' })
            }
        ];

        for (const task of automatedTasks) {
            await this.pool.query(`
                INSERT INTO automated_tasks (
                    task_name, task_type, schedule_cron, parameters
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT (task_name) DO NOTHING
            `, [task.task_name, task.task_type, task.schedule_cron, task.parameters]);
        }

        console.log('✅ Tâches automatisées configurées');
    }

    /**
     * 📊 COLLECTE DE DONNÉES EN TEMPS RÉEL
     */
    async collectLiveData(sessionId, dataType, data) {
        const collectors = {
            // Collecteur de commentaires
            comment: async (sessionId, commentData) => {
                return await this.pool.query(`
                    INSERT INTO live_comments (
                        session_id, commenter_username, commenter_id, message,
                        timestamp_original, live_timestamp, language_detected
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                `, [
                    sessionId,
                    commentData.username,
                    commentData.user_id,
                    commentData.message,
                    commentData.timestamp,
                    commentData.live_timestamp,
                    commentData.language || 'unknown'
                ]);
            },

            // Collecteur de métriques live
            metrics: async (sessionId, metricsData) => {
                return await this.pool.query(`
                    UPDATE live_sessions SET
                        max_viewers = GREATEST(max_viewers, $2),
                        total_comments = $3,
                        total_likes = $4,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                `, [
                    sessionId,
                    metricsData.current_viewers,
                    metricsData.total_comments,
                    metricsData.total_likes
                ]);
            },

            // Collecteur de preuves
            evidence: async (sessionId, evidenceData) => {
                return await this.pool.query(`
                    INSERT INTO digital_evidence (
                        session_id, evidence_type, filename, file_path,
                        file_size, file_hash, technical_metadata
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                `, [
                    sessionId,
                    evidenceData.type,
                    evidenceData.filename,
                    evidenceData.path,
                    evidenceData.size,
                    evidenceData.hash,
                    JSON.stringify(evidenceData.metadata || {})
                ]);
            }
        };

        if (collectors[dataType]) {
            return await collectors[dataType](sessionId, data);
        } else {
            throw new Error(`Type de collecteur non supporté: ${dataType}`);
        }
    }

    /**
     * 🔍 ANALYSE AUTOMATIQUE DES DONNÉES
     */
    async analyzeCollectedData() {
        // Analyse de sentiment des commentaires récents
        const recentComments = await this.pool.query(`
            SELECT id, message FROM live_comments 
            WHERE sentiment IS NULL 
            AND created_at > NOW() - INTERVAL '1 hour'
            LIMIT 100
        `);

        for (const comment of recentComments.rows) {
            const sentiment = await this.analyzeSentiment(comment.message);
            const toxicity = await this.analyzeToxicity(comment.message);
            
            await this.pool.query(`
                UPDATE live_comments SET
                    sentiment = $2,
                    toxicity_score = $3,
                    flagged = $4,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `, [
                comment.id,
                sentiment.label,
                toxicity.score,
                toxicity.score > 0.7
            ]);
        }

        // Mise à jour des scores de risque des profils
        await this.updateRiskScores();
        
        // Génération d'alertes automatiques
        await this.generateAutomaticAlerts();
    }

    /**
     * 🎯 ANALYSE DE SENTIMENT (Simulation)
     */
    async analyzeSentiment(text) {
        // Simulation d'analyse de sentiment
        const positiveWords = ['super', 'génial', 'excellent', 'merci', 'bravo'];
        const negativeWords = ['nul', 'horrible', 'déteste', 'stupide', 'idiot'];
        
        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
        
        if (positiveCount > negativeCount) {
            return { label: 'positive', confidence: 0.8 };
        } else if (negativeCount > positiveCount) {
            return { label: 'negative', confidence: 0.8 };
        } else {
            return { label: 'neutral', confidence: 0.6 };
        }
    }

    /**
     * ☢️ ANALYSE DE TOXICITÉ (Simulation)
     */
    async analyzeToxicity(text) {
        const toxicWords = ['idiot', 'stupide', 'nul', 'déteste', 'horrible'];
        const lowerText = text.toLowerCase();
        const toxicCount = toxicWords.filter(word => lowerText.includes(word)).length;
        
        return {
            score: Math.min(toxicCount * 0.3, 1.0),
            categories: {
                hate_speech: toxicCount > 2,
                harassment: toxicCount > 1,
                threats: lowerText.includes('menace') || lowerText.includes('tuer')
            }
        };
    }

    /**
     * 📈 MISE À JOUR DES SCORES DE RISQUE
     */
    async updateRiskScores() {
        await this.pool.query(`
            UPDATE profiles SET
                risk_score = LEAST(100, (
                    SELECT COALESCE(
                        (COUNT(CASE WHEN c.flagged THEN 1 END) * 10) +
                        (AVG(c.toxicity_score) * 50) +
                        (COUNT(a.id) * 15),
                        0
                    )
                    FROM live_sessions s
                    LEFT JOIN live_comments c ON s.id = c.session_id
                    LEFT JOIN automated_alerts a ON s.profile_id = a.profile_id
                    WHERE s.profile_id = profiles.id
                    AND s.created_at > NOW() - INTERVAL '30 days'
                )),
                risk_level = CASE
                    WHEN risk_score >= 80 THEN 'critical'
                    WHEN risk_score >= 60 THEN 'high'
                    WHEN risk_score >= 30 THEN 'medium'
                    ELSE 'low'
                END,
                updated_at = CURRENT_TIMESTAMP
        `);
    }

    /**
     * 🚨 GÉNÉRATION D'ALERTES AUTOMATIQUES
     */
    async generateAutomaticAlerts() {
        // Alerte pour commentaires toxiques
        await this.pool.query(`
            INSERT INTO automated_alerts (
                session_id, profile_id, alert_type, severity, title, description,
                triggered_by, confidence_score
            )
            SELECT DISTINCT
                c.session_id,
                s.profile_id,
                'high_toxicity_detected',
                'high',
                'Commentaires toxiques détectés',
                'Plusieurs commentaires avec un score de toxicité élevé ont été détectés',
                'AI_Toxicity_Analyzer',
                AVG(c.toxicity_score)
            FROM live_comments c
            JOIN live_sessions s ON c.session_id = s.id
            WHERE c.toxicity_score > 0.7
            AND c.created_at > NOW() - INTERVAL '1 hour'
            AND NOT EXISTS (
                SELECT 1 FROM automated_alerts a
                WHERE a.session_id = c.session_id
                AND a.alert_type = 'high_toxicity_detected'
                AND a.created_at > NOW() - INTERVAL '1 hour'
            )
            GROUP BY c.session_id, s.profile_id
            HAVING COUNT(*) >= 3
        `);
    }

    /**
     * 📊 STATISTIQUES EN TEMPS RÉEL
     */
    async getRealTimeStats() {
        const stats = await this.pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM profiles) as total_profiles,
                (SELECT COUNT(*) FROM profiles WHERE risk_level IN ('high', 'critical')) as high_risk_profiles,
                (SELECT COUNT(*) FROM live_sessions WHERE status = 'active') as active_sessions,
                (SELECT COUNT(*) FROM live_comments WHERE created_at > NOW() - INTERVAL '24 hours') as comments_24h,
                (SELECT COUNT(*) FROM automated_alerts WHERE acknowledged = false) as pending_alerts,
                (SELECT COUNT(*) FROM digital_evidence) as total_evidence_files
        `);

        return stats.rows[0];
    }

    /**
     * 🔄 NETTOYAGE AUTOMATIQUE
     */
    async performMaintenance() {
        // Supprimer les logs anciens
        await this.pool.query(`
            DELETE FROM forensic_logs 
            WHERE timestamp < NOW() - INTERVAL '90 days'
        `);

        // Archiver les sessions anciennes
        await this.pool.query(`
            UPDATE live_sessions SET status = 'archived'
            WHERE status = 'completed' 
            AND end_time < NOW() - INTERVAL '1 year'
        `);

        // Nettoyer les alertes résolues anciennes
        await this.pool.query(`
            DELETE FROM automated_alerts
            WHERE resolution_status = 'resolved'
            AND acknowledged_at < NOW() - INTERVAL '6 months'
        `);

        console.log('✅ Maintenance automatique effectuée');
    }

    /**
     * 🔌 FERMETURE DE LA CONNEXION
     */
    async close() {
        await this.pool.end();
    }
}

module.exports = SCISDataArchitecture;