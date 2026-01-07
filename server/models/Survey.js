const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  type: {
    type: String,
    enum: ['multiple-choice', 'short-answer', 'rating']
  },
  options: [String]
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', surveySchema);
