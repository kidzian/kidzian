const {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailWithMultipleAttachments,
  sendAssessmentReportToTeacher,
  sendAssessmentReportToStudent,
  emailTemplates,
} = require("../utils/email-service")
const User = require("../models/User")
const Teacher = require("../models/Teacher")
const Batch = require("../models/Batch")
const path = require("path")
const nodemailer = require("nodemailer")

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'Outlook'
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com", // Your email address
    pass: process.env.EMAIL_PASSWORD || "your-email-password", // Your email password or app password
  },
})

// Helper function to get students in a batch
const getStudentsInBatch = async (batchId) => {
  try {
    const batch = await Batch.findById(batchId).populate("students", "name email")
    return batch.students || []
  } catch (error) {
    console.error("Error fetching students in batch:", error)
    return []
  }
}

// FIXED: Helper function to get teacher for a batch with email filtering
const getTeacherForBatch = async (batchId) => {
  try {
    const batch = await Batch.findById(batchId).populate("teacher", "name email")

    // IMPORTANT: Filter out your email to prevent notifications
    if (batch.teacher && batch.teacher.email === "raghudbose@gmail.com") {
      console.log("⚠️ Skipping notification to raghudbose@gmail.com (filtered out)")
      return null
    }

    return batch.teacher
  } catch (error) {
    console.error("Error fetching teacher for batch:", error)
    return null
  }
}

// FIXED: Helper function to get teacher by ID with email filtering
const getTeacherById = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId).select("name email")

    // IMPORTANT: Filter out your email to prevent notifications
    if (teacher && teacher.email === "raghudbose@gmail.com") {
      console.log("⚠️ Skipping notification to raghudbose@gmail.com (filtered out)")
      return null
    }

    return teacher
  } catch (error) {
    console.error("Error fetching teacher by ID:", error)
    return null
  }
}

// Helper function to get student by ID
const getStudentById = async (studentId) => {
  try {
    const student = await User.findById(studentId).select("name email")
    return student
  } catch (error) {
    console.error("Error fetching student by ID:", error)
    return null
  }
}

// FIXED: Function to validate and prepare file attachments
const prepareEmailAttachments = (allFiles) => {
  const validAttachments = []

  console.log(`=== PREPARING ${allFiles.length} ATTACHMENTS ===`)

  allFiles.forEach((file, index) => {
    const originalPath = file.filePath
    const fullPath = path.isAbsolute(originalPath) ? originalPath : path.join(process.cwd(), originalPath)

    console.log(`File ${index + 1}:`)
    console.log(`  Original Name: ${file.originalName || file.fileName}`)
    console.log(`  Original Path: ${originalPath}`)
    console.log(`  Full Path: ${fullPath}`)

    // Check if file exists
    const fs = require("fs")
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath)
      console.log(`  ✅ File exists (${stats.size} bytes)`)

      // Determine content type based on file extension
      let contentType = "application/octet-stream"
      const ext = path.extname(file.originalName || file.fileName).toLowerCase()

      switch (ext) {
        case ".pdf":
          contentType = "application/pdf"
          break
        case ".doc":
          contentType = "application/msword"
          break
        case ".docx":
          contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          break
        case ".txt":
          contentType = "text/plain"
          break
        case ".jpg":
        case ".jpeg":
          contentType = "image/jpeg"
          break
        case ".png":
          contentType = "image/png"
          break
        case ".zip":
          contentType = "application/zip"
          break
        case ".py":
          contentType = "text/x-python"
          break
        case ".js":
          contentType = "text/javascript"
          break
        case ".html":
          contentType = "text/html"
          break
        case ".css":
          contentType = "text/css"
          break
        case ".mp4":
          contentType = "video/mp4"
          break
        case ".avi":
          contentType = "video/avi"
          break
        case ".mov":
          contentType = "video/quicktime"
          break
      }

      console.log(`  Content Type: ${contentType}`)

      validAttachments.push({
        filename: file.originalName || file.fileName,
        path: fullPath,
        contentType: contentType,
        contentDisposition: "attachment",
      })
    } else {
      console.log(`  ❌ File does not exist`)
    }
  })

  console.log(`=== ${validAttachments.length} VALID ATTACHMENTS PREPARED ===`)
  return validAttachments
}

// Notification for when a teacher creates an assignment
const notifyAssignmentCreated = async (assignment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assignment.batch)
    const teacher = await getTeacherById(assignment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assignment:", assignment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assignment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assignment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.assignmentCreated(
          student.name,
          teacher.name,
          assignment.title,
          assignment.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Assignment creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assignment creation notifications:", error)
  }
}

// NEW: Notification for when a teacher updates an assignment
const notifyAssignmentUpdated = async (assignment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assignment.batch)
    const teacher = await getTeacherById(assignment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assignment:", assignment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assignment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assignment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.assignmentUpdated(
          student.name,
          teacher.name,
          assignment.title,
          assignment.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Assignment update notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assignment update notifications:", error)
  }
}

// Notification for when a teacher creates an assessment
const notifyAssessmentCreated = async (assessment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assessment.batch)
    const teacher = await getTeacherById(assessment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assessment:", assessment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assessment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assessment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.assessmentCreated(
          student.name,
          teacher.name,
          assessment.title,
          assessment.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Assessment creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assessment creation notifications:", error)
  }
}

// NEW: Notification for when a teacher updates an assessment
const notifyAssessmentUpdated = async (assessment) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(assessment.batch)
    const teacher = await getTeacherById(assessment.teacher)

    if (!teacher) {
      console.error("Teacher not found for assessment:", assessment._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (assessment.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(assessment.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.assessmentUpdated(
          student.name,
          teacher.name,
          assessment.title,
          assessment.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Assessment update notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending assessment update notifications:", error)
  }
}

// Notification for when a teacher creates a project
const notifyProjectCreated = async (project) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(project.batch)
    const teacher = await getTeacherById(project.teacher)

    if (!teacher) {
      console.error("Teacher not found for project:", project._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (project.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(project.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.projectCreated(
          student.name,
          teacher.name,
          project.title,
          project.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Project creation notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending project creation notifications:", error)
  }
}

// NEW: Notification for when a teacher updates a project
const notifyProjectUpdated = async (project) => {
  try {
    // Get all students in the batch
    const students = await getStudentsInBatch(project.batch)
    const teacher = await getTeacherById(project.teacher)

    if (!teacher) {
      console.error("Teacher not found for project:", project._id)
      return
    }

    // Get course name
    let courseName = "Course"
    if (project.course) {
      try {
        const Course = require("../models/Course")
        const course = await Course.findById(project.course)
        if (course) {
          courseName = course.title
        }
      } catch (error) {
        console.error("Error fetching course:", error)
      }
    }

    // Send email to each student (NOT to raghudbose@gmail.com)
    for (const student of students) {
      if (student.email && student.email !== "raghudbose@gmail.com") {
        const template = emailTemplates.projectUpdated(
          student.name,
          teacher.name,
          project.title,
          project.dueDate,
          courseName,
        )
        await sendEmail(student.email, template)
      }
    }

    console.log(`Project update notifications sent to ${students.length} students`)
  } catch (error) {
    console.error("Error sending project update notifications:", error)
  }
}

// FIXED: Notification for when a student submits an assignment WITH PROPER ATTACHMENTS
const notifyAssignmentSubmitted = async (submission) => {
  try {
    console.log("=== PROCESSING ASSIGNMENT SUBMISSION NOTIFICATION ===")

    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)
    if (!teacher || !teacher.email) {
      console.error("Teacher not found or has no email for submission:", submission._id)
      return
    }

    console.log(`📧 Sending assignment notification to: ${teacher.email}`)

    // Get the student
    const student = await getStudentById(submission.student)
    if (!student) {
      console.error("Student not found for submission:", submission._id)
      return
    }

    // Get the assignment
    const Assignment = require("../models/Assignment")
    const assignment = await Assignment.findById(submission.assignment)
    if (!assignment) {
      console.error("Assignment not found for submission:", submission._id)
      return
    }

    // Get all file paths (legacy + new attachments)
    const allFiles = submission.getAllFilePaths ? submission.getAllFilePaths() : []
    console.log(`Found ${allFiles.length} files for assignment submission`)

    // Prepare email template
    const template = emailTemplates.assignmentSubmitted(
      teacher.name,
      student.name,
      assignment.title,
      submission.submittedAt,
      allFiles.length > 0 ? allFiles[0].originalName || allFiles[0].fileName : null,
      allFiles.length > 0 ? allFiles[0].filePath : null,
    )

    // Send email with attachments
    if (allFiles.length > 0) {
      const emailAttachments = prepareEmailAttachments(allFiles)

      if (emailAttachments.length > 0) {
        console.log(`📎 Sending email with ${emailAttachments.length} attachments`)
        const result = await sendEmailWithMultipleAttachments(teacher.email, template, emailAttachments)

        if (result.success) {
          console.log(`✅ Assignment submission notification with attachments sent to: ${teacher.email}`)
        } else {
          console.error(`❌ Failed to send with attachments: ${result.error}`)
          // Fallback: send without attachments
          console.log("🔄 Sending fallback email without attachments")
          await sendEmail(teacher.email, template)
        }
      } else {
        console.log("⚠️ No valid attachments found, sending email without attachments")
        await sendEmail(teacher.email, template)
      }
    } else {
      console.log("📧 Sending email without attachments")
      const result = await sendEmail(teacher.email, template)
      if (result.success) {
        console.log(`✅ Assignment submission notification sent to: ${teacher.email}`)
      } else {
        console.error(`❌ Failed to send email: ${result.error}`)
      }
    }
  } catch (error) {
    console.error("Error sending assignment submission notification:", error)
  }
}

// ENHANCED: Notification for when a student submits an assessment WITH DETAILED REPORT (TO BOTH TEACHER AND STUDENT)
const notifyAssessmentSubmitted = async (submission) => {
  try {
    console.log("=== PROCESSING ENHANCED ASSESSMENT SUBMISSION NOTIFICATION ===")

    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)

    // Get the student
    const student = await getStudentById(submission.student)
    if (!student) {
      console.error("Student not found for assessment submission:", submission._id)
      return
    }

    // Get the assessment with questions
    const Assessment = require("../models/Assessment")
    const assessment = await Assessment.findById(submission.assessment)
    if (!assessment) {
      console.error("Assessment not found for submission:", submission._id)
      return
    }

    console.log(`📊 Assessment has ${assessment.questions.length} questions`)
    console.log(`📊 Student answered ${submission.answers.length} questions`)

    // FIXED: Calculate correct percentage based on questions
    const totalQuestions = assessment.questions.length
    const correctAnswers = submission.answers.filter((a) => a.isCorrect).length
    const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    console.log(`📊 Student scored ${correctAnswers}/${totalQuestions} (${correctPercentage}%)`)

    // Send enhanced email to teacher (if teacher exists and is not blocked)
    if (teacher && teacher.email) {
      console.log(`📧 Sending enhanced assessment notification to teacher: ${teacher.email}`)

      const teacherResult = await sendAssessmentReportToTeacher(teacher.email, submission, assessment, student)

      if (teacherResult.success) {
        if (teacherResult.reportGenerated) {
          console.log(
            `✅ Enhanced assessment submission notification with detailed report sent to teacher: ${teacher.email}`,
          )
        } else {
          console.log(`✅ Basic assessment submission notification sent to teacher: ${teacher.email}`)
        }
      } else {
        console.error(`❌ Failed to send assessment submission email to teacher: ${teacherResult.error}`)
      }
    } else {
      console.log("⚠️ No valid teacher found or teacher email blocked")
    }

    // NEW: Send enhanced email to student (if student email is not blocked)
    if (student.email && student.email !== "raghudbose@gmail.com") {
      console.log(`📧 Sending assessment results to student: ${student.email}`)

      const studentResult = await sendAssessmentReportToStudent(student.email, submission, assessment, student)

      if (studentResult.success) {
        if (studentResult.reportGenerated) {
          console.log(`✅ Assessment results with detailed report sent to student: ${student.email}`)
        } else {
          console.log(`✅ Basic assessment results sent to student: ${student.email}`)
        }
      } else {
        console.error(`❌ Failed to send assessment results to student: ${studentResult.error}`)
      }
    } else {
      console.log("⚠️ Student email blocked or not available")
    }

    // Clean up PDF file after both emails are sent (with delay)
    if (teacher && teacher.email) {
      setTimeout(() => {
        try {
          const fs = require("fs")
          const reportPath = `uploads/reports/assessment-report-${student.name.replace(/\s+/g, "-")}-${submission._id}.pdf`
          if (fs.existsSync(reportPath)) {
            fs.unlinkSync(reportPath)
            console.log("🗑️ Cleaned up temporary PDF file")
          }
        } catch (error) {
          console.error("Error cleaning up PDF file:", error)
        }
      }, 120000) // Delete after 2 minutes to allow both emails to be sent
    }
  } catch (error) {
    console.error("Error sending enhanced assessment submission notification:", error)
  }
}

// FIXED: Notification for when a student submits a project WITH PROPER ATTACHMENTS
const notifyProjectSubmitted = async (submission) => {
  try {
    console.log("=== PROCESSING PROJECT SUBMISSION NOTIFICATION ===")
    console.log(`Submission ID: ${submission._id}`)

    // Get the teacher for the batch
    const teacher = await getTeacherForBatch(submission.batch)
    if (!teacher || !teacher.email) {
      console.error("Teacher not found or has no email for project submission:", submission._id)
      return
    }

    console.log(`📧 Sending project notification to: ${teacher.email}`)

    // Get the student
    const student = await getStudentById(submission.student)
    if (!student) {
      console.error("Student not found for project submission:", submission._id)
      return
    }

    // Get the project
    const Project = require("../models/Project")
    const project = await Project.findById(submission.project)
    if (!project) {
      console.error("Project not found for submission:", submission._id)
      return
    }

    // DEBUG: Check submission data
    console.log(`=== SUBMISSION DATA DEBUG ===`)
    console.log(`Legacy filePath: ${submission.filePath}`)
    console.log(`Legacy fileName: ${submission.fileName}`)
    console.log(`Attachments array length: ${submission.attachments ? submission.attachments.length : 0}`)

    if (submission.attachments && submission.attachments.length > 0) {
      submission.attachments.forEach((att, index) => {
        console.log(`Attachment ${index + 1}: ${att.originalName} at ${att.filePath}`)
      })
    }

    // Get all file paths (legacy + new attachments)
    const allFiles = submission.getAllFilePaths ? submission.getAllFilePaths() : []
    console.log(`Found ${allFiles.length} files for project submission`)

    if (allFiles.length > 0) {
      allFiles.forEach((file, index) => {
        console.log(`File ${index + 1}: ${file.originalName || file.fileName} at ${file.filePath}`)
      })
    }

    // Prepare email template
    const template = emailTemplates.projectSubmitted(
      teacher.name,
      student.name,
      project.title,
      submission.submittedAt,
      allFiles.length > 0 ? allFiles[0].originalName || allFiles[0].fileName : null,
      allFiles.length > 0 ? allFiles[0].filePath : null,
    )

    // Send email with attachments
    if (allFiles.length > 0) {
      const emailAttachments = prepareEmailAttachments(allFiles)

      if (emailAttachments.length > 0) {
        console.log(`📎 Sending email with ${emailAttachments.length} attachments`)
        const result = await sendEmailWithMultipleAttachments(teacher.email, template, emailAttachments)

        if (result.success) {
          console.log(`✅ Project submission notification with attachments sent to: ${teacher.email}`)
        } else {
          console.error(`❌ Failed to send with attachments: ${result.error}`)
          // Fallback: send without attachments
          console.log("🔄 Sending fallback email without attachments")
          await sendEmail(teacher.email, template)
        }
      } else {
        console.log("⚠️ No valid attachments found, sending email without attachments")
        await sendEmail(teacher.email, template)
      }
    } else {
      console.log("📧 Sending email without attachments")
      const result = await sendEmail(teacher.email, template)
      if (result.success) {
        console.log(`✅ Project submission notification sent to: ${teacher.email}`)
      } else {
        console.error(`❌ Failed to send email: ${result.error}`)
      }
    }
  } catch (error) {
    console.error("Error sending project submission notification:", error)
  }
}

async function sendAssessmentReportEmail(assessment, submission, recipientType) {
  let toEmail
  let subject
  let html

  if (recipientType === "teacher") {
    toEmail = assessment.teacher?.email
    subject = `Assessment Submission Notification - ${assessment.title}`
    html = `
      <p>A student has submitted an assessment: ${assessment.title}.</p>
      <p>Student: ${submission.student?.name}</p>
      <p>Score: ${submission.score}</p>
      <p>You can view the submission details in the system.</p>
    `
  } else if (recipientType === "student") {
    toEmail = submission.student?.email
    subject = `Assessment Report - ${assessment.title}`

    const totalQuestions = assessment.questions?.length || 1
    const correctAnswers = submission.answers?.filter((answer) => answer.isCorrect).length || 0
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)

    html = `
      <p>Your assessment report for ${assessment.title} is ready.</p>
      <p>Your Score: ${percentage}%</p>
      <p>You can view the detailed report in the system.</p>
    `
  } else {
    console.error("Invalid recipient type:", recipientType)
    return
  }

  if (toEmail) {
    try {
      await sendEmail(toEmail, { subject, html })
    } catch (error) {
      console.error("Error sending assessment report email:", error)
    }
  } else {
    console.warn("Recipient email not found.")
  }
}

async function notifyAssessmentSubmission(assessment, submission) {
  // Send notification to the teacher
  if (assessment.teacher?.email) {
    await sendAssessmentReportEmail(assessment, submission, "teacher")
  }

  // Also send notification to the student
  if (submission.student?.email) {
    await sendAssessmentReportEmail(assessment, submission, "student")
  }
}

module.exports = {
  notifyAssignmentCreated,
  notifyAssignmentUpdated, // NEW
  notifyAssessmentCreated,
  notifyAssessmentUpdated, // NEW
  notifyProjectCreated,
  notifyProjectUpdated, // NEW
  notifyAssignmentSubmitted,
  notifyAssessmentSubmitted,
  notifyProjectSubmitted,
  sendEmail, // Export sendEmail for testing or other uses
}
