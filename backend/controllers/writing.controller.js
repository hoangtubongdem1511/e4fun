const { evaluateWriting } = require('../services/gemini');

async function postWriting(req, res) {
  const { topic, content, level } = req.body;
  const result = await evaluateWriting(topic, content, {
    requestId: req.requestId,
    apiKey: req.geminiApiKey,
    level,
  });
  return res.json(result);
}

module.exports = {
  postWriting,
};

