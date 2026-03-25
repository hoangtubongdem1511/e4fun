const express = require('express');
const multer = require('multer');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { postChatbot } = require('../controllers/chatbot.controller');
const { chatbotRequestSchema } = require('../validators/chatbot.schemas');
const AppError = require('../utils/appError');
const httpStatus = require('../constants/httpStatus');
const errorCodes = require('../constants/errorCodes');

const MAX_IMAGES = Number(process.env.CHATBOT_MAX_IMAGES || 4);
const MAX_FILE_SIZE = Number(process.env.CHATBOT_MAX_FILE_SIZE || 3 * 1024 * 1024); // 3MB
const MAX_TOTAL_SIZE = Number(process.env.CHATBOT_MAX_TOTAL_SIZE || 12 * 1024 * 1024); // 12MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_IMAGES,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError({
          statusCode: httpStatus.BAD_REQUEST,
          code: errorCodes.UPLOAD_ERROR,
          message: 'Invalid file type',
          details: {
            allowedTypes: ALLOWED_MIME_TYPES,
            receivedType: file.mimetype,
          },
        }),
      );
    }
    return cb(null, true);
  },
});

function validateChatbotRequest(req, res, next) {
  const parsed = chatbotRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(
      new AppError({
        statusCode: httpStatus.BAD_REQUEST,
        code: errorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: parsed.error.issues,
        issues: parsed.error.issues,
      }),
    );
  }

  req.body = parsed.data;
  const files = Array.isArray(req.files) ? req.files : [];
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  if (totalSize > MAX_TOTAL_SIZE) {
    return next(
      new AppError({
        statusCode: httpStatus.BAD_REQUEST,
        code: errorCodes.UPLOAD_ERROR,
        message: 'Total upload size exceeded',
        details: { maxTotalSize: MAX_TOTAL_SIZE, receivedTotalSize: totalSize },
      }),
    );
  }

  const hasMessage = typeof req.body.message === 'string' && req.body.message.trim().length > 0;
  if (!hasMessage && files.length === 0) {
    return next(
      new AppError({
        statusCode: httpStatus.BAD_REQUEST,
        code: errorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: [{ message: 'message or images is required', path: ['message'] }],
      }),
    );
  }

  return next();
}

router.post('/', upload.array('images', MAX_IMAGES), validateChatbotRequest, asyncHandler(postChatbot));

module.exports = router;