const express = require('express');
const router = express.Router();
const { generateAssignment } = require('../services/gemini');

router.post('/generate', async (req, res) => {
  const { topic, numQuestions, questionTypes } = req.body;
  try {
    const result = await generateAssignment(topic, numQuestions, questionTypes);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
});

// Route chấm điểm bài tập
router.post('/grade', async (req, res) => {
  const { questions, userAnswers } = req.body;
  try {
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
        isCorrect: user === correct
      };
    });
    const score = results.filter(r => r.isCorrect).length;
    res.json({ score, total: questions.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to grade assignment' });
  }
});

module.exports = router;