const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  lectures: [
    {
      name: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      attendance: [
        {
          studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          attended: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Batch', batchSchema);