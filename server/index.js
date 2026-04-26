const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

dotenv.config();

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const interviewRoutes = require('./routes/interview');
const dashboardRoutes = require('./routes/dashboard');
const analyticsRoutes = require('./routes/analytics');
const resumeRoutes = require('./routes/resume');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AI Interview Prep API' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
