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
    default: 1,
    min: 1,
    max: 2,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Update average score and highest score on save
ScoreSchema.pre('save', async function (next) {
  // if the score is new, average score = first score
  if (this.isNew) {
    this.averageScore = this.score1;
    this.highestScore = this.score1;
    next();
    // else update average score and increment attempts
  } else {
    this.averageScore = Math.round((this.score1 + this.score2) / 2);
    this.highestScore = this.score2 > this.score1 ? this.score2 : this.score1;
    this.attempts += 1;
    next();
  }
});

module.exports = mongoose.model('Score', ScoreSchema);
