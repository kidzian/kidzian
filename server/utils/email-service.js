const nodemailer = require("nodemailer")
const fs = require("fs")
const path = require("path")
const { generateAssessmentReport } = require("./assessment-reportgenerator")

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-password", // Use EMAIL_PASSWORD to match your .env
  },
})

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error)
  } else {
    console.log("Email server is ready to send messages")
  }
})

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Helper function to get file stats
const getFileStats = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      return {
        exists: true,
        size: stats.size,
        formattedSize: formatFileSize(stats.size),
      }
    }
    return { exists: false, size: 0, formattedSize: "0 Bytes" }
  } catch (error) {
    console.error("Error getting file stats:", error)
    return { exists: false, size: 0, formattedSize: "0 Bytes" }
  }
}

// Email templates
const emailTemplates = {
  // Assignment Created Template
  assignmentCreated: (studentName, teacherName, assignmentTitle, dueDate, courseName) => {
    return {
      subject: `New Assignment: ${assignmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #0d9488, #06b6d4); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #e0fdff; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A new assignment has been created for you by ${teacherName}.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #0d9488;">${assignmentTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <p>Please log in to your student dashboard to view the details and submit your work.</p>
            <p>Remember, completing assignments on time earns you 20 points!</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Assignment</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // NEW: Assignment Updated Template
  assignmentUpdated: (studentName, teacherName, assignmentTitle, dueDate, courseName) => {
    return {
      subject: `Assignment Updated: ${assignmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #f59e0b, #f97316); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">📝 Assignment Updated</h2>
            <p style="color: #fef3c7; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>An assignment has been updated by ${teacherName}.</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e;">${assignmentTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #92400e; margin: 0;"><strong>⚠️ Important:</strong> Please review the updated assignment details as there may be changes to requirements, due date, or instructions.</p>
            </div>
            
            <p>Please log in to your student dashboard to view the updated details.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Updated Assignment</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // Assessment Created Template
  assessmentCreated: (studentName, teacherName, assessmentTitle, dueDate, courseName) => {
    return {
      subject: `New Assessment: ${assessmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #7c3aed, #a855f7); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">📊 New Assessment</h2>
            <p style="color: #e9d5ff; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A new assessment has been created for you by ${teacherName}.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #7c3aed;">${assessmentTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <p>Please log in to your student dashboard to take the assessment.</p>
            <p>Good luck with your assessment!</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Take Assessment</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // NEW: Assessment Updated Template
  assessmentUpdated: (studentName, teacherName, assessmentTitle, dueDate, courseName) => {
    return {
      subject: `Assessment Updated: ${assessmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #f59e0b, #f97316); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">📊 Assessment Updated</h2>
            <p style="color: #fef3c7; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>An assessment has been updated by ${teacherName}.</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e;">${assessmentTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #92400e; margin: 0;"><strong>⚠️ Important:</strong> Please review the updated assessment details as there may be changes to questions, time limit, or due date.</p>
            </div>
            
            <p>Please log in to your student dashboard to view the updated assessment.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Updated Assessment</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // Project Created Template
  projectCreated: (studentName, teacherName, projectTitle, dueDate, courseName) => {
    return {
      subject: `New Project: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #059669, #10b981); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">🚀 New Project</h2>
            <p style="color: #d1fae5; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A new project has been created for you by ${teacherName}.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #059669;">${projectTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <p>Please log in to your student dashboard to view the project details and requirements.</p>
            <p>Start working on your project early to ensure quality submission!</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Project</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // NEW: Project Updated Template
  projectUpdated: (studentName, teacherName, projectTitle, dueDate, courseName) => {
    return {
      subject: `Project Updated: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #f59e0b, #f97316); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">🚀 Project Updated</h2>
            <p style="color: #fef3c7; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A project has been updated by ${teacherName}.</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin-top: 0; color: #92400e;">${projectTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #92400e; margin: 0;"><strong>⚠️ Important:</strong> Please review the updated project details as there may be changes to requirements, deliverables, or due date.</p>
            </div>
            
            <p>Please log in to your student dashboard to view the updated project details.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Updated Project</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // ENHANCED: Template for when a student submits an assessment WITH DETAILED REPORT (FOR TEACHERS)
  assessmentSubmittedToTeacher: (
    teacherName,
    studentName,
    assessmentTitle,
    correctAnswers,
    totalQuestions,
    submissionDate,
    timeSpent,
  ) => {
    // FIXED: Calculate percentage based on questions, not marks
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const performanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"
    const performanceColor = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"
    const performanceEmoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"

    return {
      subject: `Assessment Results: ${assessmentTitle} - ${studentName} (${percentage}%)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #4f46e5, #818cf8); padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">📊 Assessment Results</h2>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 25px;">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px; color: #1e293b; text-align: center;">
                ${performanceEmoji} ${studentName} completed the assessment!
              </h3>
              <div style="text-align: center;">
                <div style="display: inline-block; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 36px; font-weight: bold; color: ${performanceColor}; margin-bottom: 5px;">
                    ${correctAnswers}/${totalQuestions}
                  </div>
                  <div style="font-size: 24px; color: ${performanceColor}; font-weight: bold; margin-bottom: 10px;">
                    ${percentage}%
                  </div>
                  <div style="background: ${performanceColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                    ${performanceLevel}
                  </div>
                </div>
              </div>
            </div>
          
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #4f46e5;">📋 Assessment Details</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #10b981;">${correctAnswers}</div>
                  <div style="font-size: 14px; color: #6b7280;">Correct Answers</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${totalQuestions - correctAnswers}</div>
                  <div style="font-size: 14px; color: #6b7280;">Wrong Answers</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #6366f1;">${timeSpent || 0}</div>
                  <div style="font-size: 14px; color: #6b7280;">Minutes Spent</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${totalQuestions}</div>
                  <div style="font-size: 14px; color: #6b7280;">Total Questions</div>
                </div>
              </div>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="margin-top: 0; color: #0c4a6e;">📄 Detailed Report</h3>
              <p style="margin: 5px 0; color: #0c4a6e;">
                A comprehensive assessment report with question-by-question analysis has been attached to this email. 
                The report includes:
              </p>
              <ul style="color: #0c4a6e; margin: 10px 0;">
                <li>Student's answers for each question</li>
                <li>Correct/incorrect indicators</li>
                <li>Points earned per question</li>
                <li>Detailed performance analysis</li>
                <li>Time spent breakdown</li>
              </ul>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4 style="margin-top: 0; color: #4f46e5;">Student Information</h4>
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Assessment:</strong> ${assessmentTitle}</p>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Performance Level:</strong> <span style="color: ${performanceColor}; font-weight: bold;">${performanceLevel}</span></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                📊 View in Dashboard
              </a>
            </div>
            
            ${
              percentage < 60
                ? `
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h4 style="margin-top: 0; color: #991b1b;">💡 Recommendation</h4>
                <p style="color: #991b1b; margin: 0;">
                  The student may benefit from additional support or review of the assessment topics. 
                  Consider providing extra resources or scheduling a follow-up session.
                </p>
              </div>
            `
                : ""
            }
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated assessment report. Please check the attached PDF for detailed analysis.</p>
          </div>
        </div>
      `,
    }
  },

  // NEW: Template for when a student submits an assessment (FOR STUDENTS)
  assessmentSubmittedToStudent: (
    studentName,
    assessmentTitle,
    correctAnswers,
    totalQuestions,
    submissionDate,
    timeSpent,
  ) => {
    // FIXED: Calculate percentage based on questions, not marks
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const performanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"
    const performanceColor = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"
    const performanceEmoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"

    return {
      subject: `Your Assessment Results: ${assessmentTitle} - ${percentage}% Score`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #4f46e5, #818cf8); padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">📊 Your Assessment Results</h2>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 25px;">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px; color: #1e293b; text-align: center;">
                ${performanceEmoji} Great job, ${studentName}!
              </h3>
              <div style="text-align: center;">
                <div style="display: inline-block; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 36px; font-weight: bold; color: ${performanceColor}; margin-bottom: 5px;">
                    ${correctAnswers}/${totalQuestions}
                  </div>
                  <div style="font-size: 24px; color: ${performanceColor}; font-weight: bold; margin-bottom: 10px;">
                    ${percentage}%
                  </div>
                  <div style="background: ${performanceColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                    ${performanceLevel}
                  </div>
                </div>
              </div>
            </div>
          
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #4f46e5;">📋 Your Performance</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #10b981;">${correctAnswers}</div>
                  <div style="font-size: 14px; color: #6b7280;">Correct Answers</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${totalQuestions - correctAnswers}</div>
                  <div style="font-size: 14px; color: #6b7280;">Wrong Answers</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #6366f1;">${timeSpent || 0}</div>
                  <div style="font-size: 14px; color: #6b7280;">Minutes Spent</div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${totalQuestions}</div>
                  <div style="font-size: 14px; color: #6b7280;">Total Questions</div>
                </div>
              </div>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="margin-top: 0; color: #0c4a6e;">📄 Detailed Report</h3>
              <p style="margin: 5px 0; color: #0c4a6e;">
                A comprehensive assessment report with your answers and explanations has been attached to this email. 
                The report shows:
              </p>
              <ul style="color: #0c4a6e; margin: 10px 0;">
                <li>Your answers for each question</li>
                <li>Which answers were correct or incorrect</li>
                <li>The correct answers for questions you missed</li>
                <li>Your performance analysis</li>
                <li>Time spent on the assessment</li>
              </ul>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4 style="margin-top: 0; color: #4f46e5;">Assessment Details</h4>
              <p><strong>Assessment:</strong> ${assessmentTitle}</p>
              <p><strong>Completed on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Your Score:</strong> <span style="color: ${performanceColor}; font-weight: bold;">${correctAnswers}/${totalQuestions} (${percentage}%)</span></p>
              <p><strong>Performance Level:</strong> <span style="color: ${performanceColor}; font-weight: bold;">${performanceLevel}</span></p>
            </div>
            
            ${
              percentage >= 80
                ? `
              <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h4 style="margin-top: 0; color: #065f46;">🎉 Excellent Work!</h4>
                <p style="color: #065f46; margin: 0;">
                  Outstanding performance! You've demonstrated a strong understanding of the material. 
                  Keep up the great work!
                </p>
              </div>
            `
                : percentage >= 60
                  ? `
              <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h4 style="margin-top: 0; color: #92400e;">👍 Good Job!</h4>
                <p style="color: #92400e; margin: 0;">
                  Good work! You're on the right track. Review the questions you missed to improve further.
                </p>
              </div>
            `
                  : `
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h4 style="margin-top: 0; color: #991b1b;">📚 Keep Learning!</h4>
                <p style="color: #991b1b; margin: 0;">
                  Don't worry! Learning takes time. Review the attached report to understand the correct answers 
                  and consider asking your teacher for additional help.
                </p>
              </div>
            `
            }
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                📊 View in Dashboard
              </a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is your personal assessment report. Keep learning and growing!</p>
          </div>
        </div>
      `,
    }
  },

  // Assignment Submitted Template
  assignmentSubmitted: (teacherName, studentName, assignmentTitle, submissionDate, fileName, filePath) => {
    const fileStats = filePath ? getFileStats(filePath) : { exists: false, formattedSize: "0 Bytes" }

    return {
      subject: `Assignment Submission: ${assignmentTitle} - ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #0d9488, #06b6d4); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #e0fdff; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${teacherName},</p>
            <p><strong>${studentName}</strong> has submitted an assignment.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #0d9488;">${assignmentTitle}</h3>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Student:</strong> ${studentName}</p>
              ${fileName ? `<p><strong>Submitted File:</strong> ${fileName} (${fileStats.formattedSize})</p>` : "<p><strong>File:</strong> No file attached</p>"}
            </div>
            
            ${
              fileName
                ? `
            <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">
              <h4 style="margin-top: 0; color: #155724;">📎 File Attachment</h4>
              <p style="margin: 5px 0; color: #155724;">The student's submission file is attached to this email. You can download and review it directly from your email.</p>
              <p style="margin: 5px 0; font-size: 14px; color: #6c757d;">File: ${fileName} (${fileStats.formattedSize})</p>
            </div>
            `
                : ""
            }
            
            <p>Please review the submission and provide feedback to the student.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review in Dashboard</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },

  // Project Submitted Template
  projectSubmitted: (teacherName, studentName, projectTitle, submissionDate, fileName, filePath) => {
    const fileStats = filePath ? getFileStats(filePath) : { exists: false, formattedSize: "0 Bytes" }

    return {
      subject: `Project Submission: ${projectTitle} - ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #059669, #10b981); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">🚀 Project Submission</h2>
            <p style="color: #d1fae5; margin: 5px 0 0;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${teacherName},</p>
            <p><strong>${studentName}</strong> has submitted a project.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #059669;">${projectTitle}</h3>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Student:</strong> ${studentName}</p>
              ${fileName ? `<p><strong>Submitted File:</strong> ${fileName} (${fileStats.formattedSize})</p>` : "<p><strong>File:</strong> No file attached</p>"}
            </div>
            
            ${
              fileName
                ? `
            <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">
              <h4 style="margin-top: 0; color: #155724;">📎 File Attachment</h4>
              <p style="margin: 5px 0; color: #155724;">The student's project files are attached to this email. You can download and review them directly from your email.</p>
              <p style="margin: 5px 0; font-size: 14px; color: #6c757d;">File: ${fileName} (${fileStats.formattedSize})</p>
            </div>
            `
                : ""
            }
            
            <p>Please review the project submission and provide feedback to the student.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review in Dashboard</a>
            </div>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #4b5563;">
            <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    }
  },
}

// Enhanced email sending function with assessment report (FOR TEACHERS)
const sendAssessmentReportToTeacher = async (to, submission, assessment, student) => {
  try {
    // IMPORTANT: Block emails to raghudbose@gmail.com
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating detailed assessment report for teacher...")

    // Generate the assessment report
    const reportResult = await generateAssessmentReport(submission, assessment, student, {
      generatePDF: true,
      outputDir: "uploads/reports",
    })

    if (!reportResult.success) {
      console.error("Failed to generate assessment report:", reportResult.error)
      // Fallback to basic email
      return await sendBasicAssessmentEmail(to, submission, assessment, student)
    }

    // Calculate statistics
    const totalQuestions = assessment.questions.length
    const correctAnswers = submission.answers.filter((a) => a.isCorrect).length

    // Create enhanced email template for teacher
    const template = emailTemplates.assessmentSubmittedToTeacher(
      "Teacher", // You can get actual teacher name from database
      student.name,
      assessment.title,
      correctAnswers,
      totalQuestions,
      submission.submittedAt,
      submission.timeSpent,
    )

    const attachments = []

    // Add PDF report if generated
    if (reportResult.pdfPath && fs.existsSync(reportResult.pdfPath)) {
      attachments.push({
        filename: `Assessment-Report-${student.name.replace(/\s+/g, "-")}.pdf`,
        path: reportResult.pdfPath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
      })
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: attachments,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Assessment report email sent to teacher successfully:", info.messageId)

    return { success: true, messageId: info.messageId, reportGenerated: true, pdfPath: reportResult.pdfPath }
  } catch (error) {
    console.error("❌ Error sending assessment report email to teacher:", error)
    return { success: false, error: error.message }
  }
}

// NEW: Enhanced email sending function with assessment report (FOR STUDENTS)
const sendAssessmentReportToStudent = async (to, submission, assessment, student) => {
  try {
    // IMPORTANT: Block emails to raghudbose@gmail.com
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating detailed assessment report for student...")

    // Generate the assessment report (reuse the same PDF)
    const reportResult = await generateAssessmentReport(submission, assessment, student, {
      generatePDF: true,
      outputDir: "uploads/reports",
    })

    if (!reportResult.success) {
      console.error("Failed to generate assessment report for student:", reportResult.error)
      // Send basic email without PDF
      const totalQuestions = assessment.questions.length
      const correctAnswers = submission.answers.filter((a) => a.isCorrect).length

      const template = emailTemplates.assessmentSubmittedToStudent(
        student.name,
        assessment.title,
        correctAnswers,
        totalQuestions,
        submission.submittedAt,
        submission.timeSpent,
      )

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
        to: to,
        subject: template.subject,
        html: template.html,
      }

      const info = await transporter.sendMail(mailOptions)
      return { success: true, messageId: info.messageId, reportGenerated: false }
    }

    // Calculate statistics
    const totalQuestions = assessment.questions.length
    const correctAnswers = submission.answers.filter((a) => a.isCorrect).length

    // Create enhanced email template for student
    const template = emailTemplates.assessmentSubmittedToStudent(
      student.name,
      assessment.title,
      correctAnswers,
      totalQuestions,
      submission.submittedAt,
      submission.timeSpent,
    )

    const attachments = []

    // Add PDF report if generated
    if (reportResult.pdfPath && fs.existsSync(reportResult.pdfPath)) {
      attachments.push({
        filename: `Your-Assessment-Report-${assessment.title.replace(/\s+/g, "-")}.pdf`,
        path: reportResult.pdfPath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
      })
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: attachments,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Assessment report email sent to student successfully:", info.messageId)

    return { success: true, messageId: info.messageId, reportGenerated: true }
  } catch (error) {
    console.error("❌ Error sending assessment report email to student:", error)
    return { success: false, error: error.message }
  }
}

// Fallback basic assessment email
const sendBasicAssessmentEmail = async (to, submission, assessment, student) => {
  const totalQuestions = assessment.questions.length
  const correctAnswers = submission.answers.filter((a) => a.isCorrect).length
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const template = {
    subject: `Assessment Completed: ${assessment.title} - ${student.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Assessment Completed</h2>
        <p><strong>${student.name}</strong> has completed the assessment: <strong>${assessment.title}</strong></p>
        <p><strong>Score:</strong> ${correctAnswers}/${totalQuestions} (${percentage}%)</p>
        <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
      </div>
    `,
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
    to: to,
    subject: template.subject,
    html: template.html,
  }

  const info = await transporter.sendMail(mailOptions)
  return { success: true, messageId: info.messageId, reportGenerated: false }
}

// Basic email sending function
const sendEmail = async (to, template) => {
  try {
    // IMPORTANT: Block emails to raghudbose@gmail.com
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("❌ Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Keep existing functions...
const sendEmailWithAttachment = async (to, template, filePath, fileName) => {
  try {
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked email with attachment to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)

    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`)
      return { success: false, error: "File not found" }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: [
        {
          filename: fileName,
          path: fullPath,
          contentType: "application/octet-stream",
          contentDisposition: "attachment",
        },
      ],
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email with attachment sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("❌ Error sending email with attachment:", error)
    return { success: false, error: error.message }
  }
}

const sendEmailWithMultipleAttachments = async (to, template, attachments) => {
  try {
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked email with multiple attachments to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    const validAttachments = []
    for (const attachment of attachments) {
      const fullPath = path.isAbsolute(attachment.path) ? attachment.path : path.join(process.cwd(), attachment.path)

      if (fs.existsSync(fullPath)) {
        validAttachments.push({
          filename: attachment.filename,
          path: fullPath,
          contentType: attachment.contentType || "application/octet-stream",
          contentDisposition: "attachment",
        })
      }
    }

    if (validAttachments.length === 0) {
      console.log("⚠️ No valid attachments found, sending email without attachments")
      return await sendEmail(to, template)
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: validAttachments,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email with ${validAttachments.length} attachments sent successfully: ${info.messageId}`)
    return { success: true, messageId: info.messageId, attachmentCount: validAttachments.length }
  } catch (error) {
    console.error("❌ Error sending email with multiple attachments:", error)
    return { success: false, error: error.message }
  }
}

// NEW: Function to send assessment report email to both teacher and student
async function sendAssessmentReportEmail(assessment, submission, reportPath) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || "test@ethereal.email", // generated ethereal user
      pass: process.env.EMAIL_PASS || "ethereal password", // generated ethereal password
    },
  })

  const totalQuestions = assessment.questions?.length || 1
  const correctAnswers = submission.answers?.filter((answer) => answer.isCorrect).length || 0
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  const teacherEmailTemplatePath = path.join(__dirname, "email-templates", "teacher-assessment-report.html")
  let teacherEmailTemplate = ""
  try {
    teacherEmailTemplate = fs.readFileSync(teacherEmailTemplatePath, "utf8")
  } catch (error) {
    console.error("Error reading teacher email template:", error)
    teacherEmailTemplate = `
      <p>Dear Teacher,</p>
      <p>Please find attached the assessment report for ${assessment.title} submitted by ${submission.student?.name || "Student"}.</p>
    `
  }

  // Replace placeholders in the email template
  teacherEmailTemplate = teacherEmailTemplate.replace("{{assessmentTitle}}", assessment.title)
  teacherEmailTemplate = teacherEmailTemplate.replace("{{studentName}}", submission.student?.name || "Student")
  teacherEmailTemplate = teacherEmailTemplate.replace("{{percentage}}", percentage)
  teacherEmailTemplate = teacherEmailTemplate.replace("{{correctAnswers}}", correctAnswers)
  teacherEmailTemplate = teacherEmailTemplate.replace("{{totalQuestions}}", totalQuestions)

  // send mail with defined transport object
  const teacherEmailOptions = {
    from: process.env.EMAIL_FROM || "noreply@kidzian.com", // sender address
    to: assessment.teacher.email, // list of receivers
    subject: `Assessment Report - ${assessment.title} - ${submission.student?.name || "Student"}`, // Subject line
    html: teacherEmailTemplate, // html body
    attachments: [
      {
        filename: `Assessment_Report_${assessment.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
        path: reportPath,
      },
    ],
  }

  await transporter.sendMail(teacherEmailOptions)

  // Send email to student as well
  if (submission.student?.email) {
    const studentEmailOptions = {
      from: process.env.EMAIL_FROM || "noreply@kidzian.com",
      to: submission.student.email,
      subject: `Your Assessment Results - ${assessment.title}`,
      html: generateStudentAssessmentEmailTemplate(assessment, submission, percentage, reportPath),
      attachments: [
        {
          filename: `Assessment_Report_${assessment.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
          path: reportPath,
        },
      ],
    }

    await transporter.sendMail(studentEmailOptions)
  }

  console.log("Email sent successfully")
}

function generateStudentAssessmentEmailTemplate(assessment, submission, percentage, reportPath) {
  const performanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"
  const encouragement =
    percentage >= 80
      ? "Outstanding work! Keep up the excellent performance!"
      : percentage >= 60
        ? "Good job! With a little more effort, you can achieve even better results!"
        : "Don't worry! Every challenge is an opportunity to learn and grow. Keep practicing!"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Your Assessment Results</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Kidzian Learning Platform</p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${submission.student?.name || "Student"}! 👋</h2>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          You've completed the assessment "<strong>${assessment.title}</strong>" and here are your results:
        </p>
        
        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: #0891b2; margin: 0 0 15px 0; font-size: 24px;">Your Score</h3>
          <div style="font-size: 48px; font-weight: bold; color: #0891b2; margin: 10px 0;">
            ${percentage}%
          </div>
          <div style="color: #0891b2; font-size: 18px; font-weight: 600;">
            ${submission.answers?.filter((answer) => answer.isCorrect).length || 0} out of ${assessment.questions?.length || 0} correct
          </div>
          <div style="margin-top: 15px; padding: 10px 20px; background: rgba(20, 184, 166, 0.1); border-radius: 25px; display: inline-block;">
            <span style="color: #14b8a6; font-weight: 600;">${performanceLevel} Performance!</span>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #059669; font-weight: 600; margin: 0 0 10px 0;">💪 ${encouragement}</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.5;">
            ${
              percentage < 60
                ? "Remember: Every expert was once a beginner. Review the attached report to see which areas need more practice, and don't hesitate to ask your teacher for help!"
                : "Your hard work is paying off! Keep this momentum going in your future assessments."
            }
          </p>
        </div>
        
        <div style="margin: 25px 0;">
          <h4 style="color: #1f2937; margin-bottom: 15px;">📊 Detailed Report</h4>
          <p style="color: #4b5563; line-height: 1.6;">
            We've attached a detailed PDF report that shows:
          </p>
          <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
            <li>Your answers for each question</li>
            <li>Correct answers and explanations</li>
            <li>Areas where you excelled</li>
            <li>Topics that might need more review</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 12px;">
            <h4 style="margin: 0 0 10px 0;">🎯 Keep Learning!</h4>
            <p style="margin: 0; opacity: 0.9;">
              Continue your learning journey with Kidzian Learning Platform
            </p>
          </div>
        </div>
      </div>
      
      <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; opacity: 0.8;">© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
        <p style="margin: 5px 0 0 0; opacity: 0.6; font-size: 14px;">Empowering Students Through Technology</p>
      </div>
    </div>
  `
}

module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailWithMultipleAttachments,
  sendAssessmentReportToTeacher,
  sendAssessmentReportToStudent,
  emailTemplates,
  formatFileSize,
  getFileStats,
  sendAssessmentReportEmail,
  generateStudentAssessmentEmailTemplate,
}
