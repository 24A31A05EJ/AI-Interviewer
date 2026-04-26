const express = require('express');
const InterviewHistory = require('../models/InterviewHistory');
const { evaluateAnswer, adaptDifficulty } = require('../utils/llm');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/evaluate', auth, async (req, res) => {
  const { question, answer, role = 'general', difficulty = 'easy', topic = 'technical' } = req.body;
  if (!question || !answer) return res.status(400).json({ message: 'Missing question or answer' });

  const evaluation = evaluateAnswer(answer, question);
  const nextDifficulty = adaptDifficulty(difficulty, evaluation.score);

  const history = new InterviewHistory({
    userId: req.user._id,
    mode: 'technical',
    role,
    questions: [{ question, answer, difficulty, topic, aiScore: evaluation.score, feedback: evaluation.feedback }],
    overallScore: evaluation.score,
  });
  await history.save();

  req.user.stats.interviewCount += 1;
  req.user.stats.totalScore += evaluation.score;
  req.user.stats.streak += evaluation.score > 70 ? 1 : 0;
  await req.user.save();

  res.json({ evaluation, nextDifficulty });
});

router.post('/mock', auth, async (req, res) => {
  const { rounds = 3, role = 'general', difficulty = 'easy', topic = 'technical' } = req.body;
  const questions = [];
  for (let i = 0; i < rounds; i++) {
    const { question } = require('../utils/llm').generateQuestionTemplate(role, topic, difficulty);
    questions.push({ question, difficulty, topic });
  }
  res.json({ roundId: Date.now(), questions, timer: 90 });
});

router.get('/history', auth, async (req, res) => {
  let history = await InterviewHistory.find({ userId: req.user._id });
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  history = history.slice(0, 50);
  res.json({ history });
});

module.exports = router;
