const { writingPrompt } = require('./writingPrompt');

function dictionaryPrompt(word, context) {
  return `
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
}

function assignmentPrompt(topic, numQuestions, questionTypes) {
  return `
Hãy tạo ${numQuestions} câu hỏi tiếng Anh về chủ đề "${topic}" với các dạng: ${questionTypes.join(', ')}.
Trả về kết quả dưới dạng JSON, mỗi phần tử gồm:
- question: nội dung câu hỏi
- options: mảng các đáp án
- answer: chỉ 1 đáp án đúng (string, KHÔNG được trả về nhiều đáp án)
- explanation: giải thích đáp án đúng bằng tiếng việt
Chỉ trả về 1 đáp án đúng duy nhất cho mỗi câu hỏi.
`;
}

module.exports = {
  dictionaryPrompt,
  writingPrompt,
  assignmentPrompt,
};

