import { z } from "zod";

export const MATCH_TYPES = [
  "WORD_DEFINITION",
  "SYNONYM",
  "ANTONYM",
  "PHRASE_MEANING",
  "IDIOM_EXPLANATION",
  "PRONUNCIATION_WORD",
];

export const matchingSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập chủ đề")
    .max(200, "Chủ đề quá dài"),
  matchType: z.enum(MATCH_TYPES, { message: "Loại ghép không hợp lệ" }),
  numPairs: z.coerce
    .number()
    .int("Số cặp phải là số nguyên")
    .min(4, "Số cặp từ 4 đến 12")
    .max(12, "Số cặp từ 4 đến 12"),
  timeLimitMinutes: z.coerce
    .number()
    .int()
    .min(1, "Thời gian từ 1 đến 15 phút")
    .max(15, "Thời gian từ 1 đến 15 phút"),
});
