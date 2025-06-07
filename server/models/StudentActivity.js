const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentActivitySchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  loginCount: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  activitiesCompleted: [{
    type: {
      type: String,
      enum: ['assignment', 'assessment', 'project', 'attendance']
    },
    id: Schema.Types.ObjectId,
    points: Number,
    completedAt: Date
  }],
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one record per student per day
studentActivitySchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StudentActivity', studentActivitySchema);
