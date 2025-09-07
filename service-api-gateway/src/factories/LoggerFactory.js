import winston from 'winston';

class LoggerFactory {
  static createLogger(serviceName = 'api-gateway') {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          service: service || serviceName,
          message: this.sanitizeLogMessage(message),
          ...meta
        });
      })
    );

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: process.env.NODE_ENV === 'production' 
            ? logFormat 
            : winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ]
    });
  }

  static sanitizeLogMessage(message) {
    if (typeof message !== 'string') return message;
    // Remove potential log injection characters
    return message.replace(/[\r\n\t]/g, ' ').substring(0, 1000);
  }
}

export default LoggerFactory;