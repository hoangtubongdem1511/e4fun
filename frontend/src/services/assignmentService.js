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
    const parsed = JSON.parse(text);
    // Khi model trả về 1 câu, đôi khi sẽ là object thay vì array.
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return [parsed];
    return [];
  } catch (e) {
    console.error("Parse error:", e, text);
    return [];
  }
}

function normalizeQuestionItem(item, idx) {
  if (!item || typeof item !== "object") return null;

  const questionText =
    typeof item.question === "string" && item.question.trim()
      ? item.question.trim()
      : `Câu ${idx + 1}`;

  const options = Array.isArray(item.options)
    ? item.options.filter((opt) => typeof opt === "string" && opt.trim())
    : [];

  if (options.length === 0) return null;

  let answer = item.answer;
  if (typeof answer === "undefined" && typeof item.answerIndex === "number") {
    answer = options[item.answerIndex];
  }
  if (typeof answer !== "string" || !answer.trim()) {
    answer = options[0];
  }

  return {
    ...item,
    question: questionText,
    options,
    answer,
    explanation:
      typeof item.explanation === "string" ? item.explanation : "",
  };
}

export async function generateAssignmentQuestions(data) {
  const resData = await generateAssignment(data);
  const quizListText = extractQuizListText(resData);
  const parsed = parseQuizListText(quizListText);
  return parsed
    .map((item, idx) => normalizeQuestionItem(item, idx))
    .filter(Boolean);
}

export async function gradeAssignment(payload) {
  const res = await api.post("/api/assignment/grade", payload);
  return res.data;
}
