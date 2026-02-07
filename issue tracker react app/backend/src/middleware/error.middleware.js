import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {

  // Zod validation errors
  if (err instanceof ZodError || err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors ?? err.issues
    });
  }

  // Custom API errors
  if (err.statusCode && typeof err.statusCode === 'number') {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // PostgreSQL errors
  if (err.code) {
    return res.status(400).json({
      message: 'Database error',
      code: err.code
    });
  }

  // Final fallback
  return res.status(500).json({
    message: err.message || 'Internal server error'
  });
}
