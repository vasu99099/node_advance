import { authenticator } from "otplib";
import UserService from "../services/authService.js";
import TokenFactory from "../utils/TokenFactory.js";
import ResponseHelper from "../utils/ResponseHelper.js";

export const registerUser = async (req, res) => {
  try {
    console.log("user reached");
    const user = await UserService.createUser(req.body);
    ResponseHelper.success(res, user, "User registered successfully", 201);
  } catch (err) {
    ResponseHelper.error(res, err.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    ResponseHelper.success(res, result, "Login successful");
  } catch (err) {
    ResponseHelper.error(res, err.message, 401);
  }
};

export const verify2fa = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await UserService.getUserById(userId);
    if (!user || !user.mfaEnabled) {
      return ResponseHelper.error(res, "Invalid request", 400);
    }

    const isValid = authenticator.check(token, user.mfaSecret, { window: 1 });

    if (!isValid) {
      return ResponseHelper.error(res, "Invalid 2FA token", 400);
    }
    const jwtToken = TokenFactory.generateJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    ResponseHelper.success(
      res,
      {
        user: userWithoutPassword,
        token: jwtToken,
      },
      "2FA verification successful",
    );
  } catch (err) {
    ResponseHelper.error(res, err.message, 401);
  }
};

export const generateJWT = (req, res) => {
  try {
    const user = req.user;
    const jwtToken = TokenFactory.generateJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
    });
    ResponseHelper.success(
      res,
      { token: jwtToken },
      "Token generated successfully",
    );
  } catch (err) {
    ResponseHelper.error(res, err.message, 500);
  }
};
