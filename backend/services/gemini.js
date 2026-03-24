const axios = require('axios');
const logger = require('../utils/logger');
const { dictionaryPrompt, writingPrompt, assignmentPrompt } = require('../constants/prompts');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/' +
  GEMINI_MODEL +
  ':generateContent?key=' +
  GEMINI_API_KEY;

// Hàm gọi Gemini cho từ điển
async function getDictionary(word, context, { requestId } = {}) {
  const prompt = dictionaryPrompt(word, context);
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

// Hàm gọi Gemini cho luyện viết
async function evaluateWriting(topic, content, { requestId } = {}) {
  const prompt = writingPrompt(topic, content);
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

async function generateAssignment(topic, numQuestions, questionTypes, { requestId } = {}) {
  const prompt = assignmentPrompt(topic, numQuestions, questionTypes);
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

// Hàm gọi Gemini cho chatbot
async function chatWithAI({ message, images, deepThink, googleSearch }, { requestId } = {}) {
  let prompt = message;
  if (deepThink) prompt = "Hãy suy nghĩ sâu sắc trước khi trả lời: " + prompt;
  if (googleSearch) prompt += " (Hãy xác minh thông tin bằng Google Search nếu cần)";
  
  // Xử lý ảnh nếu có
  const parts = [{ text: prompt }];
  if (images && images.length > 0) {
    try {
      logger.info({ requestId, imageCount: images.length }, 'Processing images');
      
      // Sử dụng Gemini model cho ảnh (multimodal)
      const visionApiUrl =
        'https://generativelanguage.googleapis.com/v1/models/' +
        GEMINI_MODEL +
        ':generateContent?key=' +
        GEMINI_API_KEY;
      
      // Tạo prompt cho ảnh
      const imagePrompt = `Hãy phân tích ảnh này và trả lời câu hỏi: ${prompt}`;
      
      // Chuẩn bị parts với ảnh
      const visionParts = [{ text: imagePrompt }];
      
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        try {
          logger.info({ requestId, index: i + 1, imageUrl }, 'Processing image');
          
          // Download ảnh từ URL và convert thành base64
          const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
          });
          
          const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
          logger.info({ requestId, index: i + 1, base64Length: base64Image.length }, 'Image converted to base64');
          
          visionParts.push({
            inline_data: {
              mime_type: "image/jpeg",
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
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ parts: [{ text: fallbackPrompt }] }]
      });
      return response.data;
    }
  } else {
    // Không có ảnh, sử dụng model text thường
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts }]
    });
    return response.data;
  }
}

module.exports = { getDictionary, evaluateWriting, chatWithAI, generateAssignment };