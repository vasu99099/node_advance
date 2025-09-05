import express from "express";
import { addressController } from "../controllers/addressController.js";
import {
  validateAddress,
  validateAddressUpdate,
  validateParams,
} from "../middlewares/validation.js";

const addressRoutes = express.Router();

// Address CRUD routes
addressRoutes.post(
  "/users/:userId",
  validateParams,
  validateAddress,
  addressController.createAddress,
);
addressRoutes.get(
  "/users/:userId",
  validateParams,
  addressController.getAddresses,
);
addressRoutes.get(
  "/users/:userId/:id",
  validateParams,
  addressController.getAddressById,
);
addressRoutes.put(
  "/users/:userId/:id",
  validateParams,
  validateAddressUpdate,
  addressController.updateAddress,
);
addressRoutes.delete(
  "/users/:userId/:id",
  validateParams,
  addressController.deleteAddress,
);
addressRoutes.patch(
  "/users/:userId/:id/default",
  validateParams,
  addressController.setDefaultAddress,
);

export default addressRoutes;
