const { getDictionary } = require('../services/gemini');

async function postDictionary(req, res) {
  const { word, context } = req.body;
  const result = await getDictionary(word, context, { requestId: req.requestId });
  return res.json(result);
}

module.exports = {
  postDictionary,
};

