import api from "./api";

export async function analyzeWriting({ topic, content }) {
  const res = await api.post("/api/writing", { topic, content });
  return res.data;
}

export function extractWritingText(resData) {
  return resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function analyzeWritingText({ topic, content }) {
  const resData = await analyzeWriting({ topic, content });
  return extractWritingText(resData);
}
