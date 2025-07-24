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

// Enhanced HTML Assessment Report Generator (No external dependencies)
const generateEnhancedAssessmentHTML = (submission, assessment, student) => {
  const { answers, score, percentage, timeSpent, submittedAt } = submission
  const { questions, maxMarks, title } = assessment

  // Calculate detailed statistics
  const totalQuestions = questions.length
  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const wrongAnswers = totalQuestions - correctAnswers
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const averageTimePerQuestion = timeSpent ? Math.round(timeSpent / totalQuestions) : 0

  // Performance indicators
  const performanceLevel =
    correctPercentage >= 80 ? "Excellent" : correctPercentage >= 60 ? "Good" : "Needs Improvement"
  const performanceColor = correctPercentage >= 80 ? "#10b981" : correctPercentage >= 60 ? "#f59e0b" : "#ef4444"
  const performanceEmoji = correctPercentage >= 80 ? "🎉" : correctPercentage >= 60 ? "👍" : "📚"

  return {
    subject: `📊 Assessment Results: ${title} - ${student.name} (${correctPercentage}%)`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assessment Report - ${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa;">
        
        <!-- Main Container -->
        <div style="max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; margin-bottom: 10px;">📊 Assessment Report</h1>
            <div style="font-size: 18px; opacity: 0.9; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.8;">Kidzian Learning Platform - Founded by Rashmi</div>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            
            <!-- Performance Summary -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; margin-bottom: 30px;">
              <div style="font-size: 24px; color: #1e293b; margin-bottom: 20px; font-weight: 600;">
                ${performanceEmoji} ${student.name} completed the assessment!
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: inline-block; min-width: 200px;">
                <div style="font-size: 42px; font-weight: bold; color: ${performanceColor}; margin-bottom: 8px;">
                  ${correctAnswers}/${totalQuestions}
                </div>
                <div style="font-size: 28px; color: ${performanceColor}; font-weight: bold; margin-bottom: 15px;">
                  ${correctPercentage}%
                </div>
                <div style="background: ${performanceColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ${performanceLevel}
                </div>
              </div>
            </div>

            <!-- Statistics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0;">
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #10b981;">${correctAnswers}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Correct Answers</div>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #ef4444;">${wrongAnswers}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Wrong Answers</div>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #6366f1;">${timeSpent || 0}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Minutes Spent</div>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #8b5cf6;">${totalQuestions}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Total Questions</div>
              </div>
            </div>

            <!-- Student Information -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; margin-bottom: 40px; border: 1px solid #bae6fd;">
              <h2 style="color: #0c4a6e; margin-bottom: 20px; font-size: 24px; margin-top: 0;">👨‍🎓 Student Information</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Student Name:</span>
                  <span style="font-weight: 500; color: #1e293b;">${student.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Email:</span>
                  <span style="font-weight: 500; color: #1e293b;">${student.email}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Submission Date:</span>
                  <span style="font-weight: 500; color: #1e293b;">${new Date(submittedAt).toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Assessment:</span>
                  <span style="font-weight: 500; color: #1e293b;">${title}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Total Questions:</span>
                  <span style="font-weight: 500; color: #1e293b;">${totalQuestions}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Avg. Time/Question:</span>
                  <span style="font-weight: 500; color: #1e293b;">${averageTimePerQuestion} min</span>
                </div>
              </div>
            </div>

            <!-- Detailed Question Analysis -->
            <div style="margin-top: 40px;">
              <h2 style="color: #4f46e5; margin-bottom: 30px; font-size: 24px; margin-top: 0; padding-bottom: 15px; border-bottom: 3px solid #e5e7eb;">📝 Detailed Question Analysis</h2>
              
              ${questions
                .map((question, index) => {
                  const studentAnswer = answers.find((a) => a.questionIndex === index)
                  const isCorrect = studentAnswer ? studentAnswer.isCorrect : false
                  const studentAnswerText = studentAnswer ? studentAnswer.answer : "No answer provided"
                  const pointsEarned = studentAnswer ? studentAnswer.pointsEarned || 0 : 0

                  return `
                  <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fafafa;">
                    <!-- Question Header -->
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb;">
                      <span style="background: #4f46e5; color: white; padding: 8px 16px; border-radius: 25px; font-weight: bold; font-size: 14px;">
                        Question ${index + 1}
                      </span>
                      <span style="background: #f3f4f6; padding: 6px 12px; border-radius: 20px; font-size: 12px; color: #6b7280; font-weight: 500;">
                        ${question.points || 1} point${(question.points || 1) > 1 ? "s" : ""}
                      </span>
                    </div>

                    <!-- Question Content -->
                    <div style="padding: 25px;">
                      <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #1f2937; line-height: 1.6;">
                        ${question.question}
                      </div>

                      ${
                        question.type === "multiple-choice" && question.options
                          ? `
                        <!-- Options List -->
                        <div style="margin: 20px 0; background: #f9fafb; padding: 20px; border-radius: 8px;">
                          <div style="font-weight: 600; color: #374151; margin-bottom: 15px; font-size: 14px;">Available Options:</div>
                          ${question.options
                            .map((option) => {
                              let optionStyle =
                                "padding: 12px 16px; margin: 8px 0; border-radius: 8px; background: white; border: 2px solid #e5e7eb; font-size: 14px;"
                              let optionLabel = ""

                              if (option === question.correctAnswer && option === studentAnswerText) {
                                optionStyle =
                                  "padding: 12px 16px; margin: 8px 0; border-radius: 8px; background: #ddd6fe; border: 2px solid #8b5cf6; color: #5b21b6; font-weight: 600; font-size: 14px;"
                                optionLabel = " ✓ (Correct & Selected)"
                              } else if (option === question.correctAnswer) {
                                optionStyle =
                                  "padding: 12px 16px; margin: 8px 0; border-radius: 8px; background: #d1fae5; border: 2px solid #10b981; color: #065f46; font-weight: 600; font-size: 14px;"
                                optionLabel = " ✓ (Correct Answer)"
                              } else if (option === studentAnswerText) {
                                optionStyle =
                                  "padding: 12px 16px; margin: 8px 0; border-radius: 8px; background: #fef2f2; border: 2px solid #ef4444; color: #991b1b; font-weight: 500; font-size: 14px;"
                                optionLabel = " ✗ (Student Selected)"
                              }

                              return `<div style="${optionStyle}">${option}${optionLabel}</div>`
                            })
                            .join("")}
                        </div>
                      `
                          : ""
                      }

                      <!-- Answer Section -->
                      <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid ${isCorrect ? "#10b981" : "#ef4444"}; background: ${isCorrect ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" : "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)"};">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; color: ${isCorrect ? "#059669" : "#dc2626"};">
                          ${isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                          <span style="font-size: 12px; background: rgba(79, 70, 229, 0.1); color: #4f46e5; padding: 4px 8px; border-radius: 12px; font-weight: 600;">
                            +${pointsEarned} point${pointsEarned !== 1 ? "s" : ""}
                          </span>
                        </div>
                        
                        <div style="font-size: 15px; margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                          <strong>Student's Answer:</strong> ${studentAnswerText}
                        </div>
                        
                        ${
                          !isCorrect
                            ? `
                          <div style="font-size: 14px; color: #059669; font-weight: 600; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; margin-top: 10px;">
                            <strong>Correct Answer:</strong> ${question.correctAnswer}
                          </div>
                        `
                            : ""
                        }
                      </div>
                    </div>
                  </div>
                `
                })
                .join("")}
            </div>

            <!-- Recommendations -->
            ${
              correctPercentage < 60
                ? `
              <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ef4444;">
                <div style="color: #991b1b; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                  💡 Teaching Recommendation
                </div>
                <div style="color: #991b1b; line-height: 1.6;">
                  The student may benefit from additional support or review of the assessment topics.
                  Consider providing extra resources, scheduling a follow-up session, or offering
                  additional practice materials to help improve understanding.
                </div>
              </div>
            `
                : ""
            }

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; transition: transform 0.2s ease;">
                📊 View in Dashboard
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; text-align: center; padding: 30px; margin-top: 40px;">
            <p style="margin: 5px 0; opacity: 0.8; font-size: 14px; font-weight: 600;">Generated on ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0; opacity: 0.8; font-size: 14px; font-weight: 600;">© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p style="margin: 5px 0; opacity: 0.6; font-size: 12px;">Empowering Education Through Technology</p>
          </div>

        </div>
      </body>
      </html>
    `,
  }
}

// Enhanced function to send assessment report with detailed HTML (No PDF dependencies)
const sendEnhancedAssessmentReportToTeacher = async (to, submission, assessment, student) => {
  try {
    // Block emails to specific address
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating enhanced HTML assessment report for teacher...")
    console.log(`Teacher: ${to}`)
    console.log(`Student: ${student.name}`)
    console.log(`Assessment: ${assessment.title}`)

    // Generate enhanced HTML email template
    const emailTemplate = generateEnhancedAssessmentHTML(submission, assessment, student)

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    }

    console.log("📧 Sending enhanced assessment email to teacher...")
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Enhanced assessment report email sent to teacher successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      reportGenerated: true,
      method: "enhanced-html",
      attachmentCount: 0,
    }
  } catch (error) {
    console.error("❌ Error sending enhanced assessment report email to teacher:", error)
    return { success: false, error: error.message }
  }
}

// Enhanced function to send assessment report to student with detailed HTML
const sendEnhancedAssessmentReportToStudent = async (to, submission, assessment, student) => {
  try {
    // Block emails to specific address
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating enhanced HTML assessment report for student...")
    console.log(`Student: ${to}`)
    console.log(`Assessment: ${assessment.title}`)

    // Generate enhanced HTML email template (same as teacher but could be customized)
    const emailTemplate = generateEnhancedAssessmentHTML(submission, assessment, student)

    // Customize subject for student
    emailTemplate.subject = `🎯 Your Assessment Results: ${assessment.title} - ${Math.round((submission.answers.filter((a) => a.isCorrect).length / assessment.questions.length) * 100)}% Score`

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    }

    console.log("📧 Sending enhanced assessment email to student...")
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Enhanced assessment report email sent to student successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      reportGenerated: true,
      method: "enhanced-html",
      attachmentCount: 0,
    }
  } catch (error) {
    console.error("❌ Error sending enhanced assessment report email to student:", error)
    return { success: false, error: error.message }
  }
}

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

// UPDATED: Enhanced notification for when a student submits an assessment WITH DETAILED HTML REPORT
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

    // PRIORITY: Send enhanced HTML email to teacher FIRST
    if (teacher && teacher.email) {
      console.log(`📧 Sending enhanced HTML assessment notification to teacher: ${teacher.email}`)
      const teacherResult = await sendEnhancedAssessmentReportToTeacher(teacher.email, submission, assessment, student)
      if (teacherResult.success) {
        console.log(`✅ Enhanced HTML assessment report sent to teacher: ${teacher.email}`)
        console.log(`📧 Method used: ${teacherResult.method}`)
      } else {
        console.error(`❌ Failed to send enhanced assessment report to teacher: ${teacherResult.error}`)

        // Fallback to original PDF method if available
        try {
          console.log("🔄 Trying fallback PDF method...")
          const fallbackResult = await sendAssessmentReportToTeacher(teacher.email, submission, assessment, student)
          if (fallbackResult.success) {
            console.log(`✅ Fallback assessment report sent to teacher: ${teacher.email}`)
          }
        } catch (fallbackError) {
          console.error(`❌ Fallback method also failed: ${fallbackError.message}`)
        }
      }
    } else {
      console.log("⚠️ No valid teacher found or teacher email blocked")
    }

    // SECONDARY: Send enhanced HTML email to student
    if (student.email && student.email !== "raghudbose@gmail.com") {
      console.log(`📧 Sending enhanced HTML assessment results to student: ${student.email}`)
      const studentResult = await sendEnhancedAssessmentReportToStudent(student.email, submission, assessment, student)
      if (studentResult.success) {
        console.log(`✅ Enhanced HTML assessment results sent to student: ${student.email}`)
        console.log(`📧 Method used: ${studentResult.method}`)
      } else {
        console.error(`❌ Failed to send enhanced assessment results to student: ${studentResult.error}`)

        // Fallback to original PDF method if available
        try {
          console.log("🔄 Trying fallback PDF method for student...")
          const fallbackResult = await sendAssessmentReportToStudent(student.email, submission, assessment, student)
          if (fallbackResult.success) {
            console.log(`✅ Fallback assessment results sent to student: ${student.email}`)
          }
        } catch (fallbackError) {
          console.error(`❌ Student fallback method also failed: ${fallbackError.message}`)
        }
      }
    } else {
      console.log("⚠️ Student email blocked or not available")
    }

    console.log("=== ENHANCED ASSESSMENT SUBMISSION NOTIFICATION COMPLETED ===")
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

// Clean up function to remove old PDF reports (if any exist)
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
  notifyAssessmentSubmitted, // This is the MAIN function that now sends enhanced HTML reports to teachers
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
  // New enhanced functions
  generateEnhancedAssessmentHTML,
  sendEnhancedAssessmentReportToTeacher,
  sendEnhancedAssessmentReportToStudent,
}
