const { z } = require('zod');

// API /api/writing
const writingRequestSchema = z.object({
  topic: z.string().min(1, 'topic is required'),
  content: z.string().min(1, 'content is required'),
  level: z
    .enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], { errorMap: () => ({ message: 'level is invalid' }) })
    .optional(),
});

module.exports = {
  writingRequestSchema,
};

