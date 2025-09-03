const { evaluateWriting } = require('../lib/services/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { topic, content } = req.body || {};
    const result = await evaluateWriting(topic, content);
    res.status(200).json(result);
  } catch (e) {
    console.error('writing error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to evaluate writing' });
  }
};
