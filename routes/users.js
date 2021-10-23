const express = require('express');

const router = express.Router();

const {
  verifyEmail,
  register,
  forgotPassword,
  confirmEmail,
  confirmReset,
  resetPassword,
  login,
  logout,
} = require('../controllers/users');

router.post('/register', [register, verifyEmail]);
router.post('/forgot', [forgotPassword, verifyEmail]);
router.put('/confirm/:id', confirmEmail);
router.put('/reset/:id', confirmReset);
router.put('/setnewpw/:id', resetPassword);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
