const express=require('express')
const mongoose =require('mongoose')
const cookieParser=require('cookie-parser')
const cors=require('cors')

const Course=require('./models/Course.js')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("mongodb connected");
}) 
.catch((error)=>console.log(error));

const newCourse = new Course({
    title: 'Java Course',
    image: 'https://kidzian.com/wp-content/uploads/2024/06/coding4-300x174.jpg',
    pdf: 'https://example.com/course.pdf',
    ageGroup: '13-17',
    about: [
        'Introduction to Java',
        'Learn the basic syntax and data types in Java.',
        'Understand and use conditional statements in Java.',
        'Introduction to for, while, and do-while loops.',
        'Introduction to arrays: declaration, initialization, and accessing elements.',
        'Introduction to String class and its methods.',
        'Introduction to methods: declaration, calling, and parameters.',
        'Introduction to recursion and its applications.',
        'Understand the basics of OOP and create classes and objects.',
        'Learn about constructors and method overloading.',
        'Introduction to inheritance: extends keyword and superclass-subclass relationship.',
        'Introduction to polymorphism and method overriding.',
        'Develop Games and projects using learned concepts',
        'Platform - Replit and more',
      ]
      
      
      ,
    learningOutcomes: [
       'Java Development Certificate',
      'Scholarship and Trophy for top 3 performers'
    ]
  });

//   newCourse.save()
//   .then(course => console.log('Course created:', course))
//   .catch(error => console.error('Error creating course:', error));

const app=express()
const PORT=process.env.PORT || 5000

app.use(
    cors({
        origin:process.env.CLIENT_BASE_URL,
        methods: ['GET', 'POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

app.post('/api/submit-form', (req, res) => {
    console.log("request reached here")
    const { name, phone, course, grade } = req.body;
  
    // Validate and process the data
    if (!name || !phone || !course || !grade) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    console.log('Received form data:', { name, phone, course, grade });
  
    // Example response
    return res.status(200).json({ message: 'Form submitted successfully!' });
  });

app.listen(PORT,()=>console.log(`Server is now listening on ${PORT}`))


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
