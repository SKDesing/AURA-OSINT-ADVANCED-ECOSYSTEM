/**
 * 📊 DATA PIPELINE
 * Pipeline de traitement des données capturées
 */

const { Pool } = require('pg');
const crypto = require('crypto');

class DataPipeline {
    constructor() {
        this.db = new Pool({
            user: process.env.DB_USER || 'aura_user',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'aura_investigations',
            password: process.env.DB_PASSWORD || 'aura_secure_2024',
            port: process.env.DB_PORT || 5432,
        });
        
        this.sessionId = null;
        this.buffer = [];
        this.flushInterval = 5000; // 5 secondes
        
        this.startFlushTimer();
    }

    // Démarrer une session de capture
    async startSession(liveUrl, title = 'TikTok Live Session') {
        try {
            const result = await this.db.query(`
                INSERT INTO live_sessions (live_url, title, start_timestamp, status)
                VALUES ($1, $2, NOW(), 'active')
                RETURNING id
            `, [liveUrl, title]);
            
            this.sessionId = result.rows[0].id;
            console.log(`📊 Session démarrée: ${this.sessionId}`);
            return this.sessionId;
        } catch (error) {
            console.error('❌ Erreur création session:', error);
            throw error;
        }
    }

    // Traiter un commentaire capturé
    async processComment(data) {
        if (!this.sessionId) return;

        const commentData = {
            session_id: this.sessionId,
            user_id: data.userId || this.generateUserId(data.user),
            username: data.user,
            message: data.message,
            timestamp: new Date(data.timestamp),
            hash_preuve: this.generateHash(data),
            source: 'browser_intercept'
        };

        this.buffer.push({
            type: 'comment',
            data: commentData
        });

        // Analyse de sentiment basique
        const sentiment = this.analyzeSentiment(data.message);
        if (sentiment.isHateful) {
            await this.flagContent(commentData, sentiment);
        }
    }

    // Traiter un cadeau capturé
    async processGift(data) {
        if (!this.sessionId) return;

        const giftData = {
            session_id: this.sessionId,
            user_id: this.generateUserId(data.user),
            username: data.user,
            gift_name: data.gift,
            gift_count: data.count,
            timestamp: new Date(data.timestamp),
            hash_preuve: this.generateHash(data)
        };

        this.buffer.push({
            type: 'gift',
            data: giftData
        });
    }

    // Traiter les statistiques du live
    async processStats(data) {
        if (!this.sessionId) return;

        await this.db.query(`
            UPDATE live_sessions 
            SET viewer_count = $2, like_count = $3, updated_at = NOW()
            WHERE id = $1
        `, [this.sessionId, data.viewers, data.likes]);
    }

    // Analyse de sentiment basique
    analyzeSentiment(message) {
        const hatefulWords = [
            'hate', 'kill', 'die', 'stupid', 'idiot', 'ugly', 'fat',
            'haine', 'mort', 'tuer', 'stupide', 'laid', 'gros'
        ];

        const lowerMessage = message.toLowerCase();
        const isHateful = hatefulWords.some(word => lowerMessage.includes(word));
        
        return {
            isHateful,
            confidence: isHateful ? 0.8 : 0.1,
            keywords: hatefulWords.filter(word => lowerMessage.includes(word))
        };
    }

    // Marquer du contenu comme problématique
    async flagContent(commentData, sentiment) {
        try {
            await this.db.query(`
                INSERT INTO flagged_content (
                    session_id, username, message, flag_reason, 
                    confidence_score, keywords, timestamp
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                commentData.session_id,
                commentData.username,
                commentData.message,
                'hate_speech',
                sentiment.confidence,
                JSON.stringify(sentiment.keywords),
                commentData.timestamp
            ]);
            
            console.log(`🚨 Contenu signalé: ${commentData.username}`);
        } catch (error) {
            console.error('❌ Erreur flagging:', error);
        }
    }

    // Générer un hash pour l'intégrité
    generateHash(data) {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(data) + Date.now())
            .digest('hex');
    }

    // Générer un ID utilisateur basé sur le nom
    generateUserId(username) {
        return crypto
            .createHash('md5')
            .update(username)
            .digest('hex')
            .substring(0, 16);
    }

    // Vider le buffer vers la base de données
    async flushBuffer() {
        if (this.buffer.length === 0) return;

        const comments = this.buffer.filter(item => item.type === 'comment');
        const gifts = this.buffer.filter(item => item.type === 'gift');

        try {
            // Insérer les commentaires
            for (const comment of comments) {
                await this.db.query(`
                    INSERT INTO live_commentaires (
                        session_id, user_id, username, message, 
                        timestamp, hash_preuve, source
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    comment.data.session_id,
                    comment.data.user_id,
                    comment.data.username,
                    comment.data.message,
                    comment.data.timestamp,
                    comment.data.hash_preuve,
                    comment.data.source
                ]);
            }

            // Insérer les cadeaux
            for (const gift of gifts) {
                await this.db.query(`
                    INSERT INTO live_cadeaux (
                        session_id, user_id, username, gift_name,
                        gift_count, timestamp, hash_preuve
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    gift.data.session_id,
                    gift.data.user_id,
                    gift.data.username,
                    gift.data.gift_name,
                    gift.data.gift_count,
                    gift.data.timestamp,
                    gift.data.hash_preuve
                ]);
            }

            console.log(`💾 Buffer vidé: ${comments.length} commentaires, ${gifts.length} cadeaux`);
            this.buffer = [];
            
        } catch (error) {
            console.error('❌ Erreur flush buffer:', error);
        }
    }

    // Timer pour vider le buffer régulièrement
    startFlushTimer() {
        setInterval(() => {
            this.flushBuffer();
        }, this.flushInterval);
    }

    // Arrêter la session
    async stopSession() {
        if (!this.sessionId) return;

        await this.flushBuffer(); // Vider le buffer final
        
        await this.db.query(`
            UPDATE live_sessions 
            SET end_timestamp = NOW(), status = 'completed'
            WHERE id = $1
        `, [this.sessionId]);

        console.log(`🛑 Session arrêtée: ${this.sessionId}`);
        this.sessionId = null;
    }
}

module.exports = DataPipeline;