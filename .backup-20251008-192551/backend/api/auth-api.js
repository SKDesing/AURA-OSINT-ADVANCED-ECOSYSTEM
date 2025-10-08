// AURA OSINT Authentication API
// Secure login with JWT, 2FA, and audit logging

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mock user database (replace with real DB)
const users = [
  {
    id: 1,
    username: 'investigator_01',
    userPassword: '$2b$10$rQZ8kHWKtGKVQ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // Test1234!
    role: 'investigator',
    permissions: ['read_incidents', 'create_reports', 'analyze_data'],
    require2FA: false,
    isActive: true
  },
  {
    id: 2,
    username: 'admin_aura',
    userPassword: '$2b$10$rQZ8kHWKtGKVQ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // Admin123!
    role: 'admin',
    permissions: ['*'],
    require2FA: true,
    isActive: true
  }
];

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'AURA_OSINT_SECRET_KEY_CHANGE_IN_PROD';

// ============================================
// LOGIN ENDPOINT
// ============================================
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, userPassword, totpCode, rememberMe } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({
        error: 'MISSING_CREDENTIALS',
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    // Find user
    const user = users.find(u => u.username === username && u.isActive);
    if (!user) {
      // Audit log failed attempt
      console.warn('[AUTH] Login attempt with invalid username', {
        username,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
      
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Identifiants incorrects'
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(userPassword, user.hashedPassword);
    if (!passwordValid) {
      // Audit log failed attempt
      console.warn('[AUTH] Login attempt with invalid password', {
        userId: user.id,
        username,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      
      return res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Identifiants incorrects'
      });
    }

    // Check 2FA requirement
    if (user.require2FA && !totpCode) {
      return res.status(200).json({
        requires2FA: true,
        message: 'Code de vérification requis'
      });
    }

    // Verify 2FA code if provided
    if (user.require2FA && totpCode) {
      // Mock 2FA verification (replace with real TOTP)
      if (totpCode !== '123456') {
        return res.status(401).json({
          error: 'INVALID_2FA',
          message: 'Code de vérification incorrect'
        });
      }
    }

    // Generate JWT token
    const tokenPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (rememberMe ? 7 * 24 * 60 * 60 : 15 * 60) // 7 days or 15 minutes
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET);

    // Audit log successful login
    console.info('[AUTH] Successful login', {
      userId: user.id,
      username: user.username,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      rememberMe,
      timestamp: new Date().toISOString()
    });

    // Set secure cookie
    res.cookie('aura_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      },
      redirectUrl: '/dashboard'
    });

  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Erreur interne du serveur'
    });
  }
});

// ============================================
// LOGOUT ENDPOINT
// ============================================
app.post('/api/auth/logout', (req, res) => {
  // Clear cookie
  res.clearCookie('aura_token');
  
  // Audit log
  console.info('[AUTH] User logout', {
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// ============================================
// TOKEN VERIFICATION MIDDLEWARE
// ============================================
const verifyToken = (req, res, next) => {
  const token = req.cookies.aura_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'NO_TOKEN',
      message: 'Token d\'authentification requis'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token invalide ou expiré'
    });
  }
};

// ============================================
// PROTECTED ROUTE EXAMPLE
// ============================================
app.get('/api/auth/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.sub,
      username: req.user.username,
      role: req.user.role,
      permissions: req.user.permissions
    }
  });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/auth/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AURA Auth API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.AUTH_PORT || 4004;
app.listen(PORT, () => {
  console.log(`🔐 AURA Auth API running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:XXXX${PORT}/api/auth/health`);
});

module.exports = app;