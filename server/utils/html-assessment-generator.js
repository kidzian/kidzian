const fs = require("fs")
const path = require("path")

// Generate comprehensive HTML assessment report that works perfectly in emails
const generateHTMLAssessmentReportContent = (submission, assessment, student) => {
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

  return `
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
  `
}

// Save HTML report to file (optional)
const saveHTMLReport = async (htmlContent, outputPath) => {
  try {
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, htmlContent, "utf8")
    console.log(`✅ HTML report saved: ${outputPath}`)
    return true
  } catch (error) {
    console.error("❌ Error saving HTML report:", error)
    return false
  }
}

// Generate assessment report with HTML method
const generateHTMLAssessmentReport = async (submission, assessment, student, options = {}) => {
  try {
    const { saveToFile = false, outputDir = "uploads/reports" } = options

    console.log("📊 Starting HTML assessment report generation...")
    console.log(`Student: ${student.name}`)
    console.log(`Assessment: ${assessment.title}`)
    console.log(`Questions: ${assessment.questions.length}`)
    console.log(`Answers: ${submission.answers.length}`)

    // Generate HTML content
    const htmlContent = generateHTMLAssessmentReportContent(submission, assessment, student)

    const result = {
      htmlContent,
      filePath: null,
      success: true,
    }

    if (saveToFile) {
      const fileName = `assessment-report-${student.name.replace(/\s+/g, "-")}-${submission._id}-${Date.now()}.html`
      const filePath = path.join(outputDir, fileName)

      const saved = await saveHTMLReport(htmlContent, filePath)
      if (saved) {
        result.filePath = filePath
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error generating HTML assessment report:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  generateHTMLAssessmentReport,
  saveHTMLReport,
}
