const express = require('express');
const auth = require('../middleware/auth');
const InterviewHistory = require('../models/InterviewHistory');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = req.user;
  const history = await InterviewHistory.find({ userId: user._id });

  const avgScore = history.length ? history.reduce((sum, item) => sum + item.overallScore, 0) / history.length : 0;
  const weakTopics = {};

  history.forEach((item) => {
    item.questions.forEach((q) => {
      const score = q.aiScore || 0;
      if (!weakTopics[q.topic]) weakTopics[q.topic] = { total: 0, count: 0 };
      weakTopics[q.topic].total += score;
      weakTopics[q.topic].count += 1;
    });
  });

  const weakTopicData = Object.keys(weakTopics).map((topic) => {
    const aggregate = weakTopics[topic];
    const avg = aggregate.total / aggregate.count;
    return { topic, avgScore: avg };
  });

  res.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      stats: user.stats,
    },
    metrics: {
      interviewCount: user.stats.interviewCount,
      avgScore: Number(avgScore.toFixed(2)),
      weakTopics: weakTopicData.sort((a, b) => a.avgScore - b.avgScore).slice(0, 5),
    },
    history,
  });
});

module.exports = router;
