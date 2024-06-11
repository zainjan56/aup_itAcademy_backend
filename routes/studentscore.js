const express = require("express");
const router = express.Router();
const StudentScore = require("../models/StudentScore");

const mongoose = require("mongoose");

router.post("/scores", async (req, res) => {
  try {
    const { studentid, score, studentname } = req.body;

    // Check if studentid is defined and not empty
    if (typeof studentid === "string" && studentid.trim() !== "") {
      // Convert studentid to ObjectId
      const studentObjectId = new mongoose.Types.ObjectId(studentid);

      // Check if a score entry for the student already exists
      const existingScore = await StudentScore.findOne({ studentId: studentObjectId });

      if (existingScore) {
        // Update the existing entry with new scores
        existingScore.quizScore = score;

        await existingScore.save(); // Save the updated entry
      } else {
        // Create a new StudentScore document
        const studentScore = new StudentScore({
          studentId: studentObjectId,
          studentName: studentname,
          quizScore: score,
        });

        // Save the student's scores to the database
        await studentScore.save();
      }

      res.json({ message: "Scores saved or updated successfully" });
    } else {
      res.status(400).json({ error: "Invalid studentId" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving or updating scores" });
  }
});


// In your server code (e.g., Node.js with Express)
router.get('/student-scores/:studentid', async (req, res) => {
  try {
    const { studentid } = req.params;
    const studentScores = await StudentScore.findOne({ studentId: studentid });
    res.json(studentScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching student scores" });
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