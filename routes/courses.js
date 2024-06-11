const express = require("express");
const multer = require("multer");
const path = require("path");
const { courseValidation } = require("./validation");
const router = express.Router();
const Course = require("../models/Courses");
const fs = require("fs");

// Ensure directories exist
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Set up multer storage for course files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";
    if (file.fieldname === "courseImage") {
      uploadPath = "public/images";
    } else if (file.fieldname === "coursePDF") {
      uploadPath = "public/pdfs";
    } else if (file.fieldname === "courseVideo") {
      uploadPath = "public/videos";
    }
    ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

//router.use('/uploads', express.static('uploads'));

// API endpoint to add a new course
router.post(
  "/addcourse",
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "coursePDF", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, instructor, topics, description, courseCode } = req.body;
      const { error } = courseValidation(req.body);
      if (error) return res.send(error.details[0].message);

      const topicsArray = topics.split(",").map((topic) => topic.trim()); // Convert comma-separated string to an array

      const findCourse = await Course.findOne({ title: req.body.title });
      if (findCourse)
        return res.status(400).send("Course is already registered!");

      const courseImage = req.files["courseImage"]
        ? req.files["courseImage"][0].filename
        : null;
      const coursePDF = req.files["coursePDF"]
        ? req.files["coursePDF"][0].filename
        : null;
      const courseVideo = req.files["courseVideo"]
        ? req.files["courseVideo"][0].filename
        : null;

      const newCourse = new Course({
        courseCode,
        title,
        instructor,
        topics: topicsArray,
        description,
        imagePath: courseImage,
        pdfPath: coursePDF,
        videoPath: courseVideo,
      });
      await newCourse.save();

      res.status(201).json({
        course: newCourse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

// To get all courses
router.get("/addcourse", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// To delete course
router.delete("/deletecourse/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Use findByIdAndDelete to remove the course by its ID
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// To update the course
// In your server file (e.g., courses.js)
router.put("/updatecourse/:id",
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "coursePDF", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCourseData = req.body;

      // Handle updating course files if provided
      if (req.files["courseImage"]) {
        updatedCourseData.imagePath = req.files["courseImage"][0].filename;
      }
      if (req.files["coursePDF"]) {
        updatedCourseData.pdfPath = req.files["coursePDF"][0].filename;
      }
      if (req.files["courseVideo"]) {
        updatedCourseData.videoPath = req.files["courseVideo"][0].filename;
      }

      // Convert topics string to array if provided
      if (updatedCourseData.topics) {
        updatedCourseData.topics = updatedCourseData.topics
          .split(", ")
          .map((topic) => topic.trim());
      }

      // Use findByIdAndUpdate to update the course by its ID
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        updatedCourseData,
        {
          new: true,
        }
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(updatedCourse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

// Define a route to get a specific course by ID
router.get("/addcourse/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
