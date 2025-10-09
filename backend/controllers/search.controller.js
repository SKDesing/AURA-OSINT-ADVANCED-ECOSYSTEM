const { pool } = require('../config/database');
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many search requests, please try again later.'
});

const searchController = {
  async search(req, res) {
    try {
      const { q, type = 'all', limit = 50 } = req.body;
      
      if (!q || typeof q !== 'string' || q.length > 500) {
        return res.status(400).json({ error: 'Invalid search query' });
      }

      const query = `
        SELECT id, username, platform, data, created_at 
        FROM profiles 
        WHERE ($1 = 'all' OR platform = $1) 
        AND (username ILIKE $2 OR data::text ILIKE $2)
        ORDER BY created_at DESC 
        LIMIT $3
      `;
      
      const values = [type, `%${q}%`, Math.min(limit, 100)];
      const result = await pool.query(query, values);
      
      res.json({
        success: true,
        results: result.rows,
        count: result.rowCount
      });
      
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = { searchController, searchLimiter };