import { useState } from "react";
import AssignmentForm from "../components/AssignmentForm";
import QuizGame from "../components/QuizGame";
import QuizResult from "../components/QuizResult";
import axios from "axios";

export default function AssignmentPage() {
  const [questions, setQuestions] = useState(null);
  const [result, setResult] = useState(null);

  const handleCreateAssignment = async (data) => {
    const res = await axios.post("http://localhost:5000/api/assignment/generate", data);
    let quizList = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Raw quizList:", quizList);
    
    // Lấy phần JSON từ dấu [ đầu tiên đến dấu ] cuối cùng
    if (quizList) {
      const firstBracket = quizList.indexOf('[');
      const lastBracket = quizList.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        quizList = quizList.substring(firstBracket, lastBracket + 1);
      }
      quizList = quizList.trim();
    }
    console.log("QuizList sau khi cắt chỉ còn JSON:", quizList);
    
    try {
      quizList = JSON.parse(quizList);
    } catch (e) {
      console.error("Parse error:", e, quizList);
      console.log("QuizList từng ký tự:", Array.from(quizList));
      quizList = [];
    }
    console.log("Parsed quizList:", quizList);
    setQuestions(quizList);
    setResult(null);
  };

  const handleSubmitQuiz = async (answers) => {
    // Gửi đáp án lên backend để chấm điểm và giải thích
    const res = await axios.post("http://localhost:5000/api/assignment/grade", {
      questions,
      userAnswers: answers
    });
    setResult(res.data);
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