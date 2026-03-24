const express = require('express');
const router = express.Router();
const { validateBody } = require('../middleware/validate');
const { dictionaryRequestSchema } = require('../validators/dictionary.schemas');
const asyncHandler = require('../utils/asyncHandler');
const { postDictionary } = require('../controllers/dictionary.controller');

router.post('/', validateBody(dictionaryRequestSchema), asyncHandler(postDictionary));

module.exports = router;
