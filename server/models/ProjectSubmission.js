const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSubmissionSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
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
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  githubUrl: String,
  liveUrl: String,
  filePath: String,
  fileName: String,
  teamMembers: [String],
  grade: Number,
  feedback: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProjectSubmission', projectSubmissionSchema);
