const express = require('express');
const { generateQuestionTemplate } = require('../utils/llm');
const router = express.Router();

router.get('/generate', (req, res) => {
  const { role = 'general', topic = 'technical', difficulty = 'easy' } = req.query;
  const questionData = generateQuestionTemplate(role, topic, difficulty);
  const aiHint = `Try to mention at least 2 examples and keep your answer concise.`;
  res.json({ question: questionData.question, difficulty: questionData.difficulty, topic: questionData.topic, hint: aiHint });
});

router.get('/topics', (req, res) => {
  res.json({
    technical: ['DSA', 'DBMS', 'OS', 'CN'],
    hr: ['Behavioral', 'Leadership', 'Culture Fit'],
    role_based: ['Frontend', 'Backend', 'AI/ML', 'Data Engineering'],
  });
});

module.exports = router;
