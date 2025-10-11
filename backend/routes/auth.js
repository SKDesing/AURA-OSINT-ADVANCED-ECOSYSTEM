const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const { db } = require('../config/database');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  body('name').isLength({ min: 2 }).trim().escape()
];

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authLimiter, registerValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const [userId] = await db('users').insert({
    email,
    password: hashedPassword,
    name,
    role: 'user',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }).returning('id');

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(userId);

  // Store refresh token
  await cache.set(`refresh_token:${userId}`, refreshToken, 7 * 24 * 60 * 60); // 7 days

  logger.info('User registered successfully', { userId, email });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: userId,
        email,
        name,
        role: 'user'
      },
      accessToken,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user
  const user = await db('users').where({ email, is_active: true }).first();
  if (!user) {
    logger.logSecurity('Login attempt with invalid email', { email, ip: req.ip });
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    logger.logSecurity('Login attempt with invalid password', { 
      userId: user.id, 
      email, 
      ip: req.ip 
    });
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Store refresh token
  await cache.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

  // Update last login
  await db('users').where({ id: user.id }).update({
    last_login: new Date(),
    updated_at: new Date()
  });

  logger.info('User logged in successfully', { userId: user.id, email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || []
      },
      accessToken,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Check if refresh token exists in cache
    const cachedToken = await cache.get(`refresh_token:${decoded.userId}`);
    if (!cachedToken || cachedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const { accessToken } = generateTokens(decoded.userId);

    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
}));

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // Remove refresh token from cache
  await cache.del(`refresh_token:${req.user.id}`);

  logger.info('User logged out successfully', { userId: req.user.id });

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   GET /api/v1/auth/verify
// @desc    Verify token and get user info
// @access  Private
router.get('/verify', authenticate, asyncHandler(async (req, res) => {
  const user = await db('users')
    .select('id', 'email', 'name', 'role', 'permissions', 'created_at')
    .where({ id: req.user.id })
    .first();

  res.json({
    success: true,
    data: { user }
  });
}));

module.exports = router;