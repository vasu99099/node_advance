import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserService from '../services/authService.js';
import AppConfig from './AppConfig.js';

class PassportConfig {
  static initialize() {
    const config = AppConfig.getConfig();
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: config.google.callbackUrl,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserService.getUserBySsoId(profile.id);
            if (!user) {
              user = await UserService.createSsoUser({
                ssoId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
              });
            }
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );

    return passport;
  }
}

export default PassportConfig;