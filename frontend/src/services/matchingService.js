import api from "./api";

/**
 * @param {{ topic: string; matchType: string; numPairs: number; timeLimitMinutes: number }} payload
 */
export async function generateMatchingGame(payload) {
  const res = await api.post("/api/matching/generate", payload);
  return res.data;
}
