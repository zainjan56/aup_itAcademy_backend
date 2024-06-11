const mongoose = require("mongoose");

// const studentScoreSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the student
//   studentName: {type: String},
//   quizScore: { type: Number, default: 0 },
//   readingScore: { type: Number, default: 0 },
//   // Add other scores here
// });

////////////////////////////////////////////////////

const studentScoreSchema = new mongoose.Schema({
  studentid: {
    type: String,
    required: true,
  },
  studentname: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
});

const StudentScore = mongoose.model("StudentScore", studentScoreSchema);

module.exports = StudentScore;
