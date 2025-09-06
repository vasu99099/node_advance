import express from "express";

import {
  disableMFA,
  setupMFA,
  verifyMFA,
} from "../controllers/mfaController.js";
const mfaRoutes = express.Router();

mfaRoutes.post("/setup", setupMFA);
mfaRoutes.post("/verify", verifyMFA);
mfaRoutes.post("/disable", disableMFA);

export default mfaRoutes;
