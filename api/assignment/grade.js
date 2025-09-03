module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { questions, userAnswers } = req.body || {};
    const results = questions.map((q, idx) => {
      let correct = q.answer;
      if (typeof correct === 'undefined' && typeof q.answerIndex === 'number') {
        correct = q.options[q.answerIndex];
      }
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
    res.status(200).json({ score, total: questions.length, results });
  } catch (e) {
    console.error('assignment grade error:', e.message);
    res.status(500).json({ error: 'Failed to grade assignment' });
  }
};
