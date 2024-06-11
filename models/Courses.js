const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true
  },
  title: { 
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
    },
  topics: {
    type: [String],
    required: true
    },
    description: {
      type: String,
      required: true
    },
  imagePath: {
    type: String,
    required: true
    },
    pdfPath: { type: String },
    videoPath: { type: String },
});

module.exports = mongoose.model('Course', courseSchema);