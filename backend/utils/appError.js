class AppError extends Error {
  constructor({ statusCode, code, message, details, issues } = {}) {
    super(message || 'Internal Server Error');

    this.name = 'AppError';
    this.statusCode = statusCode || 500;
    this.code = code;
    this.details = details;
    if (typeof issues !== 'undefined') this.issues = issues;
  }
}

module.exports = AppError;

