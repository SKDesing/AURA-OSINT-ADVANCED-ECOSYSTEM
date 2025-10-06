const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Rate limiting
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Input validation schemas
const schemas = {
  profile: Joi.object({
    unique_id: Joi.string().alphanum().min(3).max(50).required(),
    user_id: Joi.number().integer().positive().required(),
    nom_affiche: Joi.string().max(255).optional(),
    bio: Joi.string().max(1000).optional()
  }),
  
  session: Joi.object({
    live_url: Joi.string().uri().required(),
    title: Joi.string().max(255).optional(),
    streamer_username: Joi.string().alphanum().max(50).optional()
  })
};

// Validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }
    next();
  };
};

// Forensic evidence generator
const generateEvidenceHash = (data) => {
  const timestamp = Date.now();
  const content = JSON.stringify(data) + timestamp + process.env.FORENSIC_SALT;
  return {
    hash: crypto.createHash('sha256').update(content).digest('hex'),
    timestamp,
    algorithm: 'SHA256'
  };
};

// Audit logging
const auditLogger = (action) => {
  return (req, res, next) => {
    const evidence = generateEvidenceHash({
      action,
      user: req.user?.id || 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body
    });
    
    req.auditEvidence = evidence;
    next();
  };
};

// Error handler
const errorHandler = (err, req, res, next) => {
  const errorId = Date.now();
  
  console.error(`Error ${errorId}:`, {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({ 
    error: 'Internal server error', 
    errorId 
  });
};

// Security headers
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

module.exports = {
  createRateLimit,
  authenticateToken,
  validateInput,
  schemas,
  generateEvidenceHash,
  auditLogger,
  errorHandler,
  securityHeaders
};