const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;

// Hàm gọi Gemini cho từ điển
async function getDictionary(word, context) {
  const prompt = `
Hãy tra cứu từ "${word}" trong tiếng Anh và trả lời theo đúng cấu trúc sau (bằng markdown, ghi rõ số thứ tự và tiêu đề từng mục, kết quả trả về bằng tiếng việt):

"${word}"
1. Phát âm
2. Giải nghĩa
3. Ứng dụng vào ngữ pháp
4. Cụm từ và thành ngữ liên quan
5. Thông tin thú vị và mẹo học từ này

Nếu không có thông tin cho mục nào, hãy ghi 'Không có thông tin'.
${context ? `\nNgữ cảnh: ${context}` : ''}
  `;
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

// Hàm gọi Gemini cho luyện viết
async function evaluateWriting(topic, content) {
  const prompt = `Bạn là giáo viên tiếng Anh. Hãy chấm điểm và nhận xét bài viết tiếng Anh với đề bài: "${topic}". Nội dung: ${content}

Hãy trả lời đúng theo cấu trúc sau (bằng markdown, ghi rõ số thứ tự và tiêu đề từng mục, kết quả trả về bằng tiếng việt):

Nhận xét chung
1. Điểm số (trên thang 10)
2. Điểm mạnh
3. Điểm yếu
4. Phản hồi cụ thể và đề xuất cải tiến

Nếu không có thông tin cho mục nào, hãy ghi 'Không có thông tin'.`;
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

async function generateAssignment(topic, numQuestions, questionTypes) {
  const prompt = `
Hãy tạo ${numQuestions} câu hỏi tiếng Anh về chủ đề "${topic}" với các dạng: ${questionTypes.join(', ')}.
Trả về kết quả dưới dạng JSON, mỗi phần tử gồm:
- question: nội dung câu hỏi
- options: mảng các đáp án
- answer: chỉ 1 đáp án đúng (string, KHÔNG được trả về nhiều đáp án)
- explanation: giải thích đáp án đúng bằng tiếng việt
Chỉ trả về 1 đáp án đúng duy nhất cho mỗi câu hỏi.
`;
  const response = await axios.post(GEMINI_API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data;
}

// Hàm gọi Gemini cho chatbot
async function chatWithAI({ message, images, deepThink, googleSearch }) {
  let prompt = message;
  if (deepThink) prompt = "Hãy suy nghĩ sâu sắc trước khi trả lời: " + prompt;
  if (googleSearch) prompt += " (Hãy xác minh thông tin bằng Google Search nếu cần)";
  
  // Xử lý ảnh nếu có
  const parts = [{ text: prompt }];
  if (images && images.length > 0) {
    try {
      console.log('Processing images:', images.length, 'images');
      
      // Sử dụng Gemini Pro Vision cho ảnh
      const visionApiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;
      
      // Tạo prompt cho ảnh
      const imagePrompt = `Hãy phân tích ảnh này và trả lời câu hỏi: ${prompt}`;
      
      // Chuẩn bị parts với ảnh
      const visionParts = [{ text: imagePrompt }];
      
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        try {
          console.log(`Processing image ${i + 1}:`, imageUrl);
          
          // Download ảnh từ URL và convert thành base64
          const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
          });
          
          const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
          console.log(`Image ${i + 1} converted to base64, length:`, base64Image.length);
          
          visionParts.push({
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          });
        } catch (imageError) {
          console.error(`Error processing image ${i + 1}:`, imageError);
          // Bỏ qua ảnh lỗi và tiếp tục với ảnh khác
        }
      }
      
      console.log('Sending request to Gemini Vision API with', visionParts.length - 1, 'images');
      
      const response = await axios.post(visionApiUrl, {
        contents: [{ parts: visionParts }]
      });
      
      console.log('Vision API response received');
      return response.data;
    } catch (error) {
      console.error('Vision API error:', error.response?.data || error.message);
      
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