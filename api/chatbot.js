const { chatWithAI } = require('../lib/services/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { message, images, deepThink, googleSearch } = req.body || {};
    const result = await chatWithAI({ message, images, deepThink, googleSearch });
    res.status(200).json(result);
  } catch (e) {
    console.error('chatbot error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to chat with AI' });
  }
};
