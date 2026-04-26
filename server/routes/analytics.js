const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Simple analytics tracking
router.post('/track', auth, (req, res) => {
  const { eventType, metadata } = req.body;
  // in production, store to analytics collection
  console.log('Analytics event', req.user.email, eventType, metadata);
  res.json({ status: 'ok' });
});

module.exports = router;
