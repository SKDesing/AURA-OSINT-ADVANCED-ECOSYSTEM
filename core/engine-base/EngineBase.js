const EventEmitter = require('events');
const crypto = require('crypto');
const forensicLogger = require('../../logs/forensic-logger');

class EngineBase extends EventEmitter {
    constructor(platform, config = {}) {
        super();
        this.platform = platform;
        this.config = {
            connectionTimeout: 30000,
            maxRetries: 3,
            ...config
        };
        this.status = 'idle';
        this.targets = new Map();
        this.sessions = new Map();
        this.startTime = null;
        this.db = null;
        this.storage = null;
    }

    async initialize() {
        forensicLogger.audit('ENGINE_INITIALIZE', { platform: this.platform });
        this.status = 'initializing';
        this.startTime = Date.now();

        try {
            await this.setupDatabase();
            await this.setupStorage();
            await this.setupConnections();

            this.status = 'ready';
            this.emit('ready');

            forensicLogger.audit('ENGINE_READY', { 
                platform: this.platform,
                targets: this.targets.size 
            });
        } catch (error) {
            this.status = 'error';
            forensicLogger.critical('ENGINE_INIT_FAILED', { 
                platform: this.platform, 
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    validateTargetData(targetData) {
        if (!targetData.username && !targetData.id) {
            throw new Error('Target must have username or id');
        }

        if (targetData.platform && targetData.platform !== this.platform) {
            throw new Error(`Invalid platform: expected ${this.platform}, got ${targetData.platform}`);
        }

        return true;
    }

    async addTarget(targetData) {
        this.validateTargetData(targetData);

        const targetId = this.generateTargetId(targetData);

        // Check for existing target by username/id instead of generated ID
        const existingTarget = Array.from(this.targets.values())
            .find(t => t.username === targetData.username || t.id === targetData.id);
        
        if (existingTarget) {
            forensicLogger.security('DUPLICATE_TARGET', { 
                platform: this.platform, 
                targetId: existingTarget.id,
                attemptedTarget: targetData.username || targetData.id
            });
            throw new Error(`Target ${targetData.username || targetData.id} already exists`);
        }

        forensicLogger.audit('TARGET_ADDED', { 
            platform: this.platform, 
            targetId,
            targetData: this.sanitizeTargetData(targetData)
        });

        this.targets.set(targetId, {
            ...targetData,
            id: targetId,
            status: 'active',
            addedAt: new Date(),
            lastActivity: null,
            sessionCount: 0
        });

        this.emit('targetAdded', targetId);
        return targetId;
    }

    async startCollection(targetId) {
        if (!this.targets.has(targetId)) {
            throw new Error(`Target ${targetId} not found`);
        }

        const target = this.targets.get(targetId);
        
        const activeSession = Array.from(this.sessions.values())
            .find(s => s.targetId === targetId && s.status === 'active');
        
        if (activeSession) {
            forensicLogger.security('SESSION_ALREADY_ACTIVE', { 
                platform: this.platform,
                targetId,
                existingSessionId: activeSession.id
            });
            return activeSession.id;
        }

        const sessionId = this.generateSessionId(targetId);

        forensicLogger.audit('COLLECTION_START', {
            platform: this.platform,
            targetId,
            sessionId
        });

        try {
            const session = await this.createSession(target, sessionId);
            session.targetId = targetId;
            session.status = 'connecting';
            this.sessions.set(sessionId, session);

            await this.connectWithTimeout(target, session, this.config.connectionTimeout);
            
            session.status = 'active';
            await this.startDataStream(target, session);

            target.sessionCount++;
            target.lastActivity = new Date();

            this.emit('collectionStarted', { targetId, sessionId });
            return sessionId;
        } catch (error) {
            forensicLogger.critical('COLLECTION_START_FAILED', {
                platform: this.platform,
                targetId,
                error: error.message,
                stack: error.stack
            });
            
            if (this.sessions.has(sessionId)) {
                this.sessions.delete(sessionId);
            }
            
            throw error;
        }
    }

    async stopCollection(sessionId) {
        if (!this.sessions.has(sessionId)) {
            forensicLogger.security('SESSION_NOT_FOUND', { 
                platform: this.platform,
                sessionId 
            });
            throw new Error(`Session ${sessionId} not found`);
        }

        const session = this.sessions.get(sessionId);
        session.status = 'stopping';

        forensicLogger.audit('COLLECTION_STOP', {
            platform: this.platform,
            sessionId,
            duration: Date.now() - session.startTime,
            dataCollected: session.dataCount || 0
        });

        try {
            await this.disconnectFromTarget(session);
            await this.finalizeSession(session);

            this.sessions.delete(sessionId);
            this.emit('collectionStopped', { sessionId, success: true });
        } catch (error) {
            forensicLogger.security('COLLECTION_STOP_ERROR', {
                platform: this.platform,
                sessionId,
                error: error.message
            });
            
            this.sessions.delete(sessionId);
            this.emit('collectionStopped', { sessionId, success: false, error: error.message });
        }
    }

    async shutdown() {
        forensicLogger.audit('ENGINE_SHUTDOWN', { 
            platform: this.platform,
            activeSessions: this.sessions.size
        });
        
        this.status = 'shutting_down';

        const stopPromises = Array.from(this.sessions.keys())
            .map(sessionId => this.stopCollection(sessionId).catch(err => {
                forensicLogger.security('SESSION_STOP_ERROR_ON_SHUTDOWN', { 
                    sessionId, 
                    error: err.message 
                });
            }));
        
        await Promise.all(stopPromises);

        if (this.db && typeof this.db.end === 'function') {
            await this.db.end();
        }

        this.status = 'stopped';
        this.emit('shutdown');
        
        forensicLogger.audit('ENGINE_SHUTDOWN_COMPLETE', { platform: this.platform });
    }

    async connectWithTimeout(target, session, timeout) {
        return Promise.race([
            this.connectToTarget(target, session),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Connection timeout after ${timeout}ms`)), timeout)
            )
        ]);
    }

    getStatus() {
        return {
            platform: this.platform,
            status: this.status,
            targets: this.targets.size,
            activeSessions: this.sessions.size,
            uptime: this.startTime ? Date.now() - this.startTime : 0,
            activeTargets: Array.from(this.targets.entries())
                .filter(([_, t]) => t.status === 'active')
                .length,
            config: {
                connectionTimeout: this.config.connectionTimeout,
                maxRetries: this.config.maxRetries
            }
        };
    }

    getDetailedStats() {
        const sessions = Array.from(this.sessions.values());
        
        return {
            ...this.getStatus(),
            sessions: sessions.map(s => ({
                id: s.id,
                targetId: s.targetId,
                status: s.status,
                duration: Date.now() - s.startTime,
                dataCollected: s.dataCount || 0
            })),
            targets: Array.from(this.targets.entries()).map(([id, target]) => ({
                id,
                username: target.username,
                status: target.status,
                sessionCount: target.sessionCount,
                lastActivity: target.lastActivity
            }))
        };
    }

    // Abstract methods - must be implemented by subclasses
    async setupDatabase() {
        throw new Error('setupDatabase() must be implemented');
    }

    async setupStorage() {
        throw new Error('setupStorage() must be implemented');
    }

    async setupConnections() {
        throw new Error('setupConnections() must be implemented');
    }

    async createSession(target, sessionId) {
        throw new Error('createSession() must be implemented');
    }

    async connectToTarget(target, session) {
        throw new Error('connectToTarget() must be implemented');
    }

    async startDataStream(target, session) {
        throw new Error('startDataStream() must be implemented');
    }

    async disconnectFromTarget(session) {
        throw new Error('disconnectFromTarget() must be implemented');
    }

    async finalizeSession(session) {
        throw new Error('finalizeSession() must be implemented');
    }

    // Utility methods
    generateTargetId(targetData) {
        const hash = crypto.createHash('md5')
            .update(`${this.platform}:${targetData.username || targetData.id}:${Date.now()}:${Math.random()}`)
            .digest('hex')
            .substring(0, 8);
        
        return `${this.platform}_${targetData.username || targetData.id}_${hash}`;
    }

    generateSessionId(targetId) {
        const hash = crypto.createHash('md5')
            .update(`${targetId}:${Date.now()}:${Math.random()}`)
            .digest('hex')
            .substring(0, 8);
        
        return `${targetId}_session_${hash}`;
    }

    sanitizeTargetData(data) {
        const sensitiveFields = [
            'password', 'token', 'apiKey', 'secret', 
            'sessionToken', 'refreshToken', 'cookie',
            'auth', 'credentials', 'privateKey', 'accessToken'
        ];
        
        const sanitized = { ...data };
        sensitiveFields.forEach(field => delete sanitized[field]);
        
        return sanitized;
    }
}

module.exports = EngineBase;