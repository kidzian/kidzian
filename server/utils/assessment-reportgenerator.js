const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")

// Generate detailed assessment report HTML
const generateAssessmentReportHTML = (submission, assessment, student) => {
  const { answers, score, percentage, timeSpent, submittedAt } = submission
  const { questions, maxMarks, title } = assessment

  // Calculate detailed statistics
  const totalQuestions = questions.length
  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const wrongAnswers = totalQuestions - correctAnswers

  // FIXED: Calculate correct percentage based on questions, not marks
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const averageTimePerQuestion = timeSpent ? Math.round(timeSpent / totalQuestions) : 0

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Assessment Report - ${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
        .card h3 {
          margin: 0 0 10px;
          color: #4f46e5;
        }
        .card .value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        .score-excellent { color: #10b981; }
        .score-good { color: #f59e0b; }
        .score-needs-improvement { color: #ef4444; }
        .student-info {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .student-info h2 {
          margin-top: 0;
          color: #4f46e5;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .info-label {
          font-weight: 600;
          color: #6b7280;
        }
        .questions-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .questions-section h2 {
          margin-top: 0;
          color: #4f46e5;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }
        .question {
          margin-bottom: 25px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fafafa;
        }
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .question-number {
          background: #4f46e5;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }
        .question-points {
          background: #f3f4f6;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 14px;
          color: #6b7280;
        }
        .question-text {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1f2937;
        }
        .answer-section {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #e5e7eb;
        }
        .answer-correct {
          border-left-color: #10b981;
          background: #f0fdf4;
        }
        .answer-wrong {
          border-left-color: #ef4444;
          background: #fef2f2;
        }
        .answer-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .answer-correct .answer-label {
          color: #059669;
        }
        .answer-wrong .answer-label {
          color: #dc2626;
        }
        .answer-text {
          font-size: 15px;
          margin-bottom: 10px;
        }
        .correct-answer {
          font-size: 14px;
          color: #059669;
          font-weight: 500;
        }
        .options-list {
          margin: 10px 0;
        }
        .option {
          padding: 8px 12px;
          margin: 5px 0;
          border-radius: 4px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        .option-correct {
          background: #d1fae5;
          border-color: #10b981;
          color: #065f46;
          font-weight: 600;
        }
        .option-selected {
          background: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .performance-indicator {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .excellent {
          background: #d1fae5;
          color: #065f46;
        }
        .good {
          background: #fef3c7;
          color: #92400e;
        }
        .needs-improvement {
          background: #fecaca;
          color: #991b1b;
        }
        @media print {
          body { background-color: white; }
          .card, .student-info, .questions-section { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Assessment Report</h1>
        <p>${title}</p>
        <p>Kidzian Learning Platform - Founded by Rashmi</p>
      </div>

      <div class="summary-cards">
        <div class="card">
          <h3>Final Score</h3>
          <div class="value ${correctPercentage >= 80 ? "score-excellent" : correctPercentage >= 60 ? "score-good" : "score-needs-improvement"}">
            ${correctAnswers}/${totalQuestions}
          </div>
          <p>${correctPercentage}%</p>
          <span class="performance-indicator ${correctPercentage >= 80 ? "excellent" : correctPercentage >= 60 ? "good" : "needs-improvement"}">
            ${correctPercentage >= 80 ? "Excellent" : correctPercentage >= 60 ? "Good" : "Needs Improvement"}
          </span>
        </div>
        <div class="card">
          <h3>Correct Answers</h3>
          <div class="value score-excellent">${correctAnswers}</div>
          <p>out of ${totalQuestions}</p>
        </div>
        <div class="card">
          <h3>Wrong Answers</h3>
          <div class="value score-needs-improvement">${wrongAnswers}</div>
          <p>out of ${totalQuestions}</p>
        </div>
        <div class="card">
          <h3>Time Spent</h3>
          <div class="value">${timeSpent || 0}</div>
          <p>minutes</p>
        </div>
      </div>

      <div class="student-info">
        <h2>👨‍🎓 Student Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Student Name:</span>
            <span>${student.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span>${student.email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Submission Date:</span>
            <span>${new Date(submittedAt).toLocaleString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Assessment:</span>
            <span>${title}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Total Questions:</span>
            <span>${totalQuestions}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Avg. Time/Question:</span>
            <span>${averageTimePerQuestion} min</span>
          </div>
        </div>
      </div>

      <div class="questions-section">
        <h2>📝 Detailed Question Analysis</h2>
        ${questions
          .map((question, index) => {
            const studentAnswer = answers.find((a) => a.questionIndex === index)
            const isCorrect = studentAnswer ? studentAnswer.isCorrect : false
            const studentAnswerText = studentAnswer ? studentAnswer.answer : "No answer provided"

            return `
            <div class="question">
              <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
                <span class="question-points">${question.points || 1} point${(question.points || 1) > 1 ? "s" : ""}</span>
              </div>
              
              <div class="question-text">${question.question}</div>
              
              ${
                question.type === "multiple-choice" && question.options
                  ? `
                <div class="options-list">
                  <strong>Options:</strong>
                  ${question.options
                    .map(
                      (option) => `
                    <div class="option ${option === question.correctAnswer ? "option-correct" : ""} ${option === studentAnswerText ? "option-selected" : ""}">
                      ${option} ${option === question.correctAnswer ? "✓ (Correct)" : ""} ${option === studentAnswerText && option !== question.correctAnswer ? "✗ (Selected)" : ""}
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
              
              <div class="answer-section ${isCorrect ? "answer-correct" : "answer-wrong"}">
                <div class="answer-label">
                  ${isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                  ${studentAnswer ? ` (+${studentAnswer.pointsEarned || 0} point${(studentAnswer.pointsEarned || 0) !== 1 ? "s" : ""})` : " (+0 points)"}
                </div>
                <div class="answer-text">
                  <strong>Student's Answer:</strong> ${studentAnswerText}
                </div>
                ${
                  !isCorrect
                    ? `
                  <div class="correct-answer">
                    <strong>Correct Answer:</strong> ${question.correctAnswer}
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `
          })
          .join("")}
      </div>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
        <p>This is an automated assessment report.</p>
      </div>
    </body>
    </html>
  `
}

// Generate PDF from HTML
const generateAssessmentPDF = async (htmlContent, outputPath) => {
  let browser
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    })

    console.log(`✅ Assessment PDF generated: ${outputPath}`)
    return true
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
    return false
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Main function to generate assessment report
const generateAssessmentReport = async (submission, assessment, student, options = {}) => {
  try {
    const { generatePDF = true, outputDir = "uploads/reports" } = options

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Generate HTML content
    const htmlContent = generateAssessmentReportHTML(submission, assessment, student)

    const result = {
      htmlContent,
      pdfPath: null,
      success: true,
    }

    if (generatePDF) {
      const fileName = `assessment-report-${student.name.replace(/\s+/g, "-")}-${submission._id}.pdf`
      const pdfPath = path.join(outputDir, fileName)

      const pdfGenerated = await generateAssessmentPDF(htmlContent, pdfPath)

      if (pdfGenerated) {
        result.pdfPath = pdfPath
      }
    }

    return result
  } catch (error) {
    console.error("Error generating assessment report:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  generateAssessmentReport,
  generateAssessmentReportHTML,
  generateAssessmentPDF,
}
