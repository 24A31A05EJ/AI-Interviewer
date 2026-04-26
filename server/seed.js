const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InterviewHistory = require('./models/InterviewHistory');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Seeding database...');
    await User.deleteMany({});
    await InterviewHistory.deleteMany({});

    const user = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8aNrQMeG5ZeiVFjZvWzS2YzKV1LAIN', // password 'password'
      role: 'ai_ml',
      stats: { interviewCount: 2, totalScore: 160, weakTopics: { DSA: 70 }, streak: 2, badges: ['Quick Thinker'] },
    });
    await user.save();

    const ih = new InterviewHistory({
      userId: user._id,
      mode: 'technical',
      role: 'ai_ml',
      questions: [
        { question: 'What is supervised learning?', difficulty: 'easy', topic: 'AI/ML', answer: 'It is training with labels.', aiScore: 80, feedback: 'Good clarity.' },
        { question: 'Explain gradient descent.', difficulty: 'medium', topic: 'AI/ML', answer: 'An optimization algorithm.', aiScore: 80, feedback: 'Add math examples.' },
      ],
      overallScore: 80,
    });
    await ih.save();

    console.log('Seed complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
