const { generateMatching } = require('../services/gemini');
const { parseGeminiJsonArray } = require('../utils/parseGeminiJsonArray');
const AppError = require('../utils/appError');
const errorCodes = require('../constants/errorCodes');

function extractGeminiText(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

function labelsForMatchType(matchType) {
  const map = {
    WORD_DEFINITION: { left: 'Từ', right: 'Định nghĩa' },
    SYNONYM: { left: 'Từ A', right: 'Từ B' },
    ANTONYM: { left: 'Từ', right: 'Trái nghĩa' },
    PHRASE_MEANING: { left: 'Cụm từ', right: 'Ý nghĩa' },
    IDIOM_EXPLANATION: { left: 'Thành ngữ', right: 'Giải thích' },
    PRONUNCIATION_WORD: { left: 'Phát âm (IPA)', right: 'Từ' },
  };
  return map[matchType] || map.WORD_DEFINITION;
}

function normalizePair(item) {
  if (!item || typeof item !== 'object') return null;
  const left = typeof item.left === 'string' ? item.left.trim() : '';
  const right = typeof item.right === 'string' ? item.right.trim() : '';
  const explanation = typeof item.explanation === 'string' ? item.explanation.trim() : '';
  if (!left || !right) return null;
  return {
    left,
    right,
    explanation: explanation || 'Không có giải thích thêm.',
  };
}

async function postGenerate(req, res) {
  const { topic, matchType, numPairs, timeLimitMinutes } = req.body;

  const raw = await generateMatching(topic, matchType, numPairs, {
    requestId: req.requestId,
    apiKey: req.geminiApiKey,
  });

  const text = extractGeminiText(raw);
  const arr = parseGeminiJsonArray(text);
  const normalized = [];

  for (let i = 0; i < arr.length && normalized.length < numPairs; i += 1) {
    const one = normalizePair(arr[i]);
    if (one) normalized.push(one);
  }

  if (normalized.length < numPairs) {
    throw new AppError({
      statusCode: 502,
      code: errorCodes.AI_PROVIDER_ERROR,
      message: `Không đủ cặp hợp lệ từ AI (${normalized.length}/${numPairs}). Vui lòng thử lại.`,
    });
  }

  const pairs = normalized.map((p, pairId) => ({ pairId, ...p }));

  return res.json({
    pairs,
    labels: labelsForMatchType(matchType),
    matchType,
    topic,
    numPairs,
    timeLimitMinutes,
  });
}

module.exports = { postGenerate };
