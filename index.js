const express = require("express");
const userRoutes = require("./routes/user");
const courseRoutes = require('./routes/courses');
const quizRoutes = require('./routes/quiz');
const studentscoreRoutes = require('./routes/studentscore');
const mongoose = require("mongoose");
require("dotenv/config");
var cors = require("cors");

const PORT = process.env.PORT || 3001

const app = express();

const corsOptions = {
  exposedHeaders: ['Content-Length', 'token', 'Authorization'],
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qv9cox2.mongodb.net/`)

app.use(express.json());

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });

app.use("/api/user", userRoutes);

app.use(express.static('public/images'));
app.use(express.static('public/pdfs'));
app.use(express.static('public/videos'));

app.use('/courses', courseRoutes);

app.use("/quiz",quizRoutes);

app.use('/studentscore', studentscoreRoutes);


app.listen(PORT, () => console.log(`Running API on ${PORT}`))