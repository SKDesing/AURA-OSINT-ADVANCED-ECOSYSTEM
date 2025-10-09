const { pool } = require('../config/database');

const osintController = {
  async search(req, res) {
    try {
      const { query, platforms = ['all'] } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Query required' });
      }

      const sql = `
        SELECT * FROM profiles 
        WHERE ($1 = ANY($2) OR 'all' = ANY($2))
        AND (username ILIKE $3 OR data::text ILIKE $3)
        LIMIT 100
      `;
      
      const result = await pool.query(sql, [platforms[0], platforms, `%${query}%`]);
      
      res.json({
        success: true,
        results: result.rows,
        count: result.rowCount
      });
      
    } catch (error) {
      console.error('OSINT search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  },

  async analyze(req, res) {
    try {
      const { profileId } = req.params;
      
      // Simulation analyse forensique
      const analysis = {
        profileId,
        riskScore: Math.random() * 100,
        threats: ['suspicious_activity', 'fake_profile'],
        confidence: 0.85,
        timestamp: new Date().toISOString()
      };
      
      res.json({ success: true, analysis });
      
    } catch (error) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }
};

module.exports = osintController;