import Joi from "joi";
import { AppError } from "../utils/error.js";

const addressSchema = Joi.object({
  type: Joi.string().valid("shipping", "billing").required().messages({
    "string.base": "Type must be a string",
    "any.only": "Type must be either shipping or billing",
    "any.required": "Type is required",
  }),
  firstName: Joi.string().max(50).required().messages({
    "string.base": "First name must be a string",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().max(50).required().messages({
    "string.base": "Last name must be a string",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
  addressLine1: Joi.string().required().messages({
    "string.base": "Address line 1 must be a string",
    "any.required": "Address line 1 is required",
  }),
  addressLine2: Joi.string().optional().allow(""),
  city: Joi.string().required().messages({
    "string.base": "City must be a string",
    "any.required": "City is required",
  }),
  state: Joi.string().required().messages({
    "string.base": "State must be a string",
    "any.required": "State is required",
  }),
  postalCode: Joi.string().max(10).required().messages({
    "string.base": "Postal code must be a string",
    "string.max": "Postal code cannot exceed 10 characters",
    "any.required": "Postal code is required",
  }),
  country: Joi.string().default("India"),
  isDefault: Joi.boolean().optional().messages({
    "boolean.base": "isDefault must be a boolean value",
  }),
});

const addressUpdateSchema = Joi.object({
  type: Joi.string().valid("shipping", "billing").messages({
    "string.base": "Type must be a string",
    "any.only": "Type must be either shipping or billing",
  }),
  firstName: Joi.string().max(50).messages({
    "string.base": "First name must be a string",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().max(50).messages({
    "string.base": "Last name must be a string",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  addressLine1: Joi.string().messages({
    "string.base": "Address line 1 must be a string",
  }),
  addressLine2: Joi.string().allow(""),
  city: Joi.string().messages({
    "string.base": "City must be a string",
  }),
  state: Joi.string().messages({
    "string.base": "State must be a string",
  }),
  postalCode: Joi.string().max(10).messages({
    "string.base": "Postal code must be a string",
    "string.max": "Postal code cannot exceed 10 characters",
  }),
  country: Joi.string(),
  isDefault: Joi.boolean().messages({
    "boolean.base": "isDefault must be a boolean value",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

const paramsSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "User ID must be a string",
    "any.required": "User ID is required",
  }),
  id: Joi.string().messages({
    "string.base": "Address ID must be a string",
    "any.required": "Address ID is required",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    throw new AppError("Validation failed", 400, errors);
  }
  next();
};

const validateParams = (req, res, next) => {
  const { error } = paramsSchema.validate(req.params, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    throw new AppError("Validation failed", 400, errors);
  }
  next();
};

export const validateAddress = validate(addressSchema);
export const validateAddressUpdate = validate(addressUpdateSchema);
export { validateParams };
