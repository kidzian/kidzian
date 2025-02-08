const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
    startingDate: { type: Date },
    totalClasses:{type: Number},
    lectures: [
      {
        name: { type: String },
        date: { type: Date},
        completed:{type: Boolean},
        
        attendance: [
          {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            attended: { type: Boolean, default: false },
          },
        ],
      },
    ],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to User
    createdAt: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Batch', batchSchema);