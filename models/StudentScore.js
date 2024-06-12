const mongoose = require("mongoose");

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
