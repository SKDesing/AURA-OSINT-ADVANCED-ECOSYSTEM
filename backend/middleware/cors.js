// CORS Middleware - Global configuration
const cors = require('cors');

const createCorsMiddleware = () => {
  const allowlist = process.env.CORS_ALLOWLIST?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowlist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    optionsSuccessStatus: 200
  });
};

module.exports = createCorsMiddleware;