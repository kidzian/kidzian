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
const fs = require("fs")

// Configure nodemailer with your email service credentials
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'Outlook'
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com", // Your email address
    pass: process.env.EMAIL_PASSWORD || "your-email-password", // Your email password or app password
  },
})

// Fallback email templates in case they're missing from email-service
const fallbackEmailTemplates = {
  assignmentCreated: (studentName, teacherName, assignmentTitle, dueDate, courseName) => ({
    subject: `New Assignment: ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Assignment Created</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has created a new assignment for you.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #2563eb;">${assignmentTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the assignment details and submit your work.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  assignmentUpdated: (studentName, teacherName, assignmentTitle, dueDate, courseName) => ({
    subject: `Assignment Updated: ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Assignment Updated</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has updated an assignment.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #2563eb;">${assignmentTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the updated assignment details.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  assessmentCreated: (studentName, teacherName, assessmentTitle, dueDate, courseName) => ({
    subject: `New Assessment: ${assessmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Assessment Available</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has created a new assessment for you.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #dc2626;">${assessmentTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to take the assessment.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  assessmentUpdated: (studentName, teacherName, assessmentTitle, dueDate, courseName) => ({
    subject: `Assessment Updated: ${assessmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Assessment Updated</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has updated an assessment.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #dc2626;">${assessmentTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the updated assessment.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  projectCreated: (studentName, teacherName, projectTitle, dueDate, courseName) => ({
    subject: `New Project: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Project Assigned</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has assigned a new project to you.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #059669;">${projectTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the project details and submit your work.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  projectUpdated: (studentName, teacherName, projectTitle, dueDate, courseName) => ({
    subject: `Project Updated: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Project Updated</h2>
        <p>Dear ${studentName},</p>
        <p>Your teacher <strong>${teacherName}</strong> has updated a project.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #059669;">${projectTitle}</h3>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        </div>
        <p>Please log in to your dashboard to view the updated project details.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  assignmentSubmitted: (teacherName, studentName, assignmentTitle, submittedAt, fileName, filePath) => ({
    subject: `Assignment Submitted: ${assignmentTitle} by ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Assignment Submission Received</h2>
        <p>Dear ${teacherName},</p>
        <p><strong>${studentName}</strong> has submitted an assignment.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #2563eb;">${assignmentTitle}</h3>
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          ${fileName ? `<p><strong>File:</strong> ${fileName}</p>` : ""}
        </div>
        <p>Please log in to your dashboard to review the submission.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),

  projectSubmitted: (teacherName, studentName, projectTitle, submittedAt, fileName, filePath) => ({
    subject: `Project Submitted: ${projectTitle} by ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Project Submission Received</h2>
        <p>Dear ${teacherName},</p>
        <p><strong>${studentName}</strong> has submitted a project.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0; color: #059669;">${projectTitle}</h3>
          <p><strong>Student:</strong> ${studentName}</p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          ${fileName ? `<p><strong>File:</strong> ${fileName}</p>` : ""}
        </div>
        <p>Please log in to your dashboard to review the submission.</p>
        <p>Best regards,<br>Your Learning Platform</p>
      </div>
    `,
  }),
}

// Helper function to get email template with fallback
const getEmailTemplate = (templateName, ...args) => {
  try {
    // Try to use the template from email-service first
    if (emailTemplates && typeof emailTemplates[templateName] === "function") {
      return emailTemplates[templateName](...args)
    }
    // Fall back to our local templates
    if (fallbackEmailTemplates[templateName]) {
      console.log(`⚠️ Using fallback template for: ${templateName}`)
      return fallbackEmailTemplates[templateName](...args)
    }
    throw new Error(`Template ${templateName} not found`)
  } catch (error) {
    console.error(`Error getting email template ${templateName}:`, error)
    // Return a basic template as last resort
    return {
      subject: `Notification from Learning Platform`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Notification</h2>
          <p>You have received a notification from your learning platform.</p>
          <p>Please log in to your dashboard for more details.</p>
          <p>Best regards,<br>Your Learning Platform</p>
        </div>
      `,
    }
  }
}

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

// Helper function to get teacher for a batch with email filtering
const getTeacherForBatch = async (batchId) => {
  try {
    const batch = await Batch.findById(batchId).populate("teacher", "name email")
    // Filter out your email to prevent notifications
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

// Helper function to get teacher by ID with email filtering
const getTeacherById = async (teacherId) => {
  try {
    const teacher = await Teacher.findById(teacherId).select("name email")
    // Filter out your email to prevent notifications
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

// Function to validate and prepare file attachments
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
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath)
      console.log(`  ✅ File exists (${stats.size} bytes)`)

      // Determine content type based on file extension
      let contentType = "application/octet-stream"
      const ext = path.extname(file.originalName || file.fileName).toLowerCase()
      const contentTypes = {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".zip": "application/zip",
        ".py": "text/x-python",
        ".js": "text/javascript",
        ".html": "text/html",
        ".css": "text/css",
        ".mp4": "video/mp4",
        ".avi": "video/avi",
        ".mov": "video/quicktime",
      }
      contentType = contentTypes[ext] || contentType
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
        const template = getEmailTemplate(
          "assignmentCreated",
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

// Notification for when a teacher updates an assignment
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
        const template = getEmailTemplate(
          "assignmentUpdated",
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
        const template = getEmailTemplate(
          "assessmentCreated",
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

// Notification for when a teacher updates an assessment
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
        const template = getEmailTemplate(
          "assessmentUpdated",
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
        const template = getEmailTemplate(
          "projectCreated",
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

// Notification for when a teacher updates a project
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
        const template = getEmailTemplate(
          "projectUpdated",
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

// Notification for when a student submits an assignment WITH PROPER ATTACHMENTS
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
    const template = getEmailTemplate(
      "assignmentSubmitted",
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

// ENHANCED: Notification for when a student submits an assessment WITH DETAILED PDF REPORT
const notifyAssessmentSubmitted = async (submission) => {
  try {
    console.log("=== PROCESSING ENHANCED ASSESSMENT SUBMISSION NOTIFICATION ===")
    console.log(`Submission ID: ${submission._id}`)

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

    console.log(`📊 Assessment: ${assessment.title}`)
    console.log(`👨‍🎓 Student: ${student.name}`)
    console.log(`📊 Questions: ${assessment.questions.length}`)
    console.log(`📊 Student answers: ${submission.answers.length}`)

    // Calculate correct percentage based on questions
    const totalQuestions = assessment.questions.length
    const correctAnswers = submission.answers.filter((a) => a.isCorrect).length
    const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    console.log(`📊 Student scored ${correctAnswers}/${totalQuestions} (${correctPercentage}%)`)

    // PRIORITY: Send enhanced email to teacher with PDF report FIRST
    if (teacher && teacher.email) {
      console.log(`📧 Sending enhanced assessment notification with PDF to teacher: ${teacher.email}`)
      const teacherResult = await sendAssessmentReportToTeacher(teacher.email, submission, assessment, student)
      if (teacherResult.success) {
        if (teacherResult.reportGenerated) {
          console.log(
            `✅ Enhanced assessment submission notification with detailed PDF report sent to teacher: ${teacher.email}`,
          )
          console.log(`📎 PDF Report Path: ${teacherResult.pdfPath}`)
          console.log(`📎 Attachments Count: ${teacherResult.attachmentCount}`)
        } else {
          console.log(`✅ Basic assessment submission notification sent to teacher: ${teacher.email}`)
        }
      } else {
        console.error(`❌ Failed to send assessment submission email to teacher: ${teacherResult.error}`)
      }
    } else {
      console.log("⚠️ No valid teacher found or teacher email blocked")
    }

    // SECONDARY: Send enhanced email to student with PDF report
    if (student.email && student.email !== "raghudbose@gmail.com") {
      console.log(`📧 Sending assessment results with PDF to student: ${student.email}`)
      const studentResult = await sendAssessmentReportToStudent(student.email, submission, assessment, student)
      if (studentResult.success) {
        if (studentResult.reportGenerated) {
          console.log(`✅ Assessment results with detailed PDF report sent to student: ${student.email}`)
          console.log(`📎 Attachments Count: ${studentResult.attachmentCount}`)
        } else {
          console.log(`✅ Basic assessment results sent to student: ${student.email}`)
        }
      } else {
        console.error(`❌ Failed to send assessment results to student: ${studentResult.error}`)
      }
    } else {
      console.log("⚠️ Student email blocked or not available")
    }

    // Clean up PDF files after both emails are sent (with delay)
    setTimeout(() => {
      try {
        const reportsDir = "uploads/reports"
        if (fs.existsSync(reportsDir)) {
          const files = fs.readdirSync(reportsDir)
          const now = new Date().getTime()
          // Clean up files older than 10 minutes
          files.forEach((file) => {
            const filePath = path.join(reportsDir, file)
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath)
              const fileTime = new Date(stats.mtime).getTime()
              // Delete files older than 10 minutes (600000 ms)
              if (now - fileTime > 600000) {
                fs.unlinkSync(filePath)
                console.log(`🗑️ Cleaned up old PDF file: ${file}`)
              }
            }
          })
        }
      } catch (error) {
        console.error("Error cleaning up PDF files:", error)
      }
    }, 600000) // Clean up after 10 minutes

    console.log("=== ASSESSMENT SUBMISSION NOTIFICATION COMPLETED ===")
  } catch (error) {
    console.error("Error sending enhanced assessment submission notification:", error)
  }
}

// Notification for when a student submits a project WITH PROPER ATTACHMENTS
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
    const template = getEmailTemplate(
      "projectSubmitted",
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

// Legacy function for backward compatibility
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

// Legacy function for backward compatibility
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

// Clean up function to remove old PDF reports
const cleanupOldReports = () => {
  try {
    const reportsDir = "uploads/reports"
    if (!fs.existsSync(reportsDir)) {
      return
    }

    const files = fs.readdirSync(reportsDir)
    const now = new Date().getTime()

    files.forEach((file) => {
      const filePath = path.join(reportsDir, file)
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        const fileTime = new Date(stats.mtime).getTime()
        // Delete files older than 1 hour
        if (now - fileTime > 3600000) {
          fs.unlinkSync(filePath)
          console.log(`🗑️ Cleaned up old report: ${file}`)
        }
      }
    })
  } catch (error) {
    console.error("Error in cleanup process:", error)
  }
}

// Run cleanup every hour
setInterval(cleanupOldReports, 3600000)

module.exports = {
  notifyAssignmentCreated,
  notifyAssignmentUpdated,
  notifyAssessmentCreated,
  notifyAssessmentUpdated,
  notifyProjectCreated,
  notifyProjectUpdated,
  notifyAssignmentSubmitted,
  notifyAssessmentSubmitted, // This is the MAIN function that sends PDF reports to teachers
  notifyProjectSubmitted,
  sendEmail,
  sendAssessmentReportEmail, // Legacy function
  notifyAssessmentSubmission, // Legacy function
  getStudentsInBatch,
  getTeacherForBatch,
  getTeacherById,
  getStudentById,
  prepareEmailAttachments,
  cleanupOldReports,
  getEmailTemplate, // Export the helper function
  fallbackEmailTemplates, // Export fallback templates
}
