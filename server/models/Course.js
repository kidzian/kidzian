const mongoose = require('mongoose');

// Define the schema for a course
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  image: {
    type: String, // Store the image URL or path
    required: true, // Image is required
  },
  pdf: {
    type: String, // Store the PDF URL or path
    required: true, // PDF is required
  },
  ageGroup: {
    type: String, // Store age group as a string (e.g., '15-20', '21-30')
    required: true, // Age group is required
  },
  about: {
    type: [String], // Array of strings to store different descriptions or points about the course
    required: true, // About is required
  },
  learningOutcomes: {
    type: [String], // Array of strings to store the learning outcomes
    required: true, // Learning outcomes are required
  }
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
