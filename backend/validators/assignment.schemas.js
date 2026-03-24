const { z } = require('zod');

// API /api/assignment/generate
const generateAssignmentSchema = z.object({
  topic: z.string().min(1, 'topic is required'),
  numQuestions: z.coerce.number().int().positive('numQuestions must be > 0'),
  questionTypes: z.array(z.string()).min(1, 'questionTypes is required'),
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

