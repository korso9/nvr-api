const express = require('express');

const router = express.Router();

const {
  verifyEmail,
  register,
  confirmEmail,
  forgotPassword,
  resetPassword,
  login,
} = require('../controllers/users');

router.post('/register', [register, verifyEmail]);
router.put('/confirm/:id', confirmEmail);
router.put('/forgot', [forgotPassword, verifyEmail]);
router.put('/reset/:id', resetPassword);
router.post('/login', [login, verifyEmail]);
router.put('/resend/:id', verifyEmail);

module.exports = router;
