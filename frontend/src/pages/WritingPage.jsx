import WritingPractice from "../components/WritingPractice";

export default function WritingPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            ✍️ Luyện viết tiếng Anh
          </h1>
          <p className="text-gray-300 text-lg">
            Viết bài và nhận phản hồi chi tiết từ AI tutor để cải thiện kỹ năng viết
          </p>
        </div>
        
        {/* Writing Component */}
        <WritingPractice />
      </div>
    </div>
  );
}