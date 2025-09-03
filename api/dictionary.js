const { getDictionary } = require('../lib/services/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { word, context } = req.body || {};
    const result = await getDictionary(word, context);
    res.status(200).json(result);
  } catch (e) {
    console.error('dictionary error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to fetch dictionary data' });
  }
};
