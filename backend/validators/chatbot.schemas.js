const { z } = require('zod');

function countWords(input) {
  return String(input || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function toOptionalBoolean(value) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

// API /api/chatbot (multipart fields)
const chatbotRequestSchema = z.object({
  message: z
    .string()
    .max(6000, 'message is too long')
    .refine((value) => countWords(value) <= 1200, 'message must be at most 1200 words')
    .optional(),
  deepThink: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  googleSearch: z.preprocess(toOptionalBoolean, z.boolean().optional()),
});

module.exports = {
  chatbotRequestSchema,
};

