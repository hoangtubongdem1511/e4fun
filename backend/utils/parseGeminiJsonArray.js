/**
 * Extract first JSON array from model text (handles leading/trailing prose or fences).
 */
function parseGeminiJsonArray(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) return [];

  let text = rawText;
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    text = text.substring(firstBracket, lastBracket + 1);
  }

  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return [parsed];
    return [];
  } catch {
    return [];
  }
}

module.exports = { parseGeminiJsonArray };
