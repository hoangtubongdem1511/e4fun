const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../services/gemini');

router.post('/', async (req, res) => {
  const { message, images, deepThink, googleSearch } = req.body;
  try {
    const result = await chatWithAI({ message, images, deepThink, googleSearch });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to chat with AI' });
  }
});

module.exports = router;