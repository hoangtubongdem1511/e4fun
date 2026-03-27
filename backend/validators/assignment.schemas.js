const { z } = require('zod');

// API /api/assignment/generate
const generateAssignmentSchema = z.object({
  topic: z.string().trim().min(1, 'topic is required').max(200, 'topic is too long'),
  numQuestions: z.coerce.number().int().positive('numQuestions must be > 0').max(100, 'numQuestions must be <= 100'),
  questionTypes: z.array(z.string().trim().min(1).max(40)).min(1, 'questionTypes is required').max(8, 'too many questionTypes'),
});

// API /api/assignment/grade
// Validate tối thiểu để không phá vỡ payload hiện tại của front-end.
const gradeAssignmentSchema = z.object({
  questions: z.array(z.any()),
  userAnswers: z.array(z.any()),
});

module.exports = {
  generateAssignmentSchema,
  gradeAssignmentSchema,
};

