const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book'); // Update the path based on your project structure

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pdfs/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle book uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const filePath = `${req.file.filename}`;

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      filePath,
    });

    // Save the book to the database
    await newBook.save();

    res.status(201).json({ message: 'Book uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload book' });
  }
});

// Endpoint to get all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;