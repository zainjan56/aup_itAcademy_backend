const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String], 
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
