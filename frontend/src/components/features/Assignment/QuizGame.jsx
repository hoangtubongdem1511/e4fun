import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function QuizGame({ questions, onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array.isArray(questions) ? Array(questions.length).fill(null) : []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kiểm tra dữ liệu hợp lệ
  if (!Array.isArray(questions) || questions.length === 0) {
    return <div className="text-red-500 text-center p-8">Không có dữ liệu bài tập hợp lệ.</div>;
  }

  const currentQuestion = questions[current];
  const currentOptions = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];
  if (!currentQuestion || currentOptions.length === 0) {
    return <div className="text-red-500 text-center p-8">Dữ liệu câu hỏi không hợp lệ.</div>;
  }

  const handleSelect = (idx) => {
    setAnswers(ans => {
      const copy = [...ans];
      copy[current] = idx;
      return copy;
    });
  };

  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min(questions.length - 1, c + 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(answers);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200/80 dark:border-white/20">
          {/* Progress Bar & Info */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-900 dark:text-white font-bold text-lg">
              Câu <span className="text-blue-400">{current + 1}</span>/<span className="text-gray-600 dark:text-gray-300">{questions.length}</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200/70 dark:bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            {/* Dot navigation */}
            <div className="flex gap-1">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                    idx === current
                      ? 'bg-blue-500 border-blue-400 scale-125'
                      : answers[idx] !== null
                        ? 'bg-green-400 border-green-400 opacity-80'
                        : 'bg-gray-200/70 dark:bg-gray-700/50 border-gray-200/70 dark:border-gray-600/50 opacity-50'
                  }`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Chuyển đến câu ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="text-2xl text-gray-900 dark:text-white font-semibold mb-6 min-h-[56px] flex items-center">
            {/* <span className="mr-3 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">{current + 1}</span> */}
            <span>{currentQuestion.question}</span>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentOptions.map((opt, idx) => (
              <button
                key={idx}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 font-medium text-lg transition-all duration-200 shadow-sm
                  ${answers[current] === idx
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400 scale-105"
                    : "bg-gray-100/70 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 border-gray-200/70 dark:border-gray-600/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/50 hover:border-blue-400"}
                `}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitting}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-2 gap-2">
            <button
              onClick={handlePrev}
              disabled={current === 0 || isSubmitting}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-200/70 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold disabled:opacity-50 hover:bg-gray-300/70 dark:hover:bg-gray-600/50 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-1" />
              Câu trước
            </button>
            <button
              onClick={handleNext}
              disabled={current === questions.length - 1 || isSubmitting}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-200/70 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold disabled:opacity-50 hover:bg-gray-300/70 dark:hover:bg-gray-600/50 transition"
            >
              Câu tiếp
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
              ${answers.some(a => a === null) || isSubmitting
                ? 'bg-gray-300 dark:bg-gray-500 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg'}
            `}
            disabled={answers.some(a => a === null) || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Đang nộp bài...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2"></span>
                Nộp bài ngay
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

