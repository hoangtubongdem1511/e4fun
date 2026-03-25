const { z } = require('zod');

function toOptionalBoolean(value) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

// API /api/chatbot (multipart fields)
const chatbotRequestSchema = z.object({
  message: z.string().optional(),
  deepThink: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  googleSearch: z.preprocess(toOptionalBoolean, z.boolean().optional()),
});

module.exports = {
  chatbotRequestSchema,
};

