/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

const ApiResponse = require('../utils/ApiResponse');

class ErrorHandler {
  /**
   * Handle not found errors
   */
  static notFound(req, res, next) {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    next(error);
  }

  /**
   * Main error handler
   */
  static handle(err, req, res, next) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }));
      return res.status(400).json(ApiResponse.validationError(errors));
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json(
        ApiResponse.error('Invalid ID format', 'INVALID_ID')
      );
    }

    // Custom application errors
    if (err.isOperational) {
      return res.status(statusCode).json(
        ApiResponse.error(err.message, code)
      );
    }

    // Production vs development error responses
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message;

    res.status(statusCode).json(
      ApiResponse.error(message, code, process.env.NODE_ENV !== 'production' ? err.stack : undefined)
    );
  }

  /**
   * Async error wrapper
   * Use this to wrap async route handlers
   */
  static asyncWrapper(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Create custom application error
   */
  static createError(message, statusCode = 500, code = 'ERROR') {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.isOperational = true;
    return error;
  }
}

module.exports = ErrorHandler;
