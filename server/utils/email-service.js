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
    pass: process.env.EMAIL_PASSWORD || "your-password",
  },
})

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email service error:", error)
  } else {
    console.log("✅ Email server is ready to send messages")
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

// Enhanced email templates
const emailTemplates = {
  // Enhanced template for assessment submission to teacher
  assessmentSubmittedToTeacher: (
    teacherName,
    studentName,
    assessmentTitle,
    correctAnswers,
    totalQuestions,
    submissionDate,
    timeSpent,
  ) => {
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const performanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"
    const performanceColor = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"
    const performanceEmoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"

    return {
      subject: `📊 Assessment Results: ${assessmentTitle} - ${studentName} (${percentage}%)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Assessment Results</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              padding: 30px;
            }
            .performance-card {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 30px;
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .performance-title {
              font-size: 20px;
              color: #1e293b;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .score-display {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              display: inline-block;
              min-width: 200px;
            }
            .score-value {
              font-size: 42px;
              font-weight: bold;
              color: ${performanceColor};
              margin-bottom: 8px;
            }
            .score-percentage {
              font-size: 28px;
              color: ${performanceColor};
              font-weight: bold;
              margin-bottom: 15px;
            }
            .performance-badge {
              background: ${performanceColor};
              color: white;
              padding: 10px 20px;
              border-radius: 25px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .correct { color: #10b981; }
            .wrong { color: #ef4444; }
            .time { color: #6366f1; }
            .total { color: #8b5cf6; }
            .info-section {
              background: #f8fafc;
              padding: 25px;
              border-radius: 10px;
              margin: 25px 0;
            }
            .info-title {
              font-size: 18px;
              color: #4f46e5;
              margin-bottom: 15px;
              font-weight: 600;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-item:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 500;
              color: #374151;
            }
            .info-value {
              font-weight: 600;
              color: #1f2937;
            }
            .attachment-notice {
              background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
              padding: 25px;
              border-radius: 10px;
              margin: 25px 0;
              border-left: 4px solid #0ea5e9;
            }
            .attachment-title {
              font-size: 18px;
              color: #0c4a6e;
              margin-bottom: 15px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .attachment-description {
              color: #0c4a6e;
              margin-bottom: 15px;
              line-height: 1.6;
            }
            .attachment-features {
              list-style: none;
              padding: 0;
              margin: 15px 0;
            }
            .attachment-features li {
              color: #0c4a6e;
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
            }
            .attachment-features li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #059669;
              font-weight: bold;
            }
            .cta-button {
              background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
              margin: 20px 0;
              transition: transform 0.2s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .recommendation {
              background: #fef2f2;
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
              border-left: 4px solid #ef4444;
            }
            .recommendation-title {
              color: #991b1b;
              font-weight: 600;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .recommendation-text {
              color: #991b1b;
              line-height: 1.6;
            }
            .footer {
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .footer p {
              margin: 5px 0;
            }
            @media (max-width: 600px) {
              .content {
                padding: 20px;
              }
              .stats-grid {
                grid-template-columns: repeat(2, 1fr);
              }
              .score-value {
                font-size: 32px;
              }
              .score-percentage {
                font-size: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Assessment Results</h1>
              <p>Kidzian Learning Platform - Founded by Rashmi</p>
            </div>
            
            <div class="content">
              <div class="performance-card">
                <div class="performance-title">
                  ${performanceEmoji} ${studentName} completed the assessment!
                </div>
                <div class="score-display">
                  <div class="score-value">${correctAnswers}/${totalQuestions}</div>
                  <div class="score-percentage">${percentage}%</div>
                  <div class="performance-badge">${performanceLevel}</div>
                </div>
              </div>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value correct">${correctAnswers}</div>
                  <div class="stat-label">Correct Answers</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value wrong">${totalQuestions - correctAnswers}</div>
                  <div class="stat-label">Wrong Answers</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value time">${timeSpent || 0}</div>
                  <div class="stat-label">Minutes Spent</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value total">${totalQuestions}</div>
                  <div class="stat-label">Total Questions</div>
                </div>
              </div>
              
              <div class="info-section">
                <div class="info-title">📋 Assessment Details</div>
                <div class="info-item">
                  <span class="info-label">Student Name:</span>
                  <span class="info-value">${studentName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Assessment:</span>
                  <span class="info-value">${assessmentTitle}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Submitted on:</span>
                  <span class="info-value">${new Date(submissionDate).toLocaleString()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Performance Level:</span>
                  <span class="info-value" style="color: ${performanceColor};">${performanceLevel}</span>
                </div>
              </div>
              
              <div class="attachment-notice">
                <div class="attachment-title">
                  📄 Comprehensive Report Attached
                </div>
                <div class="attachment-description">
                  A detailed PDF report has been attached to this email containing complete question-by-question analysis.
                </div>
                <ul class="attachment-features">
                  <li>Student's answers for each question</li>
                  <li>Correct/incorrect indicators with explanations</li>
                  <li>Points earned per question</li>
                  <li>Detailed performance analysis and statistics</li>
                  <li>Time spent breakdown and insights</li>
                  <li>Professional formatting for easy review</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="#" class="cta-button">
                  📊 View in Dashboard
                </a>
              </div>
              
              ${
                percentage < 60
                  ? `
                  <div class="recommendation">
                    <div class="recommendation-title">
                      💡 Teaching Recommendation
                    </div>
                    <div class="recommendation-text">
                      The student may benefit from additional support or review of the assessment topics.
                      Consider providing extra resources, scheduling a follow-up session, or offering
                      additional practice materials to help improve understanding.
                    </div>
                  </div>
                `
                  : ""
              }
            </div>
            
            <div class="footer">
              <p><strong>© 2024 Kidzian Learning Platform - Founded by Rashmi</strong></p>
              <p>This is an automated assessment report. Please check the attached PDF for detailed analysis.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  },

  // Enhanced template for assessment submission to student
  assessmentSubmittedToStudent: (
    studentName,
    assessmentTitle,
    correctAnswers,
    totalQuestions,
    submissionDate,
    timeSpent,
  ) => {
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const performanceLevel = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Keep Learning"
    const performanceColor = percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444"
    const performanceEmoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"

    return {
      subject: `🎯 Your Assessment Results: ${assessmentTitle} - ${percentage}% Score`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Assessment Results</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              padding: 30px;
            }
            .celebration {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 30px;
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .celebration-title {
              font-size: 24px;
              color: #1e293b;
              margin-bottom: 20px;
              font-weight: 600;
            }
            .score-display {
              background: white;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              display: inline-block;
              min-width: 200px;
            }
            .score-value {
              font-size: 42px;
              font-weight: bold;
              color: ${performanceColor};
              margin-bottom: 8px;
            }
            .score-percentage {
              font-size: 28px;
              color: ${performanceColor};
              font-weight: bold;
              margin-bottom: 15px;
            }
            .performance-badge {
              background: ${performanceColor};
              color: white;
              padding: 10px 20px;
              border-radius: 25px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .stat-card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .correct { color: #10b981; }
            .wrong { color: #ef4444; }
            .time { color: #6366f1; }
            .total { color: #8b5cf6; }
            .encouragement {
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
              border-left: 4px solid ${performanceColor};
            }
            .encouragement-title {
              font-weight: 600;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 8px;
              color: ${performanceColor === "#ef4444" ? "#991b1b" : performanceColor === "#f59e0b" ? "#92400e" : "#065f46"};
            }
            .encouragement-text {
              line-height: 1.6;
              color: ${performanceColor === "#ef4444" ? "#991b1b" : performanceColor === "#f59e0b" ? "#92400e" : "#065f46"};
            }
            .report-section {
              background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
              padding: 25px;
              border-radius: 10px;
              margin: 25px 0;
              border-left: 4px solid #0ea5e9;
            }
            .report-title {
              font-size: 18px;
              color: #0c4a6e;
              margin-bottom: 15px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .report-description {
              color: #0c4a6e;
              margin-bottom: 15px;
              line-height: 1.6;
            }
            .report-features {
              list-style: none;
              padding: 0;
              margin: 15px 0;
            }
            .report-features li {
              color: #0c4a6e;
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
            }
            .report-features li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #059669;
              font-weight: bold;
            }
            .cta-button {
              background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
              margin: 20px 0;
              transition: transform 0.2s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .footer {
              background: #f3f4f6;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .footer p {
              margin: 5px 0;
            }
            @media (max-width: 600px) {
              .content {
                padding: 20px;
              }
              .stats-grid {
                grid-template-columns: repeat(2, 1fr);
              }
              .score-value {
                font-size: 32px;
              }
              .score-percentage {
                font-size: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Your Assessment Results</h1>
              <p>Kidzian Learning Platform - Founded by Rashmi</p>
            </div>
            
            <div class="content">
              <div class="celebration">
                <div class="celebration-title">
                  ${performanceEmoji} Great job, ${studentName}!
                </div>
                <div class="score-display">
                  <div class="score-value">${correctAnswers}/${totalQuestions}</div>
                  <div class="score-percentage">${percentage}%</div>
                  <div class="performance-badge">${performanceLevel}</div>
                </div>
              </div>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value correct">${correctAnswers}</div>
                  <div class="stat-label">Correct Answers</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value wrong">${totalQuestions - correctAnswers}</div>
                  <div class="stat-label">Wrong Answers</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value time">${timeSpent || 0}</div>
                  <div class="stat-label">Minutes Spent</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value total">${totalQuestions}</div>
                  <div class="stat-label">Total Questions</div>
                </div>
              </div>
              
              <div class="encouragement" style="background: ${performanceColor === "#ef4444" ? "#fef2f2" : performanceColor === "#f59e0b" ? "#fffbeb" : "#f0fdf4"};">
                <div class="encouragement-title">
                  ${performanceEmoji} ${percentage >= 80 ? "Outstanding Work!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
                </div>
                <div class="encouragement-text">
                  ${
                    percentage >= 80
                      ? "Excellent performance! You've demonstrated a strong understanding of the material. Keep up the great work!"
                      : percentage >= 60
                        ? "Good work! You're on the right track. Review the questions you missed to improve further."
                        : "Don't worry! Learning takes time and practice. Review the attached report to understand the correct answers and consider asking your teacher for additional help."
                  }
                </div>
              </div>
              
              <div class="report-section">
                <div class="report-title">
                  📄 Your Detailed Report
                </div>
                <div class="report-description">
                  A comprehensive PDF report with your answers and explanations has been attached to this email.
                </div>
                <ul class="report-features">
                  <li>Your answers for each question</li>
                  <li>Which answers were correct or incorrect</li>
                  <li>The correct answers for questions you missed</li>
                  <li>Your performance analysis and insights</li>
                  <li>Time spent on the assessment</li>
                  <li>Areas for improvement and study tips</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="#" class="cta-button">
                  📊 View in Dashboard
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>© 2024 Kidzian Learning Platform - Founded by Rashmi</strong></p>
              <p>Keep learning and growing! This is your personal assessment report.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }
  },
}

// Enhanced function to send assessment report to teacher with PDF attachment
const sendAssessmentReportToTeacher = async (to, submission, assessment, student) => {
  try {
    // Block emails to specific address
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating detailed assessment report for teacher...")
    console.log(`Teacher: ${to}`)
    console.log(`Student: ${student.name}`)
    console.log(`Assessment: ${assessment.title}`)

    // Generate the assessment report
    const reportResult = await generateAssessmentReport(submission, assessment, student, {
      generatePDF: true,
      outputDir: "uploads/reports",
    })

    if (!reportResult.success) {
      console.error("Failed to generate assessment report:", reportResult.error)
      return { success: false, error: "Failed to generate PDF report" }
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
      const fileStats = getFileStats(reportResult.pdfPath)
      attachments.push({
        filename: `Assessment_Report_${student.name.replace(/\s+/g, "_")}_${assessment.title.replace(/\s+/g, "_")}.pdf`,
        path: reportResult.pdfPath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
      })
      console.log(`📎 PDF attachment prepared: ${fileStats.formattedSize}`)
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: attachments,
    }

    console.log("📧 Sending email to teacher...")
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Assessment report email sent to teacher successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      reportGenerated: true,
      pdfPath: reportResult.pdfPath,
      attachmentCount: attachments.length,
    }
  } catch (error) {
    console.error("❌ Error sending assessment report email to teacher:", error)
    return { success: false, error: error.message }
  }
}

// Enhanced function to send assessment report to student with PDF attachment
const sendAssessmentReportToStudent = async (to, submission, assessment, student) => {
  try {
    // Block emails to specific address
    if (to === "raghudbose@gmail.com") {
      console.log("🚫 Blocked assessment report email to raghudbose@gmail.com")
      return { success: true, messageId: "blocked", blocked: true }
    }

    console.log("📊 Generating detailed assessment report for student...")
    console.log(`Student: ${to}`)
    console.log(`Assessment: ${assessment.title}`)

    // Generate the assessment report (reuse the same PDF or generate new one)
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
      const fileStats = getFileStats(reportResult.pdfPath)
      attachments.push({
        filename: `Your_Assessment_Report_${assessment.title.replace(/\s+/g, "_")}.pdf`,
        path: reportResult.pdfPath,
        contentType: "application/pdf",
        contentDisposition: "attachment",
      })
      console.log(`📎 PDF attachment prepared for student: ${fileStats.formattedSize}`)
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
      attachments: attachments,
    }

    console.log("📧 Sending email to student...")
    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Assessment report email sent to student successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
      reportGenerated: true,
      attachmentCount: attachments.length,
    }
  } catch (error) {
    console.error("❌ Error sending assessment report email to student:", error)
    return { success: false, error: error.message }
  }
}

// Basic email sending function
const sendEmail = async (to, template) => {
  try {
    // Block emails to specific address
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

// Email with single attachment
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

// Email with multiple attachments
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

module.exports = {
  sendEmail,
  sendEmailWithAttachment,
  sendEmailWithMultipleAttachments,
  sendAssessmentReportToTeacher,
  sendAssessmentReportToStudent,
  emailTemplates,
  formatFileSize,
  getFileStats,
}
