const router = require('express').Router();

router.use('/api/users', require('./users'));

router.use('/api/scores', require('./scores'));

module.exports = router;
