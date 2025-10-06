const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');
const { format } = require('pg-format');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Chiffrement AES-256-GCM sécurisé (corrigé)
const encrypt = (text) => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipherGCM(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

const decrypt = (encryptedData) => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  const decipher = crypto.createDecipherGCM(algorithm, key, Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Sanitisation anti-XSS/SQLi
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }
  return input;
};

const sanitizeQuery = (query, params) => {
  return format(query, params);
};

// Double logging forensique
const forensicLogger = {
  evidence: (action, data) => {
    const timestamp = new Date().toISOString();
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify({ action, data, timestamp }))
      .digest('hex');
    
    // Log évidence (inviolable)
    const evidenceLog = {
      timestamp,
      action,
      hash,
      data: encrypt(JSON.stringify(data))
    };
    
    // Log système (opérationnel)
    const systemLog = {
      timestamp,
      level: 'INFO',
      action,
      summary: `Action ${action} executed`
    };
    
    return { evidenceLog, systemLog, hash };
  }
};

// JWT offline pour USB
const generateOfflineJWT = (payload, usbKey) => {
  const secret = crypto.createHash('sha256')
    .update(usbKey + process.env.JWT_SECRET)
    .digest('hex');
  
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Anti-brute force avancé
const advancedRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req) => {
    if (req.user?.role === 'admin') return 1000;
    if (req.user?.role === 'analyst') return 500;
    return 100;
  },
  skip: (req) => req.ip === '127.0.0.1',
  onLimitReached: (req) => {
    forensicLogger.evidence('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });
  }
});

// Détection d'attaques
const attackDetection = (req, res, next) => {
  const suspicious = [
    /<script/i,
    /union.*select/i,
    /\.\.\/\.\.\//,
    /exec\(/i,
    /eval\(/i
  ];
  
  const payload = JSON.stringify(req.body) + req.url + JSON.stringify(req.query);
  
  for (const pattern of suspicious) {
    if (pattern.test(payload)) {
      forensicLogger.evidence('ATTACK_DETECTED', {
        type: pattern.source,
        ip: req.ip,
        payload: payload.substring(0, 500)
      });
      
      return res.status(400).json({ error: 'Malicious request detected' });
    }
  }
  
  next();
};

// Watchdog système
const systemWatchdog = {
  checkSecrets: () => {
    const { execSync } = require('child_process');
    try {
      const result = execSync('grep -r "password.*:" . --exclude-dir=.git --exclude-dir=node_modules | grep -v ".env"', { encoding: 'utf8' });
      if (result.trim()) {
        return { status: 'FAIL', details: 'Secrets found in code' };
      }
    } catch (e) {
      // No secrets found (grep returns 1 when no match)
    }
    return { status: 'PASS' };
  },
  
  checkPermissions: () => {
    const fs = require('fs');
    try {
      const stats = fs.statSync('.env');
      const perms = (stats.mode & parseInt('777', 8)).toString(8);
      if (perms !== '600') {
        return { status: 'FAIL', details: `Wrong .env permissions: ${perms}` };
      }
    } catch (e) {
      return { status: 'FAIL', details: '.env file not found' };
    }
    return { status: 'PASS' };
  },
  
  runAll: () => {
    return {
      secrets: systemWatchdog.checkSecrets(),
      permissions: systemWatchdog.checkPermissions(),
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  encrypt,
  decrypt,
  sanitizeInput,
  sanitizeQuery,
  forensicLogger,
  generateOfflineJWT,
  advancedRateLimit,
  attackDetection,
  systemWatchdog
};