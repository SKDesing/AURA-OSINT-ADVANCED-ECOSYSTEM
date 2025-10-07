const forensicLogger = require('../logs/forensic-logger');

class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.limits = {
            api: { requests: 100, window: 60000 },      // 100 req/min
            auth: { requests: 5, window: 300000 },      // 5 req/5min
            search: { requests: 50, window: 60000 },    // 50 req/min
            upload: { requests: 10, window: 60000 }     // 10 req/min
        };
        
        // Cleanup old entries every 5 minutes
        setInterval(() => this.cleanup(), 300000);
    }

    middleware(type = 'api') {
        return (req, res, next) => {
            const key = this.getKey(req);
            const limit = this.limits[type];
            
            if (!limit) {
                return next();
            }

            const now = Date.now();
            const windowStart = now - limit.window;
            
            if (!this.requests.has(key)) {
                this.requests.set(key, []);
            }

            const userRequests = this.requests.get(key);
            
            // Remove old requests outside the window
            const validRequests = userRequests.filter(time => time > windowStart);
            this.requests.set(key, validRequests);

            if (validRequests.length >= limit.requests) {
                forensicLogger.security('RATE_LIMIT_EXCEEDED', {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    url: req.url,
                    type,
                    requestCount: validRequests.length,
                    limit: limit.requests
                });

                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    retryAfter: Math.ceil(limit.window / 1000),
                    limit: limit.requests,
                    window: limit.window / 1000
                });
            }

            // Add current request
            validRequests.push(now);
            this.requests.set(key, validRequests);

            // Add rate limit headers
            res.set({
                'X-RateLimit-Limit': limit.requests,
                'X-RateLimit-Remaining': limit.requests - validRequests.length,
                'X-RateLimit-Reset': new Date(now + limit.window).toISOString()
            });

            next();
        };
    }

    getKey(req) {
        // Use user ID if authenticated, otherwise IP
        return req.user?.userId || req.ip;
    }

    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, requests] of this.requests.entries()) {
            const validRequests = requests.filter(time => 
                now - time < Math.max(...Object.values(this.limits).map(l => l.window))
            );
            
            if (validRequests.length === 0) {
                this.requests.delete(key);
                cleaned++;
            } else {
                this.requests.set(key, validRequests);
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Rate limiter cleaned ${cleaned} expired entries`);
        }
    }

    getStats() {
        return {
            totalKeys: this.requests.size,
            limits: this.limits,
            memoryUsage: JSON.stringify([...this.requests.entries()]).length
        };
    }

    // Specific limiters for different endpoints
    apiLimiter() {
        return this.middleware('api');
    }

    authLimiter() {
        return this.middleware('auth');
    }

    searchLimiter() {
        return this.middleware('search');
    }

    uploadLimiter() {
        return this.middleware('upload');
    }

    // Strict limiter for sensitive operations
    strictLimiter() {
        return (req, res, next) => {
            const key = this.getKey(req);
            const now = Date.now();
            const window = 300000; // 5 minutes
            const maxRequests = 3;

            if (!this.requests.has(key + '_strict')) {
                this.requests.set(key + '_strict', []);
            }

            const userRequests = this.requests.get(key + '_strict');
            const validRequests = userRequests.filter(time => now - time < window);

            if (validRequests.length >= maxRequests) {
                forensicLogger.critical('STRICT_RATE_LIMIT_EXCEEDED', {
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    url: req.url,
                    requestCount: validRequests.length
                });

                return res.status(429).json({
                    error: 'Strict rate limit exceeded',
                    retryAfter: 300
                });
            }

            validRequests.push(now);
            this.requests.set(key + '_strict', validRequests);
            next();
        };
    }
}

module.exports = new RateLimiter();