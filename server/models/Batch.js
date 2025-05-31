const mongoose = require("mongoose")

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    schedule: {
      type: Object,
      required: true,
    },
    maxStudents: {
      type: Number,
      required: true,
    },
    currentStudents: {
      type: Number,
      default: 0,
    },
    students: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming User is your student model
  },
],
    lectures: [
      {
        name: { type: String },
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
)

const Batch = mongoose.model("Batch", batchSchema)

module.exports = Batch
