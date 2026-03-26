const { getDictionary } = require('../services/gemini');
const { lookupDictionary, buildContextText } = require('../services/dictionaryWebLookup');

async function postDictionary(req, res) {
  const { word, context } = req.body;

  // 1) Web lookup (dictionaryapi.dev) để có dữ liệu kiểm chứng.
  // 2) Nếu thất bại, giữ nguyên `context` từ client (nếu có), hoặc dùng rỗng để prompt trả "không thể xác minh".
  let webContextText = '';
  try {
    const web = await lookupDictionary(word, { requestId: req.requestId });
    if (web.ok && web.data) webContextText = buildContextText(web.data);
  } catch (e) {
    // ignore; fallback to prompt-only mode
    webContextText = '';
  }

  const mergedContext = [webContextText, context].filter((v) => typeof v === 'string' && v.trim().length > 0).join('\n');

  const result = await getDictionary(word, mergedContext, {
    requestId: req.requestId,
    apiKey: req.geminiApiKey,
  });
  return res.json(result);
}

module.exports = {
  postDictionary,
};

