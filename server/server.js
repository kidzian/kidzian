const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Course = require('./models/Course.js'); // Import the Course model

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// GET endpoint to fetch all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.status(200).json(courses); // Return the courses as JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

app.listen(PORT, () => console.log(`Server is now listening on ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const nodemailer = require('nodemailer');  // Import nodemailer

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: process.env.CLIENT_BASE_URL,
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],
//     allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//       'Cache-Control',
//       'Expires',
//       'Pragma',
//     ],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// // Create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  // Using Gmail's SMTP service
//   auth: {
//     user: process.env.EMAIL_USER,  // Your email address
//     pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
//   },
// });

// app.post('/api/submit-form', (req, res) => {
//   console.log('request reached here');
//   const { name, phone, course, grade } = req.body;

//   // Validate and process the data
//   if (!name || !phone || !course || !grade) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   console.log('Received form data:', { name, phone, course, grade });

//   // Send an email with the submitted form data
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'bhadula245@gmail.com',
//     subject: 'Query for Kidzian - Demo Booking Request',
//     text: `Hey, \n\nThere is a query for Kidzian regarding booking a demo with the following details:\n\nName: ${name}\nPhone Number: ${phone}\nCourse: ${course}\nGrade: ${grade}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//       return res.status(500).json({ message: 'Failed to send email.' });
//     }
//     console.log('Email sent: ' + info.response);
//     return res.status(200).json({ message: 'Form submitted and email sent successfully!' });
//   });
// });

// app.listen(PORT, () =>
//   console.log(`Server is now listening on ${PORT}`)
// );
