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
    // Legacy single file support (keep for backward compatibility)
    filePath: String,
    fileName: String,
    // Enhanced: Support for multiple attachments
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          default: 0,
        },
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
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      trim: true,
    },
    isGraded: {
      type: Boolean,
      default: false,
    },
    gradedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })
submissionSchema.index({ batch: 1, submittedAt: -1 })
submissionSchema.index({ student: 1, submittedAt: -1 })

// Virtual for checking if submission is late
submissionSchema.virtual("isLate").get(function () {
  if (!this.assignment || !this.assignment.dueDate) return false
  return this.submittedAt > this.assignment.dueDate
})

// Method to get all file paths (legacy + new attachments)
submissionSchema.methods.getAllFilePaths = function () {
  const filePaths = []

  // Add legacy file if exists
  if (this.filePath && this.fileName) {
    filePaths.push({
      fileName: this.fileName,
      filePath: this.filePath,
      originalName: this.fileName,
    })
  }

  // Add new attachments
  if (this.attachments && this.attachments.length > 0) {
    this.attachments.forEach((attachment) => {
      filePaths.push({
        fileName: attachment.fileName,
        filePath: attachment.filePath,
        originalName: attachment.originalName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
      })
    })
  }

  return filePaths
}

module.exports = mongoose.model("Submission", submissionSchema)
