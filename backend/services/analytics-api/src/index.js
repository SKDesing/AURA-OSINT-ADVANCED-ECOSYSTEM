const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const osintRoutes = require('./osint-routes');

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// OSINT Intelligence Engine routes
app.use('/api/osint', osintRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'running', services: ['database', 'api'] });
});

app.get('/api/streams/active', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        stream_id,
        room_id,
        streamer_username,
        current_viewers,
        peak_viewers,
        total_comments as total_messages,
        total_gifts,
        revenue_estimate as total_revenue,
        status
      FROM fortress_live_streams 
      WHERE status = 'live'
      ORDER BY current_viewers DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analytics/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    const result = await pool.query(`
      SELECT u.*, COUNT(s.stream_id) as stream_count
      FROM fortress_users u
      LEFT JOIN fortress_live_streams s ON u.user_id = s.streamer_user_id
      WHERE u.username ILIKE $1 OR u.display_name ILIKE $1
      GROUP BY u.user_id
      LIMIT 50
    `, [`%${query}%`]);
    
    res.json({
      matches: result.rows,
      correlation_score: 0.95,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🔌 Analytics API running on port ${port}`);
});