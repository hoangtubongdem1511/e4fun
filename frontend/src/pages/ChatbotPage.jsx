import Chatbot from "../components/Chatbot";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🤖 AI Tutor đồng hành
          </h1>
          <p className="text-gray-300 text-lg">
            Chat với AI tutor thông minh để được tư vấn và hỗ trợ học tiếng Anh 24/7
          </p>
        </div>
        
        {/* Chatbot Component */}
        <div className="flex justify-center">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}