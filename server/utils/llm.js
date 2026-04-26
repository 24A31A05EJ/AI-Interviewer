// Mock LLM/AI services for rapid development.

const generateQuestionTemplate = (role, topic, difficulty) => {
  const topics = {
    technical: {
      easy: ['What is a linked list?', 'Explain stack vs queue.'],
      medium: ['Describe merge sort and complexity.', 'Explain debouncing vs throttling.'],
      hard: ['Design a distributed lock service.', 'Explain CP/CA/AP in CAP theorem.'],
    },
    hr: {
      easy: ['Tell me about yourself.', 'What are your strengths?'],
      medium: ['Describe a team conflict you resolved.', 'How do you handle feedback?'],
      hard: ['Tell me about a time you failed and what you learned.', 'How do you prioritize tasks under pressure?'],
    },
    frontend: {
      easy: ['What is React state?', 'Explain CSS box model.'],
      medium: ['Compare React hooks vs lifecycle methods.', 'Explain virtual DOM.'],
      hard: ['Explain how React’s reconciliation works.', 'Design a responsive component library.'],
    },
    backend: {
      easy: ['What is REST?', 'How does HTTP status code 404 work?'],
      medium: ['Explain JWT auth flow.', 'What is database indexing?'],
      hard: ['Design a scalable microservices architecture.', 'Explain eventual consistency.'],
    },
    ai_ml: {
      easy: ['What is supervised learning?', 'Explain precision and recall.'],
      medium: ['Describe gradient descent.', 'What is regularization?'],
      hard: ['Explain transformer architecture.', 'What is GAN and how does it work?'],
    },
  };

  const pool = topics[topic] || topics[role] || topics.technical;
  const list = pool[difficulty.toLowerCase()] || pool.easy;
  const question = list[Math.floor(Math.random() * list.length)];

  return { question, difficulty, topic: topic || role };
};

const evaluateAnswer = (answer, question) => {
  // Simple NLP heuristic: length + keyword match
  const cleaned = answer ? answer.toLowerCase() : '';
  let score = Math.min(100, Math.max(10, cleaned.length + 10));
  const keywords = question.toLowerCase().split(' ').slice(0, 3);
  let matches = 0;
  keywords.forEach((word) => {
    if (cleaned.includes(word) && word.length > 3) matches += 1;
  });

  score += matches * 6;
  score = Math.min(100, score);

  const clarity = cleaned.length > 50 ? 0.8 : 0.6;
  const relevance = matches / (keywords.length || 1);

  return {
    score,
    clarity: Math.round(clarity * 100),
    relevance: Math.round(relevance * 100),
    technical: Math.min(100, score + matches * 5),
    feedback: `Try to include more concrete examples and relevant technical keywords. Detected ${matches} keyword matches.`,
  };
};

const adaptDifficulty = (currentDifficulty, latestScore) => {
  if (latestScore > 85) {
    if (currentDifficulty === 'easy') return 'medium';
    if (currentDifficulty === 'medium') return 'hard';
  }
  if (latestScore < 60) {
    if (currentDifficulty === 'hard') return 'medium';
    if (currentDifficulty === 'medium') return 'easy';
  }
  return currentDifficulty;
};

module.exports = { generateQuestionTemplate, evaluateAnswer, adaptDifficulty };
