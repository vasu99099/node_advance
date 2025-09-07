import dotenv from 'dotenv';

class AppConfig {
  static config = null;

  static loadConfig() {
    if (this.config) return this.config;

    dotenv.config();

    this.config = {
      server: {
        port: parseInt(process.env.PORT) || 4001,
        serviceName: process.env.SERVICE_NAME || 'Auth Service'
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpire: process.env.JWT_EXPIRE || '7d',
        bcryptRounds: 12
      },
      google: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET,
        callbackUrl: '/auth/google/callback'
      },
      database: {
        url: process.env.DATABASE_URL
      }
    };

    return this.config;
  }

  static getConfig() {
    return this.config || this.loadConfig();
  }

  static validateConfig() {
    const config = this.getConfig();
    const errors = [];

    if (!config.auth.jwtSecret) {
      errors.push('JWT_SECRET is required');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }

    return true;
  }
}

export default AppConfig;