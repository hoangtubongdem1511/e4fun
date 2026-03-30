import { useState } from "react";
import AssignmentForm from "@/components/features/Assignment/AssignmentForm";
import QuizGame from "@/components/features/Assignment/QuizGame";
import QuizResult from "@/components/features/Assignment/QuizResult";
import { generateAssignmentQuestions, gradeAssignment } from "@/services/assignmentService";
import { backendErrorMessage } from "@/utils/backendErrorMessage";

export default function AssignmentPage() {
  const [questions, setQuestions] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCreateAssignment = async (data) => {
    setError("");
    try {
      const quizList = await generateAssignmentQuestions(data);
      setQuestions(quizList);
      setResult(null);
    } catch (e) {
      setError(backendErrorMessage(e));
      setQuestions(null);
      setResult(null);
    }
  };

  const handleSubmitQuiz = async (answers) => {
    setError("");
    try {
      const res = await gradeAssignment({
        questions,
        userAnswers: answers,
      });
      setResult(res);
    } catch (e) {
      setError(backendErrorMessage(e));
    }
  };

  const handleRetry = () => {
    setQuestions(null);
    setResult(null);
    setError("");
  };

  return (
    <div>
      {/* Chỉ hiển thị banner lỗi ở đây khi đang ở bước chấm bài (questions đã có). */}
      {error && questions && (
        <div className="p-4">
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center text-red-700 dark:text-red-300">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {!questions ? (
        <AssignmentForm
          onSubmit={handleCreateAssignment}
          backendError={error}
          onBackendErrorClear={() => setError("")}
        />
      ) : !result ? (
        <QuizGame questions={questions} onSubmit={handleSubmitQuiz} />
      ) : (
        <QuizResult {...result} onRetry={handleRetry} />
      )}
    </div>
  );
}
