import bcrypt from 'bcrypt';
import AppConfig from '../config/AppConfig.js';

class PasswordFactory {
  static async hash(password) {
    const config = AppConfig.getConfig();
    return await bcrypt.hash(password, config.auth.bcryptRounds);
  }

  static async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

export default PasswordFactory;