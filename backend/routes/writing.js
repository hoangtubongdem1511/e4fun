const express = require('express');
const router = express.Router();
const { validateBody } = require('../middleware/validate');
const { writingRequestSchema } = require('../validators/writing.schemas');
const asyncHandler = require('../utils/asyncHandler');
const { postWriting } = require('../controllers/writing.controller');

router.post('/', validateBody(writingRequestSchema), asyncHandler(postWriting));

module.exports = router;