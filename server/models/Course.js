

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  pdf: { type: String, required: true },
  ageGroup: { type: String, required: true },
  about: { type: [String], required: true },
  learningOutcomes: { type: [String], required: true },
  batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // Reference to Batch
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;