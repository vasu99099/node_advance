import { addressService } from "../services/addressService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { AppError } from "../utils/error.js";

export const addressController = {
  createAddress: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log("userId", userId);
    const address = await addressService.createAddress(userId, req.body);
    successResponse(res, address, "Address created successfully", 201);
  }),

  getAddresses: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const addresses = await addressService.getAddresses(userId);
    successResponse(res, addresses, "Addresses retrieved successfully");
  }),

  getAddressById: asyncHandler(async (req, res) => {
    const { userId, id } = req.params;
    const address = await addressService.getAddressById(id, userId);
    successResponse(res, address, "Address retrieved successfully");
  }),

  updateAddress: asyncHandler(async (req, res) => {
    const { userId, id } = req.params;
    const address = await addressService.updateAddress(id, userId, req.body);
    successResponse(res, address, "Address updated successfully");
  }),

  deleteAddress: asyncHandler(async (req, res) => {
    const { userId, id } = req.params;
    await addressService.deleteAddress(id, userId);
    successResponse(res, null, "Address deleted successfully");
  }),

  setDefaultAddress: asyncHandler(async (req, res) => {
    const { userId, id } = req.params;
    const address = await addressService.setDefaultAddress(id, userId);
    successResponse(res, address, "Default address set successfully");
  }),
};
