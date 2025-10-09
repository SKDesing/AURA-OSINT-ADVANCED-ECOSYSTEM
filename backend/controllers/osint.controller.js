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
      
      // Analyse OSINT réelle
      const profile = await pool.query('SELECT * FROM profiles WHERE id = $1', [profileId]);
      
      let riskScore = 0;
      let threats = [];
      let confidence = 0.5;
      
      if (profile.rows.length > 0) {
        const data = profile.rows[0];
        
        // Scoring basé sur des critères réels
        if (data.username && data.username.length < 3) riskScore += 20;
        if (data.created_at && new Date(data.created_at) > new Date(Date.now() - 30*24*60*60*1000)) riskScore += 15;
        if (!data.verified) riskScore += 25;
        
        // Détection de menaces
        if (riskScore > 40) threats.push('suspicious_activity');
        if (riskScore > 60) threats.push('fake_profile');
        if (data.username && /[0-9]{4,}/.test(data.username)) threats.push('bot_pattern');
        
        confidence = Math.min(0.95, 0.5 + (riskScore / 200));
      }
      
      const analysis = {
        profileId,
        riskScore: Math.min(100, riskScore),
        threats,
        confidence,
        timestamp: new Date().toISOString(),
        criteria: {
          username_length: data?.username?.length || 0,
          account_age_days: data?.created_at ? Math.floor((Date.now() - new Date(data.created_at)) / (24*60*60*1000)) : 0,
          verified: data?.verified || false
        }
      };
      
      res.json({ success: true, analysis });
      
    } catch (error) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }
};

module.exports = osintController;