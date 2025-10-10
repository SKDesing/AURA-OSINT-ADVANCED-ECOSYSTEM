// AURA Anti-Harassment Detection Engine
// Cybersécurité - Tracking Harcèlement TikTok

const mysql = require('mysql2/promise');
const crypto = require('crypto');

class AntiHarassmentEngine {
    constructor() {
        this.toxicityThresholds = {
            mild: 0.3,
            moderate: 0.5,
            severe: 0.7,
            extreme: 0.85
        };
        
        this.harassmentPatterns = [
            { type: 'threats', keywords: ['kill', 'die', 'hurt', 'violence'], weight: 10 },
            { type: 'doxxing', keywords: ['address', 'phone', 'real name', 'location'], weight: 9 },
            { type: 'sexual_harassment', keywords: ['sexual', 'body', 'inappropriate'], weight: 8 },
            { type: 'hate_speech', keywords: ['racist', 'homophobic', 'discrimination'], weight: 8 },
            { type: 'spam_flooding', pattern: 'repeated_messages', weight: 5 }
        ];
    }

    // Analyser toxicité d'un message
    async analyzeToxicity(messageText) {
        // Simulation NLP - remplacer par vraie API (Perspective API, Toxic-BERT)
        let score = 0;
        const flags = {
            contains_insults: false,
            contains_threats: false,
            contains_sexual_content: false,
            contains_racism: false,
            contains_doxxing: false,
            contains_spam: false
        };

        const lowerText = messageText.toLowerCase();
        
        // Détection patterns
        for (const pattern of this.harassmentPatterns) {
            if (pattern.keywords) {
                for (const keyword of pattern.keywords) {
                    if (lowerText.includes(keyword)) {
                        score += pattern.weight / 100;
                        
                        // Set flags
                        if (pattern.type === 'threats') flags.contains_threats = true;
                        if (pattern.type === 'doxxing') flags.contains_doxxing = true;
                        if (pattern.type === 'sexual_harassment') flags.contains_sexual_content = true;
                        if (pattern.type === 'hate_speech') flags.contains_racism = true;
                    }
                }
            }
        }

        const category = this.categorizeToxicity(Math.min(score, 1.0));
        
        return {
            toxicity_score: Math.min(score, 1.0),
            toxicity_category: category,
            ...flags
        };
    }

    categorizeToxicity(score) {
        if (score >= this.toxicityThresholds.extreme) return 'extreme';
        if (score >= this.toxicityThresholds.severe) return 'severe';
        if (score >= this.toxicityThresholds.moderate) return 'moderate';
        if (score >= this.toxicityThresholds.mild) return 'mild';
        return 'benign';
    }

    // Enregistrer message capturé avec analyse
    async captureMessage(sessionId, messageData) {
        const analysis = await this.analyzeToxicity(messageData.message_text);
        
        const messageRecord = {
            session_id: sessionId,
            tiktok_message_id: messageData.message_id,
            sender_user_id: messageData.sender_user_id,
            sender_username: messageData.sender_username,
            sender_nickname: messageData.sender_nickname,
            message_text: messageData.message_text,
            message_type: messageData.message_type || 'chat',
            sent_at: new Date(messageData.timestamp),
            ...analysis
        };

        // Insérer en base
        const connection = await this.getDbConnection();
        const [result] = await connection.execute(
            `INSERT INTO captured_messages SET ?`,
            messageRecord
        );

        // Si toxicité élevée, créer incident
        if (analysis.toxicity_score >= this.toxicityThresholds.severe) {
            await this.createHarassmentIncident(messageData.sender_user_id, sessionId, result.insertId, analysis);
        }

        await connection.end();
        return result.insertId;
    }

    // Créer incident de harcèlement
    async createHarassmentIncident(aggressorId, sessionId, messageId, analysis) {
        const connection = await this.getDbConnection();
        
        // Déterminer type d'incident
        let incidentType = 'verbal_abuse';
        if (analysis.contains_threats) incidentType = 'threats';
        if (analysis.contains_doxxing) incidentType = 'doxxing';
        if (analysis.contains_sexual_content) incidentType = 'sexual_harassment';
        if (analysis.contains_racism) incidentType = 'hate_speech';

        const incident = {
            aggressor_user_id: aggressorId,
            victim_user_id: await this.getSessionHost(sessionId),
            session_id: sessionId,
            incident_type: incidentType,
            severity: Math.ceil(analysis.toxicity_score * 10),
            related_messages: JSON.stringify([messageId]),
            evidence_count: 1,
            incident_start: new Date(),
            status: 'open'
        };

        const [result] = await connection.execute(
            `INSERT INTO harassment_incidents SET ?`,
            incident
        );

        // Créer alerte si critique
        if (analysis.toxicity_score >= this.toxicityThresholds.extreme) {
            await this.createRealTimeAlert(sessionId, [messageId], 'critical', 'Extreme toxicity detected');
        }

        await connection.end();
        return result.insertId;
    }

    // Générer rapport PDF
    async generateSuspectReport(suspectId) {
        const connection = await this.getDbConnection();
        
        // Récupérer données suspect
        const [suspectData] = await connection.execute(
            `CALL generate_suspect_dossier(?)`,
            [suspectId]
        );

        // Générer PDF (simulation)
        const reportPath = `./reports/suspect_${suspectId}_${Date.now()}.pdf`;
        const reportHash = crypto.createHash('sha256').update(JSON.stringify(suspectData)).digest('hex');

        const report = {
            suspect_ids: JSON.stringify([suspectId]),
            incident_ids: JSON.stringify(suspectData[1].map(i => i.incident_id)),
            pdf_file_path: reportPath,
            pdf_file_hash: reportHash,
            report_type: 'suspect_dossier',
            report_title: `Dossier Suspect #${suspectId}`,
            generated_by: 'AURA_SYSTEM'
        };

        await connection.execute(
            `INSERT INTO generated_reports SET ?`,
            report
        );

        await connection.end();
        return reportPath;
    }

    // Créer alerte temps réel
    async createRealTimeAlert(sessionId, messageIds, severity, message) {
        const connection = await this.getDbConnection();
        
        const alert = {
            trigger_type: 'high_toxicity_burst',
            session_id: sessionId,
            message_ids: JSON.stringify(messageIds),
            severity: severity,
            alert_message: message,
            manual_intervention_required: severity === 'critical'
        };

        await connection.execute(
            `INSERT INTO realtime_alerts SET ?`,
            alert
        );

        await connection.end();
    }

    // Utilitaires
    async getSessionHost(sessionId) {
        const connection = await this.getDbConnection();
        const [rows] = await connection.execute(
            `SELECT host_user_id FROM monitored_live_sessions WHERE session_id = ?`,
            [sessionId]
        );
        await connection.end();
        return rows[0]?.host_user_id || null;
    }

    async getDbConnection() {
        return mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'aura',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'aura_anti_harassment'
        });
    }
}

module.exports = AntiHarassmentEngine;