const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

router.get('/api/:userId/scores', (req, res) => {
  res.status(200).json({ success: true });
});

router.put('/api/:userId/scores', (req, res) => {
  res.status(200).json({ success: true });
});

router.post('/api/:userId/scores', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
