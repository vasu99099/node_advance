import express from "express";
import addressRoutes from "./addressRoutes.js";

const indexRoutes = express.Router();

indexRoutes.use("/address", addressRoutes);

indexRoutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: process.env.SERVICE_NAME });
});
// indexRoutes.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });
export default indexRoutes;
