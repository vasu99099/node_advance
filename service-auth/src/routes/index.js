import express from "express";
import authRoutes from "./authRoutes.js";

import mfaRoutes from "./mfaRoutes.js";

const indexRoutes = express.Router();

indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/mfa", mfaRoutes);

indexRoutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: process.env.SERVICE_NAME });
});

export default indexRoutes;
