const { generateAssignment } = require('../../lib/services/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { topic, numQuestions, questionTypes } = req.body || {};
    const result = await generateAssignment(topic, numQuestions, questionTypes);
    res.status(200).json(result);
  } catch (e) {
    console.error('assignment generate error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
};
