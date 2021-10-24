const router = require('express').Router();

router.use('/api/users', require('./users'));

router.use('/api/users/:userId/scores', require('./scores'));

module.exports = router;
