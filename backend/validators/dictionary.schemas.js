const { z } = require('zod');

// API /api/dictionary
const dictionaryRequestSchema = z.object({
  word: z.string().min(1, 'word is required'),
  // context có thể không truyền (front-end có thể gửi hoặc không)
  context: z.string().optional(),
});

module.exports = {
  dictionaryRequestSchema,
};

