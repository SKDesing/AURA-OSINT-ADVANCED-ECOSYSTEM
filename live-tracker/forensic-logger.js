/**
 * 📝 FORENSIC LOGGER
 * Système de logging forensique pour messages inconnus et audit
 */

const fs = require('fs').promises;
const path = require('path');

class ForensicLogger {
    constructor() {
        this.logsDir = path.join(__dirname, '../logs/forensic');
        this.ensureLogsDir();
    }

    async ensureLogsDir() {
        try {
            await fs.mkdir(this.logsDir, { recursive: true });
        } catch (error) {
            console.error('❌ Erreur création dossier logs:', error);
        }
    }

    // Logger les messages WebSocket inconnus
    async logUnknownMessage(data) {
        const timestamp = new Date().toISOString();
        const filename = `unknown_messages_${new Date().toISOString().split('T')[0]}.log`;
        const filepath = path.join(this.logsDir, filename);
        
        const logEntry = {
            timestamp,
            url: data.url,
            rawData: data.rawData,
            analysis: this.analyzeUnknownMessage(data.rawData)
        };

        try {
            await fs.appendFile(filepath, JSON.stringify(logEntry) + '\n');
            console.log('📝 Message inconnu loggé:', filename);
        } catch (error) {
            console.error('❌ Erreur logging message inconnu:', error);
        }
    }

    // Analyser un message inconnu pour identifier des patterns
    analyzeUnknownMessage(rawData) {
        try {
            const data = JSON.parse(rawData);
            const analysis = {
                hasUser: !!(data.user || data.userId || data.nickname),
                hasMessage: !!(data.message || data.content || data.text),
                hasGift: !!(data.gift || data.giftId || data.giftName),
                hasStats: !!(data.viewerCount || data.memberCount || data.likeCount),
                possibleType: this.guessMessageType(data),
                keys: Object.keys(data)
            };
            
            return analysis;
        } catch (error) {
            return { error: 'Invalid JSON', rawLength: rawData.length };
        }
    }

    // Deviner le type de message basé sur les clés
    guessMessageType(data) {
        if (data.user && (data.message || data.content)) return 'POSSIBLE_COMMENT';
        if (data.gift || data.giftId) return 'POSSIBLE_GIFT';
        if (data.viewerCount || data.memberCount) return 'POSSIBLE_STATS';
        if (data.method && data.method.includes('Chat')) return 'POSSIBLE_CHAT';
        if (data.method && data.method.includes('Gift')) return 'POSSIBLE_GIFT';
        if (data.type) return `POSSIBLE_${data.type.toUpperCase()}`;
        return 'UNKNOWN';
    }

    // Logger les événements de sécurité
    async logSecurityEvent(event, details) {
        const timestamp = new Date().toISOString();
        const filename = `security_${new Date().toISOString().split('T')[0]}.log`;
        const filepath = path.join(this.logsDir, filename);
        
        const logEntry = {
            timestamp,
            event,
            details,
            severity: this.getSecuritySeverity(event)
        };

        try {
            await fs.appendFile(filepath, JSON.stringify(logEntry) + '\n');
            console.log(`🔒 Événement sécurité loggé: ${event}`);
        } catch (error) {
            console.error('❌ Erreur logging sécurité:', error);
        }
    }

    getSecuritySeverity(event) {
        const severityMap = {
            'INVALID_TOKEN': 'HIGH',
            'INJECTION_DETECTED': 'CRITICAL',
            'UNUSUAL_MESSAGE_PATTERN': 'MEDIUM',
            'RATE_LIMIT_EXCEEDED': 'MEDIUM'
        };
        
        return severityMap[event] || 'LOW';
    }

    // Générer un rapport d'analyse des messages inconnus
    async generateUnknownMessagesReport() {
        const today = new Date().toISOString().split('T')[0];
        const filename = `unknown_messages_${today}.log`;
        const filepath = path.join(this.logsDir, filename);
        
        try {
            const content = await fs.readFile(filepath, 'utf8');
            const messages = content.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
            
            const report = {
                date: today,
                totalMessages: messages.length,
                possibleTypes: {},
                commonKeys: {},
                recommendations: []
            };

            // Analyser les types possibles
            messages.forEach(msg => {
                const type = msg.analysis?.possibleType || 'UNKNOWN';
                report.possibleTypes[type] = (report.possibleTypes[type] || 0) + 1;
                
                // Compter les clés communes
                if (msg.analysis?.keys) {
                    msg.analysis.keys.forEach(key => {
                        report.commonKeys[key] = (report.commonKeys[key] || 0) + 1;
                    });
                }
            });

            // Générer des recommandations
            Object.entries(report.possibleTypes).forEach(([type, count]) => {
                if (count > 5 && type !== 'UNKNOWN') {
                    report.recommendations.push(`Ajouter support pour ${type} (${count} occurrences)`);
                }
            });

            return report;
        } catch (error) {
            console.error('❌ Erreur génération rapport:', error);
            return null;
        }
    }
}

module.exports = ForensicLogger;