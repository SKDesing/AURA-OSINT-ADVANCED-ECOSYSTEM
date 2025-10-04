import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Export JSON
router.get('/sessions/:id/export/json', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
    const comments = await pool.query('SELECT * FROM comments WHERE session_id = $1 ORDER BY timestamp', [id]);
    
    const exportData = {
      session: session.rows[0],
      comments: comments.rows,
      stats: {
        total_comments: comments.rows.length,
        unique_users: [...new Set(comments.rows.map(c => c.username))].length,
        moderators: comments.rows.filter(c => c.is_moderator).length,
        owners: comments.rows.filter(c => c.is_owner).length
      }
    };
    
    res.setHeader('Content-Disposition', `attachment; filename="session-${id}-export.json"`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export CSV
router.get('/sessions/:id/export/csv', async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await pool.query('SELECT * FROM comments WHERE session_id = $1 ORDER BY timestamp', [id]);
    
    const csvHeader = 'timestamp,username,content,is_moderator,is_owner,is_vip,follower_count\n';
    const csvRows = comments.rows.map(c => 
      `${c.timestamp},"${c.username}","${c.content.replace(/"/g, '""')}",${c.is_moderator},${c.is_owner},${c.is_vip},${c.follower_count || 0}`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="session-${id}-comments.csv"`);
    res.send(csvHeader + csvRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User cards
router.get('/sessions/:id/users', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        username,
        unique_id,
        COUNT(*) as comment_count,
        MAX(is_moderator) as is_moderator,
        MAX(is_owner) as is_owner,
        MAX(is_vip) as is_vip,
        MAX(follower_count) as follower_count,
        MAX(avatar_url) as avatar_url,
        MIN(timestamp) as first_comment,
        MAX(timestamp) as last_comment
      FROM comments 
      WHERE session_id = $1 
      GROUP BY username, unique_id
      ORDER BY comment_count DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;