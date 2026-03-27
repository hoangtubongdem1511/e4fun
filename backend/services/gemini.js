const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');
const { dictionaryPrompt } = require('../constants/dictionaryPrompt');
const { writingPrompt } = require('../constants/writingPrompt');
const { assignmentPrompt } = require('../constants/assignmentPrompt');
const chatbotScopePrompt = require('../constants/chatPrompt');
const { clearExpired, getCache, setCache, getInflight, setInflight, clearInflight } = require('../utils/aiCache');
const { mapAiError } = require('../utils/aiErrorMapper');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const SERVER_GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DICTIONARY_CACHE_TTL_MS = 30 * 60 * 1000;
const WRITING_CACHE_TTL_MS = 5 * 60 * 1000;
const ASSIGNMENT_CACHE_TTL_MS = 10 * 60 * 1000;

function buildGeminiApiUrl(apiKey) {
  // Back-compat: nếu không có per-user apiKey (header bị thiếu / chưa implement),
  // vẫn fallback về GEMINI_API_KEY trong env để app chạy bình thường.
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    apiKey = SERVER_GEMINI_API_KEY;
  }

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('Gemini apiKey is required');
  }

  return (
    'https://generativelanguage.googleapis.com/v1/models/' +
    GEMINI_MODEL +
    ':generateContent?key=' +
    apiKey.trim()
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeApiKeyScope(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return 'server_default';
  return crypto.createHash('sha256').update(apiKey.trim()).digest('hex').slice(0, 12);
}

function buildCacheKey(endpoint, apiKey, payload) {
  const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return `${endpoint}:${GEMINI_MODEL}:${safeApiKeyScope(apiKey)}:${payloadHash}`;
}

function isRetriableStatus(status) {
  return status === 429 || status === 503 || status === 502 || status === 504;
}

async function postWithRetry(apiUrl, payload, { requestId, endpoint, retries = 1 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await axios.post(apiUrl, payload);
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      const canRetry = attempt < retries && isRetriableStatus(status);
      if (!canRetry) break;
      const backoffMs = Math.min(800 * (2 ** attempt) + Math.floor(Math.random() * 300), 2500);
      logger.warn({ requestId, endpoint, attempt, status, backoffMs }, 'Gemini request retrying');
      await sleep(backoffMs);
    }
  }
  throw lastErr;
}

async function callGeminiWithPolicies({
  endpoint,
  payload,
  apiKey,
  requestId,
  cacheTtlMs = 0,
  useInflightDedupe = true,
  retries = 1,
} = {}) {
  clearExpired();
  const key = buildCacheKey(endpoint, apiKey, payload);

  if (cacheTtlMs > 0) {
    const cached = getCache(key);
    if (typeof cached !== 'undefined') {
      logger.info({ requestId, endpoint }, 'AI cache hit');
      return cached;
    }
  }

  if (useInflightDedupe) {
    const inProgress = getInflight(key);
    if (inProgress) {
      logger.info({ requestId, endpoint }, 'AI inflight dedupe hit');
      return inProgress;
    }
  }

  const work = (async () => {
    const apiUrl = buildGeminiApiUrl(apiKey);
    try {
      const response = await postWithRetry(apiUrl, payload, { requestId, endpoint, retries });
      if (cacheTtlMs > 0) setCache(key, response.data, cacheTtlMs);
      return response.data;
    } catch (err) {
      throw mapAiError(err, { endpoint });
    }
  })();

  if (useInflightDedupe) setInflight(key, work);

  try {
    return await work;
  } finally {
    if (useInflightDedupe) clearInflight(key);
  }
}

function buildChatbotScopePrompt(scopeObj) {
  if (!scopeObj || typeof scopeObj !== 'object') return '';
  const sections = [scopeObj.role, scopeObj.scope, scopeObj.behavior, scopeObj.hints]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .map((part) => part.trim());
  return sections.join('\n\n');
}

const CHATBOT_SCOPE_PROMPT = buildChatbotScopePrompt(chatbotScopePrompt);

// Hàm gọi Gemini cho từ điển
async function getDictionary(word, context, { requestId, apiKey } = {}) {
  const prompt = dictionaryPrompt(word, context);
  return callGeminiWithPolicies({
    endpoint: 'dictionary',
    apiKey,
    requestId,
    cacheTtlMs: DICTIONARY_CACHE_TTL_MS,
    retries: 2,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
  });
}

// Hàm gọi Gemini cho luyện viết
async function evaluateWriting(topic, content, { requestId, apiKey, level } = {}) {
  const prompt = writingPrompt(topic, content, level);
  return callGeminiWithPolicies({
    endpoint: 'writing',
    apiKey,
    requestId,
    cacheTtlMs: WRITING_CACHE_TTL_MS,
    retries: 1,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
  });
}

async function generateAssignment(topic, numQuestions, questionTypes, { requestId, apiKey } = {}) {
  const prompt = assignmentPrompt(topic, numQuestions, questionTypes);
  return callGeminiWithPolicies({
    endpoint: 'assignment',
    apiKey,
    requestId,
    cacheTtlMs: ASSIGNMENT_CACHE_TTL_MS,
    retries: 2,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
  });
}

// Hàm gọi Gemini cho chatbot
async function chatWithAI({ message, files, deepThink, googleSearch }, { requestId, apiKey } = {}) {
  const textApiUrl = buildGeminiApiUrl(apiKey);

  let userPrompt = message || '';
  if (deepThink) userPrompt = "Hãy suy nghĩ sâu sắc trước khi trả lời: " + userPrompt;
  if (googleSearch) userPrompt += " (Hãy xác minh thông tin bằng Google Search nếu cần)";

  const prompt = (CHATBOT_SCOPE_PROMPT ? `${CHATBOT_SCOPE_PROMPT}\n\n---\n\n` : '') + `Người học: ${userPrompt}`;
  
  // Xử lý ảnh nếu có
  const parts = [{ text: prompt }];
  if (files && files.length > 0) {
    try {
      logger.info({ requestId, imageCount: files.length }, 'Processing images');
      
      const visionApiUrl = textApiUrl;
      
      // Tạo prompt cho ảnh
      const imagePrompt = `Hãy phân tích ảnh này và trả lời câu hỏi sau:\n\n${prompt}`;
      
      // Chuẩn bị parts với ảnh
      const visionParts = [{ text: imagePrompt }];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          logger.info({ requestId, index: i + 1, mimeType: file.mimetype, size: file.size }, 'Processing image');

          const base64Image = Buffer.from(file.buffer).toString('base64');
          logger.info({ requestId, index: i + 1, base64Length: base64Image.length }, 'Image converted to base64');
          
          visionParts.push({
            inline_data: {
              mime_type: file.mimetype || "image/jpeg",
              data: base64Image
            }
          });
        } catch (imageError) {
          logger.warn(
            { requestId, index: i + 1, error: imageError?.message || String(imageError) },
            'Error processing image',
          );
          // Bỏ qua ảnh lỗi và tiếp tục với ảnh khác
        }
      }
      
      logger.info({ requestId, imageCount: visionParts.length - 1 }, 'Sending request to Gemini Vision API');
      
      const response = await postWithRetry(
        visionApiUrl,
        { contents: [{ parts: visionParts }] },
        { requestId, endpoint: 'chatbot_vision', retries: 1 },
      );
      
      logger.info({ requestId }, 'Vision API response received');
      return response.data;
    } catch (error) {
      logger.error(
        { requestId, visionError: error.response?.data || error.message },
        'Vision API error',
      );
      
      // Fallback to text-only if vision fails
      let fallbackMessage = "Xin lỗi, tôi không thể phân tích ảnh lúc này.";
      
      if (error.response?.data?.error?.code === 429) {
        fallbackMessage = "Xin lỗi, tôi đã vượt quá giới hạn sử dụng cho tính năng phân tích ảnh. Bạn có thể:\n\n1. Thử lại sau vài phút\n2. Mô tả ảnh bằng lời để tôi có thể giúp bạn\n3. Kiểm tra quota API key của bạn";
      } else if (error.response?.data?.error?.message?.includes('not found')) {
        fallbackMessage = "Xin lỗi, model phân tích ảnh không khả dụng. Bạn có thể mô tả ảnh bằng lời để tôi có thể giúp bạn.";
      }
      
      const fallbackPrompt = prompt + "\n\n" + fallbackMessage;
      try {
        const response = await postWithRetry(
          textApiUrl,
          { contents: [{ parts: [{ text: fallbackPrompt }] }] },
          { requestId, endpoint: 'chatbot_text_fallback', retries: 1 },
        );
        return response.data;
      } catch (fallbackErr) {
        throw mapAiError(fallbackErr, { endpoint: 'chatbot' });
      }
    }
  } else {
    // Không có ảnh, sử dụng model text thường
    try {
      const response = await postWithRetry(
        textApiUrl,
        { contents: [{ parts }] },
        { requestId, endpoint: 'chatbot', retries: 1 },
      );
      return response.data;
    } catch (err) {
      throw mapAiError(err, { endpoint: 'chatbot' });
    }
  }
}

module.exports = { getDictionary, evaluateWriting, chatWithAI, generateAssignment, buildGeminiApiUrl };