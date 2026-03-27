const { z } = require('zod');

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// API /api/writing
const writingRequestSchema = z.object({
  topic: z.string().min(1, 'topic is required'),
  content: z
    .string()
    .min(1, 'content is required')
    .refine((value) => countWords(value) <= 3000, 'content must be <= 3000 words'),
  level: z
    .enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], { errorMap: () => ({ message: 'level is invalid' }) })
    .optional(),
});

module.exports = {
  writingRequestSchema,
};

