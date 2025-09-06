import { authenticator } from "otplib";
import UserService from "../services/authService.js";
import QRCode from "qrcode";

export const setupMFA = async (req, res) => {
  try {
    const userId = req.body.userId; // assume user is logged in
    const user = await UserService.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate secret
    const secret = authenticator.generateSecret();

    // Generate otpauth URL
    const otpauth = authenticator.keyuri(user.email, "MyApp", secret);

    // Convert to QR image
    const qrImageUrl = await QRCode.toDataURL(otpauth);

    // Save temp secret (not yet active until user confirms OTP)

    await UserService.updateUser(userId, { mfaSecret: secret });

    res.json({
      message: "Scan this QR code with Google Authenticator",
      qrImageUrl,
      secret, // (optional: usually don’t send secret to frontend)
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const verifyMFA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await UserService.getUserById(userId);
    console.log("user", user);
    if (!user || !user.mfaSecret) {
      return res.status(400).json({ message: "No MFA setup in progress" });
    }

    const isValid = authenticator.check(token, user.mfaSecret, { window: 1 });
    console.log("isValid", token);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP token" });
    }

    // OTP valid → activate MFA
    await UserService.updateUser(userId, {
      mfaEnabled: true,
    });

    res.json({ message: "MFA activated successfully" });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const disableMFA = async (req, res) => {
  try {
    const { userId, password } = req.body;
    // optionally ask for password confirmation for security

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // (optional) verify password before disabling MFA
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Disable MFA
    user.mfaSecret = null;
    user.mfaEnabled = false;
    await user.save();

    res.json({ message: "MFA disabled successfully" });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
