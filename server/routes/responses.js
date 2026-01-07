const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Survey = require('../models/Survey');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const responseData = {
      surveyId: req.body.surveyId,
      answers: req.body.answers,
      respondentName: req.body.respondentName,
      respondentEmail: req.body.respondentEmail
    };

    // If user is logged in, add their user ID
    if (req.header('x-auth-token')) {
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(req.header('x-auth-token'), process.env.JWT_SECRET || 'your-secret-key');
        responseData.submittedBy = decoded.userId;
      } catch (err) {
        // Token invalid, continue without user ID
      }
    }

    const response = new Response(responseData);
    await response.save();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/survey/:surveyId', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    if (survey.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const responses = await Response.find({ surveyId: req.params.surveyId })
      .populate('submittedBy', 'name email')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics/:surveyId', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    if (survey.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const responses = await Response.find({ surveyId: req.params.surveyId });
    
    const analytics = {
      totalResponses: responses.length,
      questions: survey.questions.map(question => {
        const questionResponses = responses.map(r => 
          r.answers.find(a => a.questionId.toString() === question._id.toString())
        ).filter(Boolean);

        if (question.type === 'multiple-choice') {
          const counts = {};
          question.options.forEach(opt => counts[opt] = 0);
          questionResponses.forEach(r => {
            if (r.answer && counts[r.answer] !== undefined) {
              counts[r.answer]++;
            }
          });
          return {
            questionId: question._id,
            text: question.text,
            type: question.type,
            data: counts
          };
        } else if (question.type === 'rating') {
          const ratings = questionResponses.map(r => parseInt(r.answer)).filter(r => !isNaN(r));
          const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
          return {
            questionId: question._id,
            text: question.text,
            type: question.type,
            average: avg.toFixed(2),
            responses: ratings
          };
        } else {
          return {
            questionId: question._id,
            text: question.text,
            type: question.type,
            answers: questionResponses.map(r => r.answer)
          };
        }
      })
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
