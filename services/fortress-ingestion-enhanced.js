// 🏰 AURA Fortress Ingestion Enhanced - Fusion des meilleures pratiques
const { Pool } = require('pg');
const { EventEmitter } = require('events');

class FortressIngestionEnhanced extends EventEmitter {
    constructor(config) {
        super();
        
        // Pool optimisé (ton approche)
        this.pool = new Pool({
            host: config.database.host,
            port: config.database.port,
            database: config.database.database,
            user: config.database.user,
            password: config.database.password,
            max: config.database.max || 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        // Buffer système (ton innovation)
        this.captureBuffer = new Map();
        this.config = config;
        
        // Auto-flush (ton système)
        this.flushInterval = setInterval(
            () => this.flushAllBuffers(),
            config.capture?.flushIntervalMs || 5000
        );
    }

    // 🎯 MISSION PRINCIPALE : Ingestion complète TikTok Live
    async ingestTikTokLiveData(liveData) {
        const operations = [];

        // 1. Streamer
        if (liveData.streamer) {
            operations.push(this.ingestUser(liveData.streamer));
        }

        // 2. Stream
        if (liveData.stream) {
            operations.push(this.ingestLiveStream(liveData.stream));
        }

        // 3. Viewers (batch)
        if (liveData.viewers?.length > 0) {
            liveData.viewers.forEach(viewer => {
                operations.push(this.ingestViewer(viewer));
            });
        }

        // 4. Messages (batch + ML)
        if (liveData.messages?.length > 0) {
            liveData.messages.forEach(message => {
                operations.push(this.ingestChatMessage(message));
            });
        }

        // 5. Gifts
        if (liveData.gifts?.length > 0) {
            liveData.gifts.forEach(gift => {
                operations.push(this.ingestGiftTransaction(gift));
            });
        }

        // 6. Tokens sécurité
        if (liveData.tokens) {
            operations.push(this.captureSecurityTokens(liveData.tokens));
        }

        // 7. Métriques temps réel
        if (liveData.metrics) {
            operations.push(this.captureRealtimeMetrics(liveData.stream.id, liveData.metrics));
        }

        // Exécution parallèle optimisée
        try {
            await Promise.allSettled(operations);
            this.emit('ingestion:complete', { 
                operations: operations.length,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.emit('ingestion:error', { error, liveData });
        }
    }

    // 🎭 Ingestion utilisateur avec déduplication (ton approche)
    async ingestUser(userData) {
        try {
            const result = await this.pool.query(
                `SELECT fortress_upsert_user($1, $2, $3, $4)`,
                [
                    userData.userId || userData.tiktok_user_id,
                    userData.username,
                    userData.displayName || userData.display_name,
                    userData.followerCount || userData.follower_count || 0
                ]
            );

            const userId = result.rows[0].fortress_upsert_user;
            this.emit('user:ingested', { userId, username: userData.username });
            return userId;

        } catch (error) {
            console.error('❌ User ingestion failed:', error);
            this.emit('error:user_ingestion', { userData, error });
            throw error;
        }
    }

    // 📺 Ingestion stream avec transaction (ton système)
    async ingestLiveStream(streamData) {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // Streamer d'abord
            const streamerUserId = await this.ingestUser({
                userId: streamData.anchorId || streamData.anchor_id,
                username: streamData.streamerUsername || streamData.streamer_username,
                displayName: streamData.streamerDisplayName,
                followerCount: streamData.followerCount || 0
            });

            // Stream
            const streamResult = await client.query(`
                INSERT INTO fortress_live_streams (
                    room_id, anchor_id, stream_url, streamer_user_id, streamer_username,
                    title, description, hashtags, category, status, started_at,
                    broadcast_region, capture_method, data_integrity_hash
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (room_id) DO UPDATE SET
                    status = EXCLUDED.status,
                    current_viewers = EXCLUDED.current_viewers,
                    updated_at = NOW()
                RETURNING stream_id
            `, [
                streamData.roomId || streamData.room_id,
                streamData.anchorId || streamData.anchor_id,
                streamData.streamUrl || streamData.stream_url,
                streamerUserId,
                streamData.streamerUsername || streamData.streamer_username,
                streamData.title,
                streamData.description,
                streamData.hashtags || [],
                streamData.category,
                'live',
                new Date(),
                streamData.region || streamData.broadcast_region,
                'aura-stealth-logger',
                this.generateDataHash(streamData)
            ]);

            await client.query('COMMIT');

            const streamId = streamResult.rows[0].stream_id;
            this.emit('stream:created', { streamId, roomId: streamData.roomId });
            return streamId;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Stream ingestion failed:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // 💬 Messages avec ML enrichissement (ton innovation)
    async ingestChatMessage(messageData) {
        if (!this.captureBuffer.has('messages')) {
            this.captureBuffer.set('messages', []);
        }

        // Enrichissement ML parallèle (ton approche)
        const enrichmentPromise = this.enrichMessage(messageData);

        const messageBuffer = this.captureBuffer.get('messages');
        messageBuffer.push({ 
            data: messageData, 
            enrichment: enrichmentPromise 
        });

        // Flush si buffer plein (ton système)
        if (messageBuffer.length >= (this.config.capture?.batchSize || 50)) {
            await this.flushMessages();
        }
    }

    // 🧠 Enrichissement ML (ton pipeline)
    async enrichMessage(message) {
        const [sentiment, toxicity, language, entities] = await Promise.all([
            this.analyzeSentiment(message.content || message.message_content),
            this.analyzeToxicity(message.content || message.message_content),
            this.detectLanguage(message.content || message.message_content),
            this.extractEntities(message.content || message.message_content)
        ]);

        return {
            sentiment_score: sentiment.score,
            toxicity_score: toxicity.score,
            language_detected: language,
            contains_emojis: this.containsEmojis(message.content),
            emoji_list: this.extractEmojis(message.content),
            contains_mentions: this.containsMentions(message.content),
            mentioned_users: this.extractMentions(message.content),
            contains_hashtags: this.containsHashtags(message.content),
            hashtag_list: this.extractHashtags(message.content),
            ml_analysis: {
                intent: await this.classifyIntent(message.content),
                topics: await this.extractTopics(message.content),
                confidence: sentiment.confidence
            }
        };
    }

    // 🔄 Flush messages optimisé (ton approche)
    async flushMessages() {
        const messageBuffer = this.captureBuffer.get('messages');
        if (!messageBuffer || messageBuffer.length === 0) return;

        try {
            // Attendre enrichissements (ton système)
            const enrichedMessages = await Promise.all(
                messageBuffer.map(async (msg) => ({
                    ...msg.data,
                    enrichment: await msg.enrichment
                }))
            );

            // Batch insert optimisé
            const values = enrichedMessages.map((m, idx) => {
                const base = idx * 15;
                return `($${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, 
                         $${base+6}, $${base+7}, $${base+8}, $${base+9}, $${base+10},
                         $${base+11}, $${base+12}, $${base+13}, $${base+14}, $${base+15})`;
            }).join(',');

            const params = enrichedMessages.flatMap(m => [
                m.streamId || m.stream_id,
                m.userId || m.user_id,
                m.content || m.message_content,
                m.type || m.message_type || 'text',
                m.enrichment.language_detected,
                m.enrichment.sentiment_score,
                m.enrichment.toxicity_score,
                m.enrichment.contains_emojis,
                m.enrichment.emoji_list,
                m.enrichment.contains_mentions,
                m.enrichment.mentioned_users,
                m.enrichment.contains_hashtags,
                m.enrichment.hashtag_list,
                m.sentAt || new Date(),
                JSON.stringify(m.enrichment.ml_analysis)
            ]);

            await this.pool.query(`
                INSERT INTO fortress_chat_messages (
                    stream_id, user_id, message_content, message_type,
                    language_detected, sentiment_score, toxicity_score,
                    contains_emojis, emoji_list, contains_mentions, mentioned_users,
                    contains_hashtags, hashtag_list, sent_at, ml_analysis
                ) VALUES ${values}
            `, params);

            this.emit('messages:flushed', { count: enrichedMessages.length });
            this.captureBuffer.set('messages', []);

        } catch (error) {
            console.error('❌ Message flush failed:', error);
            this.emit('error:message_flush', { error });
        }
    }

    // 🔄 Flush tous les buffers (ton système)
    async flushAllBuffers() {
        const flushPromises = [];
        
        if (this.captureBuffer.has('messages')) {
            flushPromises.push(this.flushMessages());
        }
        
        if (this.captureBuffer.has('viewers')) {
            flushPromises.push(this.flushViewers());
        }

        await Promise.allSettled(flushPromises);
    }

    // 🧠 Services ML (à implémenter)
    async analyzeSentiment(text) {
        // Appel service ML ou analyse locale
        return { score: 0.5, confidence: 0.8 };
    }

    async analyzeToxicity(text) {
        // Détection toxicité
        return { score: 0.1 };
    }

    async detectLanguage(text) {
        // Détection langue
        if (/[àâäéèêëïîôöùûüÿç]/.test(text)) return 'fr';
        return 'en';
    }

    async extractEntities(text) {
        // Extraction entités nommées
        return [];
    }

    async classifyIntent(text) {
        // Classification d'intention
        return 'general';
    }

    async extractTopics(text) {
        // Extraction de sujets
        return [];
    }

    // Utilitaires
    containsEmojis(text) {
        return /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text);
    }

    extractEmojis(text) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
        return text.match(emojiRegex) || [];
    }

    containsMentions(text) {
        return /@\w+/.test(text);
    }

    extractMentions(text) {
        const mentions = text.match(/@(\w+)/g);
        return mentions ? mentions.map(m => m.substring(1)) : [];
    }

    containsHashtags(text) {
        return /#\w+/.test(text);
    }

    extractHashtags(text) {
        const hashtags = text.match(/#(\w+)/g);
        return hashtags ? hashtags.map(h => h.substring(1)) : [];
    }

    generateDataHash(data) {
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    // Nettoyage
    async close() {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
        await this.flushAllBuffers();
        await this.pool.end();
    }
}

module.exports = FortressIngestionEnhanced;