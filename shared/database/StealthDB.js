const BaseJSONDB = require('./BaseJSONDB');
const path = require('path');

class StealthDB extends BaseJSONDB {
    constructor() {
        super(path.join(__dirname, '../../databases/stealth/sessions.json'));
    }

    async createSession(sessionId, targetUrl, chromiumProfilePath = null) {
        const session = {
            session_id: sessionId,
            target_url: targetUrl,
            chromium_profile_path: chromiumProfilePath,
            status: 'active',
            started_at: new Date().toISOString(),
            total_logs: 0
        };
        return await this.addRecord('stealth_sessions', session);
    }

    async getSession(sessionId) {
        const sessions = await this.getRecords('stealth_sessions', s => s.session_id === sessionId);
        return sessions[0] || null;
    }

    async updateSessionStatus(sessionId, status) {
        const db = await this.readDB();
        const session = db.stealth_sessions?.find(s => s.session_id === sessionId);
        if (!session) return null;

        const updates = { status };
        if (status === 'stopped') {
            updates.stopped_at = new Date().toISOString();
        }

        return await this.updateRecord('stealth_sessions', session.id, updates);
    }

    async addLog(sessionId, logType, message, metadata = null) {
        const log = {
            session_id: sessionId,
            log_type: logType,
            message,
            metadata,
            timestamp: new Date().toISOString()
        };
        
        // Increment session log count
        const session = await this.getSession(sessionId);
        if (session) {
            await this.updateRecord('stealth_sessions', session.id, { 
                total_logs: (session.total_logs || 0) + 1 
            });
        }
        
        return await this.addRecord('stealth_logs', log);
    }

    async getLogs(sessionId = null, logType = null, limit = 100) {
        let filter = null;
        
        if (sessionId && logType) {
            filter = log => log.session_id === sessionId && log.log_type === logType;
        } else if (sessionId) {
            filter = log => log.session_id === sessionId;
        } else if (logType) {
            filter = log => log.log_type === logType;
        }
        
        const logs = await this.getRecords('stealth_logs', filter, limit);
        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    async addForensicData(sessionId, userProfile, networkRequests, domInteractions, extractedData) {
        const forensicData = {
            session_id: sessionId,
            user_profile: userProfile,
            network_requests: networkRequests,
            dom_interactions: domInteractions,
            extracted_data: extractedData,
            analysis_timestamp: new Date().toISOString()
        };
        return await this.addRecord('tiktok_forensic_data', forensicData);
    }

    async getForensicData(sessionId) {
        return await this.getRecords('tiktok_forensic_data', f => f.session_id === sessionId);
    }
}

module.exports = StealthDB;
