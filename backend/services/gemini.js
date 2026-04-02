const axios = require('axios');
const logger = require('../utils/logger');
const { dictionaryPrompt } = require('../constants/dictionaryPrompt');
const { writingPrompt } = require('../constants/writingPrompt');
const { assignmentPrompt } = require('../constants/assignmentPrompt');
const { matchingPrompt } = require('../constants/matchingPrompt');
const chatbotScopePrompt = require('../constants/chatPrompt');
const {
  makeAiCacheKey,
  getCachedResult,
  setCachedResult,
  getInflight,
  setInflight,
  clearInflight,
} = require('../utils/aiCache');
const { mapGeminiError } = require('../utils/aiErrorMapper');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
// README/DEPLOY dùng GOOGLE_API_KEY; code cũ dùng GEMINI_API_KEY — hỗ trợ cả hai.
const SERVER_GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const CACHE_TTL = {
  dictionary: 30 * 60 * 1000,
  writing: 5 * 60 * 1000,
  assignment: 10 * 60 * 1000,
  matching: 10 * 60 * 1000,
  chatbot: 0,
};

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

function isRetryableStatus(status) {
  return status === 429 || status === 503;
}

async function postGeminiWithResilience({
  endpoint,
  apiKey,
  payload,
  requestId,
  useResultCache = true,
  useInflightDedup = true,
  maxRetries = 0,
  ttlMs = 0,
}) {
  const url = buildGeminiApiUrl(apiKey);
  const key = makeAiCacheKey({
    endpoint,
    model: GEMINI_MODEL,
    apiKey,
    payload,
  });

  if (useResultCache && ttlMs > 0) {
    const cached = getCachedResult(key);
    if (cached) {
      logger.info({ requestId, endpoint, cache: 'hit' }, 'AI cache hit');
      return cached;
    }
  }

  if (useInflightDedup) {
    const inflight = getInflight(key);
    if (inflight) {
      logger.info({ requestId, endpoint, cache: 'inflight-hit' }, 'AI inflight dedupe hit');
      return inflight;
    }
  }

  const requestPromise = (async () => {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await axios.post(url, payload);
        if (useResultCache && ttlMs > 0) {
          setCachedResult(key, response.data, ttlMs);
          logger.info({ requestId, endpoint, cache: 'stored' }, 'AI cache stored');
        }
        return response.data;
      } catch (err) {
        lastError = err;
        const status = err?.response?.status;
        if (attempt < maxRetries && isRetryableStatus(status)) {
          const backoffMs = 250 * 2 ** attempt + Math.floor(Math.random() * 120);
          logger.warn(
            { requestId, endpoint, attempt: attempt + 1, status, backoffMs },
            'AI call retrying after transient error',
          );
          await sleep(backoffMs);
          continue;
        }
        break;
      }
    }
    throw mapGeminiError(lastError, { endpoint });
  })();

  if (useInflightDedup) {
    setInflight(key, requestPromise);
    try {
      return await requestPromise;
    } finally {
      clearInflight(key);
    }
  }

  return requestPromise;
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
  return postGeminiWithResilience({
    endpoint: 'dictionary',
    apiKey,
    requestId,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
    useResultCache: true,
    useInflightDedup: true,
    maxRetries: 2,
    ttlMs: CACHE_TTL.dictionary,
  });
}

// Hàm gọi Gemini cho luyện viết
async function evaluateWriting(topic, content, { requestId, apiKey, level } = {}) {
  const prompt = writingPrompt(topic, content, level);
  return postGeminiWithResilience({
    endpoint: 'writing',
    apiKey,
    requestId,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
    useResultCache: true,
    useInflightDedup: true,
    maxRetries: 1,
    ttlMs: CACHE_TTL.writing,
  });
}

async function generateAssignment(topic, numQuestions, questionTypes, { requestId, apiKey } = {}) {
  const prompt = assignmentPrompt(topic, numQuestions, questionTypes);
  return postGeminiWithResilience({
    endpoint: 'assignment',
    apiKey,
    requestId,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
    useResultCache: true,
    useInflightDedup: true,
    maxRetries: 2,
    ttlMs: CACHE_TTL.assignment,
  });
}

async function generateMatching(topic, matchType, numPairs, { requestId, apiKey } = {}) {
  const prompt = matchingPrompt(topic, matchType, numPairs);
  return postGeminiWithResilience({
    endpoint: 'matching',
    apiKey,
    requestId,
    payload: {
      contents: [{ parts: [{ text: prompt }] }],
    },
    useResultCache: true,
    useInflightDedup: true,
    maxRetries: 2,
    ttlMs: CACHE_TTL.matching,
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
      
      const response = await axios.post(visionApiUrl, {
        contents: [{ parts: visionParts }]
      });
      
      logger.info({ requestId }, 'Vision API response received');
      return response.data;
    } catch (error) {
      logger.error(
        { requestId, visionError: error.response?.data || error.message },
        'Vision API error',
      );
      
      // Fallback to text-only if vision fails
      let fallbackMessage = "Xin lỗi, tôi không thể phân tích ảnh lúc này.";
      
      if (error.response?.data?.error?.code === 429 || error.response?.status === 429) {
        fallbackMessage = "Xin lỗi, tôi đã vượt quá giới hạn sử dụng cho tính năng phân tích ảnh. Bạn có thể:\n\n1. Thử lại sau vài phút\n2. Mô tả ảnh bằng lời để tôi có thể giúp bạn\n3. Kiểm tra quota API key của bạn";
      } else if (error.response?.data?.error?.message?.includes('not found')) {
        fallbackMessage = "Xin lỗi, model phân tích ảnh không khả dụng. Bạn có thể mô tả ảnh bằng lời để tôi có thể giúp bạn.";
      }
      
      const fallbackPrompt = prompt + "\n\n" + fallbackMessage;
      return postGeminiWithResilience({
        endpoint: 'chatbot',
        apiKey,
        requestId,
        payload: {
          contents: [{ parts: [{ text: fallbackPrompt }] }],
        },
        useResultCache: false,
        useInflightDedup: true,
        maxRetries: 1,
        ttlMs: CACHE_TTL.chatbot,
      });
    }
  } else {
    // Không có ảnh, sử dụng model text thường
    return postGeminiWithResilience({
      endpoint: 'chatbot',
      apiKey,
      requestId,
      payload: {
        contents: [{ parts }],
      },
      useResultCache: false,
      useInflightDedup: true,
      maxRetries: 1,
      ttlMs: CACHE_TTL.chatbot,
    });
  }
}

module.exports = {
  getDictionary,
  evaluateWriting,
  chatWithAI,
  generateAssignment,
  generateMatching,
  buildGeminiApiUrl,
};