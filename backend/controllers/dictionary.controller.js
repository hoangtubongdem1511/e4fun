const { getDictionary } = require('../services/gemini');

async function postDictionary(req, res) {
  const { word, context } = req.body;

  const userContext = typeof context === 'string' ? context.trim() : '';

  const result = await getDictionary(word, userContext, {
    requestId: req.requestId,
    apiKey: req.geminiApiKey,
  });

  res.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
  res.set('Vary', 'x-gemini-api-key');
  return res.json(result);
}

module.exports = {
  postDictionary,
};
