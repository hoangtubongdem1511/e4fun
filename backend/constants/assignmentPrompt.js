function assignmentPrompt(topic, numQuestions, questionTypes) {
  const typesText = Array.isArray(questionTypes) && questionTypes.length > 0
    ? questionTypes.join(', ')
    : 'Vocabulary, Grammar';

  return `
Bạn là giáo viên tiếng Anh. Hãy tạo bộ câu hỏi trắc nghiệm theo yêu cầu bên dưới.

INPUT:
- topic: "${topic}"
- numQuestions: ${numQuestions}
- questionTypes: ${typesText}

YÊU CẦU NỘI DUNG:
1) Tạo đúng ${numQuestions} câu hỏi tiếng Anh, bám sát topic.
2) Câu hỏi rõ ràng, ngắn gọn, phù hợp người học tiếng Anh.
3) Mỗi câu có đúng 4 đáp án trong "options", chỉ 1 đáp án đúng.
4) "answer" phải là chuỗi trùng khớp chính xác với một phần tử trong "options".
5) "explanation" giải thích ngắn gọn bằng tiếng Việt (1-3 câu).
6) Tránh câu mơ hồ; đáp án nhiễu hợp lý nhưng không đánh đố.

RÀNG BUỘC OUTPUT (BẮT BUỘC):
- Chỉ trả về JSON thuần (valid JSON), không markdown, không code block, không text ngoài JSON.
- Kết quả là một JSON array.
- Mỗi phần tử có đúng 4 field:
  - "question": string
  - "options": string[] (đúng 4 phần tử, không trùng nhau)
  - "answer": string (phải nằm trong options)
  - "explanation": string (tiếng Việt)
- Không thêm field khác.

Ví dụ shape hợp lệ:
[
  {
    "question": "....",
    "options": ["A", "B", "C", "D"],
    "answer": "B",
    "explanation": "..."
  }
]
`;
}

module.exports = { assignmentPrompt };

