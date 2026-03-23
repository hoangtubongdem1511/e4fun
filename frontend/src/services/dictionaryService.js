import api from "./api";

export async function lookupWord(word) {
  const res = await api.post("/api/dictionary", { word });
  return res.data;
}

export function extractDictionaryText(resData) {
  return resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function lookupWordText(word) {
  const resData = await lookupWord(word);
  return extractDictionaryText(resData);
}
