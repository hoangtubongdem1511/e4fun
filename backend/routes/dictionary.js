const express = require('express');
const router = express.Router();
const { getDictionary } = require('../services/gemini');

router.post('/', async (req, res) => {
  const { word, context } = req.body;
  try {
    const result = await getDictionary(word, context);
    res.json(result);
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to fetch dictionary data', detail: err?.response?.data || err.message });
  }
});

module.exports = router;
