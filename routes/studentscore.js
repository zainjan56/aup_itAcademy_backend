const express = require("express");
const router = express.Router();
const StudentScore = require("../models/StudentScore");

const mongoose = require("mongoose");

router.post("/scores", async (req, res) => {

  const { studentid, studentname, score, courseCode, courseTitle } = req.body;

  try {
    let studentScore = await StudentScore.findOne({ studentid, courseCode });

    if (studentScore) {
      // Update score if entry exists
      studentScore.score = score;
    } else {
      // Create new entry if not
      studentScore = new StudentScore({
        studentid,
        studentname,
        score,
        courseCode,
        courseTitle
      });
    }

    await studentScore.save();
    res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


// In your server code (e.g., Node.js with Express)
router.get('/student-scores/:studentid', async (req, res) => {
  const { studentid } = req.params;
  try {
    const scores = await StudentScore.find({ studentid });

    if (!scores) {
      return res.status(404).json({ message: "No scores found for this student." });
    }

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the scores." });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await StudentScore.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
});

module.exports = router;