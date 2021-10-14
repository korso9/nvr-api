const express = require('express');

const router = express.Router();

router.post('/', createScore);
router.get('/:product/:lesson', getScore);
router.put('/:product/:lesson', addToScore);
router.put('/:product/:lesson', unlockScore);

module.exports = router;
