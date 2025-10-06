/**
 * 🛣️ API ROUTES COMPLÈTES
 * Routes complètes pour communication Frontend-Backend
 */

const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuration DB
const db = new Pool({
    user: process.env.DB_USER || 'aura_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'aura_investigations',
    password: process.env.DB_PASSWORD || 'aura_secure_2024',
    port: process.env.DB_PORT || 5432,
});

// 📊 ROUTES SESSIONS LIVE
router.get('/sessions', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT s.*, 
                   COUNT(DISTINCT c.id) as comment_count,
                   COUNT(DISTINCT g.id) as gift_count
            FROM live_sessions s
            LEFT JOIN live_commentaires c ON s.id = c.session_id
            LEFT JOIN live_cadeaux g ON s.id = g.session_id
            GROUP BY s.id
            ORDER BY s.start_timestamp DESC
            LIMIT 50
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/sessions', async (req, res) => {
    try {
        const { live_url, title, streamer_username } = req.body;
        const result = await db.query(`
            INSERT INTO live_sessions (live_url, title, streamer_username)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [live_url, title, streamer_username]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sessions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const session = await db.query('SELECT * FROM live_sessions WHERE id = $1', [id]);
        const comments = await db.query('SELECT * FROM live_commentaires WHERE session_id = $1 ORDER BY timestamp DESC', [id]);
        const gifts = await db.query('SELECT * FROM live_cadeaux WHERE session_id = $1 ORDER BY timestamp DESC', [id]);
        
        res.json({
            session: session.rows[0],
            comments: comments.rows,
            gifts: gifts.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 💬 ROUTES COMMENTAIRES
router.get('/comments', async (req, res) => {
    try {
        const { session_id, flagged, limit = 100 } = req.query;
        let query = 'SELECT * FROM live_commentaires';
        let params = [];
        let conditions = [];

        if (session_id) {
            conditions.push('session_id = $' + (params.length + 1));
            params.push(session_id);
        }

        if (flagged !== undefined) {
            conditions.push('flagged = $' + (params.length + 1));
            params.push(flagged === 'true');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/comments/flag', async (req, res) => {
    try {
        const { comment_id, reason } = req.body;
        await db.query('UPDATE live_commentaires SET flagged = true WHERE id = $1', [comment_id]);
        
        // Ajouter à la table flagged_content
        const comment = await db.query('SELECT * FROM live_commentaires WHERE id = $1', [comment_id]);
        if (comment.rows.length > 0) {
            const c = comment.rows[0];
            await db.query(`
                INSERT INTO flagged_content (session_id, username, message, flag_reason, timestamp)
                VALUES ($1, $2, $3, $4, $5)
            `, [c.session_id, c.username, c.message, reason, c.timestamp]);
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🎁 ROUTES CADEAUX
router.get('/gifts', async (req, res) => {
    try {
        const { session_id, limit = 100 } = req.query;
        let query = 'SELECT * FROM live_cadeaux';
        let params = [];

        if (session_id) {
            query += ' WHERE session_id = $1';
            params.push(session_id);
        }

        query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 👤 ROUTES PROFILS
router.get('/profiles', async (req, res) => {
    try {
        const { search, limit = 50 } = req.query;
        let query = 'SELECT * FROM profils_tiktok';
        let params = [];

        if (search) {
            query += ' WHERE unique_id ILIKE $1 OR nom_affiche ILIKE $1';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY updated_at DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/profiles', async (req, res) => {
    try {
        const profile = req.body;
        const result = await db.query(`
            INSERT INTO profils_tiktok (
                unique_id, user_id, nom_affiche, bio, verifie,
                follower_count, following_count, video_count, heart_count,
                url_photo_profil, hash_preuve, methode_collecte
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (unique_id) DO UPDATE SET
                nom_affiche = EXCLUDED.nom_affiche,
                bio = EXCLUDED.bio,
                follower_count = EXCLUDED.follower_count,
                following_count = EXCLUDED.following_count,
                video_count = EXCLUDED.video_count,
                heart_count = EXCLUDED.heart_count,
                updated_at = NOW()
            RETURNING *
        `, [
            profile.unique_id, profile.user_id, profile.nom_affiche, profile.bio,
            profile.verifie, profile.follower_count, profile.following_count,
            profile.video_count, profile.heart_count, profile.url_photo_profil,
            profile.hash_preuve, profile.methode_collecte || 'manual'
        ]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚨 ROUTES CONTENU SIGNALÉ
router.get('/flagged', async (req, res) => {
    try {
        const { reviewed, limit = 50 } = req.query;
        let query = 'SELECT * FROM flagged_content';
        let params = [];

        if (reviewed !== undefined) {
            query += ' WHERE reviewed = $1';
            params.push(reviewed === 'true');
        }

        query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📊 ROUTES STATISTIQUES
router.get('/stats', async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM live_sessions) as total_sessions,
                (SELECT COUNT(*) FROM live_sessions WHERE status = 'active') as active_sessions,
                (SELECT COUNT(*) FROM live_commentaires) as total_comments,
                (SELECT COUNT(*) FROM live_commentaires WHERE flagged = true) as flagged_comments,
                (SELECT COUNT(*) FROM live_cadeaux) as total_gifts,
                (SELECT COUNT(*) FROM profils_tiktok) as total_profiles,
                (SELECT COUNT(*) FROM flagged_content WHERE reviewed = false) as pending_reviews
        `);
        res.json(stats.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔍 ROUTES RECHERCHE
router.get('/search', async (req, res) => {
    try {
        const { q, type = 'all', limit = 20 } = req.query;
        const results = {};

        if (type === 'all' || type === 'comments') {
            const comments = await db.query(`
                SELECT * FROM live_commentaires 
                WHERE message ILIKE $1 OR username ILIKE $1
                ORDER BY timestamp DESC LIMIT $2
            `, [`%${q}%`, limit]);
            results.comments = comments.rows;
        }

        if (type === 'all' || type === 'profiles') {
            const profiles = await db.query(`
                SELECT * FROM profils_tiktok 
                WHERE unique_id ILIKE $1 OR nom_affiche ILIKE $1 OR bio ILIKE $1
                ORDER BY updated_at DESC LIMIT $2
            `, [`%${q}%`, limit]);
            results.profiles = profiles.rows;
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📝 ROUTES LOGS
router.get('/logs', async (req, res) => {
    try {
        const { level, category, limit = 100 } = req.query;
        let query = 'SELECT * FROM forensic_logs';
        let params = [];
        let conditions = [];

        if (level) {
            conditions.push('log_level = $' + (params.length + 1));
            params.push(level);
        }

        if (category) {
            conditions.push('category = $' + (params.length + 1));
            params.push(category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit));

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;