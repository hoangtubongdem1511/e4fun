export default function QuizResult({ results, score, total, onRetry }) {
  const percentage = Math.round((score / total) * 100);
  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = total - correctCount;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header với điểm số */}
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200/80 dark:border-white/20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Kết quả bài tập
          </h2>
          
          {/* Điểm số chính */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              {score}/{total}
            </div>
            <div className="text-2xl text-gray-600 dark:text-gray-300 font-semibold">
              {percentage}%
            </div>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{correctCount}</div>
              <div className="text-green-700 dark:text-green-300 text-sm">Câu đúng</div>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{wrongCount}</div>
              <div className="text-red-700 dark:text-red-300 text-sm">Câu sai</div>
            </div>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="space-y-6">
          {results.map((r, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/80 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300">
              {/* Header câu hỏi */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold text-lg">
                    {r.isCorrect ? (
                      <span className="flex items-center text-green-400">
                        {/* <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg> */}
                        Đúng
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400">
                        {/* <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg> */}
                        Sai
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Câu hỏi */}
              <div className="text-gray-900 dark:text-white text-lg mb-4 leading-relaxed">
                {r.question}
              </div>

              {/* Đáp án */}
              <div className="space-y-2 mb-4">
                {r.options.map((opt, i) => (
                  <div key={i} className={`
                    px-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${opt === r.correctAnswer 
                      ? 'bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300' 
                      : opt === r.userAnswer && opt !== r.correctAnswer 
                        ? 'bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300'
                        : 'bg-gray-200/70 dark:bg-gray-700/50 border-gray-200/70 dark:border-gray-600/50 text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {opt === r.correctAnswer && (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {opt === r.userAnswer && opt !== r.correctAnswer && (
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Giải thích */}
              {r.explanation && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-blue-700 dark:text-blue-300 font-semibold">Giải thích</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-200 text-sm leading-relaxed">
                    {r.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nút làm bài mới */}
        <div className="mt-8 text-center">
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center">
              {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg> */}
              Làm bài tập mới
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 