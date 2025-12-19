import { Request, Response, NextFunction } from 'express';

/**
 * Error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (err.message.includes('not found')) {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('not authorized') || err.message.includes('Unauthorized')) {
    statusCode = 403;
    message = err.message;
  } else if (
    err.message.includes('required') ||
    err.message.includes('invalid') ||
    err.message.includes('must be') ||
    err.message.includes('already')
  ) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
