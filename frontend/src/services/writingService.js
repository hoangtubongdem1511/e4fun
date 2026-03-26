import api from "./api";

export async function analyzeWriting({ topic, content, level }) {
  const res = await api.post("/api/writing", { topic, content, level });
  return res.data;
}

export function extractWritingText(resData) {
  return resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function analyzeWritingText({ topic, content, level }) {
  const resData = await analyzeWriting({ topic, content, level });
  return extractWritingText(resData);
}
