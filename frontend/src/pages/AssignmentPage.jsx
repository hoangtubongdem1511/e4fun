import { useState } from "react";
import AssignmentForm from "@/components/features/Assignment/AssignmentForm";
import QuizGame from "@/components/features/Assignment/QuizGame";
import QuizResult from "@/components/features/Assignment/QuizResult";
import { generateAssignmentQuestions, gradeAssignment } from "@/services/assignmentService";

export default function AssignmentPage() {
  const [questions, setQuestions] = useState(null);
  const [result, setResult] = useState(null);

  const handleCreateAssignment = async (data) => {
    const quizList = await generateAssignmentQuestions(data);
    setQuestions(quizList);
    setResult(null);
  };

  const handleSubmitQuiz = async (answers) => {
    const res = await gradeAssignment({
      questions,
      userAnswers: answers,
    });
    setResult(res);
  };

  const handleRetry = () => {
    setQuestions(null);
    setResult(null);
  };

  return (
    <div>
      {!questions ? (
        <AssignmentForm onSubmit={handleCreateAssignment} />
      ) : !result ? (
        <QuizGame questions={questions} onSubmit={handleSubmitQuiz} />
      ) : (
        <QuizResult {...result} onRetry={handleRetry} />
      )}
    </div>
  );
}
