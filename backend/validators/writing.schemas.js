const { z } = require('zod');

// API /api/writing
const writingRequestSchema = z.object({
  topic: z.string().min(1, 'topic is required'),
  content: z.string().min(1, 'content is required'),
});

module.exports = {
  writingRequestSchema,
};

