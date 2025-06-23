const fs = require("fs").promises
const path = require("path")

/**
 * Enhanced file cleanup middleware for Kidzian Learning Platform
 * Works with the existing submission models and file structure
 */

// Helper function to safely delete a file
const deleteFile = async (filePath) => {
  try {
    await fs.access(filePath)
    await fs.unlink(filePath)
    console.log(`Successfully deleted file: ${filePath}`)
    return true
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`File not found (already deleted): ${filePath}`)
      return true // File doesn't exist, consider it successful
    }
    console.error(`Error deleting file ${filePath}:`, error)
    return false
  }
}

// Helper function to get all submission files for assignments
const getAssignmentSubmissionFiles = async (assignmentId, Submission) => {
  try {
    const submissions = await Submission.find({ assignment: assignmentId })
    const filePaths = []

    submissions.forEach((submission) => {
      if (submission.attachments && submission.attachments.length > 0) {
        submission.attachments.forEach((attachment) => {
          if (attachment.fileName && attachment.filePath) {
            filePaths.push({
              fileName: attachment.fileName,
              filePath: attachment.filePath,
              originalName: attachment.originalName,
              submissionId: submission._id,
            })
          }
        })
      }

      // Handle legacy single file submissions (if any)
      if (submission.filePath && submission.fileName) {
        filePaths.push({
          fileName: submission.fileName,
          filePath: submission.filePath,
          submissionId: submission._id,
        })
      }
    })

    return filePaths
  } catch (error) {
    console.error("Error getting assignment submission files:", error)
    return []
  }
}

// Helper function to get all submission files for assessments
const getAssessmentSubmissionFiles = async (assessmentId, AssessmentSubmission) => {
  try {
    const submissions = await AssessmentSubmission.find({ assessment: assessmentId })
    const filePaths = []

    submissions.forEach((submission) => {
      if (submission.attachments && submission.attachments.length > 0) {
        submission.attachments.forEach((attachment) => {
          if (attachment.fileName && attachment.filePath) {
            filePaths.push({
              fileName: attachment.fileName,
              filePath: attachment.filePath,
              originalName: attachment.originalName,
              submissionId: submission._id,
            })
          }
        })
      }
    })

    return filePaths
  } catch (error) {
    console.error("Error getting assessment submission files:", error)
    return []
  }
}

// Helper function to get all submission files for projects
const getProjectSubmissionFiles = async (projectId, ProjectSubmission) => {
  try {
    const submissions = await ProjectSubmission.find({ project: projectId })
    const filePaths = []

    submissions.forEach((submission) => {
      if (submission.attachments && submission.attachments.length > 0) {
        submission.attachments.forEach((attachment) => {
          if (attachment.fileName && attachment.filePath) {
            filePaths.push({
              fileName: attachment.fileName,
              filePath: attachment.filePath,
              originalName: attachment.originalName,
              submissionId: submission._id,
            })
          }
        })
      }

      // Handle legacy single file submissions (if any)
      if (submission.filePath && submission.fileName) {
        filePaths.push({
          fileName: submission.fileName,
          filePath: submission.filePath,
          submissionId: submission._id,
        })
      }
    })

    return filePaths
  } catch (error) {
    console.error("Error getting project submission files:", error)
    return []
  }
}

// Main cleanup function for assignments
const cleanupAssignmentFiles = async (assignmentId, models) => {
  try {
    console.log(`Starting file cleanup for assignment with ID: ${assignmentId}`)

    const { Submission } = models
    const files = await getAssignmentSubmissionFiles(assignmentId, Submission)

    if (files.length === 0) {
      console.log(`No files found for assignment ${assignmentId}`)
      return { success: true, deletedFiles: 0, errors: [] }
    }

    const results = {
      success: true,
      deletedFiles: 0,
      errors: [],
    }

    // Delete each file
    for (const file of files) {
      // Use the full file path if available, otherwise construct it
      let fullPath = file.filePath
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), file.filePath)
      }

      const deleted = await deleteFile(fullPath)

      if (deleted) {
        results.deletedFiles++
      } else {
        results.errors.push(`Failed to delete: ${file.fileName}`)
        results.success = false
      }
    }

    // Delete the submission records from database
    try {
      const deleteResult = await Submission.deleteMany({ assignment: assignmentId })
      console.log(`Deleted ${deleteResult.deletedCount} assignment submission records`)
    } catch (dbError) {
      console.error("Error deleting assignment submission records:", dbError)
      results.errors.push("Failed to delete submission records from database")
    }

    console.log(`File cleanup completed for assignment ${assignmentId}:`, results)
    return results
  } catch (error) {
    console.error(`Error in file cleanup for assignment ${assignmentId}:`, error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error.message],
    }
  }
}

// Main cleanup function for assessments
const cleanupAssessmentFiles = async (assessmentId, models) => {
  try {
    console.log(`Starting file cleanup for assessment with ID: ${assessmentId}`)

    const { AssessmentSubmission } = models
    const files = await getAssessmentSubmissionFiles(assessmentId, AssessmentSubmission)

    if (files.length === 0) {
      console.log(`No files found for assessment ${assessmentId}`)
      return { success: true, deletedFiles: 0, errors: [] }
    }

    const results = {
      success: true,
      deletedFiles: 0,
      errors: [],
    }

    // Delete each file
    for (const file of files) {
      let fullPath = file.filePath
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), file.filePath)
      }

      const deleted = await deleteFile(fullPath)

      if (deleted) {
        results.deletedFiles++
      } else {
        results.errors.push(`Failed to delete: ${file.fileName}`)
        results.success = false
      }
    }

    // Delete the submission records from database
    try {
      const deleteResult = await AssessmentSubmission.deleteMany({ assessment: assessmentId })
      console.log(`Deleted ${deleteResult.deletedCount} assessment submission records`)
    } catch (dbError) {
      console.error("Error deleting assessment submission records:", dbError)
      results.errors.push("Failed to delete submission records from database")
    }

    console.log(`File cleanup completed for assessment ${assessmentId}:`, results)
    return results
  } catch (error) {
    console.error(`Error in file cleanup for assessment ${assessmentId}:`, error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error.message],
    }
  }
}

// Main cleanup function for projects
const cleanupProjectFiles = async (projectId, models) => {
  try {
    console.log(`Starting file cleanup for project with ID: ${projectId}`)

    const { ProjectSubmission } = models
    const files = await getProjectSubmissionFiles(projectId, ProjectSubmission)

    if (files.length === 0) {
      console.log(`No files found for project ${projectId}`)
      return { success: true, deletedFiles: 0, errors: [] }
    }

    const results = {
      success: true,
      deletedFiles: 0,
      errors: [],
    }

    // Delete each file
    for (const file of files) {
      let fullPath = file.filePath
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), file.filePath)
      }

      const deleted = await deleteFile(fullPath)

      if (deleted) {
        results.deletedFiles++
      } else {
        results.errors.push(`Failed to delete: ${file.fileName}`)
        results.success = false
      }
    }

    // Delete the submission records from database
    try {
      const deleteResult = await ProjectSubmission.deleteMany({ project: projectId })
      console.log(`Deleted ${deleteResult.deletedCount} project submission records`)
    } catch (dbError) {
      console.error("Error deleting project submission records:", dbError)
      results.errors.push("Failed to delete submission records from database")
    }

    console.log(`File cleanup completed for project ${projectId}:`, results)
    return results
  } catch (error) {
    console.error(`Error in file cleanup for project ${projectId}:`, error)
    return {
      success: false,
      deletedFiles: 0,
      errors: [error.message],
    }
  }
}

// Utility function to clean up orphaned files
const cleanupOrphanedFiles = async (models) => {
  try {
    const { Submission, AssessmentSubmission, ProjectSubmission } = models
    const uploadsDir = path.join(process.cwd(), "uploads", "assignments")

    // Check if uploads directory exists
    try {
      await fs.access(uploadsDir)
    } catch (error) {
      console.log("Uploads directory does not exist")
      return { success: true, orphanedFiles: [], deletedFiles: 0 }
    }

    const files = await fs.readdir(uploadsDir)
    const orphanedFiles = []
    let checkedFiles = 0

    for (const file of files) {
      // Check if file exists in any submission record
      const [assignmentSubmission, assessmentSubmission, projectSubmission] = await Promise.all([
        Submission.findOne({
          $or: [{ "attachments.fileName": file }, { fileName: file }],
        }),
        AssessmentSubmission.findOne({ "attachments.fileName": file }),
        ProjectSubmission.findOne({
          $or: [{ "attachments.fileName": file }, { fileName: file }],
        }),
      ])

      if (!assignmentSubmission && !assessmentSubmission && !projectSubmission) {
        orphanedFiles.push(file)
      }
      checkedFiles++
    }

    return {
      success: true,
      orphanedFiles,
      checkedFiles,
      deletedFiles: 0,
    }
  } catch (error) {
    console.error("Error in cleanup orphaned files:", error)
    return {
      success: false,
      error: error.message,
      orphanedFiles: [],
      checkedFiles: 0,
      deletedFiles: 0,
    }
  }
}

module.exports = {
  cleanupAssignmentFiles,
  cleanupAssessmentFiles,
  cleanupProjectFiles,
  cleanupOrphanedFiles,
  deleteFile,
}
