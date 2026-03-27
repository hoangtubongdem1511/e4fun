const { generateAssignment } = require('../services/gemini');

async function postGenerate(req, res) {
  const { topic, numQuestions, questionTypes } = req.body;
  const result = await generateAssignment(topic, numQuestions, questionTypes, {
    requestId: req.requestId,
    apiKey: req.geminiApiKey,
  });
  return res.json(result);
}

async function postGrade(req, res) {
  const { questions, userAnswers } = req.body;

  // Chấm điểm đơn giản (so sánh trực tiếp)
  const results = questions.map((q, idx) => {
    // Lấy đáp án đúng
    let correct = q.answer;
    if (typeof correct === 'undefined' && typeof q.answerIndex === 'number') {
      correct = q.options[q.answerIndex];
    }

    // Lấy đáp án người dùng
    const user = q.options[userAnswers[idx]];
    return {
      question: q.question,
      options: q.options,
      correctAnswer: correct,
      userAnswer: user,
      explanation: q.explanation,
      isCorrect: user === correct,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  return res.json({ score, total: questions.length, results });
}

module.exports = {
  postGenerate,
  postGrade,
};

