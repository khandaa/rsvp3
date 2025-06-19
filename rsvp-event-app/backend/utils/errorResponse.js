class ErrorResponse extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown (only available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = this.constructor.name;
  }

  // Static method to create a new ErrorResponse instance
  static badRequest(message = 'Bad Request', errors = []) {
    return new ErrorResponse(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ErrorResponse(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new ErrorResponse(message, 404);
  }

  static conflict(message = 'Resource already exists') {
    return new ErrorResponse(message, 409);
  }

  static validationError(message = 'Validation failed', errors = []) {
    return new ErrorResponse(message, 422, errors);
  }

  static serverError(message = 'Internal Server Error') {
    return new ErrorResponse(message, 500);
  }
}

module.exports = ErrorResponse;
