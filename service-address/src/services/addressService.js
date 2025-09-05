import { addressRepository } from "../repositories/addressRepository.js";
import { AppError } from "../utils/error.js";

export const addressService = {
  async createAddress(userId, addressData) {
    const data = { ...addressData, userId };
    return await addressRepository.create(data);
  },

  async getAddresses(userId) {
    return await addressRepository.findByUserId(userId);
  },

  async getAddressById(id, userId) {
    const address = await addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new AppError("Address not found", 404);
    }
    return address;
  },

  async updateAddress(id, userId, updateData) {
    const address = await addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new AppError("Address not found", 404);
    }
    return await addressRepository.update(id, updateData);
  },

  async deleteAddress(id, userId) {
    const address = await addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new AppError("Address not found", 404);
    }
    return await addressRepository.delete(id);
  },

  async setDefaultAddress(id, userId) {
    const address = await addressRepository.findById(id);
    if (!address || address.userId !== userId) {
      throw new AppError("Address not found", 404);
    }
    await addressRepository.setDefault(userId, id);
    return await addressRepository.findById(id);
  }
};