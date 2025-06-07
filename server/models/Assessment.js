const mongoose = require('mongoose');
const { Schema } = mongoose;

const assessmentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['quiz', 'test', 'exam', 'practical'],
    default: 'quiz'
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
      default: 'multiple-choice'
    },
    options: [String], // For multiple choice
    correctAnswer: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  batch: {
    type: Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  dueDate: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);
