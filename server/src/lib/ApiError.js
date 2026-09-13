import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message, errors = []) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(StatusCodes.FORBIDDEN, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static conflict(message) {
    return new ApiError(StatusCodes.CONFLICT, message);
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(StatusCodes.TOO_MANY_REQUESTS, message);
  }
}
