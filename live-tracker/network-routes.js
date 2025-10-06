const express = require('express');
const router = express.Router();
const StealthProxy = require('../aura-proxy/stealth-proxy');

let proxyInstance = null;

// Initialize proxy if not exists
const getProxy = () => {
  if (!proxyInstance) {
    proxyInstance = new StealthProxy(8888);
  }
  return proxyInstance;
};

// Get intercepted network evidence
router.get('/evidence', (req, res) => {
  try {
    const proxy = getProxy();
    const evidence = proxy.getInterceptedData();
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get network evidence' });
  }
});

// Export evidence to file
router.post('/export', (req, res) => {
  try {
    const proxy = getProxy();
    const filepath = proxy.exportEvidence('json');
    res.json({ 
      success: true, 
      filepath,
      timestamp: Date.now(),
      count: proxy.getInterceptedData().length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export evidence' });
  }
});

// Get network statistics
router.get('/stats', (req, res) => {
  try {
    const proxy = getProxy();
    const evidence = proxy.getInterceptedData();
    
    const stats = {
      total: evidence.length,
      tiktok: evidence.filter(e => e.isTikTok).length,
      https: evidence.filter(e => e.type === 'HTTPS_CONNECT').length,
      http: evidence.filter(e => e.type === 'HTTP').length,
      lastHour: evidence.filter(e => Date.now() - e.timestamp < 3600000).length,
      domains: [...new Set(evidence.map(e => {
        try {
          return new URL(e.url).hostname;
        } catch {
          return 'unknown';
        }
      }))].slice(0, 10)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get network stats' });
  }
});

// Clear evidence (forensic operation)
router.delete('/evidence', (req, res) => {
  try {
    const proxy = getProxy();
    const count = proxy.getInterceptedData().length;
    
    // Export before clearing
    const filepath = proxy.exportEvidence('json');
    
    // Clear the in-memory data
    proxy.interceptedData = [];
    
    res.json({ 
      success: true, 
      cleared: count,
      exported: filepath
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear evidence' });
  }
});

module.exports = router;