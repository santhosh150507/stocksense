const env = require('../config/env');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle common Postgres errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        statusCode = 409;
        message = err.detail || 'A resource with this identifier already exists.';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        message = err.detail || 'Foreign key constraint violated.';
        break;
      case '23514': // check_violation
        statusCode = 400;
        message = err.detail || 'Check constraint violated.';
        break;
      case '22P02': // invalid_text_representation
        statusCode = 400;
        message = 'Invalid input syntax for type.';
        break;
      default:
        break;
    }
  }

  if (env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error('Unhandled Server Error:', err);
  }

  res.status(statusCode).json({
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
