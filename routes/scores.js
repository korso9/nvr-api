const express = require('express');

const router = express.Router();

const {
  createNewScore,
  getScore,
  addScore,
  unlockScore,
} = require('../controllers/scores');

router.post('/', createNewScore);
router.get('/:product/:lesson', getScore);
router.put('/:product/:lesson', addScore);
router.put('/:product/:lesson', unlockScore);

module.exports = router;
