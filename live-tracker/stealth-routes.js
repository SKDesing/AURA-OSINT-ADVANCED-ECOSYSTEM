/**
 * 🕵️ AURA STEALTH ROUTES - API Backend Pré-Affichage
 * Routes spécialisées pour interception furtive
 */

const express = require('express');
const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuration DB
const db = new Pool({
    user: process.env.DB_USER || 'aura_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'aura_investigations',
    password: process.env.DB_PASSWORD || 'aura_secure_2024',
    port: process.env.DB_PORT || 5432,
});

// 🚨 Route alerte pré-affichage
router.post('/pre-display-alert', async (req, res) => {
    try {
        const { analysis, raw_data, source_url, intercepted_at, pre_display_advantage_ms } = req.body;
        
        // Hash des données pour intégrité
        const dataHash = crypto.createHash('sha256')
            .update(JSON.stringify(raw_data))
            .digest('hex');
        
        // Stockage alerte critique
        const result = await db.query(`
            INSERT INTO forensic_logs (
                log_level, action, category, message, details, 
                user_ip, timestamp
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
        `, [
            'CRITICAL',
            'pre_display_alert',
            'stealth_interception',
            `Alerte pré-affichage: ${analysis.triggers.join(', ')}`,
            JSON.stringify({
                analysis,
                raw_data,
                source_url,
                intercepted_at,
                pre_display_advantage_ms,
                data_hash: dataHash
            }),
            req.ip
        ]);
        
        // Log forensique spécialisé
        console.log(`🚨 ALERTE PRÉ-AFFICHAGE [${analysis.alertLevel}]:`, {
            triggers: analysis.triggers,
            advantage_ms: pre_display_advantage_ms,
            hash: dataHash.substring(0, 8)
        });
        
        res.json({ 
            success: true, 
            alert_id: result.rows[0].id,
            hash: dataHash,
            stored_at: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Erreur alerte pré-affichage:', error);
        res.status(500).json({ error: error.message });
    }
});

// 💾 Route stockage pré-affichage
router.post('/pre-display-store', async (req, res) => {
    try {
        const { data, url, analysis, stored_at, advantage_ms, hash } = req.body;
        
        // Vérification hash intégrité
        const calculatedHash = crypto.createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
        
        if (hash && hash !== calculatedHash) {
            return res.status(400).json({ error: 'Hash integrity check failed' });
        }
        
        // Stockage données pré-affichage
        const result = await db.query(`
            INSERT INTO digital_evidence (
                evidence_type, file_name, file_hash, hash_algorithm,
                metadata, chain_of_custody, integrity_verified,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING id
        `, [
            'pre_display_data',
            `pre-display-${Date.now()}.json`,
            calculatedHash,
            'SHA256',
            JSON.stringify({
                source_url: url,
                analysis,
                advantage_ms,
                extraction_method: 'stealth_pre_display'
            }),
            JSON.stringify([{
                action: 'intercepted_pre_display',
                timestamp: stored_at,
                agent: 'aura_stealth_extractor',
                integrity_hash: calculatedHash
            }]),
            true
        ]);
        
        // Stockage fichier physique
        const evidenceDir = path.join(__dirname, '../evidence/pre-display');
        if (!fs.existsSync(evidenceDir)) {
            fs.mkdirSync(evidenceDir, { recursive: true });
        }
        
        const filename = `pre-display-${result.rows[0].id}-${Date.now()}.json`;
        const filepath = path.join(evidenceDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify({
            evidence_id: result.rows[0].id,
            intercepted_data: data,
            metadata: {
                url, analysis, advantage_ms, stored_at,
                hash: calculatedHash
            }
        }, null, 2));
        
        res.json({ 
            success: true, 
            evidence_id: result.rows[0].id,
            filepath: filename,
            hash: calculatedHash
        });
        
    } catch (error) {
        console.error('Erreur stockage pré-affichage:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🚀 Route démarrage session stealth
router.post('/start-session', async (req, res) => {
    try {
        const { url, title, timestamp, user_agent, capture_type } = req.body;
        
        // Création session forensique
        const sessionId = crypto.randomUUID();
        
        const result = await db.query(`
            INSERT INTO live_sessions (
                id, live_url, title, start_timestamp, 
                status, hash_session
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [
            sessionId,
            url,
            title || 'TikTok Live Stealth Session',
            new Date(timestamp),
            'stealth_active',
            crypto.createHash('sha256').update(sessionId + timestamp).digest('hex')
        ]);
        
        // Log démarrage session
        await db.query(`
            INSERT INTO forensic_logs (
                log_level, action, category, message, details, timestamp
            ) VALUES ($1, $2, $3, $4, $5, NOW())
        `, [
            'INFO',
            'start_stealth_session',
            'session_management',
            `Session stealth démarrée: ${url}`,
            JSON.stringify({
                session_id: sessionId,
                capture_type,
                user_agent,
                stealth_mode: true
            })
        ]);
        
        console.log(`🚀 SESSION STEALTH DÉMARRÉE:`, {
            session_id: sessionId,
            url: url,
            capture_type
        });
        
        res.json({ 
            success: true, 
            session_id: sessionId,
            session: result.rows[0]
        });
        
    } catch (error) {
        console.error('Erreur démarrage session:', error);
        res.status(500).json({ error: error.message });
    }
});

// 📹 Route upload vidéo forensique
router.post('/upload-video', async (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!req.files || !req.files.video) {
            return res.status(400).json({ error: 'Aucune vidéo fournie' });
        }
        
        const videoFile = req.files.video;
        const videoHash = crypto.createHash('sha256')
            .update(videoFile.data)
            .digest('hex');
        
        // Stockage vidéo
        const videoDir = path.join(__dirname, '../evidence/videos');
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
        }
        
        const filename = `stealth-${session_id}-${Date.now()}.webm`;
        const filepath = path.join(videoDir, filename);
        
        fs.writeFileSync(filepath, videoFile.data);
        
        // Enregistrement base de données
        const result = await db.query(`
            INSERT INTO digital_evidence (
                session_id, evidence_type, file_path, file_name,
                file_size, file_hash, hash_algorithm, mime_type,
                metadata, chain_of_custody, integrity_verified,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            RETURNING id
        `, [
            session_id,
            'stealth_video',
            filepath,
            filename,
            videoFile.data.length,
            videoHash,
            'SHA256',
            'video/webm',
            JSON.stringify({
                capture_method: 'stealth_screen_recording',
                original_name: videoFile.name,
                upload_timestamp: new Date().toISOString()
            }),
            JSON.stringify([{
                action: 'video_uploaded',
                timestamp: new Date().toISOString(),
                agent: 'aura_stealth_system',
                file_hash: videoHash
            }]),
            true
        ]);
        
        console.log(`📹 VIDÉO STEALTH UPLOADÉE:`, {
            evidence_id: result.rows[0].id,
            filename,
            size: videoFile.data.length,
            hash: videoHash.substring(0, 8)
        });
        
        res.json({ 
            success: true, 
            evidence_id: result.rows[0].id,
            filename,
            hash: videoHash
        });
        
    } catch (error) {
        console.error('Erreur upload vidéo:', error);
        res.status(500).json({ error: error.message });
    }
});

// 📊 Route statistiques stealth
router.get('/stats', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                COUNT(*) FILTER (WHERE action = 'pre_display_alert') as pre_display_alerts,
                COUNT(*) FILTER (WHERE action = 'start_stealth_session') as stealth_sessions,
                COUNT(*) FILTER (WHERE evidence_type = 'pre_display_data') as pre_display_evidence,
                COUNT(*) FILTER (WHERE evidence_type = 'stealth_video') as stealth_videos
            FROM forensic_logs fl
            FULL OUTER JOIN digital_evidence de ON true
            WHERE fl.timestamp >= NOW() - INTERVAL '24 hours'
               OR de.created_at >= NOW() - INTERVAL '24 hours'
        `);
        
        res.json({
            success: true,
            stats: stats.rows[0],
            period: '24h',
            generated_at: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Erreur stats stealth:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;