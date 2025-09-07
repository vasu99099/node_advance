import TokenFactory from './TokenFactory.js';
import ResponseHelper from './ResponseHelper.js';

class AuthMiddleware {
  static authenticate(req, res, next) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return ResponseHelper.error(res, 'Access token required', 401);
      }

      const decoded = TokenFactory.verifyJWT(token);
      req.user = decoded;
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return ResponseHelper.error(res, 'Invalid token', 401);
    }
  }
}

export default AuthMiddleware;