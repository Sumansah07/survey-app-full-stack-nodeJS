const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const survey = new Survey({
      ...req.body,
      createdBy: req.user.userId
    });
    await survey.save();
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.find().populate('createdBy', 'name email');
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-surveys', auth, async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: req.user.userId });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate('createdBy', 'name email');
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    if (survey.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Survey deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
