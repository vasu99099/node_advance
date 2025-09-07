export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (
  res,
  message = "Internal Server Error",
  statusCode = 500,
  errors = null
) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};
