const { z } = require('zod');

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// API /api/dictionary
const dictionaryRequestSchema = z.object({
  word: z
    .string()
    .min(1, 'word is required')
    .max(120, 'word is too long')
    .refine((value) => countWords(value) <= 7, 'word must be <= 7 words'),
  // context có thể không truyền (front-end có thể gửi hoặc không)
  context: z
    .string()
    .max(240, 'context is too long')
    .refine((value) => countWords(value) <= 15, 'context must be <= 15 words')
    .optional(),
});

module.exports = {
  dictionaryRequestSchema,
};

