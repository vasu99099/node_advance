import { authenticator } from "otplib";
import UserService from "../services/authService.js";
import QRCode from "qrcode";
import PasswordFactory from "../utils/PasswordFactory.js";
import ResponseHelper from "../utils/ResponseHelper.js";

export const setupMFA = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserService.getUserById(userId);
    if (!user) return ResponseHelper.error(res, "User not found", 404);

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, "MyApp", secret);
    const qrImageUrl = await QRCode.toDataURL(otpauth);

    await UserService.updateUser(userId, { mfaSecret: secret });

    ResponseHelper.success(res, {
      qrImageUrl,
      secret
    }, "Scan this QR code with Google Authenticator");
  } catch (err) {
    ResponseHelper.error(res, err.message, 401);
  }
};

export const verifyMFA = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.userId;

    const user = await UserService.getUserById(userId);
    if (!user || !user.mfaSecret) {
      return ResponseHelper.error(res, "No MFA setup in progress", 400);
    }

    const isValid = authenticator.check(token, user.mfaSecret, { window: 1 });
    if (!isValid) {
      return ResponseHelper.error(res, "Invalid OTP token", 400);
    }

    await UserService.updateUser(userId, {
      mfaEnabled: true,
    });

    ResponseHelper.success(res, null, "MFA activated successfully");
  } catch (err) {
    ResponseHelper.error(res, err.message, 401);
  }
};

export const disableMFA = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    const user = await UserService.getUserById(userId);
    if (!user) {
      return ResponseHelper.error(res, "User not found", 404);
    }

    const isMatch = await PasswordFactory.compare(password, user.passwordHash);
    if (!isMatch) {
      return ResponseHelper.error(res, "Invalid password", 400);
    }

    await UserService.updateUser(userId, {
      mfaSecret: null,
      mfaEnabled: false
    });

    ResponseHelper.success(res, null, "MFA disabled successfully");
  } catch (err) {
    ResponseHelper.error(res, err.message, 401);
  }
};