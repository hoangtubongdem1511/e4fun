import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { analyzeWritingText } from "@/services/writingService";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const WRITING_TOPICS = [
  "My favorite hobby",
  "A memorable trip",
  "Technology in education",
  "Environmental protection",
  "Future career goals",
  "Cultural differences"
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getInitialWritingLevel() {
  try {
    const raw = window.localStorage.getItem("e4fun.onboarding");
    const parsed = raw ? JSON.parse(raw) : null;
    const lvl = parsed?.level;
    if (LEVELS.includes(lvl)) return lvl;
  } catch {
    // ignore
  }
  return "B1";
}

export default function WritingPractice() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState(getInitialWritingLevel);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) return;
    
    setIsLoading(true);
    setError("");
    setResult("");
    
    try {
      const text = await analyzeWritingText({ topic, content, level });
      if (!text) setError("Không thể phân tích bài viết. Vui lòng thử lại.");
      else setResult(text);
    } catch (err) {
      console.error("Writing error:", err);
      const backendMessage = err?.response?.data?.error?.message;
      setError(backendMessage || "Có lỗi xảy ra khi phân tích bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSuggestion = (suggestedTopic) => {
    setTopic(suggestedTopic);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Writing Form */}
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/80 dark:border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-gray-900 dark:text-white font-semibold text-lg mb-3">
              Chủ đề bài viết
            </label>
            <Input
              className="w-full px-4 py-4 bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
              placeholder="Nhập chủ đề bài viết..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={isLoading}
            />
            
            {/* Topic Suggestions */}
            <div className="mt-3">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Gợi ý chủ đề:</p>
              <div className="flex flex-wrap gap-2">
                {WRITING_TOPICS.map((suggestedTopic) => (
                  <button
                    key={suggestedTopic}
                    type="button"
                    onClick={() => handleTopicSuggestion(suggestedTopic)}
                    className="px-3 py-1 bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/50 rounded-lg hover:bg-green-500 hover:text-white hover:border-green-400 transition-all duration-300 text-sm"
                  >
                    {suggestedTopic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-gray-900 dark:text-white font-semibold text-lg mb-3">
              Nội dung bài viết
            </label>
            <div className="relative">
              <Textarea
                className="w-full px-4 py-4 bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 resize-none"
                placeholder="Viết bài của bạn ở đây..."
                rows={8}
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-gray-500 dark:text-gray-400 text-sm">
                {wordCount} từ
              </div>
            </div>
          </div>

          {/* Level Select */}
          <div>
            <label className="block text-gray-900 dark:text-white font-semibold text-lg mb-3">
              Trình độ CEFR (level)
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-4 bg-gray-100/70 dark:bg-gray-800/50 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit" 
            disabled={isLoading || !topic.trim() || !content.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              isLoading || !topic.trim() || !content.trim()
                ? 'bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Đang phân tích bài viết...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> */}
                Chấm điểm bài viết
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center text-red-700 dark:text-red-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/80 dark:border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-xl">Phản hồi từ AI tutor</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Điểm số và góp ý chi tiết</p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <div className="bg-gray-100/60 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/70 dark:border-gray-600/50">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/80 dark:border-white/20">
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">Mẹo viết bài hiệu quả</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Viết ít nhất 100-200 từ để có đánh giá chi tiết</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Sử dụng đa dạng từ vựng và cấu trúc câu</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Kiểm tra ngữ pháp và chính tả trước khi nộp</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Viết theo cấu trúc: Mở bài - Thân bài - Kết luận</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}