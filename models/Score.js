const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  product: {
    type: String,
    enum: process.env.PRODUCT_LIST,
  },
  lesson: {
    type: Number,
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
  },
  resets: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model('Score', ScoreSchema);
