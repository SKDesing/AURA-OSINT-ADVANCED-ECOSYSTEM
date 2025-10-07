const jwt = require('jsonwebtoken');
const forensicLogger = require('../logs/forensic-logger');

class Authentication {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'aura-secure-2024';
        this.tokenExpiry = '24h';
    }

    generateToken(userId, permissions = []) {
        const payload = {
            userId,
            permissions,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };

        forensicLogger.audit('TOKEN_GENERATED', { userId, permissions });
        return jwt.sign(payload, this.secret);
    }

    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.secret);
            forensicLogger.audit('TOKEN_VERIFIED', { userId: decoded.userId });
            return decoded;
        } catch (error) {
            forensicLogger.security('TOKEN_VERIFICATION_FAILED', { error: error.message });
            throw new Error('Invalid token');
        }
    }

    middleware() {
        return (req, res, next) => {
            const token = req.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                forensicLogger.security('MISSING_TOKEN', {
                    ip: req.ip,
                    url: req.url,
                    userAgent: req.get('User-Agent')
                });
                
                return res.status(401).json({ error: 'Access token required' });
            }

            try {
                const decoded = this.verifyToken(token);
                req.user = decoded;
                next();
            } catch (error) {
                forensicLogger.security('INVALID_TOKEN', {
                    ip: req.ip,
                    url: req.url,
                    error: error.message
                });
                
                return res.status(401).json({ error: 'Invalid token' });
            }
        };
    }

    requirePermission(permission) {
        return (req, res, next) => {
            if (!req.user?.permissions?.includes(permission)) {
                forensicLogger.security('PERMISSION_DENIED', {
                    userId: req.user?.userId,
                    requiredPermission: permission,
                    userPermissions: req.user?.permissions
                });
                
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next();
        };
    }

    optionalAuth() {
        return (req, res, next) => {
            const token = req.headers.authorization?.replace('Bearer ', '');
            
            if (token) {
                try {
                    req.user = this.verifyToken(token);
                } catch (error) {
                    // Continue without authentication
                }
            }
            next();
        };
    }
}

module.exports = new Authentication();