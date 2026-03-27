const { z } = require('zod');

function countWords(input) {
  return String(input || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// API /api/dictionary
const dictionaryRequestSchema = z.object({
  word: z
    .string()
    .trim()
    .min(1, 'word is required')
    .max(80, 'word is too long')
    .refine((value) => countWords(value) <= 7, 'word must be at most 7 words'),
  // context có thể không truyền (front-end có thể gửi hoặc không)
  context: z
    .string()
    .max(300, 'context is too long')
    .refine((value) => countWords(value) <= 15, 'context must be at most 15 words')
    .optional(),
});

module.exports = {
  dictionaryRequestSchema,
};

