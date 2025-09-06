import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import indexRoutes from "./routes/index.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "./services/authService.js";
dotenv.config();
const app = express();
app.use(express.json());

// Routes
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);
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
    },
  ),
);
app.use(passport.initialize());

app.use(indexRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME} running on port ${PORT}`);
});
