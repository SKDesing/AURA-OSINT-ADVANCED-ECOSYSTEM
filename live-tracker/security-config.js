const helmet = require('helmet');
const rateLimit = require('rate-limiter-flexible');

// Configuration sécurité headers
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
    keyGenerator: (req) => req.ip,
    points: 100, // Nombre de requêtes
    duration: 60, // Par minute
});

module.exports = { securityHeaders, rateLimiter };
