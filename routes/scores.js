const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

// get an existing lesson score
router.get('/api/:userId/scores/:product/:scoreId', (req, res) => {
  res.status(200).json({ success: true });
});

// update an existing lesson score
router.put('/api/:userId/scores/:product/:scoreId', (req, res) => {
  res.status(200).json({ success: true });
});

// create a new lesson score
router.post('/api/:userId/scores', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
