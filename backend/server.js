const express = require('express');
const http = require('http');
const cors = require('cors');
const { globalRateLimit, sanitizeInput, securityHeaders } = require('./middleware/security');
const { searchController, searchLimiter } = require('./controllers/search.controller');
const osintController = require('./controllers/osint.controller');
const healthRouter = require('./routes/health');
const contactRouter = require('./routes/contact');
const mvpRouter = require('./routes/mvp');
const cacheMiddleware = require('./middleware/cache');
const WebSocketServer = require('./websocket/server');

// OSINT Phase 0 integration
const { registerOsintTools } = require('../apps/api/src/bootstrap/osint');
const { osintRouter } = require('../apps/api/src/routes/osint');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4010;

// Security middleware
app.use(securityHeaders);
app.use(globalRateLimit);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(sanitizeInput);

// Health check
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
registerOsintTools();

// Mount OSINT routes
app.use('/api/osint', osintRouter);

// WebSocket server
const wsServer = new WebSocketServer(server);

server.listen(PORT, () => {
  console.log(`🚀 AURA Backend running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`🔍 OSINT tools registered and ready`);
});