const { evaluateWriting } = require('../services/gemini');

async function postWriting(req, res) {
  const { topic, content } = req.body;
  const result = await evaluateWriting(topic, content, { requestId: req.requestId });
  return res.json(result);
}

module.exports = {
  postWriting,
};

