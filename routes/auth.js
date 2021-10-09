const express = require('express');
const User = require('../models/User');

const router = express.Router();

// get a specific user
// will use select modifiers to get specific data
router.get('/:userId', (req, res) => {
  res.status(200).json({ success: true });
});

// update a specific user
router.put('/:userId', (req, res) => {
  res.status(200).json({ success: true });
});

// register a new user
router.post('/', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
