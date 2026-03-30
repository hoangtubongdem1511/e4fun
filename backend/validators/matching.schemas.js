const { z } = require('zod');

const MATCH_TYPES = z.enum([
  'WORD_DEFINITION',
  'SYNONYM',
  'ANTONYM',
  'PHRASE_MEANING',
  'IDIOM_EXPLANATION',
  'PRONUNCIATION_WORD',
]);

const generateMatchingSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, 'Chủ đề không được để trống')
    .max(200, 'Chủ đề quá dài'),
  matchType: MATCH_TYPES,
  numPairs: z.coerce
    .number()
    .int('Số cặp phải là số nguyên')
    .min(4, 'Số cặp từ 4 đến 12')
    .max(12, 'Số cặp từ 4 đến 12'),
  timeLimitMinutes: z.coerce
    .number()
    .int()
    .min(1, 'Thời gian từ 1 đến 15 phút')
    .max(15, 'Thời gian từ 1 đến 15 phút'),
});

module.exports = {
  generateMatchingSchema,
  MATCH_TYPES,
};
