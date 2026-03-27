const { z } = require('zod');

function toOptionalBoolean(value) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

// API /api/chatbot (multipart fields)
const chatbotRequestSchema = z.object({
  message: z
    .string()
    .max(5000, 'message is too long')
    .refine((value) => countWords(value) <= 800, 'message must be <= 800 words')
    .optional(),
  deepThink: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  googleSearch: z.preprocess(toOptionalBoolean, z.boolean().optional()),
});

module.exports = {
  chatbotRequestSchema,
};

