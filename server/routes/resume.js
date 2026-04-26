const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

const extractSkillsFromText = (text) => {
  const keywords = ['React', 'Node', 'MongoDB', 'PostgreSQL', 'Python', 'TensorFlow', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Structures'];
  const found = keywords.filter((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(text));
  return [...new Set(found)];
};

const { generateQuestionTemplate } = require('../utils/llm');

const generateQuestionsFromSkills = (skills) => {
  return skills.slice(0, 5).map((skill, index) => ({
    question: `Based on your experience with ${skill}, explain how you would solve a real-world problem using this technology.`,
    difficulty: index < 2 ? 'easy' : 'medium',
    topic: 'role_based',
  }));
};

const router = express.Router();

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Resume file required' });

  const filePath = req.file.path;
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer);
  fs.unlinkSync(filePath);

  const skills = extractSkillsFromText(parsed.text);
  const questions = generateQuestionsFromSkills(skills);

  res.json({ skills, questions });
});

module.exports = router;
