import { authenticator } from "otplib";
import UserService from "../services/authService.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const verify2fa = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await UserService.getUserById(userId);
    if (!user || !user.mfaEnabled) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const isValid = authenticator.check(token, user.mfaSecret, { window: 1 });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid 2FA token" });
    }
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    const { passwordHash, ...userWithoutPassword } = user;

    res.send({
      user: userWithoutPassword,
      token: jwtToken,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const generateJWT = (req, res) => {
  const user = req.user;
  const jwtToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
  res.json({ token: jwtToken });
};
