const knex = require('knex');

class QuerySanitizer {
  constructor(dbConfig) {
    this.db = knex({
      client: 'postgresql',
      connection: dbConfig,
      pool: { min: 2, max: 10 }
    });
    
    // Requêtes prédéfinies sécurisées
    this.allowedQueries = {
      'profiles_summary': 'SELECT username, platform, risk_level, created_at FROM profils_tiktok ORDER BY created_at DESC LIMIT ?',
      'profiles_by_platform': 'SELECT * FROM profils_tiktok WHERE platform = ? LIMIT ?',
      'high_risk_profiles': 'SELECT * FROM profils_tiktok WHERE risk_level IN (?, ?) ORDER BY created_at DESC LIMIT ?',
      'recent_sessions': 'SELECT * FROM live_sessions WHERE created_at >= ? ORDER BY created_at DESC LIMIT ?',
      'user_activity': 'SELECT COUNT(*) as total, platform FROM profils_tiktok GROUP BY platform',
      'evidence_chain': 'SELECT * FROM evidence_chain WHERE profile_id = ? ORDER BY created_at DESC'
    };
  }

  // Exécution de requêtes prédéfinies uniquement
  async executeQuery(queryName, params = []) {
    if (!this.allowedQueries[queryName]) {
      throw new Error(`Requête non autorisée: ${queryName}`);
    }

    try {
      const query = this.allowedQueries[queryName];
      const result = await this.db.raw(query, params);
      
      return {
        success: true,
        data: result.rows,
        rowCount: result.rowCount
      };
    } catch (error) {
      console.error('Erreur requête DB:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Construction sécurisée de requêtes avec Query Builder
  async buildSecureQuery(table, filters = {}) {
    try {
      let query = this.db(table);

      // Filtres sécurisés
      if (filters.platform) {
        query = query.where('platform', filters.platform);
      }
      
      if (filters.riskLevel) {
        query = query.where('risk_level', filters.riskLevel);
      }
      
      if (filters.status) {
        query = query.where('status', filters.status);
      }
      
      if (filters.dateFrom) {
        query = query.where('created_at', '>=', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query = query.where('created_at', '<=', filters.dateTo);
      }

      // Pagination sécurisée
      const limit = Math.min(filters.limit || 20, 100);
      const offset = filters.offset || 0;
      
      query = query.limit(limit).offset(offset);

      const result = await query;
      
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      console.error('Erreur query builder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validation des noms de tables
  isValidTable(tableName) {
    const allowedTables = [
      'profils_tiktok',
      'identites',
      'live_sessions',
      'messages_live',
      'entreprises',
      'agences',
      'audit_trail',
      'evidence_chain'
    ];
    
    return allowedTables.includes(tableName);
  }

  // Obtenir la structure d'une table
  async getTableStructure(tableName) {
    if (!this.isValidTable(tableName)) {
      throw new Error(`Table non autorisée: ${tableName}`);
    }

    try {
      const columns = await this.db(tableName).columnInfo();
      return {
        success: true,
        columns: Object.keys(columns),
        structure: columns
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async close() {
    await this.db.destroy();
  }
}

module.exports = QuerySanitizer;