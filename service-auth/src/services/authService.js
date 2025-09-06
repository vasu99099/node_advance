import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.js";
import UserRepository from "../repositories/userRepository.js";
import { publish } from "../events/producer.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createSsoUser(userData) {
    const { ssoId, email, role, firstName, lastName } = userData;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return await this.updateUser(existingUser.id, { ssoId });
    }
    const user = this.userRepository.create({
      ssoId,
      email: email.toLowerCase(),
      passwordHash: null,
      firstName,
      lastName,
    });
    return user;
  }

  async createUser(userData) {
    const { email, password, role, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("User already exists with this email", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.userRepository.create({
      email: email.toLowerCase(),
      passwordHash,
      role,
      firstName,
      lastName,
      phone,
    });

    // Publish event for other services

    // await publish("user.registered", {
    //   userId: user.id,
    //   email: user.email,
    //   role: user.role,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    // });

    return user;
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user || !user.isActive) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }
    if (user.mfaEnabled) {
      // Ask for OTP
      throw new AppError("MFA Required", 401, {
        mfaRequired: true,
        userId: user.id,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    // // Publish login event
    // await publishEvent("UserLoggedIn", {
    //   userId: user.id,
    //   email: user.email,
    //   loginAt: new Date(),
    // });

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUserBySsoId(id) {
    const user = await this.userRepository.findBySsoId(id);
    return user;
  }
  async updateUser(id, userData) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    // If email is being updated, check uniqueness
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new AppError("Email already in use", 409);
      }
      userData.email = userData.email.toLowerCase();
    }

    const updatedUser = await this.userRepository.update(id, userData);

    // Publish update event
    // await publishEvent("UserUpdated", {
    //   userId: updatedUser.id,
    //   email: updatedUser.email,
    //   changes: userData,
    // });

    return updatedUser;
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.delete(id);

    // Publish deletion event
    // await publishEvent("UserDeleted", {
    //   userId: id,
    //   email: user.email,
    // });

    return { message: "User deleted successfully" };
  }

  async getUsers(filters) {
    return await this.userRepository.findAll(filters);
  }

  async changePassword(id, currentPassword, newPassword) {
    const user = await this.userRepository.findByEmail(
      (await this.userRepository.findById(id)).email,
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new AppError("Current password is incorrect", 400);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.updatePassword(id, newPasswordHash);

    // Publish password change event
    // await publishEvent("UserPasswordChanged", {
    //   userId: id,
    //   email: user.email,
    //   changedAt: new Date(),
    // });

    return { message: "Password updated successfully" };
  }

  async toggleUserStatus(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await this.userRepository.update(id, {
      isActive: !user.isActive,
    });

    // Publish status change event
    // await publishEvent("UserStatusChanged", {
    //   userId: id,
    //   email: user.email,
    //   isActive: updatedUser.isActive,
    // });

    return updatedUser;
  }
}

export default new UserService();
