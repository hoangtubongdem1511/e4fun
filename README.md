# E4Fun - Học Tiếng Anh Thông Minh với AI Gemini

E4Fun là một ứng dụng web học tiếng Anh hiện đại được xây dựng với React, Node.js và tích hợp AI Gemini để cung cấp trải nghiệm học tập tương tác và cá nhân hóa.

## Tính năng nổi bật

### **Từ điển thông minh**
- Tra cứu từ vựng với định nghĩa chi tiết
- Ví dụ sử dụng và phát âm
- Gợi ý từ vựng phổ biến
- Kết quả được tạo bởi AI Gemini

### **Luyện viết**
- Viết bài theo chủ đề tự chọn
- Nhận phản hồi chi tiết từ AI tutor
- Đánh giá ngữ pháp, từ vựng và cấu trúc
- Gợi ý chủ đề viết phong phú
- Đếm số từ và mẹo viết hiệu quả

### **Chat bot**
- Chat trực tiếp với AI tutor 24/7
- Hỗ trợ mọi vấn đề tiếng Anh
- Upload ảnh để phân tích
- Chế độ "Suy nghĩ sâu" cho câu trả lời chi tiết

### **Bài tập tương tác**
- Tạo quiz game theo chủ đề
- Nhiều loại câu hỏi: ngữ pháp, từ vựng, đọc hiểu
- Chấm điểm tự động và giải thích chi tiết
- Giao diện làm bài hiện đại với progress bar
- Kết quả chi tiết với phân tích từng câu

### **Trò chơi ghép đôi**
- Chọn chủ đề, số cặp và loại ghép (từ–nghĩa, đồng nghĩa, trái nghĩa,…)
- Cặp thẻ được sinh tự động bởi AI Gemini theo đúng chủ đề
- Bộ 3 màn hình: chọn cấu hình, chơi game trên bàn thẻ, xem kết quả
- Thống kê thời gian, số lần ghép sai và độ chính xác sau mỗi lượt chơi

## Yêu cầu hệ thống

- Node.js **>= 18**
- npm (khuyến nghị dùng cùng bản cài Node)
- Google Gemini API key (bắt buộc để gọi AI)

## Triển khai (Azure + GitHub Actions)

Hướng dẫn từng bước: [DEPLOY.md](./DEPLOY.md).

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone https://github.com/hoangtubongdem1511/e4fun.git
cd e4fun
```

### 2. Cài đặt dependencies (backend & frontend)

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Cấu hình environment variables

#### Backend (.env)
Tạo file `.env` trong thư mục `backend`:
```env
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
Tạo file `.env` trong thư mục `frontend`:
```env
REACT_APP_API_URL=http://localhost:5000
```
### 4. Khởi chạy ứng dụng (dev)

Mở **2 terminal**:

#### Terminal 1 – Backend
```bash
cd backend
npm start
```
Server API chạy tại: http://localhost:5000

#### Terminal 2 – Frontend
```bash
cd frontend
npm start
```
Web app chạy tại: http://localhost:3000

## Screenshots

### Trang chủ
<img src="/frontend/images/Home.png" width="100%" alt="Home">

### Từ điển
<img src="/frontend/images/Dictionary1.png" width="100%" alt="Dictionary1">
<img src="/frontend/images/Dictionary2.png" width="100%" alt="Dictionary2">

### Luyện viết
<img src="/frontend/images/Writing1.png" width="100%" alt="Writing1">
<img src="/frontend/images/Writing2.png" width="100%" alt="Writing2">

### Chat Bot
<img src="/frontend/images/ChatBox.png" width="100%" alt="ChatBox">

### Quiz
<img src="/frontend/images/Assignment1.png" width="100%" alt="Assignment1">
<img src="/frontend/images/Assignment2.png" width="100%" alt="Assignment2">
<img src="/frontend/images/Assignment3.png" width="100%" alt="Assignment3">

### Trò chơi ghép đôi
<img src="/frontend/images/Matching1.png" width="100%" alt="Matching1">
<img src="/frontend/images/Matching2.png" width="100%" alt="Matching2">
<img src="/frontend/images/Matching3.png" width="100%" alt="Matching3">

## Cấu trúc dự án

```
e4fun/
├── backend/
│   ├── app.js                 # Server entry point
│   ├── routes/                # API routes
│   │   ├── assignment.js      # Quiz (tạo & chấm điểm)
│   │   ├── chatbot.js         # AI chat
│   │   ├── dictionary.js      # Từ điển
│   │   ├── matching.js        # Matching game
│   │   └── writing.js         # Luyện viết
│   ├── controllers/           # Xử lý request theo từng feature
│   ├── validators/            # Zod schemas validate body
│   ├── constants/             # Prompt Gemini, error codes,...
│   ├── services/
│   │   └── gemini.js          # Tầng gọi Gemini + cache
│   ├── utils/                 # Helper (parse JSON Gemini, map lỗi,...)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Layout, IntroduceApp, Modal,...
│   │   │   ├── ui/            # Button, Input, Textarea,...
│   │   │   └── features/
│   │   │       ├── Assignment/  # AssignmentForm, QuizGame, QuizResult,...
│   │   │       ├── Chatbot/     # Chatbot, MessageImageCollage,...
│   │   │       ├── Dictionary/  # Dictionary
│   │   │       └── Matching/    # MatchingForm, MatchingGameBoard, MatchingResult
│   │   ├── pages/             # Trang: Home, AssignmentPage, MatchingPage,...
│   │   ├── validators/        # Zod schemas cho frontend
│   │   ├── utils/             # backendErrorMessage,...
│   │   ├── App.js             # Main app component (router)
│   │   └── index.js           # Entry point
│   └── package.json
└── README.md
```

## Tính năng bổ sung trong tương lai
- Đăng nhập và cập nhật thông tin
- Image to text
- Flashcard
- Speaking Practice

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

 **Nếu dự án này hữu ích, hãy cho mình một star!** 