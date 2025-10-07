const forensicLogger = require('../logs/forensic-logger');

class ErrorHandler {
    constructor() {
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        process.on('uncaughtException', (error) => {
            this.handleCriticalError('UNCAUGHT_EXCEPTION', error);
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.handleCriticalError('UNHANDLED_REJECTION', { reason, promise });
        });
    }

    handleCriticalError(type, error) {
        forensicLogger.critical(type, {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        console.error(`🚨 CRITICAL ERROR [${type}]:`, error);
        
        // Graceful shutdown
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }

    middleware() {
        return (error, req, res, next) => {
            const errorId = require('crypto').randomUUID();
            
            forensicLogger.security('API_ERROR', {
                errorId,
                message: error.message,
                stack: error.stack,
                url: req.url,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            }, req.user?.id);

            const statusCode = error.statusCode || 500;
            const isDevelopment = process.env.NODE_ENV === 'development';

            res.status(statusCode).json({
                error: {
                    id: errorId,
                    message: statusCode === 500 ? 'Internal Server Error' : error.message,
                    ...(isDevelopment && { stack: error.stack })
                }
            });
        };
    }

    asyncHandler(fn) {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }

    validateRequest(schema) {
        return (req, res, next) => {
            const { error } = schema.validate(req.body);
            if (error) {
                const validationError = new Error(error.details[0].message);
                validationError.statusCode = 400;
                return next(validationError);
            }
            next();
        };
    }

    rateLimitHandler() {
        return (req, res, next) => {
            forensicLogger.security('RATE_LIMIT_EXCEEDED', {
                ip: req.ip,
                url: req.url,
                userAgent: req.get('User-Agent')
            });

            res.status(429).json({
                error: {
                    message: 'Too many requests',
                    retryAfter: 60
                }
            });
        };
    }

    notFoundHandler() {
        return (req, res, next) => {
            forensicLogger.audit('NOT_FOUND', {
                url: req.url,
                method: req.method,
                ip: req.ip
            });

            res.status(404).json({
                error: {
                    message: 'Resource not found'
                }
            });
        };
    }
}

module.exports = new ErrorHandler();