class AppError extends Error {
  constructor(message, statusCode, validationErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.validationErrors = validationErrors;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Prisma errors
  if (err.code === "P2002") {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  if (err.code === "P2025") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    validationErrors: error.validationErrors || null,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { AppError, errorHandler };
