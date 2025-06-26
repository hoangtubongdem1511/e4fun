# 🎓 E4Fun - Học Tiếng Anh Thông Minh với AI Gemini

E4Fun là một ứng dụng web học tiếng Anh hiện đại được xây dựng với React, Node.js và tích hợp AI Gemini để cung cấp trải nghiệm học tập tương tác và cá nhân hóa.

![E4Fun Banner](https://img.shields.io/badge/E4Fun-AI%20Learning%20Platform-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-38B2AC?style=flat-square&logo=tailwind-css)

## 🌟 Tính năng nổi bật

### 📚 **Từ điển thông minh**
- Tra cứu từ vựng với định nghĩa chi tiết
- Ví dụ sử dụng và phát âm
- Gợi ý từ vựng phổ biến
- Kết quả được tạo bởi AI Gemini

### ✍️ **Luyện viết AI**
- Viết bài theo chủ đề tự chọn
- Nhận phản hồi chi tiết từ AI tutor
- Đánh giá ngữ pháp, từ vựng và cấu trúc
- Gợi ý chủ đề viết phong phú
- Đếm số từ và mẹo viết hiệu quả

### 🤖 **AI Tutor đồng hành**
- Chat trực tiếp với AI tutor 24/7
- Hỗ trợ mọi vấn đề tiếng Anh
- Upload ảnh để phân tích
- Chế độ "Suy nghĩ sâu" cho câu trả lời chi tiết
- Lưu trữ lịch sử trò chuyện

### 🎯 **Bài tập tương tác**
- Tạo quiz game theo chủ đề
- Nhiều loại câu hỏi: ngữ pháp, từ vựng, đọc hiểu
- Chấm điểm tự động và giải thích chi tiết
- Giao diện làm bài hiện đại với progress bar
- Kết quả chi tiết với phân tích từng câu

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19.1.0** - UI Framework
- **Tailwind CSS 3.4.3** - Styling
- **React Router DOM** - Navigation
- **Axios** - HTTP Client
- **React Markdown** - Markdown rendering
- **React Dropzone** - File upload

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - AI services
- **Cloudinary** - Image storage
- **CORS** - Cross-origin resource sharing

## 📋 Yêu cầu hệ thống

- Node.js 18.0.0 trở lên
- npm hoặc yarn
- Google Gemini API key
- Cloudinary account (cho upload ảnh)

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone https://github.com/hoangtubongdem1511/e4fun.git
cd e4fun
```

### 2. Cài đặt dependencies

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

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
Tạo file `.env` trong thư mục `frontend`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Khởi chạy ứng dụng

#### Backend
```bash
cd backend
npm start
```
Server sẽ chạy tại: http://localhost:5000

#### Frontend
```bash
cd frontend
npm start
```
Ứng dụng sẽ chạy tại: http://localhost:3000

## 📖 Hướng dẫn sử dụng

### 🏠 Trang chủ
<img src="/frontend/images/Home.png" width="100%" alt="Home">
- Xem tổng quan các tính năng
- Truy cập nhanh vào các chức năng chính
- Tìm hiểu về AI Gemini và lợi ích

### 📚 Từ điển
<img src="/frontend/images/Dictionary1.png" width="100%" alt="Dictionary1">
<img src="/frontend/images/Dictionary2.png" width="100%" alt="Dictionary2">
1. Nhập từ cần tra cứu vào ô tìm kiếm
2. Nhấn "Tra cứu từ" hoặc Enter
3. Xem kết quả với định nghĩa chi tiết
4. Sử dụng gợi ý từ vựng phổ biến

### ✍️ Luyện viết
<img src="/frontend/images/Writing1.png" width="100%" alt="Writing1">
<img src="/frontend/images/Writing2.png" width="100%" alt="Writing2">
1. Chọn chủ đề hoặc nhập chủ đề tự do
2. Viết bài với ít nhất 100-200 từ
3. Nhấn "Chấm điểm bài viết"
4. Xem phản hồi chi tiết từ AI tutor

### 🤖 AI Tutor
<img src="/frontend/images/ChatBox.png" width="100%" alt="ChatBox">
1. Nhập câu hỏi về tiếng Anh
2. Upload ảnh (tùy chọn) để phân tích
3. Bật "Suy nghĩ sâu" cho câu trả lời chi tiết
4. Chat liên tục với AI tutor

### 🎯 Bài tập
<img src="/frontend/images/Assignment1.png" width="100%" alt="Assignment1">
<img src="/frontend/images/Assignment2.png" width="100%" alt="Assignment2">
<img src="/frontend/images/Assignment3.png" width="100%" alt="Assignment3">
1. Chọn chủ đề bài tập
2. Đặt số lượng câu hỏi (1-30)
3. Chọn loại câu hỏi
4. Làm bài với giao diện tương tác
5. Xem kết quả và giải thích chi tiết

## 🔧 Cấu trúc dự án

```
e4fun/
├── backend/
│   ├── app.js                 # Server entry point
│   ├── routes/                # API routes
│   │   ├── assignment.js      # Quiz generation & grading
│   │   ├── chatbot.js         # AI chat functionality
│   │   ├── dictionary.js      # Dictionary lookup
│   │   ├── upload.js          # Image upload
│   │   └── writing.js         # Writing assessment
│   ├── services/              # External services
│   │   ├── cloudinary.js      # Image storage
│   │   └── gemini.js          # AI integration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AssignmentForm.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Dictionary.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── QuizGame.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   └── WritingPractice.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── AssignmentPage.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   ├── DictionaryPage.jsx
│   │   │   ├── Home.jsx
│   │   │   └── WritingPage.jsx
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── package.json
└── README.md
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

⭐ **Nếu dự án này hữu ích, hãy cho mình một star!** 