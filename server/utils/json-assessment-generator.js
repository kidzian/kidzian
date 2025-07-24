const fs = require("fs")
const path = require("path")

// Generate structured JSON assessment data
const generateAssessmentJSON = (submission, assessment, student) => {
  const { answers, score, percentage, timeSpent, submittedAt } = submission
  const { questions, maxMarks, title } = assessment

  // Calculate detailed statistics
  const totalQuestions = questions.length
  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const wrongAnswers = totalQuestions - correctAnswers
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  // Analyze each question
  const questionAnalysis = questions.map((question, index) => {
    const studentAnswer = answers.find((a) => a.questionIndex === index)
    const isCorrect = studentAnswer ? studentAnswer.isCorrect : false
    const studentAnswerText = studentAnswer ? studentAnswer.answer : "No answer provided"
    const pointsEarned = studentAnswer ? studentAnswer.pointsEarned || 0 : 0

    return {
      questionNumber: index + 1,
      question: question.question,
      type: question.type,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      studentAnswer: studentAnswerText,
      isCorrect: isCorrect,
      pointsEarned: pointsEarned,
      maxPoints: question.points || 1,
      explanation: question.explanation || null,
    }
  })

  // Performance analysis
  const performanceLevel =
    correctPercentage >= 80 ? "Excellent" : correctPercentage >= 60 ? "Good" : "Needs Improvement"
  const strengths = []
  const weaknesses = []

  // Analyze performance by question type or topic
  questionAnalysis.forEach((q, index) => {
    if (q.isCorrect) {
      strengths.push(`Question ${q.questionNumber}: ${q.question.substring(0, 50)}...`)
    } else {
      weaknesses.push(`Question ${q.questionNumber}: ${q.question.substring(0, 50)}...`)
    }
  })

  return {
    reportMetadata: {
      generatedAt: new Date().toISOString(),
      reportId: `${submission._id}-${Date.now()}`,
      version: "1.0",
    },
    assessment: {
      id: assessment._id,
      title: title,
      totalQuestions: totalQuestions,
      maxMarks: maxMarks,
      timeLimit: assessment.timeLimit || null,
    },
    student: {
      id: student._id,
      name: student.name,
      email: student.email,
    },
    submission: {
      id: submission._id,
      submittedAt: submittedAt,
      timeSpent: timeSpent,
      totalScore: score,
      percentage: percentage,
    },
    results: {
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      correctPercentage: correctPercentage,
      performanceLevel: performanceLevel,
      averageTimePerQuestion: timeSpent ? Math.round(timeSpent / totalQuestions) : 0,
    },
    questionAnalysis: questionAnalysis,
    insights: {
      strengths: strengths.slice(0, 5), // Top 5 strengths
      weaknesses: weaknesses.slice(0, 5), // Top 5 areas for improvement
      recommendations: generateRecommendations(correctPercentage, questionAnalysis),
    },
  }
}

// Generate personalized recommendations
const generateRecommendations = (percentage, questionAnalysis) => {
  const recommendations = []

  if (percentage < 60) {
    recommendations.push("Consider scheduling a one-on-one review session with the student")
    recommendations.push("Provide additional practice materials for the topics covered")
    recommendations.push("Review the fundamental concepts before moving to advanced topics")
  } else if (percentage < 80) {
    recommendations.push("Focus on the specific questions the student got wrong")
    recommendations.push("Provide targeted practice exercises")
    recommendations.push("Encourage the student to explain their reasoning for incorrect answers")
  } else {
    recommendations.push("Excellent performance! Consider providing more challenging material")
    recommendations.push("The student is ready for advanced topics in this subject")
    recommendations.push("Consider having the student help peers who are struggling")
  }

  // Add specific recommendations based on question types
  const incorrectQuestions = questionAnalysis.filter((q) => !q.isCorrect)
  if (incorrectQuestions.length > 0) {
    recommendations.push(
      `Pay special attention to questions ${incorrectQuestions.map((q) => q.questionNumber).join(", ")}`,
    )
  }

  return recommendations
}

// Save JSON report to file
const saveJSONReport = async (jsonData, outputPath) => {
  try {
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), "utf8")
    console.log(`✅ JSON report saved: ${outputPath}`)
    return true
  } catch (error) {
    console.error("❌ Error saving JSON report:", error)
    return false
  }
}

// Generate comprehensive email template from JSON data
const generateEmailFromJSON = (jsonData) => {
  const { assessment, student, results, questionAnalysis, insights } = jsonData
  const performanceColor =
    results.correctPercentage >= 80 ? "#10b981" : results.correctPercentage >= 60 ? "#f59e0b" : "#ef4444"
  const performanceEmoji = results.correctPercentage >= 80 ? "🎉" : results.correctPercentage >= 60 ? "👍" : "📚"

  return {
    subject: `📊 Assessment Results: ${assessment.title} - ${student.name} (${results.correctPercentage}%)`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assessment Results</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa;">
        
        <div style="max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">📊 Assessment Results</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Kidzian Learning Platform - Founded by Rashmi</p>
          </div>

          <div style="padding: 30px;">
            
            <!-- Performance Summary -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center; border: 1px solid #e2e8f0;">
              <div style="font-size: 20px; color: #1e293b; margin-bottom: 20px; font-weight: 600;">
                ${performanceEmoji} ${student.name} completed the assessment!
              </div>
              <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: inline-block; min-width: 200px;">
                <div style="font-size: 42px; font-weight: bold; color: ${performanceColor}; margin-bottom: 8px;">
                  ${results.correctAnswers}/${results.totalQuestions}
                </div>
                <div style="font-size: 28px; color: ${performanceColor}; font-weight: bold; margin-bottom: 15px;">
                  ${results.correctPercentage}%
                </div>
                <div style="background: ${performanceColor}; color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: bold; display: inline-block;">
                  ${results.performanceLevel}
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0;">
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #10b981;">${results.correctAnswers}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Correct</div>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #ef4444;">${results.wrongAnswers}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Wrong</div>
              </div>
              <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; border: 1px solid #e5e7eb;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #6366f1;">${jsonData.submission.timeSpent || 0}</div>
                <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Minutes</div>
              </div>
            </div>

            <!-- Question Breakdown -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #4f46e5; margin-bottom: 20px; margin-top: 0;">📝 Question Breakdown</h3>
              
              ${questionAnalysis
                .map(
                  (q) => `
                <div style="background: white; margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 4px solid ${q.isCorrect ? "#10b981" : "#ef4444"};">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #1f2937;">Question ${q.questionNumber}</strong>
                    <span style="background: ${q.isCorrect ? "#d1fae5" : "#fef2f2"}; color: ${q.isCorrect ? "#065f46" : "#991b1b"}; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                      ${q.isCorrect ? "✅ Correct" : "❌ Wrong"}
                    </span>
                  </div>
                  <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                    ${q.question.length > 100 ? q.question.substring(0, 100) + "..." : q.question}
                  </div>
                  <div style="font-size: 13px;">
                    <span style="color: #374151;"><strong>Student:</strong> ${q.studentAnswer}</span><br>
                    ${!q.isCorrect ? `<span style="color: #059669;"><strong>Correct:</strong> ${q.correctAnswer}</span>` : ""}
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <!-- Recommendations -->
            ${
              insights.recommendations.length > 0
                ? `
              <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
                <h3 style="color: #0c4a6e; margin-bottom: 15px; margin-top: 0;">💡 Teaching Recommendations</h3>
                <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                  ${insights.recommendations.map((rec) => `<li style="margin-bottom: 8px;">${rec}</li>`).join("")}
                </ul>
              </div>
            `
                : ""
            }

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                📊 View Full Report in Dashboard
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>© 2024 Kidzian Learning Platform - Founded by Rashmi</strong></p>
            <p style="margin: 5px 0;">Generated on ${new Date(jsonData.reportMetadata.generatedAt).toLocaleString()}</p>
          </div>

        </div>
      </body>
      </html>
    `,
    jsonData: jsonData, // Include the raw data for further processing if needed
  }
}

// Main function to generate JSON-based assessment report
const generateJSONAssessmentReport = async (submission, assessment, student, options = {}) => {
  try {
    const { saveToFile = false, outputDir = "uploads/reports" } = options

    console.log("📊 Starting JSON assessment report generation...")
    console.log(`Student: ${student.name}`)
    console.log(`Assessment: ${assessment.title}`)

    // Generate JSON data
    const jsonData = generateAssessmentJSON(submission, assessment, student)

    const result = {
      jsonData,
      emailTemplate: generateEmailFromJSON(jsonData),
      filePath: null,
      success: true,
    }

    if (saveToFile) {
      const fileName = `assessment-report-${student.name.replace(/\s+/g, "-")}-${submission._id}-${Date.now()}.json`
      const filePath = path.join(outputDir, fileName)

      const saved = await saveJSONReport(jsonData, filePath)
      if (saved) {
        result.filePath = filePath
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error generating JSON assessment report:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  generateAssessmentJSON,
  generateEmailFromJSON,
  generateJSONAssessmentReport,
  saveJSONReport,
}
