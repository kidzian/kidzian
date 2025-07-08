const mongoose = require("mongoose")
const { Schema } = mongoose

const projectSubmissionSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubUrl: String,
    liveUrl: String,

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

    // Legacy fields for backward compatibility
    filePath: String,
    fileName: String,

    teamMembers: [String],
    grade: Number,
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Method to get all file paths (legacy + new attachments)
projectSubmissionSchema.methods.getAllFilePaths = function () {
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

module.exports = mongoose.model("ProjectSubmission", projectSubmissionSchema)
