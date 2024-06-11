// const mongoose = require('mongoose');

// // Define a schema for the quiz data
// const quizSchema = new mongoose.Schema({
//   question: {
//     type: String,
//     required: true,
//   },
//   options: [String], // An array of answer options
//   correctAnswer: {
//     type: String,
//     required: true,
//   },
// });

// // Create a model based on the schema
// module.exports = mongoose.model("Quiz", quizSchema);

/////////////////////////////////////////////////////////////

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
