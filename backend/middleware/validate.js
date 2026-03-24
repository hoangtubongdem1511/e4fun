const { ZodError } = require('zod');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');
const AppError = require('../utils/appError');

function validateBody(schema) {
  return function validateBodyMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);
    if (result.success) return next();

    const issues = result.error.issues;
    const err = new AppError({
      statusCode: httpStatus.BAD_REQUEST,
      code: errorCodes.VALIDATION_ERROR,
      message: 'Validation failed',
      details: issues,
      issues,
    });

    // Giữ nguyên type để errorHandler nhận diện (nếu cần).
    err.name = result.error instanceof ZodError ? 'ZodError' : 'ValidationError';

    next(err);
  };
}

module.exports = {
  validateBody,
};

