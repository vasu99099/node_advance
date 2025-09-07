import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import LoggerFactory from './LoggerFactory.js';

class MiddlewareFactory {
  static logger = LoggerFactory.createLogger('middleware-factory');

  static createRateLimiter(options = {}) {
    const {
      windowMs = 15 * 60 * 1000,
      max = 100,
      message = 'Too many requests, please try again later'
    } = options;

    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        this.logger.warn('Rate limit exceeded', {
          ip: req.ip,
          userAgent: req.get('User-Agent')?.substring(0, 100)
        });
        res.status(429).json({
          success: false,
          message
        });
      }
    });
  }

  static createCorsMiddleware(allowedOrigins = []) {
    // Simplified CORS for debugging
    return cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
  }

  static createSecurityMiddleware() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  static createAuthMiddleware() {
    return (req, res, next) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        this.logger.warn('Invalid token', { error: error.message });
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
    };
  }

  static createRequestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.logger.info('Request completed', {
          method: req.method,
          url: req.url.substring(0, 200),
          status: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('User-Agent')?.substring(0, 100)
        });
      });
      
      next();
    };
  }
}

export default MiddlewareFactory;