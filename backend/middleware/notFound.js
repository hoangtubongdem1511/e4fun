// Handler trả lỗi chuẩn hóa khi không tìm thấy route.
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');
const AppError = require('../utils/appError');

module.exports = function notFound(req, res, next) {
  next(
    new AppError({
      statusCode: httpStatus.NOT_FOUND,
      code: errorCodes.NOT_FOUND,
      message: 'Not Found',
      details: {
        method: req.method,
        path: req.originalUrl,
      },
    }),
  );
};

