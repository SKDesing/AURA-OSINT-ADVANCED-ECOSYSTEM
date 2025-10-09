const { Pool } = require('pg');
const EventEmitter = require('eventemitter3');
const { spawn } = require('child_process');
const path = require('path');

class OSINTIntelligenceEngine extends EventEmitter {
  constructor(config) {
    super();
    this.pool = new Pool(config.database);
    this.toolsPath = config.toolsPath || '/app/osint-tools';
    this.cache = new Map();
  }

  async searchUsername(username, platforms = ['all']) {
    const cacheKey = `username_${username}_${platforms.join(',')}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const results = await this.runSherlock(username, platforms);
    this.cache.set(cacheKey, results);
    
    await this.storeResults('username_search', { username, platforms, results });
    this.emit('search:completed', { type: 'username', target: username, results });
    
    return results;
  }

  async runSherlock(username, platforms) {
    return new Promise((resolve, reject) => {
      const sherlockPath = path.join(this.toolsPath, 'sherlock', 'sherlock.py');
      const args = ['--json', '--print-found', username];
      
      if (platforms.length > 0 && !platforms.includes('all')) {
        args.push('--site', platforms.join(','));
      }

      const process = spawn('python3', [sherlockPath, ...args]);
      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output);
            resolve(this.formatSherlockResults(results));
          } catch (e) {
            resolve({ found: [], error: 'Parse error' });
          }
        } else {
          reject(new Error(error));
        }
      });
    });
  }

  async harvestEmails(domain) {
    return new Promise((resolve, reject) => {
      const harvesterPath = path.join(this.toolsPath, 'theHarvester', 'theHarvester.py');
      const args = ['-d', domain, '-b', 'google,bing,duckduckgo', '-f', 'json'];

      const process = spawn('python3', [harvesterPath, ...args]);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output);
            resolve(this.formatHarvesterResults(results));
          } catch (e) {
            resolve({ emails: [], hosts: [], error: 'Parse error' });
          }
        } else {
          reject(new Error('Harvester failed'));
        }
      });
    });
  }

  async analyzeMetadata(filePath) {
    return new Promise((resolve, reject) => {
      const exiftoolPath = path.join(this.toolsPath, 'exiftool', 'exiftool');
      const args = ['-json', '-all', filePath];

      const process = spawn(exiftoolPath, args);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output);
            resolve(this.formatExifResults(results[0]));
          } catch (e) {
            resolve({ metadata: {}, error: 'Parse error' });
          }
        } else {
          reject(new Error('ExifTool failed'));
        }
      });
    });
  }

  async correlateIdentities(identities) {
    const correlations = [];
    
    for (let i = 0; i < identities.length; i++) {
      for (let j = i + 1; j < identities.length; j++) {
        const score = this.calculateCorrelationScore(identities[i], identities[j]);
        if (score > 0.7) {
          correlations.push({
            identity1: identities[i],
            identity2: identities[j],
            score,
            evidence: this.extractEvidence(identities[i], identities[j])
          });
        }
      }
    }

    return correlations.sort((a, b) => b.score - a.score);
  }

  calculateCorrelationScore(id1, id2) {
    let score = 0;
    
    // Username similarity
    if (id1.username && id2.username) {
      const similarity = this.stringSimilarity(id1.username, id2.username);
      score += similarity * 0.3;
    }
    
    // Email domain matching
    if (id1.email && id2.email) {
      const domain1 = id1.email.split('@')[1];
      const domain2 = id2.email.split('@')[1];
      if (domain1 === domain2) score += 0.2;
    }
    
    // Bio/description similarity
    if (id1.bio && id2.bio) {
      const bioSim = this.stringSimilarity(id1.bio, id2.bio);
      score += bioSim * 0.25;
    }
    
    // Profile picture similarity (placeholder)
    if (id1.avatar && id2.avatar) {
      score += 0.15; // Would use image comparison
    }
    
    // Activity patterns
    if (id1.activity_hours && id2.activity_hours) {
      const overlap = this.calculateTimeOverlap(id1.activity_hours, id2.activity_hours);
      score += overlap * 0.1;
    }

    return Math.min(score, 1.0);
  }

  stringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async storeResults(type, data) {
    const query = `
      INSERT INTO osint_results (type, target, data, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;
    
    try {
      const result = await this.pool.query(query, [
        type,
        data.username || data.domain || data.target,
        JSON.stringify(data)
      ]);
      return result.rows[0].id;
    } catch (error) {
      console.error('Failed to store OSINT results:', error);
      return null;
    }
  }

  formatSherlockResults(results) {
    return {
      found: Object.entries(results)
        .filter(([site, data]) => data.status === 'Claimed')
        .map(([site, data]) => ({
          platform: site,
          url: data.url_main,
          status: 'found',
          response_time: data.response_time_s
        })),
      total_found: Object.values(results).filter(r => r.status === 'Claimed').length,
      timestamp: new Date().toISOString()
    };
  }

  formatHarvesterResults(results) {
    return {
      emails: results.emails || [],
      hosts: results.hosts || [],
      ips: results.ips || [],
      urls: results.urls || [],
      timestamp: new Date().toISOString()
    };
  }

  formatExifResults(metadata) {
    return {
      camera: metadata.Make || null,
      model: metadata.Model || null,
      gps: {
        latitude: metadata.GPSLatitude || null,
        longitude: metadata.GPSLongitude || null
      },
      datetime: metadata.DateTime || null,
      software: metadata.Software || null,
      timestamp: new Date().toISOString()
    };
  }

  extractEvidence(id1, id2) {
    const evidence = [];
    
    if (id1.username && id2.username) {
      const sim = this.stringSimilarity(id1.username, id2.username);
      if (sim > 0.8) {
        evidence.push(`Username similarity: ${(sim * 100).toFixed(1)}%`);
      }
    }
    
    if (id1.email && id2.email) {
      const domain1 = id1.email.split('@')[1];
      const domain2 = id2.email.split('@')[1];
      if (domain1 === domain2) {
        evidence.push(`Same email domain: ${domain1}`);
      }
    }
    
    return evidence;
  }

  calculateTimeOverlap(hours1, hours2) {
    const overlap = hours1.filter(h => hours2.includes(h));
    return overlap.length / Math.max(hours1.length, hours2.length);
  }

  async getSystemStats() {
    try {
      const result = await this.pool.query(`
        SELECT 
          COUNT(*) as total_searches,
          COUNT(DISTINCT target) as unique_targets,
          type,
          COUNT(*) as count_by_type
        FROM osint_results 
        WHERE created_at > NOW() - INTERVAL '24 hours'
        GROUP BY type
      `);
      
      return {
        cache_size: this.cache.size,
        recent_searches: result.rows,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        cache_size: this.cache.size,
        recent_searches: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = OSINTIntelligenceEngine;