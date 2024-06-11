const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    secretId: {
        type: String,
        min: 3,
        max: 30,
    },
    name: {
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    email: {
        type: String,
        min: 3,
        max: 100,
        required: true
    },
    password: {
        type: String,
        min: 8,
        max: 100,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Teacher', 'Admin'],
        required: true,
      },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("User", userSchema);