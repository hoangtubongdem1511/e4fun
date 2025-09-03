import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    
    setIsLoading(true);
    setError("");
    setResult("");
    
    try {
      const res = await axios.post("/api/dictionary", { word });
      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setResult(text);
      } else {
        setError("Không tìm thấy kết quả cho từ này");
      }
    } catch (err) {
      console.error("Dictionary error:", err);
      setError("Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border-2 border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              placeholder="Nhập từ cần tra cứu..."
              value={word}
              onChange={e => setWord(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {/* Search Button */}
          <button 
            type="submit" 
            disabled={isLoading || !word.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              isLoading || !word.trim()
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Đang tra cứu...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tra cứu từ
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center text-red-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Kết quả tra cứu</h3>
              <p className="text-gray-300 text-sm">Định nghĩa và thông tin chi tiết</p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Quick Suggestions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">💡 Gợi ý từ vựng phổ biến</h3>
        <div className="flex flex-wrap gap-2">
          {['hello', 'beautiful', 'technology', 'education', 'happiness', 'success'].map((suggestedWord) => (
            <button
              key={suggestedWord}
              onClick={() => setWord(suggestedWord)}
              className="px-4 py-2 bg-gray-800/50 text-gray-200 border border-gray-600/50 rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 text-sm font-medium"
            >
              {suggestedWord}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
