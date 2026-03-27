const { z } = require('zod');

function countWords(input) {
  return String(input || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// API /api/writing
const writingRequestSchema = z.object({
  topic: z.string().trim().min(1, 'topic is required').max(200, 'topic is too long'),
  content: z
    .string()
    .trim()
    .min(1, 'content is required')
    .refine((value) => countWords(value) <= 3000, 'content must be at most 3000 words'),
  level: z
    .enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], { errorMap: () => ({ message: 'level is invalid' }) })
    .optional(),
});

module.exports = {
  writingRequestSchema,
};

