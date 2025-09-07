import express from "express";
import authRoutes from "./authRoutes.js";

import mfaRoutes from "./mfaRoutes.js";

const indexRoutes = express.Router();

indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/mfa", mfaRoutes);

indexRoutes.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Service is healthy",
    data: {
      status: "ok",
      service: process.env.SERVICE_NAME || "Auth Service",
    },
    timestamp: new Date().toISOString(),
  });
});

indexRoutes.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Test endpoint working",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Debug: catch all requests
indexRoutes.use((req, res, next) => {
  console.log(`[AUTH SERVICE] ${req.method} ${req.url}`);
  next();
});

export default indexRoutes;
