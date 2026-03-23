import api from "./api";

export async function generateAssignment(data) {
  const res = await api.post("/api/assignment/generate", data);
  return res.data;
}

export function extractQuizListText(resData) {
  return resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

/**
 * Parse quiz list from model raw text that may contain leading/trailing text.
 * It extracts JSON between the first `[` and the last `]`, then JSON.parse.
 */
export function parseQuizListText(quizListText) {
  if (!quizListText) return [];

  let text = quizListText;

  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1) {
    text = text.substring(firstBracket, lastBracket + 1);
  }

  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Parse error:", e, text);
    return [];
  }
}

export async function generateAssignmentQuestions(data) {
  const resData = await generateAssignment(data);
  const quizListText = extractQuizListText(resData);
  return parseQuizListText(quizListText);
}

export async function gradeAssignment(payload) {
  const res = await api.post("/api/assignment/grade", payload);
  return res.data;
}
