import express from "express";
import {
  generateJWT,
  loginUser,
  registerUser,
  verify2fa,
} from "../controllers/authController.js";
import passport from "passport";
const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/verify-2fa", verify2fa);
authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  generateJWT,
);

export default authRoutes;
