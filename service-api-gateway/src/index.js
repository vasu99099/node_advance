import express from "express";
import ConfigFactory from "./factories/ConfigFactory.js";
import LoggerFactory from "./factories/LoggerFactory.js";
import MiddlewareFactory from "./factories/MiddlewareFactory.js";
import ServiceFactory from "./factories/ServiceFactory.js";

const config = ConfigFactory.loadConfig();
const logger = LoggerFactory.createLogger("api-gateway");

// Validate configuration
ConfigFactory.validateConfig();

// Register services
Object.entries(config.services).forEach(([name, serviceConfig]) => {
  ServiceFactory.registerService(name, serviceConfig);
});

// Now import routes after services are registered
const { default: gatewayRoutes } = await import("./routes/gateway.js");

const app = express();

// Security middleware
app.use(MiddlewareFactory.createSecurityMiddleware());
app.use(MiddlewareFactory.createCorsMiddleware(config.security.allowedOrigins));

// Rate limiting
app.use(
  MiddlewareFactory.createRateLimiter({
    windowMs: config.security.rateLimitWindow,
    max: config.security.rateLimitMax,
  })
);

// Request logging
app.use(MiddlewareFactory.createRequestLogger());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Import error handler
const { default: ErrorHandler } = await import("./middlewares/ErrorHandler.js");

// Gateway routes
app.use("/", gatewayRoutes);

// 404 handler
app.use("*", ErrorHandler.notFound);

// Error handler
app.use(ErrorHandler.handle);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

const server = app.listen(config.server.port, config.server.host, () => {
  logger.info("Server started", {
    serviceName: config.server.serviceName,
    port: config.server.port,
    host: config.server.host,
    environment: process.env.NODE_ENV || "development",
  });
});

export default server;
