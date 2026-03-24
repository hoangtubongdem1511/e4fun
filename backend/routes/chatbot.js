const express = require('express');
const router = express.Router();
const { validateBody } = require('../middleware/validate');
const { chatbotRequestSchema } = require('../validators/chatbot.schemas');
const asyncHandler = require('../utils/asyncHandler');
const { postChatbot } = require('../controllers/chatbot.controller');

router.post('/', validateBody(chatbotRequestSchema), asyncHandler(postChatbot));

module.exports = router;