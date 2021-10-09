const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  product: {
    type: String,
    enum: process.env.PRODUCT_LIST.split(', '),
    required: true,
  },
  lesson: {
    type: Number,
    required: true,
  },
  highestScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  score1: {
    type: Number,
    min: 0,
    max: 100,
  },
  score2: {
    type: Number,
    min: 0,
    max: 100,
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 2,
    required: true,
  },
  freeMode: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Score', ScoreSchema);
