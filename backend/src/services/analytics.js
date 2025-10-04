import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export class AnalyticsService {
  
  // Analyse temporelle des commentaires
  static async getActivityHeatmap(sessionId) {
    const result = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM to_timestamp(timestamp/1000)) as hour,
        COUNT(*) as comment_count
      FROM comments 
      WHERE session_id = $1 
      GROUP BY hour 
      ORDER BY hour
    `, [sessionId]);
    
    return result.rows;
  }

  // Top mots utilisés
  static async getTopWords(sessionId, limit = 20) {
    const result = await pool.query(`
      SELECT 
        word,
        COUNT(*) as frequency
      FROM (
        SELECT unnest(string_to_array(lower(content), ' ')) as word
        FROM comments 
        WHERE session_id = $1 AND length(content) > 2
      ) words
      WHERE length(word) > 2
      GROUP BY word
      ORDER BY frequency DESC
      LIMIT $2
    `, [sessionId, limit]);
    
    return result.rows;
  }

  // Statistiques utilisateurs avancées
  static async getUserEngagement(sessionId) {
    const result = await pool.query(`
      SELECT 
        username,
        COUNT(*) as messages,
        AVG(length(content)) as avg_length,
        MIN(timestamp) as first_seen,
        MAX(timestamp) as last_seen,
        is_moderator,
        is_owner,
        follower_count
      FROM comments 
      WHERE session_id = $1 
      GROUP BY username, is_moderator, is_owner, follower_count
      ORDER BY messages DESC
    `, [sessionId]);
    
    return result.rows;
  }
}