import { useState } from "react";

const SUGGESTED_TOPICS = [
  "Local weather", "Public transport", "Daily routines", "Simple hobbies", "Shopping trips"
];

const QUESTION_TYPES = [
  { value: "Most Suitable Word", label: "Chọn từ thích hợp nhất", icon: "🎯" },
  { value: "Verb Conjugation", label: "Chia động từ", icon: "🔄" },
  { value: "Conditional Sentences", label: "Câu điều kiện", icon: "⚡" },
  { value: "Indirect Speech", label: "Câu gián tiếp", icon: "💬" },
  { value: "Sentence Completion", label: "Điền vào chỗ trống", icon: "✏️" },
  { value: "Reading Comprehension", label: "Đọc hiểu văn bản", icon: "📖" },
  { value: "Grammar", label: "Ngữ pháp", icon: "📚" },
  { value: "Collocation", label: "Phối hợp từ", icon: "🔗" },
  { value: "Synonym/Antonym", label: "Từ đồng nghĩa/trái nghĩa", icon: "🔄" },
  { value: "Vocabulary", label: "Từ vựng", icon: "📝" }
];

export default function AssignmentForm({ onSubmit }) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
    // Clear error when user selects a type
    if (errors.questionTypes) {
      setErrors(prev => ({ ...prev, questionTypes: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!topic.trim()) {
      newErrors.topic = "Vui lòng nhập chủ đề bài tập";
    }
    if (selectedTypes.length === 0) {
      newErrors.questionTypes = "Vui lòng chọn ít nhất một loại câu hỏi";
    }
    if (!numQuestions || numQuestions < 1 || numQuestions > 30) {
      newErrors.numQuestions = "Số câu hỏi phải từ 1-30";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSubmit({ topic, numQuestions, questionTypes: selectedTypes });
    } catch (error) {
      console.error("Error creating assignment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSuggestion = (suggestedTopic) => {
    setTopic(suggestedTopic);
    if (errors.topic) {
      setErrors(prev => ({ ...prev, topic: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 text-center border border-white/20">
          <div className="text-4xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-white mb-2">Tạo Bài Tập</h1>
          <p className="text-gray-200 text-lg">
            Thiết lập bài tập phù hợp với nhu cầu học tập của bạn
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Topic Section */}
            <div className="space-y-4">
              <label className="block text-white font-semibold text-lg">
                🎯 Chủ đề bài tập
              </label>
              <div className="relative">
                <input
                  className={`w-full px-6 py-4 rounded-xl bg-gray-800/50 border-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                    errors.topic ? 'border-red-400' : 'border-gray-600/50 focus:border-blue-400'
                  }`}
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (errors.topic) setErrors(prev => ({ ...prev, topic: null }));
                  }}
                  placeholder="Nhập chủ đề bài tập của bạn..."
                />
                {errors.topic && (
                  <p className="text-red-300 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.topic}
                  </p>
                )}
              </div>
              
              {/* Topic Suggestions */}
              <div className="space-y-3">
                <p className="text-gray-200 text-sm">💡 Gợi ý chủ đề:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TOPICS.map((suggestedTopic) => (
                    <button
                      type="button"
                      key={suggestedTopic}
                      className="px-4 py-2 rounded-full bg-gray-800/50 text-gray-200 border border-gray-600/50 hover:bg-blue-500 hover:text-white hover:border-blue-400 transition-all duration-300 text-sm font-medium"
                      onClick={() => handleTopicSuggestion(suggestedTopic)}
                    >
                      {suggestedTopic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Number of Questions Section */}
            <div className="space-y-4">
              <label className="block text-white font-semibold text-lg">
                📊 Số lượng câu hỏi
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={30}
                  className={`w-full px-6 py-4 rounded-xl bg-gray-800/50 border-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                    errors.numQuestions ? 'border-red-400' : 'border-gray-600/50 focus:border-blue-400'
                  }`}
                  value={numQuestions}
                  onChange={(e) => {
                    setNumQuestions(Number(e.target.value));
                    if (errors.numQuestions) setErrors(prev => ({ ...prev, numQuestions: null }));
                  }}
                />
                {errors.numQuestions && (
                  <p className="text-red-300 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.numQuestions}
                  </p>
                )}
              </div>
              
              {/* Quick number buttons */}
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    type="button"
                    key={num}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                      numQuestions === num
                        ? 'bg-blue-500 text-white border-blue-400'
                        : 'bg-gray-800/50 text-gray-200 border-gray-600/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setNumQuestions(num)}
                  >
                    {num} câu
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types Section */}
            <div className="space-y-4">
              <label className="block text-white font-semibold text-lg">
                🎨 Loại câu hỏi
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUESTION_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedTypes.includes(type.value)
                        ? 'bg-blue-500/20 border-blue-400 text-white'
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => handleTypeChange(type.value)}
                    />
                    <div className="flex items-center space-x-3 w-full">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                      {selectedTypes.includes(type.value) && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.questionTypes && (
                <p className="text-red-300 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.questionTypes}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic || selectedTypes.length === 0 || !numQuestions}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                isLoading || !topic || selectedTypes.length === 0 || !numQuestions
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Đang tạo bài tập...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🚀</span>
                  Tạo bài tập ngay
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}