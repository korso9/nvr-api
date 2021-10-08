const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add a valid email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  firstName: {
    Type: String,
    required: [true, 'Please add your first name'],
  },
  lastName: {
    Type: String,
    required: [true, 'Please add your last name'],
  },
  password: {
    Type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be between 8 and 12 characters'],
    maxlength: [12, 'Password must be between 8 and 12 characters'],
    select = false,
  },
});

module.exports = mongoose.model('User', UserSchema);