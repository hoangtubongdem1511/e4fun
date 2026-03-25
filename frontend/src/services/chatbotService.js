import api from "./api";

export async function sendChatMessage(payload) {
  const res = await api.post("/api/chatbot", payload);
  return res.data;
}

export function extractChatbotText(resData) {
  return resData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Không có phản hồi";
}

export async function sendChatMessageText(payload) {
  const resData = await sendChatMessage(payload);
  return extractChatbotText(resData);
}
