import express from "express";
import AppConfig from "./config/AppConfig.js";
import PassportConfig from "./config/PassportConfig.js";
import indexRoutes from "./routes/index.js";

const app = express();
const config = AppConfig.loadConfig();

// Validate configuration
AppConfig.validateConfig();

// Middleware
app.use(express.json());

// Initialize Passport
const passport = PassportConfig.initialize();
app.use(passport.initialize());

// Routes
app.use(indexRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const server = app.listen(config.server.port, () => {
  console.log(
    `${config.server.serviceName} running on port ${config.server.port}`,
  );
});

export default server;
