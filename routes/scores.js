const express = require('express');
const router = express.Router();
const { createNewScore, getScore, addScore } = require('../controllers/scores');
const protect = require('../middleware/auth');

router.post('/', [protect, createNewScore]);
router.get('/:product/:lesson', [protect, getScore]);
router.put('/:product/:lesson', [protect, addScore]);

module.exports = router;
