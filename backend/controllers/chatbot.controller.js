const { chatWithAI } = require('../services/gemini');

async function postChatbot(req, res) {
  const { message, images, deepThink, googleSearch } = req.body;
  const result = await chatWithAI({ message, images, deepThink, googleSearch }, { requestId: req.requestId });
  return res.json(result);
}

module.exports = {
  postChatbot,
};

