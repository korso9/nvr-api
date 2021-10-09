const express = require('express');
const User = require('../models/User');

const router = express.Router();

// get a specific user
// will use select modifiers to get specific data
router.get('/api/:userId', (req, res) => {
  res.status(200).json({ success: true });
});

// update a specific user
router.put('/api/:userId', (req, res) => {
  res.status(200).json({ success: true });
});

// register a new user
router.post('/api', (req, res) => {
  res.status(200).json({ success: true });
});

module.exports = router;
