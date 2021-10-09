const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

// get an existing lesson score
router.get('/:product/:scoreId', (req, res) => {
  res.status(200).json({ success: true });
});

// update an existing lesson score
router.put('/:product/:scoreId', (req, res) => {
  res.status(200).json({ success: true });
});

// create a new lesson score
router.post('/', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
