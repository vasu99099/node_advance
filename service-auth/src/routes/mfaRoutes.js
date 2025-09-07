import express from "express";
import {
  disableMFA,
  setupMFA,
  verifyMFA,
} from "../controllers/mfaController.js";
import AuthMiddleware from "../utils/AuthMiddleware.js";

const mfaRoutes = express.Router();

mfaRoutes.post("/setup", AuthMiddleware.authenticate, setupMFA);
mfaRoutes.post("/verify", AuthMiddleware.authenticate, verifyMFA);
mfaRoutes.post("/disable", AuthMiddleware.authenticate, disableMFA);

export default mfaRoutes;
