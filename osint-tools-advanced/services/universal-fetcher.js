#!/usr/bin/env node

/**
 * AURA Universal Fetcher v2.0 - Multi-mode with Playwright + ETag caching
 * Env: FETCH_MODE=http|headless, MAX_PER_HOST=2, ACCEPT_LANG=fr-FR
 */

const crypto = require('crypto');
const { URL } = require('url');

class UniversalFetcher {
  constructor(options = {}) {
    this.userAgents = [
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    
    this.respectRobots = options.respectRobots !== false;
    this.robotsCache = new Map();
    this.etagCache = new Map(); // URL -> {etag, lastModified}
    this.browser = null;
  }

  normalizeUrl(url) {
    try {
      const u = new URL(url);
      u.hash = '';
      if ((u.protocol === 'http:' && u.port === '80') || (u.protocol === 'https:' && u.port === '443')) {
        u.port = '';
      }
      if (u.pathname.endsWith('/') && u.pathname !== '/') {
        u.pathname = u.pathname.slice(0, -1);
      }
      return u.toString();
    } catch {
      return url;
    }
  }

  async checkRobots(url) {
    if (!this.respectRobots) return true;
    
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
    
    if (this.robotsCache.has(robotsUrl)) {
      return this.robotsCache.get(robotsUrl);
    }

    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(robotsUrl, { timeout: 5000 });
      const text = await response.text();
      const allowed = !text.includes('User-agent: *') || !text.includes('Disallow: /');
      this.robotsCache.set(robotsUrl, allowed);
      return allowed;
    } catch (error) {
      this.robotsCache.set(robotsUrl, true);
      return true;
    }
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async fetchHTTP(url, options = {}) {
    const allowed = await this.checkRobots(url);
    if (!allowed) {
      throw new Error(`Robots.txt disallows fetching: ${url}`);
    }

    const fetch = (await import('node-fetch')).default;
    const normalizedUrl = this.normalizeUrl(url);
    const cached = this.etagCache.get(normalizedUrl);
    
    const headers = {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': process.env.ACCEPT_LANG || 'fr-FR,fr;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      ...options.headers
    };

    // Add conditional headers for caching
    if (cached?.etag) headers['If-None-Match'] = cached.etag;
    if (cached?.lastModified) headers['If-Modified-Since'] = cached.lastModified;

    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(normalizedUrl, {
          method: 'GET',
          headers,
          timeout: options.timeout || 30000,
          redirect: 'follow'
        });

        // Handle 304 Not Modified
        if (response.status === 304) {
          return {
            url: normalizedUrl,
            finalUrl: normalizedUrl,
            status: 304,
            headers: Object.fromEntries(response.headers),
            content: '',
            contentType: 'text/html',
            fetchedAt: new Date().toISOString(),
            method: 'http',
            cached: true
          };
        }

        // Handle 429 Rate Limit
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || (attempt * 2);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        const content = await response.text();
        
        // Update cache
        const etag = response.headers.get('etag');
        const lastModified = response.headers.get('last-modified');
        if (etag || lastModified) {
          this.etagCache.set(normalizedUrl, { etag, lastModified });
        }
        
        return {
          url: normalizedUrl,
          finalUrl: response.url,
          status: response.status,
          headers: Object.fromEntries(response.headers),
          content,
          contentType: response.headers.get('content-type'),
          fetchedAt: new Date().toISOString(),
          method: 'http'
        };
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  async fetchHeadless(url, options = {}) {
    const allowed = await this.checkRobots(url);
    if (!allowed) {
      throw new Error(`Robots.txt disallows fetching: ${url}`);
    }

    if (!this.browser) {
      const { chromium } = require('playwright');
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
    }

    const context = await this.browser.newContext({
      userAgent: this.getRandomUserAgent(),
      locale: 'fr-FR',
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();
    
    try {
      // Block unnecessary resources
      await page.route('**/*.{png,jpg,jpeg,gif,webp,woff,woff2,css}', route => route.abort());

      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: options.timeout || 30000
      });

      const content = await page.content();
      const title = await page.title();
      
      return {
        url: this.normalizeUrl(url),
        finalUrl: page.url(),
        status: response?.status() || 200,
        headers: response?.headers() || {},
        content,
        title,
        contentType: 'text/html',
        fetchedAt: new Date().toISOString(),
        method: 'headless'
      };
    } finally {
      await context.close();
    }
  }

  async fetch(url, options = {}) {
    const mode = process.env.FETCH_MODE || options.mode || 'http';
    
    try {
      let result;
      
      if (mode === 'headless' || this.needsHeadless(url)) {
        result = await this.fetchHeadless(url, options);
      } else {
        result = await this.fetchHTTP(url, options);
      }

      // Add content hash for deduplication
      result.contentHash = crypto
        .createHash('sha256')
        .update(result.content || '')
        .digest('hex');

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
  }

  needsHeadless(url) {
    const headlessPatterns = [
      /linkedin\.com/,
      /facebook\.com/,
      /twitter\.com/,
      /instagram\.com/,
      /societe\.com/
    ];
    
    return headlessPatterns.some(pattern => pattern.test(url));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = UniversalFetcher;

if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node universal-fetcher.js <url>');
    process.exit(1);
  }

  const fetcher = new UniversalFetcher();
  
  fetcher.fetch(url)
    .then(result => {
      console.log(JSON.stringify({
        url: result.url,
        status: result.status,
        contentHash: result.contentHash,
        contentLength: result.content?.length || 0,
        method: result.method,
        cached: result.cached || false,
        fetchedAt: result.fetchedAt
      }, null, 2));
    })
    .catch(error => {
      console.error('Fetch failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      fetcher.close();
    });
}