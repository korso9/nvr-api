const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const randomize = require('randomatic');

const UserSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      required: [true, 'Please add a valid email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    firstName: {
      type: String,
      required: [true, 'Please add your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add your last name'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be between 8 and 12 characters'],
      maxlength: [10, 'Password must be between 8 and 12 characters'],
      select: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpire: {
      type: Date,
      default: null,
    },
    resetConfirmed: {
      type: Boolean,
      default: false,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('scores', {
  ref: 'Score',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Encrypt password on user save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Test entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification code
UserSchema.methods.getVerificationCode = async function () {
  // Create random code
  const code = randomize('A0', 6);
  const salt = await bcrypt.genSalt(10);

  // Hash code and store
  this.verificationCode = await bcrypt.hash(code, salt);

  // Set verificaiton code to expire in 60 minutes
  this.verificationExpire = Date.now() + 60 * 60 * 1000;

  // return verification code
  return code;
};

// Test entered code to hashed code
UserSchema.methods.matchVerificationCode = async function (enteredCode) {
  return await bcrypt.compare(enteredCode, this.verificationCode);
};

module.exports = mongoose.model('User', UserSchema);
