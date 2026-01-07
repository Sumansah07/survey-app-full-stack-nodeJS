const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  answer: mongoose.Schema.Types.Mixed
});

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondentEmail: {
    type: String
  },
  respondentName: {
    type: String
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);
