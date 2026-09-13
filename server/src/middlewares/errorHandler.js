import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../lib/ApiError.js';
import logger from '../lib/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, [], err.stack);
    error.isOperational = false;
  }

  if (!error.isOperational) {
    logger.error({
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors?.length && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
}
