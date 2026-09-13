import { StatusCodes } from 'http-status-codes';

export class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }

  static ok(res, data, message = 'Success', meta = null) {
    return new ApiResponse(StatusCodes.OK, data, message, meta).send(res);
  }

  static created(res, data, message = 'Created successfully') {
    return new ApiResponse(StatusCodes.CREATED, data, message).send(res);
  }

  static noContent(res) {
    return res.status(StatusCodes.NO_CONTENT).end();
  }
}
