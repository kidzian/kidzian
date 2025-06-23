const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        fileName: String,
        originalName: String,
        filePath: String,
        fileSize: Number,
        mimeType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLateSubmission: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "returned", "resubmitted"],
      default: "submitted",
    },
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        content: String,
        attachments: [
          {
            fileName: String,
            originalName: String,
            filePath: String,
            uploadedAt: Date,
          },
        ],
        submittedAt: Date,
        version: Number,
      },
    ],

    // Legacy fields for backward compatibility
    filePath: String,
    fileName: String,
  },
  {
    timestamps: true,
  },
)

// Compound index for unique submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })
submissionSchema.index({ batch: 1, submittedAt: -1 })
submissionSchema.index({ student: 1, submittedAt: -1 })
submissionSchema.index({ gradedBy: 1, status: 1 })

// Index for file cleanup queries
submissionSchema.index({ "attachments.fileName": 1 })
submissionSchema.index({ fileName: 1 }) // Legacy field

// Virtual for grade percentage
submissionSchema.virtual("gradePercentage").get(function () {
  if (!this.grade || !this.populated("assignment")) return null
  return Math.round((this.grade / this.assignment.maxMarks) * 100)
})

// Virtual for submission status display
submissionSchema.virtual("statusDisplay").get(function () {
  switch (this.status) {
    case "submitted":
      return this.grade !== undefined ? "Graded" : "Submitted"
    case "graded":
      return "Graded"
    case "returned":
      return "Returned"
    case "resubmitted":
      return "Resubmitted"
    default:
      return "Unknown"
  }
})

// Method to check if submission is late
submissionSchema.methods.checkIfLate = async function () {
  await this.populate("assignment")
  this.isLateSubmission = this.submittedAt > this.assignment.dueDate
  return this.isLateSubmission
}

// Method to add grade and feedback
submissionSchema.methods.addGrade = function (grade, feedback, gradedBy) {
  this.grade = grade
  this.feedback = feedback
  this.gradedBy = gradedBy
  this.gradedAt = new Date()
  this.status = "graded"
  return this.save()
}

// Pre-remove middleware to clean up files when submission is deleted
submissionSchema.pre("remove", async function (next) {
  const { deleteFile } = require("../middleware/filecleanup")
  const path = require("path")

  // Clean up attachments
  if (this.attachments && this.attachments.length > 0) {
    for (const attachment of this.attachments) {
      if (attachment.filePath) {
        let fullPath = attachment.filePath
        if (!path.isAbsolute(fullPath)) {
          fullPath = path.join(process.cwd(), attachment.filePath)
        }
        await deleteFile(fullPath)
      }
    }
  }

  // Clean up legacy file (if any)
  if (this.filePath) {
    let fullPath = this.filePath
    if (!path.isAbsolute(fullPath)) {
      fullPath = path.join(process.cwd(), this.filePath)
    }
    await deleteFile(fullPath)
  }

  next()
})

// Pre-save middleware to check if submission is late
submissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    await this.checkIfLate()
  }
  next()
})

// Post-save middleware to update assignment statistics
submissionSchema.post("save", async function () {
  const Assignment = mongoose.model("Assignment")
  const assignment = await Assignment.findById(this.assignment)
  if (assignment) {
    await assignment.updateStats()
  }
})

// Static method to clean up files for multiple submissions
submissionSchema.statics.cleanupFiles = async function (filter) {
  const submissions = await this.find(filter)
  const { deleteFile } = require("../middleware/filecleanup")
  const path = require("path")

  let deletedCount = 0

  for (const submission of submissions) {
    // Clean up attachments
    if (submission.attachments && submission.attachments.length > 0) {
      for (const attachment of submission.attachments) {
        if (attachment.filePath) {
          let fullPath = attachment.filePath
          if (!path.isAbsolute(fullPath)) {
            fullPath = path.join(process.cwd(), attachment.filePath)
          }
          const deleted = await deleteFile(fullPath)
          if (deleted) deletedCount++
        }
      }
    }

    // Clean up legacy file (if any)
    if (submission.filePath) {
      let fullPath = submission.filePath
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), submission.filePath)
      }
      const deleted = await deleteFile(fullPath)
      if (deleted) deletedCount++
    }
  }

  return deletedCount
}

module.exports = mongoose.model("Submission", submissionSchema)
