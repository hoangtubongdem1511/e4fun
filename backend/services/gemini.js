const axios = require('axios');
const logger = require('../utils/logger');
const { dictionaryPrompt, writingPrompt, assignmentPrompt } = require('../constants/prompts');
const chatbotScopePrompt = require('../constants/chatPrompt');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const SERVER_GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
  const response = await axios.post(buildGeminiApiUrl(apiKey), {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.data;
}

// Hàm gọi Gemini cho luyện viết
async function evaluateWriting(topic, content, { requestId, apiKey, level } = {}) {
  const prompt = writingPrompt(topic, content, level);
  const response = await axios.post(buildGeminiApiUrl(apiKey), {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.data;
}

async function generateAssignment(topic, numQuestions, questionTypes, { requestId, apiKey } = {}) {
  const prompt = assignmentPrompt(topic, numQuestions, questionTypes);
  const response = await axios.post(buildGeminiApiUrl(apiKey), {
    contents: [{ parts: [{ text: prompt }] }],
  });
  return response.data;
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
      
      if (error.response?.data?.error?.code === 429) {
        fallbackMessage = "Xin lỗi, tôi đã vượt quá giới hạn sử dụng cho tính năng phân tích ảnh. Bạn có thể:\n\n1. Thử lại sau vài phút\n2. Mô tả ảnh bằng lời để tôi có thể giúp bạn\n3. Kiểm tra quota API key của bạn";
      } else if (error.response?.data?.error?.message?.includes('not found')) {
        fallbackMessage = "Xin lỗi, model phân tích ảnh không khả dụng. Bạn có thể mô tả ảnh bằng lời để tôi có thể giúp bạn.";
      }
      
      const fallbackPrompt = prompt + "\n\n" + fallbackMessage;
      const response = await axios.post(textApiUrl, {
        contents: [{ parts: [{ text: fallbackPrompt }] }],
      });
      return response.data;
    }
  } else {
    // Không có ảnh, sử dụng model text thường
    const response = await axios.post(textApiUrl, {
      contents: [{ parts }],
    });
    return response.data;
  }
}

module.exports = { getDictionary, evaluateWriting, chatWithAI, generateAssignment, buildGeminiApiUrl };