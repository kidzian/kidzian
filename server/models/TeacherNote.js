const mongoose = require("mongoose")

const teacherNoteSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  suggestions: {
    type: String,
    default: "",
  },
  strengths: {
    type: String,
    default: "",
  },
  areasForImprovement: {
    type: String,
    default: "",
  },
  // ENHANCED: Multiple classes taken with details
  classesTaken: [
    {
      date: {
        type: Date,
        required: true,
      },
      topic: {
        type: String,
        default: "",
      },
      notes: {
        type: String,
        default: "",
      },
    },
  ],
  // ENHANCED: Certificates earned by the student
  certificates: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: "",
      },
      dateEarned: {
        type: Date,
        required: true,
      },
      certificateUrl: {
        type: String,
        default: "",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create compound index to ensure one note per teacher-student pair
teacherNoteSchema.index({ teacher: 1, student: 1 }, { unique: true })

// Update the updatedAt field before saving
teacherNoteSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model("TeacherNote", teacherNoteSchema)
