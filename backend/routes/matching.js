const express = require('express');
const router = express.Router();
const { validateBody } = require('../middleware/validate');
const { generateMatchingSchema } = require('../validators/matching.schemas');
const asyncHandler = require('../utils/asyncHandler');
const { postGenerate } = require('../controllers/matching.controller');

router.post('/generate', validateBody(generateMatchingSchema), asyncHandler(postGenerate));

module.exports = router;
