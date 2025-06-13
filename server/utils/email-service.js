const nodemailer = require("nodemailer")

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
    console.log("Email service error:", error)
  } else {
    console.log("Email server is ready to send messages")
  }
})

// Email templates
const emailTemplates = {
  // Template for when a teacher creates an assignment
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

  // Template for when a teacher creates an assessment
  assessmentCreated: (studentName, teacherName, assessmentTitle, dueDate, courseName) => {
    return {
      subject: `New Assessment: ${assessmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #4f46e5, #818cf8); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A new assessment has been created for you by ${teacherName}.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #4f46e5;">${assessmentTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString() : "Not specified"}</p>
            </div>
            
            <p>Please log in to your student dashboard to take this assessment.</p>
            <p>Completing assessments can earn you 10-20 points based on your score!</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Assessment</a>
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

  // Template for when a teacher creates a project
  projectCreated: (studentName, teacherName, projectTitle, dueDate, courseName) => {
    return {
      subject: `New Project: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #2563eb, #60a5fa); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #dbeafe; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${studentName},</p>
            <p>A new project has been created for you by ${teacherName}.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">${projectTitle}</h3>
              <p><strong>Course:</strong> ${courseName}</p>
              <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
            </div>
            
            <p>Please log in to your student dashboard to view the project details and requirements.</p>
            <p>Completing projects earns you 30 points!</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Project</a>
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

  // Template for when a student submits an assignment
  assignmentSubmitted: (teacherName, studentName, assignmentTitle, submissionDate) => {
    return {
      subject: `Assignment Submission: ${assignmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #0d9488, #06b6d4); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #e0fdff; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${teacherName},</p>
            <p>${studentName} has submitted an assignment.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #0d9488;">${assignmentTitle}</h3>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Student:</strong> ${studentName}</p>
            </div>
            
            <p>Please log in to your teacher dashboard to review and grade this submission.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Submission</a>
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

  // Template for when a student submits an assessment
  assessmentSubmitted: (teacherName, studentName, assessmentTitle, score, percentage, submissionDate) => {
    return {
      subject: `Assessment Submission: ${assessmentTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #4f46e5, #818cf8); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${teacherName},</p>
            <p>${studentName} has completed an assessment.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #4f46e5;">${assessmentTitle}</h3>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Score:</strong> ${score} (${percentage}%)</p>
            </div>
            
            <p>Please log in to your teacher dashboard to review the assessment results.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Results</a>
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

  // Template for when a student submits a project
  projectSubmitted: (teacherName, studentName, projectTitle, submissionDate) => {
    return {
      subject: `Project Submission: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #2563eb, #60a5fa); padding: 15px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Kidzian Learning Platform</h2>
            <p style="color: #dbeafe; margin: 5px 0 0;">Founded by Rashmi</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${teacherName},</p>
            <p>${studentName} has submitted a project.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">${projectTitle}</h3>
              <p><strong>Submitted on:</strong> ${new Date(submissionDate).toLocaleString()}</p>
              <p><strong>Student:</strong> ${studentName}</p>
            </div>
            
            <p>Please log in to your teacher dashboard to review and grade this project submission.</p>
            
            <div style="margin-top: 30px;">
              <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Project</a>
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

// Email sending functions
// test 
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kidzian Learning Platform" <notifications@kidzian.com>',
      to: to,
      subject: template.subject,
      html: template.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendEmail,
  emailTemplates,
}
