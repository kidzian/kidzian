const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")

// POST /api/send-email
router.post("/send-email", async (req, res) => {
  const { name, phone, email, course, grade } = req.body

  if (!name || !phone || !email || !course || !grade) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"Trial Request" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // your email to receive trial requests
      subject: "New Trial Session Request",
      html: `
        <h2>New Trial Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Grade:</strong> ${grade}</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({ error: "Failed to send email" })
  }
})

module.exports = router
// test changes