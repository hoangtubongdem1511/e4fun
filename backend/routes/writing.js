const express = require('express');
const router = express.Router();
const { evaluateWriting } = require('../services/gemini');

router.post('/', async (req, res) => {
  const { topic, content } = req.body;
  try {
    const result = await evaluateWriting(topic, content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate writing' });
  }
});

module.exports = router;