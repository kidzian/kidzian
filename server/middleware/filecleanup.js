const fs = require("fs").promises
const path = require("path")
const nodemailer = require("nodemailer")

/**
 * Enhanced file cleanup middleware for Kidzian Learning Platform
 * Works with the existing submission models and file structure
 * Now includes email notifications for cleanup operations
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

// Enhanced function to send cleanup notification emails
const sendCleanupNotification = async (teacherEmail, cleanupDetails) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: teacherEmail,
      subject: `File Cleanup Notification - ${cleanupDetails.type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
            File Cleanup Notification
          </h2>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">Cleanup Summary</h3>
            <p><strong>Type:</strong> ${cleanupDetails.type}</p>
            <p><strong>ID:</strong> ${cleanupDetails.id}</p>
            <p><strong>Files Deleted:</strong> ${cleanupDetails.deletedFiles}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          ${cleanupDetails.errors.length > 0 ? `
          <div style="background-color: #f5c6cb; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">Errors Encountered</h3>
            <ul>
              ${cleanupDetails.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px;">
              This is an automated notification from the Kidzian Learning Platform.
            </p>
          </div>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Cleanup notification sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending cleanup notification:", error)
    return { success: false, error: error.message }
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
              studentEmail: submission.studentEmail, // Added for notification
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
          studentEmail: submission.studentEmail,
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
              studentEmail: submission.studentEmail,
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
              studentEmail: submission.studentEmail,
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
          studentEmail: submission.studentEmail,
        })
      }
    })

    return filePaths
  } catch (error) {
    console.error("Error getting project submission files:", error)
    return []
  }
}

// Enhanced cleanup function for assignments with email notification
const cleanupAssignmentFiles = async (assignmentId, models, options = {}) => {
  try {
    console.log(`Starting file cleanup for assignment with ID: ${assignmentId}`)
    const { Submission } = models
    const { notifyTeacher = false, teacherEmail = null } = options

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

    // Send notification email if requested
    if (notifyTeacher && teacherEmail) {
      const cleanupDetails = {
        type: "Assignment",
        id: assignmentId,
        deletedFiles: results.deletedFiles,
        errors: results.errors,
      }
      await sendCleanupNotification(teacherEmail, cleanupDetails)
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

// Enhanced cleanup function for assessments with email notification
const cleanupAssessmentFiles = async (assessmentId, models, options = {}) => {
  try {
    console.log(`Starting file cleanup for assessment with ID: ${assessmentId}`)
    const { AssessmentSubmission } = models
    const { notifyTeacher = false, teacherEmail = null } = options

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

    // Send notification email if requested
    if (notifyTeacher && teacherEmail) {
      const cleanupDetails = {
        type: "Assessment",
        id: assessmentId,
        deletedFiles: results.deletedFiles,
        errors: results.errors,
      }
      await sendCleanupNotification(teacherEmail, cleanupDetails)
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

// Enhanced cleanup function for projects with email notification
const cleanupProjectFiles = async (projectId, models, options = {}) => {
  try {
    console.log(`Starting file cleanup for project with ID: ${projectId}`)
    const { ProjectSubmission } = models
    const { notifyTeacher = false, teacherEmail = null } = options

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

    // Send notification email if requested
    if (notifyTeacher && teacherEmail) {
      const cleanupDetails = {
        type: "Project",
        id: projectId,
        deletedFiles: results.deletedFiles,
        errors: results.errors,
      }
      await sendCleanupNotification(teacherEmail, cleanupDetails)
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

// Enhanced utility function to clean up orphaned files
const cleanupOrphanedFiles = async (models, options = {}) => {
  try {
    const { Submission, AssessmentSubmission, ProjectSubmission } = models
    const { notifyAdmin = false, adminEmail = null, deleteOrphaned = false } = options
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
    let deletedFiles = 0

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
        
        // Delete orphaned file if requested
        if (deleteOrphaned) {
          const filePath = path.join(uploadsDir, file)
          const deleted = await deleteFile(filePath)
          if (deleted) {
            deletedFiles++
          }
        }
      }
      checkedFiles++
    }

    // Send notification email if requested
    if (notifyAdmin && adminEmail && orphanedFiles.length > 0) {
      const cleanupDetails = {
        type: "Orphaned Files Cleanup",
        id: "System",
        deletedFiles: deletedFiles,
        errors: [],
        orphanedCount: orphanedFiles.length,
      }
      await sendCleanupNotification(adminEmail, cleanupDetails)
    }

    return {
      success: true,
      orphanedFiles,
      checkedFiles,
      deletedFiles,
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

// Batch cleanup function for multiple items
const batchCleanup = async (items, type, models, options = {}) => {
  const results = []
  
  for (const item of items) {
    let result
    switch (type) {
      case 'assignment':
        result = await cleanupAssignmentFiles(item.id, models, {
          notifyTeacher: options.notifyTeacher,
          teacherEmail: item.teacherEmail,
        })
        break
      case 'assessment':
        result = await cleanupAssessmentFiles(item.id, models, {
          notifyTeacher: options.notifyTeacher,
          teacherEmail: item.teacherEmail,
        })
        break
      case 'project':
        result = await cleanupProjectFiles(item.id, models, {
          notifyTeacher: options.notifyTeacher,
          teacherEmail: item.teacherEmail,
        })
        break
      default:
        result = { success: false, error: 'Invalid cleanup type' }
    }
    
    results.push({
      id: item.id,
      type: type,
      ...result,
    })
  }
  
  return results
}

module.exports = {
  cleanupAssignmentFiles,
  cleanupAssessmentFiles,
  cleanupProjectFiles,
  cleanupOrphanedFiles,
  deleteFile,
  sendCleanupNotification,
  batchCleanup,
}
