const AppError = require('./appError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

const OVERLOADED_MESSAGE = 'Hệ thống đang quá tải, vui lòng thử lại sau ít phút.';

function endpointFallbackMessage(endpoint) {
  if (endpoint === 'dictionary' || endpoint === 'writing') {
    return OVERLOADED_MESSAGE;
  }
  if (endpoint === 'assignment') {
    return 'Hệ thống tạo bài tập đang quá tải, vui lòng thử lại sau ít phút.';
  }
  if (endpoint === 'matching') {
    return 'Trò ghép đôi đang quá tải, vui lòng thử lại sau ít phút.';
  }
  if (endpoint === 'chatbot') {
    return 'Chatbot đang quá tải, bạn vui lòng thử lại sau ít phút.';
  }
  return OVERLOADED_MESSAGE;
}

function mapGeminiError(err, { endpoint } = {}) {
  const statusCode = err?.response?.status || err?.statusCode;
  const retryAfter = err?.response?.headers?.['retry-after'];
  const providerDetails = err?.response?.data;

  if (statusCode === 429) {
    return new AppError({
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: endpointFallbackMessage(endpoint),
      details: {
        providerStatus: statusCode,
        retryAfter: retryAfter || null,
      },
      issues: providerDetails,
    });
  }

  if (statusCode === 503 || statusCode === 502 || statusCode === 504) {
    return new AppError({
      statusCode: httpStatus.BAD_GATEWAY,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: 'Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.',
      details: { providerStatus: statusCode },
      issues: providerDetails,
    });
  }

  if (err?.isAxiosError) {
    return new AppError({
      statusCode: statusCode || httpStatus.BAD_GATEWAY,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: err?.message || 'AI provider error',
      details: providerDetails,
    });
  }

  return err;
}

module.exports = {
  mapGeminiError,
  endpointFallbackMessage,
};

