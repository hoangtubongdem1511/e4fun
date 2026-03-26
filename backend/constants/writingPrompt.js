function writingPrompt(topic, content, level) {
  const safeLevel = level && typeof level === "string" ? level : "B1";

  const LEVEL_CONFIG = {
    A1: {
      focus: "Ưu tiên lỗi cơ bản và kiểu câu ngắn; phản hồi theo hướng 'làm mẫu → làm lại'.",
      maxStrengths: 2,
      maxTaskQuotes: 1,
      stepLimit: 3,
      maxErrors: 3,
      grammarPriority: "Hiện tại đơn (V1), 'to be', số ít/số nhiều cơ bản, mạo từ a/an/the, trật tự câu đơn, dấu câu cơ bản.",
      coherencePriority: "Câu đơn rõ ràng; chuyển ý bằng từ nối rất cơ bản (and/but/also).",
      lexicalPriority: "Từ vựng cơ bản đúng nghĩa; tránh yêu cầu từ vựng học thuật."
    },
    A2: {
      focus: "Mở rộng hơn A1: tăng độ chính xác thì, giới từ; vẫn ưu tiên ví dụ ngắn.",
      maxStrengths: 2,
      maxTaskQuotes: 2,
      stepLimit: 4,
      maxErrors: 4,
      grammarPriority:
        "Thì hiện tại/ quá khứ đơn cơ bản, chủ-vị (S-V agreement) cơ bản, giới từ thường gặp, mạo từ, cấu trúc câu đơn + 1-2 câu ghép đơn giản.",
      coherencePriority: "Có bố cục rõ ràng hơn; dùng transition đơn giản (first/then/however).",
      lexicalPriority: "Collocation cơ bản theo chủ đề (ví dụ: 'go to school', 'have a dream')."
    },
    B1: {
      focus: "B1 tập trung tính rõ ràng và liên kết ở mức vừa; góp ý theo 'vấn đề → cách sửa → ví dụ'.",
      maxStrengths: 3,
      maxTaskQuotes: 2,
      stepLimit: 5,
      maxErrors: 5,
      grammarPriority:
        "Thì thông dụng và sự nhất quán, câu ghép với because/so/although (nếu có), mệnh đề quan hệ đơn giản (nếu xuất hiện), lỗi dấu câu thường gặp.",
      coherencePriority: "Mạch lạc nhờ transition hợp lý; giảm lặp/nhảy ý giữa câu.",
      lexicalPriority: "Tăng độ đa dạng từ vựng; sửa từ dùng sai ngữ cảnh, thay bằng cụm phù hợp hơn."
    },
    B2: {
      focus: "B2 tăng chiều sâu: ít lỗi lặp, nhiều góp ý 'tự nhiên hơn' và độ chính xác ngữ nghĩa.",
      maxStrengths: 3,
      maxTaskQuotes: 3,
      stepLimit: 5,
      maxErrors: 6,
      grammarPriority:
        "Câu phức vừa (relative clauses/conditional cơ bản nếu có), cấu trúc nhấn mạnh mức vừa, sự nhất quán thì và đại từ, lỗi hình thức từ.",
      errorExampleFormat:
        "Với mỗi lỗi tiêu biểu, trình bày theo format ví dụ ngắn: **Sai:** <trích 1 cụm/câu từ bài của người học> -> **Đúng:** <phiên bản đã sửa> -> **Giải thích (1 dòng):** <vì sao đúng>.",
      coherencePriority: "Transition đa dạng hơn; câu có quan hệ logic rõ (contrast/addition/cause).",
      lexicalPriority: "Tối ưu collocation và lựa chọn từ theo sắc thái; đề xuất 2-3 phương án thay thế."
      ,
      lexicalExampleFormat:
        "Khi gợi ý từ/cụm cần thay thế, trình bày theo format ví dụ ngắn: **Từ/cụm hiện tại:** <trích> -> **Gợi ý:** <từ/cụm đúng> -> **Giải thích (1 dòng):** <vì sao phù hợp hơn>."
    },
    C1: {
      focus: "C1: ưu tiên tự nhiên, chính xác và độ phong phú diễn đạt; hướng dẫn viết lại câu/đoạn ngắn.",
      maxStrengths: 4,
      maxTaskQuotes: 3,
      stepLimit: 5,
      maxErrors: 7,
      grammarPriority:
        "Tối ưu cấu trúc câu dài, lỗi tinh tế (đại từ tham chiếu, mệnh đề, voice/tense), kết hợp liên từ đa dạng nếu có.",
      errorExampleFormat:
        "Với mỗi lỗi tiêu biểu, trình bày theo format ví dụ ngắn: **Sai:** <trích 1 cụm/câu từ bài của người học> -> **Đúng:** <phiên bản đã sửa> -> **Giải thích (1 dòng):** <vì sao đúng>.",
      coherencePriority: "Liên kết logic sâu hơn; loại bỏ câu rời và thay bằng cấu trúc mượt.",
      lexicalPriority: "Tối ưu register/collocation; sửa lựa chọn từ hơi 'sai giọng' và đề xuất cụm tự nhiên."
      ,
      lexicalExampleFormat:
        "Khi gợi ý từ/cụm cần thay thế, trình bày theo format ví dụ ngắn: **Từ/cụm hiện tại:** <trích> -> **Gợi ý:** <từ/cụm đúng> -> **Giải thích (1 dòng):** <vì sao phù hợp hơn>."
    },
    C2: {
      focus: "C2: phản hồi như biên tập viên; tinh chỉnh diễn đạt và tính học thuật/tự nhiên cao.",
      maxStrengths: 4,
      maxTaskQuotes: 4,
      stepLimit: 5,
      maxErrors: 8,
      grammarPriority:
        "Tinh chỉnh lỗi hiếm và phức tạp (word choice + grammar interaction), tránh lặp cấu trúc, nâng độ chính xác và độ trôi chảy.",
      errorExampleFormat:
        "Với mỗi lỗi tiêu biểu, trình bày theo format ví dụ ngắn: **Sai:** <trích 1 cụm/câu từ bài của người học> -> **Đúng:** <phiên bản đã sửa> -> **Giải thích (1 dòng):** <vì sao đúng>.",
      coherencePriority: "Mạch lạc chặt; viết lại 1 đoạn ngắn theo hướng tự nhiên hơn (nếu đủ dữ liệu).",
      lexicalPriority: "Lựa chọn từ tinh tế theo ngữ dụng; gợi ý paraphrase 1-2 câu cho chỗ cần nâng cấp."
      ,
      lexicalExampleFormat:
        "Khi gợi ý từ/cụm cần thay thế, trình bày theo format ví dụ ngắn: **Từ/cụm hiện tại:** <trích> -> **Gợi ý:** <từ/cụm đúng> -> **Giải thích (1 dòng):** <vì sao phù hợp hơn>."
    }
  };

  const cfg = LEVEL_CONFIG[safeLevel] || LEVEL_CONFIG.B1;

  return `Bạn là giáo viên tiếng Anh cho người học Việt Nam.

Người học đang ở level: ${safeLevel}
- Hãy điều chỉnh độ khó, độ chi tiết và loại lỗi ưu tiên theo CEFR tương ứng với level này.
- Luôn dựa trên đúng nội dung người học cung cấp; không tự bịa.
- Không cần trình bày “chain-of-thought”. Chỉ đưa kết luận, ví dụ và gợi ý cải thiện.

Mục tiêu phản hồi cho level ${safeLevel}: ${cfg.focus}

Đề bài: "${topic}"

Nội dung bài viết của người học:
${content}

Hãy trả về bằng Markdown tiếng Việt theo đúng các mục và tiêu đề sau:

## Đánh giá Tổng quan
1) Điểm tổng (0-10): <ghi điểm>
2) Tóm tắt nhanh (${safeLevel === "A1" ? "2-3" : "2-4"} câu): <nhận xét tổng quan>

## Điểm mạnh
- Nêu ${cfg.maxStrengths} điểm mạnh có căn cứ từ bài viết (tránh khen chung chung).

## Các điểm cần Cải thiện (Phân tích Chi Tiết)
### Task Achievement (Mức độ hoàn thành yêu cầu)
- Bài viết có bám sát đề không?
- Các ý còn thiếu/chưa trả lời đúng trọng tâm?
- Nếu có, trích tối đa ${cfg.maxTaskQuotes} câu/đoạn ngắn từ bài và nói vì sao nó chưa khớp yêu cầu (nói ngắn gọn, đúng trọng tâm).

### Coherence & Cohesion (Mạch lạc & Liên kết)
- Bố cục có rõ ràng không (mở bài/thân bài/kết luận)?
- Dùng câu liên kết/transition có hợp lý không?
- Chỉ ra chỗ câu bị “rời” và gợi ý cách nối câu phù hợp level (A1/A2: gợi ý 1 mẫu câu đơn giản; B1+ : gợi ý 1-2 cách nối logic hơn).
- Ưu tiên loại transition phù hợp: ${cfg.coherencePriority}

### Lexical Resource (Vốn từ vựng)
- Từ vựng có phù hợp chủ đề không?
- Nêu các chỗ dùng từ chưa đúng sắc thái/ngữ cảnh.
- Gợi ý thay thế (level thấp: 1-2 từ/cụm; level cao: 2-3 lựa chọn) và cho ví dụ câu ngắn đúng hơn.
- Ưu tiên lựa chọn từ theo: ${cfg.lexicalPriority}
- ${cfg.lexicalExampleFormat || "Ở level thấp, chỉ cần gợi ý thay thế ngắn gọn, không bắt buộc format ví dụ ràng buộc."}

### Grammatical Range & Accuracy (Ngữ pháp)
- Liệt kê các lỗi ngữ pháp phổ biến (ưu tiên lỗi thường gặp theo level). Tối đa ${cfg.maxErrors} lỗi tiêu biểu.
- Với mỗi lỗi tiêu biểu: nêu “lỗi gì”, “sửa thế nào”, và “ví dụ ngắn sau khi sửa”.
- ${cfg.errorExampleFormat || "Với mỗi lỗi tiêu biểu, hãy đưa tối thiểu 1 ví dụ câu sau khi sửa (ngắn gọn, đúng trọng tâm)."}
- Nếu bài có quá ít dữ liệu để xác định lỗi cụ thể, hãy ghi rõ: “Không đủ ví dụ để kết luận chắc chắn”.
- Ưu tiên lỗi theo: ${cfg.grammarPriority}

## Các Bước Cải thiện Tiếp theo
Gợi ý tối đa ${cfg.stepLimit} bước để người học cải thiện bài tiếp theo.
Mỗi bước trình bày theo format:
<Bước #>. Làm gì (cụ thể) + mục tiêu (cải thiện phần nào)

## Lời kết
- Viết 2-3 câu khích lệ nhưng vẫn bám theo những điểm cần cải thiện chính.

Nguyên tắc:
- Nếu không tìm thấy lỗi/ý phù hợp trong bài, không được tự bịa: hãy ghi “Không có thông tin rõ ràng trong bài”.
- Ưu tiên ví dụ ngắn và trực tiếp từ nội dung người học đã đưa.
`;
}

module.exports = { writingPrompt };

