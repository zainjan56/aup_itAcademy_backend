const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Adjust the path as necessary

router.post('/createquiz', async (req, res) => {
  try {
    const { courseCode, title, questions } = req.body;

    const newQuiz = new Quiz({
      courseCode,
      title,
      questions,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz added successfully', data: newQuiz });
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/questions', async (req, res) => {
  try {
    // Use Mongoose to query the database for all questions
    const questions = await Quiz.find();
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

module.exports = router;