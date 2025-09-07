import LoggerFactory from '../factories/LoggerFactory.js';
import { HTTP_STATUS } from '../constants/HttpStatus.js';

class ErrorHandler {
  static logger = LoggerFactory.createLogger('error-handler');

  static handle(err, req, res, next) {
    const errorId = Date.now().toString(36);
    
    ErrorHandler.logger.error('Unhandled error', {
      errorId,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      url: req.url
    });

    const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message;

    res.status(statusCode).json({
      success: false,
      message,
      errorId: process.env.NODE_ENV === 'development' ? errorId : undefined
    });
  }

  static notFound(req, res) {
    ErrorHandler.logger.warn('Route not found', { url: req.originalUrl });
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Route not found'
    });
  }
}

export default ErrorHandler;