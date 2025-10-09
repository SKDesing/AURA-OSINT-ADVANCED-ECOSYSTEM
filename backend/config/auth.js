// Hash généré avec bcrypt rounds=12 pour "Mohand/06"
const ROOT_PASSWORD_HASH = '$2b$12$8K9vX2mF4nQ7pL3wR6tY8eH5jM1cN0oP9qS4vU7xZ2aB6dE8fG3hI';

const AUTH_CONFIG = {
  rootUser: {
    username: 'root',
    passwordHash: ROOT_PASSWORD_HASH,
    role: 'admin'
  },
  jwtSecret: process.env.JWT_SECRET || 'aura_jwt_secret_2025_secure',
  jwtExpiry: '24h'
};

module.exports = AUTH_CONFIG;