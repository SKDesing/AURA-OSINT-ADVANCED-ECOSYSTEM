const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { globalRateLimit, sanitizeInput, securityHeaders } = require('./middleware/security');
const { searchController, searchLimiter } = require('./controllers/search.controller');
const osintController = require('./controllers/osint.controller');
const healthRouter = require('./routes/health');
const contactRouter = require('./routes/contact');
const mvpRouter = require('./routes/mvp');
const cacheMiddleware = require('./middleware/cache');
const WebSocketServer = require('./websocket/server');

// OSINT Phase 0 integration
const osintRouter = require('./routes/osint');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4010;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
app.use(securityHeaders);
app.use(globalRateLimit);

// OSINT API rate limiting
const osintRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: { error: 'Too many OSINT requests' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});
app.use('/', healthRouter);

// API routes avec cache
app.post('/api/v1/search', searchLimiter, cacheMiddleware(60), searchController.search);
app.post('/api/v1/osint/search', searchLimiter, cacheMiddleware(120), osintController.search);
app.get('/api/v1/osint/analyze/:profileId', cacheMiddleware(300), osintController.analyze);

// Contact route
app.use('/api', contactRouter);

// MVP routes
app.use('/', mvpRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// OSINT Phase 0 initialization
console.log('🔍 OSINT tools ready');

// Mount OSINT routes with rate limiting
app.use('/api/osint', osintRateLimit, osintRouter);

// WebSocket server
const wsServer = new WebSocketServer(server);

server.listen(PORT, () => {
  console.log(`🚀 AURA Backend running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`🔍 OSINT tools registered and ready`);
});