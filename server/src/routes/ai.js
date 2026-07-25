const express = require('express');
const { generateStudyContent } = require('../services/aiService');

const router = express.Router();
const allowedTypes = new Set(['summary', 'explain', 'quiz', 'essay', 'notes', 'translate']);
const allowedLevels = new Set(['primary', 'secondary', 'university', 'adult']);
const allowedLengths = new Set(['short', 'medium', 'long']);

router.post('/generate', async (req, res) => {
  const { type = 'summary', level = 'secondary', length = 'medium', input = '' } = req.body || {};
  const cleanInput = String(input).trim();

  if (!cleanInput) {
    return res.status(400).json({ error: 'Tafadhali andika mada au maandishi kwanza.' });
  }

  if (cleanInput.length > 6000) {
    return res.status(413).json({ error: 'Maandishi ni marefu sana kwa toleo hili la awali. Punguza hadi herufi 6000.' });
  }

  if (!allowedTypes.has(type) || !allowedLevels.has(level) || !allowedLengths.has(length)) {
    return res.status(400).json({ error: 'Chaguo ulilotuma halitambuliki.' });
  }

  const result = await generateStudyContent({ type, level, length, input: cleanInput });
  return res.json(result);
});

module.exports = router;
