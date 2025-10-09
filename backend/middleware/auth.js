const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AUTH_CONFIG = require('../config/auth');

const authenticateRoot = async (username, password) => {
  if (username === AUTH_CONFIG.rootUser.username) {
    const isValid = await bcrypt.compare(password, AUTH_CONFIG.rootUser.passwordHash);
    if (isValid) {
      return {
        username: AUTH_CONFIG.rootUser.username,
        role: AUTH_CONFIG.rootUser.role
      };
    }
  }
  return null;
};

const generateToken = (user) => {
  return jwt.sign(user, AUTH_CONFIG.jwtSecret, { expiresIn: AUTH_CONFIG.jwtExpiry });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    // Force HS256 algorithm, reject 'none'
    const decoded = jwt.verify(token, AUTH_CONFIG.jwtSecret, { 
      algorithms: ['HS256'],
      ignoreNotBefore: false,
      ignoreExpiration: false
    });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateRoot, generateToken, verifyToken };