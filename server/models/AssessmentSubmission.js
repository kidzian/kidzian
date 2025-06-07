const mongoose = require('mongoose');
const { Schema } = mongoose;

const assessmentSubmissionSchema = new Schema({
  assessment: {
    type: Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batch: {
    type: Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  answers: [{
    questionIndex: Number,
    answer: String,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssessmentSubmission', assessmentSubmissionSchema);
