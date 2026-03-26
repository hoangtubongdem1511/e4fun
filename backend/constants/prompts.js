const { writingPrompt } = require('./writingPrompt');
const { dictionaryPrompt } = require('./dictionaryPrompt');

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

