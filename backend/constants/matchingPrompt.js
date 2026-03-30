const MATCH_TYPE_INSTRUCTIONS = {
  WORD_DEFINITION: `Mỗi cặp:
- "left": một từ/cụm từ tiếng Anh (1 từ hoặc cụm ngắn, gắn chủ đề).
- "right": định nghĩa/ngắn gọn bằng tiếng Việt (1 câu ngắn).
- "explanation": tiếng Việt, 1 dòng: vì sao hai mục này khớp hoặc gợi ý ghi nhớ.`,

  SYNONYM: `Mỗi cặp:
- "left": từ/cụm tiếng Anh thứ nhất.
- "right": từ/cụm tiếng Anh đồng nghĩa thực sự với left (không trùng chính tả).
- "explanation": tiếng Việt, 1 dòng: nghĩa chung hoặc khác biệt sắc thái nếu có.`,

  ANTONYM: `Mỗi cặp:
- "left": từ/cụm tiếng Anh.
- "right": từ/cụm tiếng Anh trái nghĩa rõ ràng.
- "explanation": tiếng Việt, 1 dòng.`,

  PHRASE_MEANING: `Mỗi cặp:
- "left": cụm từ/collocation tiếng Anh (2-6 từ).
- "right": ý nghĩa tiếng Việt ngắn gọn.
- "explanation": tiếng Việt, 1 dòng: cách dùng hoặc ngữ cảnh.`,

  IDIOM_EXPLANATION: `Mỗi cặp:
- "left": thành ngữ/tục ngữ tiếng Anh.
- "right": giải thích nghĩa bóng hoặc nghĩa thực bằng tiếng Việt (ngắn).
- "explanation": tiếng Việt, 1 dòng: ví dụ tình huống dùng.`,

  PRONUNCIATION_WORD: `Mỗi cặp:
- "left": phiên âm IPA cho một từ tiếng Anh (có dấu /.../).
- "right": chính từ tiếng Anh tương ứng (một từ).
- "explanation": tiếng Việt, 1 dòng: gợi ý phát âm hoặc stress nếu cần.`,
};

function matchingPrompt(topic, matchType, numPairs) {
  const typeKey = typeof matchType === 'string' ? matchType : 'WORD_DEFINITION';
  const typeBlock =
    MATCH_TYPE_INSTRUCTIONS[typeKey] || MATCH_TYPE_INSTRUCTIONS.WORD_DEFINITION;

  return `
Bạn là giáo viên tiếng Anh. Hãy tạo đúng ${numPairs} cặp nội dung cho trò ghép đôi (matching game).

INPUT:
- topic: "${topic}"
- matchType: "${typeKey}"
- numPairs: ${numPairs}

YÊU CẦU NỘI DUNG:
1) Tất cả cặp phải bám sát chủ đề topic.
2) Mỗi cặp là một ghép đúng duy nhất: chỉ có một "right" khớp với một "left".
3) Không trùng lặp nội dung giữa các cặp (left và right đều phải khác biệt trong toàn bộ mảng).
4) Độ khó phù hợp người học tiếng Anh trung bình.
5) ${typeBlock}

RÀNG BUỘC OUTPUT (BẮT BUỘC):
- Chỉ trả về JSON thuần (valid JSON), không markdown, không code fence, không text ngoài JSON.
- Kết quả là một JSON array đúng ${numPairs} phần tử.
- Mỗi phần tử có đúng 3 field:
  - "left": string (không rỗng)
  - "right": string (không rỗng)
  - "explanation": string (tiếng Việt, 1 dòng)
- Không thêm field khác.

Ví dụ shape hợp lệ:
[
  { "left": "...", "right": "...", "explanation": "..." }
]
`;
}

module.exports = { matchingPrompt };
