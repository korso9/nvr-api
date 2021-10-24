const express = require('express');

const router = express.Router();

const {
  verifyEmail,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  login,
  logout,
} = require('../controllers/users');

router.post('/register', [register, verifyEmail]);
router.put('/confirm/', confirmEmail);
router.post('/forgot', [forgotPassword, verifyEmail]);
router.put('/reset/:id', resetPassword);
router.post('/login', [login, verifyEmail]);
router.get('/logout', logout);

module.exports = router;
