const { z } = require('zod');

// API /api/chatbot
const chatbotRequestSchema = z.object({
  message: z.string().optional(),
  images: z.array(z.string()).optional(),
  deepThink: z.boolean().optional(),
  googleSearch: z.boolean().optional(),
});

module.exports = {
  chatbotRequestSchema,
};

