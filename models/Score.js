const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  product: {
    type: String,
    enum: process.env.PRODUCT_LIST,
    required: true,
  },
  lesson: {
    type: Number,
    required: true,
  },
  highestScore: {
    type: Decimal,
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  attempts: {
    default: 0,
    min: 0,
    max: 2,
    required: true,
  },
  resets: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Score', ScoreSchema);
