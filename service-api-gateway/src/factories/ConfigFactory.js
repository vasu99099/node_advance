import dotenv from 'dotenv';
import LoggerFactory from './LoggerFactory.js';

class ConfigFactory {
  static logger = LoggerFactory.createLogger('config-factory');
  static config = null;

  static loadConfig() {
    if (this.config) return this.config;

    dotenv.config();

    const requiredEnvVars = ['JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    this.config = {
      server: {
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || '0.0.0.0',
        serviceName: process.env.SERVICE_NAME || 'API Gateway'
      },
      security: {
        jwtSecret: process.env.JWT_SECRET,
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
      },
      services: {
        auth: {
          url: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
          routes: ['/auth']
        },
        address: {
          url: process.env.ADDRESS_SERVICE_URL || 'http://localhost:4005',
          routes: ['/addresses']
        },
        inventory: {
          url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:4002',
          routes: ['/inventory']
        },
        order: {
          url: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
          routes: ['/orders']
        },
        notification: {
          url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4004',
          routes: ['/notifications']
        }
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info'
      },
      monitoring: {
        healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000
      }
    };

    this.logger.info('Configuration loaded', {
      port: this.config.server.port,
      environment: process.env.NODE_ENV || 'development'
    });

    return this.config;
  }

  static getConfig() {
    return this.config || this.loadConfig();
  }

  static validateConfig() {
    const config = this.getConfig();
    const errors = [];

    if (!config.security.jwtSecret) {
      errors.push('JWT_SECRET is required');
    }

    if (config.server.port < 1 || config.server.port > 65535) {
      errors.push('PORT must be between 1 and 65535');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

export default ConfigFactory;