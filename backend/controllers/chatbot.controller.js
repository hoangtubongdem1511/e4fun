const { chatWithAI } = require('../services/gemini');

async function postChatbot(req, res) {
  const { deepThink, googleSearch } = req.body;
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  const files = Array.isArray(req.files) ? req.files : [];
  const result = await chatWithAI(
    { message, files, deepThink, googleSearch },
    { requestId: req.requestId, apiKey: req.geminiApiKey },
  );
  return res.json(result);
}

module.exports = {
  postChatbot,
};

