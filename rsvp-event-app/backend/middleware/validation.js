const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Middleware to handle validation errors
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return next(new ErrorResponse('Validation failed', 400, errorMessages));
  };
};

// Simple validation handler for use with existing validation arrays
exports.validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map((err) => ({
    field: err.param,
    message: err.msg,
  }));

  return next(new ErrorResponse('Validation failed', 400, errorMessages));
};

// Sanitize request data to prevent XSS
exports.sanitize = (fields) => {
  return (req, res, next) => {
    if (fields && Array.isArray(fields)) {
      fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          req.body[field] = req.body[field].replace(/<[^>]*>?/gm, '');
        }
      });
    }
    next();
  };
};
