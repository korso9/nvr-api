const express = require('express');
const router = express.Router();
const { postScore, getScore } = require('../controllers/scores');
const { protect } = require('../middleware/auth');

router.post('/', [protect, postScore]);
router.get('/:product/:lesson', [protect, getScore]);

module.exports = router;
