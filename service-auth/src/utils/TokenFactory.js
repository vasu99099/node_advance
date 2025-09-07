import jwt from 'jsonwebtoken';
import AppConfig from '../config/AppConfig.js';

class TokenFactory {
  static generateJWT(user) {
    const config = AppConfig.getConfig();
    
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpire }
    );
  }

  static verifyJWT(token) {
    const config = AppConfig.getConfig();
    return jwt.verify(token, config.auth.jwtSecret);
  }
}

export default TokenFactory;