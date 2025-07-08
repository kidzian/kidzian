const mongoose = require("mongoose")
const { Schema } = mongoose

const assessmentSubmissionSchema = new Schema(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        answer: String,
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    // Enhanced: Support for file attachments in assessments (optional)
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
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Method to get all file paths for assessments (if any)
assessmentSubmissionSchema.methods.getAllFilePaths = function () {
  const filePaths = []

  // Add attachments if any
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

module.exports = mongoose.model("AssessmentSubmission", assessmentSubmissionSchema)
