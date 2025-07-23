const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")

// Generate detailed assessment report HTML with enhanced styling and question analysis
const generateAssessmentReportHTML = (submission, assessment, student) => {
  const { answers, score, percentage, timeSpent, submittedAt } = submission
  const { questions, maxMarks, title } = assessment

  // Calculate detailed statistics
  const totalQuestions = questions.length
  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const wrongAnswers = totalQuestions - correctAnswers
  
  // Calculate correct percentage based on questions, not marks
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const averageTimePerQuestion = timeSpent ? Math.round(timeSpent / totalQuestions) : 0

  // Performance indicators
  const performanceLevel = correctPercentage >= 80 ? "Excellent" : correctPercentage >= 60 ? "Good" : "Needs Improvement"
  const performanceColor = correctPercentage >= 80 ? "#10b981" : correctPercentage >= 60 ? "#f59e0b" : "#ef4444"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Assessment Report - ${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
          padding: 20px;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .header .subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        
        .header .platform {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .content {
          padding: 30px;
        }
        
        .summary-section {
          margin-bottom: 40px;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .card h3 {
          font-size: 16px;
          color: #4f46e5;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .card .value {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .card .description {
          font-size: 14px;
          color: #6b7280;
        }
        
        .score-excellent { color: #10b981; }
        .score-good { color: #f59e0b; }
        .score-needs-improvement { color: #ef4444; }
        
        .performance-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 10px;
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
        
        .student-info {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 40px;
          border: 1px solid #bae6fd;
        }
        
        .student-info h2 {
          color: #0c4a6e;
          margin-bottom: 20px;
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #bae6fd;
        }
        
        .info-item:last-child {
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: #0c4a6e;
          font-size: 14px;
        }
        
        .info-value {
          font-weight: 500;
          color: #1e293b;
        }
        
        .questions-section {
          margin-top: 40px;
        }
        
        .questions-section h2 {
          color: #4f46e5;
          margin-bottom: 30px;
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 15px;
          border-bottom: 3px solid #e5e7eb;
        }
        
        .question {
          margin-bottom: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: #fafafa;
        }
        
        .question-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .question-number {
          background: #4f46e5;
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .question-points {
          background: #f3f4f6;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .question-content {
          padding: 25px;
        }
        
        .question-text {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .options-list {
          margin: 20px 0;
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }
        
        .options-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .option {
          padding: 12px 16px;
          margin: 8px 0;
          border-radius: 8px;
          background: white;
          border: 2px solid #e5e7eb;
          font-size: 14px;
          transition: all 0.2s ease;
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
          font-weight: 500;
        }
        
        .option-both {
          background: #ddd6fe;
          border-color: #8b5cf6;
          color: #5b21b6;
          font-weight: 600;
        }
        
        .answer-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          border-left: 4px solid #e5e7eb;
        }
        
        .answer-correct {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }
        
        .answer-wrong {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
        }
        
        .answer-label {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .answer-correct .answer-label {
          color: #059669;
        }
        
        .answer-wrong .answer-label {
          color: #dc2626;
        }
        
        .answer-text {
          font-size: 15px;
          margin-bottom: 12px;
          padding: 10px;
          background: rgba(255,255,255,0.7);
          border-radius: 6px;
        }
        
        .correct-answer {
          font-size: 14px;
          color: #059669;
          font-weight: 600;
          padding: 10px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 6px;
          margin-top: 10px;
        }
        
        .points-earned {
          font-size: 12px;
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        
        .footer {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          text-align: center;
          padding: 30px;
          margin-top: 40px;
        }
        
        .footer p {
          margin: 5px 0;
          opacity: 0.8;
        }
        
        .footer .copyright {
          font-size: 14px;
          font-weight: 600;
        }
        
        .footer .tagline {
          font-size: 12px;
          opacity: 0.6;
        }
        
        @media print {
          body { 
            background-color: white; 
            padding: 0;
          }
          .container { 
            box-shadow: none; 
            max-width: 100%;
          }
          .card:hover {
            transform: none;
          }
        }
        
        @page {
          margin: 1cm;
          size: A4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Assessment Report</h1>
          <div class="subtitle">${title}</div>
          <div class="platform">Kidzian Learning Platform - Founded by Rashmi</div>
        </div>
        
        <div class="content">
          <div class="summary-section">
            <div class="summary-cards">
              <div class="card">
                <h3>Final Score</h3>
                <div class="value ${correctPercentage >= 80 ? "score-excellent" : correctPercentage >= 60 ? "score-good" : "score-needs-improvement"}">
                  ${correctAnswers}/${totalQuestions}
                </div>
                <div class="description">${correctPercentage}%</div>
                <div class="performance-badge ${correctPercentage >= 80 ? "excellent" : correctPercentage >= 60 ? "good" : "needs-improvement"}">
                  ${performanceLevel}
                </div>
              </div>
              
              <div class="card">
                <h3>Correct Answers</h3>
                <div class="value score-excellent">${correctAnswers}</div>
                <div class="description">out of ${totalQuestions}</div>
              </div>
              
              <div class="card">
                <h3>Wrong Answers</h3>
                <div class="value score-needs-improvement">${wrongAnswers}</div>
                <div class="description">out of ${totalQuestions}</div>
              </div>
              
              <div class="card">
                <h3>Time Spent</h3>
                <div class="value">${timeSpent || 0}</div>
                <div class="description">minutes</div>
              </div>
            </div>
          </div>
          
          <div class="student-info">
            <h2>👨‍🎓 Student Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Student Name:</span>
                <span class="info-value">${student.name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${student.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Submission Date:</span>
                <span class="info-value">${new Date(submittedAt).toLocaleString()}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Assessment:</span>
                <span class="info-value">${title}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Questions:</span>
                <span class="info-value">${totalQuestions}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Avg. Time/Question:</span>
                <span class="info-value">${averageTimePerQuestion} min</span>
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
                const pointsEarned = studentAnswer ? (studentAnswer.pointsEarned || 0) : 0
                
                return `
                <div class="question">
                  <div class="question-header">
                    <span class="question-number">Question ${index + 1}</span>
                    <span class="question-points">${question.points || 1} point${(question.points || 1) > 1 ? "s" : ""}</span>
                  </div>
                  
                  <div class="question-content">
                    <div class="question-text">${question.question}</div>
                    
                    ${
                      question.type === "multiple-choice" && question.options
                        ? `
                        <div class="options-list">
                          <div class="options-title">Available Options:</div>
                          ${question.options
                            .map((option) => {
                              let optionClass = "option"
                              if (option === question.correctAnswer && option === studentAnswerText) {
                                optionClass += " option-both"
                              } else if (option === question.correctAnswer) {
                                optionClass += " option-correct"
                              } else if (option === studentAnswerText) {
                                optionClass += " option-selected"
                              }
                              
                              let optionLabel = ""
                              if (option === question.correctAnswer && option === studentAnswerText) {
                                optionLabel = " ✓ (Correct & Selected)"
                              } else if (option === question.correctAnswer) {
                                optionLabel = " ✓ (Correct Answer)"
                              } else if (option === studentAnswerText) {
                                optionLabel = " ✗ (Student Selected)"
                              }
                              
                              return `
                                <div class="${optionClass}">
                                  ${option}${optionLabel}
                                </div>
                              `
                            })
                            .join("")}
                        </div>
                      `
                        : ""
                    }
                    
                    <div class="answer-section ${isCorrect ? "answer-correct" : "answer-wrong"}">
                      <div class="answer-label">
                        ${isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                        <span class="points-earned">+${pointsEarned} point${pointsEarned !== 1 ? "s" : ""}</span>
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
                </div>
              `
              })
              .join("")}
          </div>
        </div>
        
        <div class="footer">
          <p class="copyright">Generated on ${new Date().toLocaleString()}</p>
          <p class="copyright">© 2024 Kidzian Learning Platform - Founded by Rashmi</p>
          <p class="tagline">Empowering Education Through Technology</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Generate PDF from HTML with enhanced settings
const generateAssessmentPDF = async (htmlContent, outputPath) => {
  let browser
  try {
    console.log("🚀 Launching browser for PDF generation...")
    
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu"
      ],
    })
    
    const page = await browser.newPage()
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 })
    
    console.log("📄 Setting HTML content...")
    await page.setContent(htmlContent, { 
      waitUntil: "networkidle0",
      timeout: 30000 
    })
    
    console.log("🖨️ Generating PDF...")
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    })
    
    console.log(`✅ Assessment PDF generated successfully: ${outputPath}`)
    return true
  } catch (error) {
    console.error("❌ Error generating PDF:", error)
    return false
  } finally {
    if (browser) {
      await browser.close()
      console.log("🔒 Browser closed")
    }
  }
}

// Main function to generate assessment report
const generateAssessmentReport = async (submission, assessment, student, options = {}) => {
  try {
    const { generatePDF = true, outputDir = "uploads/reports" } = options
    
    console.log("📊 Starting assessment report generation...")
    console.log(`Student: ${student.name}`)
    console.log(`Assessment: ${assessment.title}`)
    console.log(`Questions: ${assessment.questions.length}`)
    console.log(`Answers: ${submission.answers.length}`)
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
      console.log(`📁 Created output directory: ${outputDir}`)
    }
    
    // Generate HTML content
    console.log("🎨 Generating HTML content...")
    const htmlContent = generateAssessmentReportHTML(submission, assessment, student)
    
    const result = {
      htmlContent,
      pdfPath: null,
      success: true,
    }
    
    if (generatePDF) {
      const fileName = `assessment-report-${student.name.replace(/\s+/g, "-")}-${submission._id}-${Date.now()}.pdf`
      const pdfPath = path.join(outputDir, fileName)
      
      console.log(`📄 Generating PDF: ${fileName}`)
      const pdfGenerated = await generateAssessmentPDF(htmlContent, pdfPath)
      
      if (pdfGenerated) {
        result.pdfPath = pdfPath
        console.log(`✅ PDF report generated: ${pdfPath}`)
        
        // Verify file exists and get size
        if (fs.existsSync(pdfPath)) {
          const stats = fs.statSync(pdfPath)
          console.log(`📊 PDF file size: ${(stats.size / 1024).toFixed(2)} KB`)
        }
      } else {
        console.error("❌ PDF generation failed")
      }
    }
    
    return result
  } catch (error) {
    console.error("❌ Error generating assessment report:", error)
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
