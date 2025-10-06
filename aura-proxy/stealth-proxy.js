const http = require('http');
const https = require('https');
const net = require('net');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class StealthProxy {
  constructor(port = 8888) {
    this.port = port;
    this.interceptedData = [];
    this.evidenceDir = path.join(__dirname, '../evidence/network');
    this.initEvidenceDir();
  }

  initEvidenceDir() {
    if (!fs.existsSync(this.evidenceDir)) {
      fs.mkdirSync(this.evidenceDir, { recursive: true });
    }
  }

  start() {
    const server = http.createServer((req, res) => {
      this.handleHttpRequest(req, res);
    });

    server.on('connect', (req, clientSocket, head) => {
      this.handleHttpsConnect(req, clientSocket, head);
    });

    server.listen(this.port, () => {
      console.log(`🔒 AURA Stealth Proxy running on port ${this.port}`);
    });

    return server;
  }

  handleHttpRequest(req, res) {
    const targetUrl = req.url;
    const parsedUrl = url.parse(targetUrl);
    
    const evidence = this.createEvidence(req, 'HTTP');
    this.logRequest(evidence);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.path,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      let responseData = '';
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
        res.write(chunk);
      });

      proxyRes.on('end', () => {
        evidence.response = {
          statusCode: proxyRes.statusCode,
          headers: proxyRes.headers,
          body: this.isTikTokRequest(targetUrl) ? responseData : '[FILTERED]'
        };
        this.saveEvidence(evidence);
        res.end();
      });
    });

    req.on('data', (chunk) => {
      proxyReq.write(chunk);
    });

    req.on('end', () => {
      proxyReq.end();
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500);
      res.end();
    });
  }

  handleHttpsConnect(req, clientSocket, head) {
    const { hostname, port } = this.parseConnectRequest(req.url);
    
    const evidence = this.createEvidence(req, 'HTTPS_CONNECT');
    this.logRequest(evidence);

    const serverSocket = net.connect(port || 443, hostname, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
      console.error('Server socket error:', err);
      clientSocket.end();
    });
  }

  parseConnectRequest(url) {
    const [hostname, port] = url.split(':');
    return { hostname, port: parseInt(port) };
  }

  createEvidence(req, type) {
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      url: req.url,
      method: req.method,
      headers: req.headers,
      userAgent: req.headers['user-agent'],
      isTikTok: this.isTikTokRequest(req.url),
      hash: null
    };
  }

  isTikTokRequest(url) {
    const tiktokDomains = [
      'tiktok.com',
      'tiktokcdn.com',
      'musical.ly',
      'byteoversea.com',
      'tiktokv.com'
    ];
    return tiktokDomains.some(domain => url.includes(domain));
  }

  logRequest(evidence) {
    if (evidence.isTikTok) {
      console.log(`🎯 TikTok: ${evidence.method} ${evidence.url}`);
      this.interceptedData.push(evidence);
    }
  }

  saveEvidence(evidence) {
    if (!evidence.isTikTok) return;

    evidence.hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(evidence))
      .digest('hex');

    const filename = `evidence_${evidence.timestamp}_${evidence.id.slice(0, 8)}.json`;
    const filepath = path.join(this.evidenceDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(evidence, null, 2));
  }

  getInterceptedData() {
    return this.interceptedData;
  }

  exportEvidence(format = 'json') {
    const timestamp = Date.now();
    const filename = `tiktok_evidence_${timestamp}.${format}`;
    const filepath = path.join(this.evidenceDir, filename);

    if (format === 'json') {
      fs.writeFileSync(filepath, JSON.stringify(this.interceptedData, null, 2));
    }

    return filepath;
  }
}

module.exports = StealthProxy;