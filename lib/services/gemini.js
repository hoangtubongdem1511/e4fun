const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const DEFAULT_MODEL = 'gemini-1.5-flash';
const GEMINI_API_URL = (model) => `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, model = DEFAULT_MODEL, parts = null) {
  const payload = parts ? { contents: [{ parts }] } : { contents: [{ parts: [{ text: prompt }] }] };
  const response = await axios.post(GEMINI_API_URL(model), payload);
  return response.data;
}

async function getDictionary(word, context) {
  const prompt = `Hãy tra cứu từ "${word}" trong tiếng Anh và trả lời theo đúng cấu trúc sau (bằng markdown):

1. Phát âm
2. Giải nghĩa
3. Ứng dụng vào ngữ pháp
4. Cụm từ và thành ngữ liên quan
5. Thông tin thú vị và mẹo học từ này

Nếu không có thông tin cho mục nào, hãy ghi 'Không có thông tin'.${context ? `\nNgữ cảnh: ${context}` : ''}`;
  return await callGemini(prompt);
}

async function evaluateWriting(topic, content) {
  const prompt = `Bạn là giáo viên tiếng Anh. Hãy chấm điểm và nhận xét bài viết tiếng Anh với đề bài: "${topic}". Nội dung: ${content}

Hãy trả lời đúng theo cấu trúc sau (bằng markdown, ghi rõ số thứ tự và tiêu đề từng mục):

1. Điểm số (trên thang 10)
2. Điểm mạnh
3. Điểm yếu
4. Phản hồi cụ thể và đề xuất cải tiến

Nếu không có thông tin cho mục nào, hãy ghi 'Không có thông tin'.`;
  return await callGemini(prompt);
}

async function chatWithAI({ message, images, deepThink, googleSearch }) {
  let prompt = message || '';
  if (deepThink) prompt = 'Hãy suy nghĩ sâu sắc trước khi trả lời: ' + prompt;
  if (googleSearch) prompt += ' (Hãy xác minh thông tin bằng Google Search nếu cần)';

  if (images && images.length > 0) {
    const parts = [{ text: `Hãy phân tích ảnh này và trả lời câu hỏi: ${prompt}` }];
    for (const imageUrl of images) {
      try {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
        parts.push({ inline_data: { mime_type: 'image/jpeg', data: base64Image } });
      } catch (err) {
        // bỏ qua ảnh lỗi
      }
    }
    return await callGemini('', 'gemini-1.5-flash', parts);
  }

  return await callGemini(prompt);
}

async function generateAssignment(topic, numQuestions, questionTypes = []) {
  const listTypes = Array.isArray(questionTypes) ? questionTypes.join(', ') : '';
  const prompt = `Hãy tạo ${numQuestions} câu hỏi tiếng Anh về chủ đề "${topic}" với các dạng: ${listTypes}.
Trả về kết quả dưới dạng JSON (một mảng), mỗi phần tử gồm đúng các trường sau:
- question: string
- options: array<string> (4 đáp án)
- answer: string (CHỈ 1 đáp án đúng duy nhất)
- explanation: string (giải thích ngắn gọn)

Chỉ in JSON thuần, không kèm ```json.`;
  return await callGemini(prompt);
}

module.exports = { getDictionary, evaluateWriting, chatWithAI, generateAssignment };
