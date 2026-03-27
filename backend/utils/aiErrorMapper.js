const AppError = require('./appError');
const errorCodes = require('../constants/errorCodes');

const RATE_LIMIT_WARNING = 'CẢNH BÁO\nE4Fun đang bận đi chơi nên tạm thời vắng mặt.\nBạn yêu vui lòng ngồi đợi rồi tra lại thử nha.';

function parseRetryAfterSeconds(raw) {
  if (!raw) return undefined;
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 0) return n;
  return undefined;
}

function mapAiError(error, { endpoint } = {}) {
  const status = error?.response?.status;
  const retryAfter = parseRetryAfterSeconds(error?.response?.headers?.['retry-after']);
  const providerDetails = error?.response?.data || error?.message || String(error);

  if (status === 429) {
    const msg = endpoint === 'dictionary' || endpoint === 'writing'
      ? RATE_LIMIT_WARNING
      : 'Hệ thống AI đang quá tải. Vui lòng thử lại sau ít phút.';
    return new AppError({
      statusCode: 429,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: msg,
      details: {
        endpoint,
        providerStatus: status,
        retryAfter,
      },
    });
  }

  if (status === 503 || status === 502 || status === 504) {
    return new AppError({
      statusCode: 503,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: 'Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.',
      details: {
        endpoint,
        providerStatus: status,
      },
    });
  }

  if (status && status >= 400) {
    return new AppError({
      statusCode: status,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: 'Có lỗi từ nhà cung cấp AI. Vui lòng thử lại.',
      details: {
        endpoint,
        providerStatus: status,
      },
    });
  }

  return new AppError({
    statusCode: 500,
    code: errorCodes.AI_PROVIDER_ERROR,
    message: 'Không thể kết nối dịch vụ AI. Vui lòng thử lại sau.',
    details: {
      endpoint,
      providerDetails,
    },
  });
}

module.exports = {
  mapAiError,
  RATE_LIMIT_WARNING,
};

