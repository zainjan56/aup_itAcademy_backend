const mongoose = require("mongoose");

const studentScoreSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the student
  studentName: {type: String},
  quizScore: { type: Number, default: 0 },
  readingScore: { type: Number, default: 0 },
  // Add other scores here
});

const StudentScore = mongoose.model("StudentScore", studentScoreSchema);

module.exports = StudentScore;
