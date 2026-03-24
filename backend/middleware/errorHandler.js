const logger = require('../utils/logger');
const errorCodes = require('../constants/errorCodes');

function normalizeError(err) {
  if (typeof err === 'string') {
    return { message: err, details: undefined };
  }
  if (!err || typeof err !== 'object') {
    return { message: 'Unknown error', details: undefined };
  }
  return err;
}

module.exports = function errorHandler(err, req, res, next) {
  // Express sẽ truyền lỗi qua đây khi dùng `next(err)`.
  const normalized = normalizeError(err);

  const requestId = req.requestId || req.headers['x-request-id'];
  let statusCode = normalized.statusCode || normalized.status || 500;

  // Handle Zod-like validation errors (phase 2 sẽ dùng zod thật).
  const isZodError = normalized.name === 'ZodError' || Array.isArray(normalized.issues);
  const isAxiosError = normalized.isAxiosError || normalized.name === 'AxiosError';

  // Multer errors (file filter/limits) thường không set statusCode sẵn.
  if (normalized.code === 'LIMIT_FILE_SIZE' || normalized.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    normalized.code = normalized.code || errorCodes.UPLOAD_ERROR;
  }

  const code = (() => {
    if (isZodError) return errorCodes.VALIDATION_ERROR;
    if (isAxiosError) return normalized.code || errorCodes.AI_PROVIDER_ERROR;
    return normalized.code || (statusCode === 404 ? errorCodes.NOT_FOUND : errorCodes.INTERNAL_SERVER_ERROR);
  })();

  const message = (() => {
    if (isZodError) return normalized.message || 'Validation failed';
    if (isAxiosError) return normalized.message || 'AI provider error';
    if (statusCode === 404) return normalized.message || 'Not Found';
    if (statusCode === 400) return normalized.message || 'Bad Request';
    return normalized.message || 'Internal Server Error';
  })();

  const details = (() => {
    if (isZodError) return normalized.issues;
    if (isAxiosError) return normalized.response?.data || normalized.details;
    return normalized.details;
  })();

  // Với lỗi provider, ưu tiên status code từ phản hồi (nếu có).
  if (isAxiosError && normalized.response?.status) {
    statusCode = normalized.response.status;
  }

  logger.error(
    {
      requestId,
      statusCode,
      code,
      message,
      details,
      stack: normalized.stack,
    },
    'request failed',
  );

  return res.status(statusCode).json({
    error: { code, message, details },
    requestId,
  });
};

