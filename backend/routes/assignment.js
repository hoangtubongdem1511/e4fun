const express = require('express');
const router = express.Router();
const { validateBody } = require('../middleware/validate');
const { generateAssignmentSchema, gradeAssignmentSchema } = require('../validators/assignment.schemas');
const asyncHandler = require('../utils/asyncHandler');
const { postGenerate, postGrade } = require('../controllers/assignment.controller');

router.post('/generate', validateBody(generateAssignmentSchema), asyncHandler(postGenerate));

// Route chấm điểm bài tập
router.post('/grade', validateBody(gradeAssignmentSchema), asyncHandler(postGrade));

module.exports = router;