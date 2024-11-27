class ErrorHandler {
  static formatResponse(res, err) {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    return res.status(statusCode).json({
      status,
      message: err.message || "An unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
}

class AppError extends Error {
  statusCode;
  status;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

class DuplicateFieldError extends AppError {
  constructor(field) {
    super(`${field} already exists.`, 409);
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  DuplicateFieldError,
  UnauthorizedError,
  ErrorHandler
};
