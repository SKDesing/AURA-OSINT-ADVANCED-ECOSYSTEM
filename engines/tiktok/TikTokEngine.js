const EngineBase = require('../../core/engine-base/EngineBase');
const ChromiumLauncher = require('../../chromium-launcher');
const forensicLogger = require('../../logs/forensic-logger');

class TikTokEngine extends EngineBase {
    constructor(config = {}) {
        super('tiktok', config);
        this.browser = null;
        this.pages = new Map();
    }

    async setupDatabase() {
        // Use existing database schema for TikTok
        this.db = require('../../shared/database/ForensicDB');
        await this.db.connect();
    }

    async setupStorage() {
        // Use existing storage system
        this.storage = {
            hot: require('../../shared/database/StealthDB'),
            warm: this.db,
            cold: null // TODO: Implement cold storage
        };
    }

    async setupConnections() {
        const launcher = new ChromiumLauncher({
            headless: this.config.headless !== false,
            devtools: this.config.devtools || false
        });
        
        this.browser = await launcher.launch();
        forensicLogger.audit('TIKTOK_BROWSER_READY', { 
            headless: this.config.headless,
            pid: this.browser.process()?.pid 
        });
    }

    async createSession(target, sessionId) {
        const session = {
            id: sessionId,
            targetId: target.id,
            platform: 'tiktok',
            target: target,
            startTime: Date.now(),
            status: 'created',
            data: {
                messages: [],
                viewers: [],
                gifts: [],
                metadata: {}
            },
            page: null
        };

        // Save session to database
        await this.storage.warm.query(`
            INSERT INTO live_sessions (session_id, target_username, started_at, status)
            VALUES ($1, $2, $3, $4)
        `, [sessionId, target.username, new Date(), 'active']);

        return session;
    }

    async connectToTarget(target, session) {
        const page = await this.browser.newPage();
        session.page = page;
        this.pages.set(session.id, page);

        // Navigate to TikTok live
        const liveUrl = `https://www.tiktok.com/@${target.username}/live`;
        
        forensicLogger.audit('TIKTOK_NAVIGATE', { 
            targetId: target.id,
            sessionId: session.id,
            url: liveUrl 
        });

        await page.goto(liveUrl, { waitUntil: 'networkidle2' });
        
        // Check if live is active
        const isLive = await this.checkIfLive(page);
        if (!isLive) {
            throw new Error(`Target ${target.username} is not currently live`);
        }

        session.status = 'connected';
    }

    async startDataStream(target, session) {
        const page = session.page;
        
        // Inject chat monitoring script
        await page.evaluateOnNewDocument(() => {
            window.auraCollectedData = [];
            
            // Monitor chat messages
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(...args) {
                const ws = new originalWebSocket(...args);
                
                ws.addEventListener('message', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'chat' || data.type === 'gift') {
                            window.auraCollectedData.push({
                                type: data.type,
                                data: data,
                                timestamp: Date.now()
                            });
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                });
                
                return ws;
            };
        });

        // Start data collection loop
        this.startCollectionLoop(session);
        
        session.status = 'streaming';
        forensicLogger.audit('TIKTOK_STREAM_START', {
            targetId: target.id,
            sessionId: session.id
        });
    }

    startCollectionLoop(session) {
        const collectData = async () => {
            if (!this.sessions.has(session.id)) {
                return; // Session stopped
            }

            try {
                const page = session.page;
                const collectedData = await page.evaluate(() => {
                    const data = window.auraCollectedData || [];
                    window.auraCollectedData = [];
                    return data;
                });

                if (collectedData.length > 0) {
                    await this.processCollectedData(session, collectedData);
                }

                // Continue collection
                setTimeout(collectData, 1000);
            } catch (error) {
                forensicLogger.security('TIKTOK_COLLECTION_ERROR', {
                    sessionId: session.id,
                    error: error.message
                });
                
                // Retry after delay
                setTimeout(collectData, 5000);
            }
        };

        collectData();
    }

    async processCollectedData(session, data) {
        for (const item of data) {
            try {
                if (item.type === 'chat') {
                    await this.processChatMessage(session, item);
                } else if (item.type === 'gift') {
                    await this.processGift(session, item);
                }
            } catch (error) {
                forensicLogger.security('TIKTOK_DATA_PROCESS_ERROR', {
                    sessionId: session.id,
                    itemType: item.type,
                    error: error.message
                });
            }
        }
    }

    async processChatMessage(session, item) {
        const message = {
            session_id: session.id,
            user_id: item.data.user?.id,
            username: item.data.user?.username,
            message_text: item.data.message,
            timestamp_live: new Date(item.timestamp),
            message_type: 'chat'
        };

        await this.storage.warm.query(`
            INSERT INTO chat_messages (session_id, user_id, username, message_text, timestamp_live, message_type)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [message.session_id, message.user_id, message.username, message.message_text, message.timestamp_live, message.message_type]);

        session.data.messages.push(message);
        this.emit('chatMessage', { sessionId: session.id, message });
    }

    async processGift(session, item) {
        const gift = {
            session_id: session.id,
            user_id: item.data.user?.id,
            username: item.data.user?.username,
            gift_name: item.data.gift?.name,
            gift_value: item.data.gift?.value,
            timestamp_live: new Date(item.timestamp)
        };

        session.data.gifts.push(gift);
        this.emit('gift', { sessionId: session.id, gift });
    }

    async checkIfLive(page) {
        try {
            await page.waitForSelector('[data-e2e="live-avatar"]', { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async disconnectFromTarget(session) {
        if (session.page) {
            await session.page.close();
            this.pages.delete(session.id);
        }
        session.status = 'disconnected';
    }

    async finalizeSession(session) {
        const endTime = Date.now();
        const duration = endTime - session.startTime;

        await this.storage.warm.query(`
            UPDATE live_sessions 
            SET ended_at = $1, duration_seconds = $2, total_messages = $3, status = 'completed'
            WHERE session_id = $4
        `, [new Date(endTime), Math.floor(duration / 1000), session.data.messages.length, session.id]);

        forensicLogger.audit('TIKTOK_SESSION_FINALIZED', {
            sessionId: session.id,
            duration,
            messagesCollected: session.data.messages.length,
            giftsCollected: session.data.gifts.length
        });
    }

    async shutdown() {
        forensicLogger.audit('TIKTOK_ENGINE_SHUTDOWN', { 
            activeSessions: this.sessions.size 
        });

        // Stop all active sessions
        for (const [sessionId] of this.sessions) {
            await this.stopCollection(sessionId);
        }

        // Close browser
        if (this.browser) {
            await this.browser.close();
        }

        this.status = 'shutdown';
    }
}

module.exports = TikTokEngine;