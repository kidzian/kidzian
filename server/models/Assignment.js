const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    maxMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
    instructions: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        fileName: String,
        filePath: String,
        originalName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    allowLateSubmission: {
      type: Boolean,
      default: false,
    },
    submissionFormat: {
      type: String,
      enum: ["text", "file", "both"],
      default: "both",
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    averageGrade: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
assignmentSchema.index({ batch: 1, dueDate: 1 })
assignmentSchema.index({ teacher: 1, createdAt: -1 })
assignmentSchema.index({ course: 1, isActive: 1 })

// Virtual for checking if assignment is overdue
assignmentSchema.virtual("isOverdue").get(function () {
  return new Date() > this.dueDate
})

// Virtual for days remaining
assignmentSchema.virtual("daysRemaining").get(function () {
  const now = new Date()
  const due = new Date(this.dueDate)
  const diffTime = due - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Method to update submission statistics
assignmentSchema.methods.updateStats = async function () {
  const Submission = mongoose.model("Submission")
  const stats = await Submission.aggregate([
    { $match: { assignment: this._id } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        averageGrade: { $avg: "$grade" },
      },
    },
  ])
  if (stats.length > 0) {
    this.totalSubmissions = stats[0].totalSubmissions
    this.averageGrade = Math.round(stats[0].averageGrade * 100) / 100 // Round to 2 decimal places
  } else {
    this.totalSubmissions = 0
    this.averageGrade = 0
  }
  await this.save()
}

// Pre-save middleware to set default due date if not provided
assignmentSchema.pre("save", function (next) {
  if (!this.dueDate) {
    // Set default due date to 7 days from now
    this.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
  next()
})

module.exports = mongoose.model("Assignment", assignmentSchema)
