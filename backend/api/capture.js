// ============================================
// 🎯 AURA OSINT - API CAPTURE ENDPOINT
// ============================================
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aura_tiktok_streams',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20
});

// ============================================
// POST /api/capture/live/start
// ============================================
router.post('/live/start', async (req, res) => {
    try {
        const {
            tiktok_live_id,
            creator_username,
            creator_display_name,
            title,
            started_at
        } = req.body;

        const result = await pool.query(`
            INSERT INTO live_sessions (
                session_id,
                target_username,
                title,
                started_at,
                status
            ) VALUES ($1, $2, $3, $4, 'active')
            ON CONFLICT (session_id) DO UPDATE
            SET status = 'active'
            RETURNING id
        `, [tiktok_live_id, creator_username, title, started_at]);

        res.json({
            success: true,
            live_id: result.rows[0].id,
            message: 'Live session créée'
        });

    } catch (error) {
        console.error('Erreur /live/start:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// POST /api/capture/batch
// ============================================
router.post('/batch', async (req, res) => {
    try {
        const { live_id, comments } = req.body;

        if (!live_id || !comments?.length) {
            return res.status(400).json({ error: 'Invalid batch' });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Insert comments en batch
            const values = comments.map(c => [
                live_id,
                c.user_tiktok_id,
                c.user_username,
                c.text,
                c.timestamp,
                c.sequence
            ]);

            const query = `
                INSERT INTO chat_messages (
                    session_id, user_id, username, message_text, 
                    timestamp_live, message_hash
                ) VALUES ${values.map((_, i) => 
                    `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
                ).join(', ')}
            `;

            const flatValues = values.flat();
            await client.query(query, flatValues);

            // Update session stats
            await client.query(`
                UPDATE live_sessions
                SET total_messages = total_messages + $1
                WHERE session_id = $2
            `, [comments.length, live_id]);

            await client.query('COMMIT');

            res.json({
                success: true,
                inserted: comments.length
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Erreur /batch:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;