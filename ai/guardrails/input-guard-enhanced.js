/**
 * AURA OSINT Enhanced Input Guard
 * Advanced input validation with OSINT-specific patterns
 */

const crypto = require('crypto');

class EnhancedInputGuard {
  constructor() {
    this.maxChars = parseInt(process.env.AI_MAX_INPUT_CHARS || '6000');
    this.forensicMaxChars = parseInt(process.env.AI_FORENSIC_MAX_CHARS || '12000');
    
    // OSINT-specific blocked patterns
    this.blockedPatterns = [
      'ignore previous',
      'system override', 
      'exfiltrate',
      'delete all data',
      'bypass platform detection',
      'scrape private content',
      'extract user data',
      'dump database',
      'admin access',
      'root privileges'
    ];
    
    // PII patterns for detection
    this.piiPatterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone_fr: /\b(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}\b/g,
      phone_us: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      coordinates: /\b-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+\b/g
    };
  }

  validate(text, context = {}) {
    const result = {
      blocked: false,
      reason: null,
      sanitized: text,
      piiDetected: [],
      riskScore: 0,
      metadata: {
        length: text.length,
        wordCount: text.split(/\s+/).length,
        language: this.detectLanguage(text),
        timestamp: new Date().toISOString()
      }
    };

    // Basic validation
    if (!text || text.trim().length === 0) {
      result.blocked = true;
      result.reason = 'Empty input';
      return result;
    }

    // Length validation (context-aware)
    const maxLength = context.forensic ? this.forensicMaxChars : this.maxChars;
    if (text.length > maxLength) {
      result.blocked = true;
      result.reason = `Input too long (${text.length} > ${maxLength})`;
      return result;
    }

    // Control characters check
    const controlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
    if (controlChars.test(text)) {
      result.blocked = true;
      result.reason = 'Control characters detected';
      return result;
    }

    // Blocked patterns check
    const lowerText = text.toLowerCase();
    for (const pattern of this.blockedPatterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        result.blocked = true;
        result.reason = `Blocked pattern detected: ${pattern}`;
        result.riskScore = 10;
        return result;
      }
    }

    // PII detection
    result.piiDetected = this.detectPII(text);
    if (result.piiDetected.length > 0) {
      result.riskScore += result.piiDetected.length * 2;
    }

    // OSINT context validation
    if (context.platform) {
      const platformRisk = this.assessPlatformRisk(text, context.platform);
      result.riskScore += platformRisk;
    }

    // Sanitization
    result.sanitized = this.sanitize(text);

    return result;
  }

  detectPII(text) {
    const detected = [];
    
    for (const [type, pattern] of Object.entries(this.piiPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        detected.push({
          type,
          count: matches.length,
          examples: matches.slice(0, 2) // Only first 2 for privacy
        });
      }
    }
    
    return detected;
  }

  detectLanguage(text) {
    // Simple heuristic language detection
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const arabicChars = (text.match(/[\u0600-\u06ff]/g) || []).length;
    const cyrillicChars = (text.match(/[\u0400-\u04ff]/g) || []).length;
    
    const totalChars = text.length;
    
    if (chineseChars / totalChars > 0.3) return 'zh';
    if (arabicChars / totalChars > 0.3) return 'ar';
    if (cyrillicChars / totalChars > 0.3) return 'ru';
    
    // French vs English heuristic
    const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'je', 'tu', 'il', 'elle'];
    const frenchCount = frenchWords.reduce((count, word) => {
      return count + (text.toLowerCase().split(/\s+/).filter(w => w === word).length);
    }, 0);
    
    if (frenchCount > 2) return 'fr';
    return 'en'; // Default to English
  }

  assessPlatformRisk(text, platform) {
    let risk = 0;
    
    // Platform-specific risk patterns
    const platformPatterns = {
      tiktok: ['live stream', 'follow me', 'duet', 'fyp'],
      facebook: ['friend request', 'message me', 'add me'],
      instagram: ['dm me', 'story', 'reel', 'follow back'],
      twitter: ['retweet', 'follow', 'dm', 'thread']
    };
    
    const patterns = platformPatterns[platform.toLowerCase()] || [];
    const lowerText = text.toLowerCase();
    
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        risk += 1;
      }
    }
    
    return Math.min(risk, 5); // Cap at 5
  }

  sanitize(text) {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
      .trim()
      .substring(0, this.maxChars);
  }

  generateHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

module.exports = EnhancedInputGuard;