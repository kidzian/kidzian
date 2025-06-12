const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Course = require('./models/Course.js'); 
const User = require('./models/User.js'); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const Batch = require('./models/Batch');
const path = require("path")
const emailRoutes = require("./routes/email")


const Teacher = require('./models/Teacher');

const Admin = require("./models/Admin");
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")
const teacherRoutes = require("./routes/teachers")
const studentRoutes = require("./routes/students")
const courseRoutes = require('./routes/Courses.js');

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
    methods: ['GET', 'POST', 'DELETE', 'PUT','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'demokidzians@gmail.com',
    pass: 'enkb fzsn ocpg akud',
  },
});
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/students", studentRoutes)
app.use('/api', courseRoutes);
app.use("/api", emailRoutes)


app.get('/api/batch/:batchId', async (req, res) => {
  const { batchId } = req.params;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(batchId)) {
    return res.status(400).json({ error: 'Invalid batch ID format' });
  }

  try {
    const batchInfo = await Batch.findById(batchId);

    if (batchInfo) {
      res.json(batchInfo);
    } else {
      res.status(404).json({ error: 'Batch not found' });
    }
  } catch (err) {
    console.error('Error fetching batch:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/api/submit-form', async (req, res) => {
  const { name, phone, course, grade,email } = req.body;
  console.log(email);
 
  try {
    // Send email with form details

    const mailOptions1 = {
      from: 'demokidzians@gmail.com', // Sender address
      to: 'demokidzians@gmail.com', // Recipient address (replace with your email)
      subject: 'Demo Booking Request', // Email subject
      text: `Details:
             Name: ${name}
             Phone Number: ${phone}
             Course: ${course}
             Grade: ${grade}, 
             Email: ${email}`,
    };

    const mailOptions2 = {
      from: 'demokidzians@gmail.com', // Sender address
      to: email, // Recipient address (replace with your email)
      subject: 'Your Demo Booking is Confirmed , Kidzian Team Will Contact You Soon', // Email subject
      text: `Dear Parents,

Thank you for booking a demo with Kidzian! We are excited to have your child experience our learning program. Here are the details of your booking:

Student Details:

Name: ${name}
Phone Number: ${phone}
Email: ${email}
Course: ${course}
Grade: ${grade}

Our team will reach out to you shortly to guide you through the next steps. If you have any questions or need support, feel free to contact us at info@kidzians.com.

Looking forward to an amazing learning journey together!

Best Regards,
Kidzian Team
www.kidzians.com


             `,
    };

    await Promise.all([
      transporter.sendMail(mailOptions1),
      transporter.sendMail(mailOptions2),
    ]);

    // Respond to the client
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: error });
  }
});
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const mailOptions = {
      from: 'demokidzians@gmail.com',
      to: 'demokidzians@gmail.com',
      subject: 'New Contact Form Submission',
      text: `New message from:
             Name: ${firstName} ${lastName}
             Email: ${email}
             Phone: ${phone}
             Message: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

// GET endpoint to fetch all courses
app.get('/api/courses', async (req, res) => {
  try {
    console.log("searching courses")
    const courses = await Course.find(); // Fetch all courses from the database
    res.status(200).json(courses); // Return the courses as JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log(email,password);
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    
  console.log(user)
    // Create JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });

    // Send response with the token
    res.status(200).json({
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


app.delete('/batch/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    console.log("deleting",batchId)
    // Check if the batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Remove the batch ID from the related course
    await Course.updateOne(
      { batches: batchId },
      { $pull: { batches: batchId } }
    );

    // Remove the batch ID from all related users
    await User.updateMany(
      { 'batches.batch': batchId },
      { $pull: { batches: { batch: batchId } } }
    );

    // Delete the batch
    await Batch.findByIdAndDelete(batchId);

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//teacher route

// Admin Login Route







app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user)
    res.status(200).json(user); // Return user information
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});






const genAI = new GoogleGenerativeAI("AIzaSyB0d08P3EAm32OtYK8-kN9i1xg8Vw9VRcE"); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the chatbot's context
const CONTEXT = `
You are KidzAI, an AI chatbot for Kidzian, an innovative educational platform designed to inspire and guide young learners in the world of technology. Your primary role is to assist users with inquiries related to Kidzian and its courses.

### 📚 Our Courses:
1. Little Innovators  
2. Junior Innovators  
3. Senior Innovators  
4. Artificial Intelligence & Machine Learning  
5. Web Development  
6. App Development (Junior)  
7. App Development (Senior)  
8. Java Programming  

❗ **Note:** You are not programmed to answer questions outside of this scope. If asked about unrelated topics, respond with:  
*"I'm designed to help with our courses only."*

---  

## **🌟 About Kidzian**  
Founded in 2023 by **Rashmi Raju**, a passionate software engineer and educator with an **M.Tech in Computer Science**, Kidzian was born from a desire to make tech education more **engaging, interactive, and accessible** for young minds.  

The idea sparked from a neighborhood coding workshop, where Rashmi saw the **excitement and potential** in young learners. Since then, Kidzian has grown into a **leading tech school for children aged 7-17**, offering hands-on courses in:  
- **Block-based coding**  
- **Python, Java, JavaScript**  
- **HTML, CSS, and more**  

Our **gamified, interactive learning platform** personalizes learning paths and fosters **creativity, collaboration, and problem-solving skills**.

---  

## **🚀 Our Mission**
✅ **Inspire through creativity**  
✅ **Empower the next generation**  
✅ **Promote diversity & inclusion in tech**  
✅ **Make learning fun and accessible for all**  

Backed by **WSS, Google Level Up Program, and the Cherie Blair Foundation for Women**, we are committed to **continuous innovation** in tech education.

---  

## **📝 Course Curriculums**

### **1. Little Innovators** (Age Group: 7-9)
- Fundamentals of coding  
- Hardware and Software  
- Parts of a computer  
- Introduction to Block-based Coding  
- Concept of Sequencing  
- What are events  
- Coding with events  
- Introduction to Loops & Types of Loops  
- Animation projects  
- Conditionals and how to use them  
- Single-player games/Flappy Bird Game  
- Mini Projects in Code.org  
- Introduction to Scratch  
- Projects using Scratch  
- Math and Science Projects using Scratch  
- Platforms: Code.org, Scratch  
**Awards:** Certificate of Completion from Kidzian Private Limited  

### **2. Junior Innovators** (Age Group: 9-12)
- Fundamentals of App Design  
- Basics of Interactive Apps  
- Implementing conditionals, loops, lists in projects  
- Creating e-commerce, chat apps, yoga app, and more  
- Machine Learning (ML) projects  
- HTML Basics (Lists, Tables, Images, Hyperlinks)  
- Basics of CSS  
- Creating a simple website  
- Platforms: Scratch, Teachable, Thunkable, Replit, and more  
**Awards:** Certificate of Completion from Kidzian Private Limited  

### **3. Senior Innovators** (Age Group: 12-17)
- What is text-based coding and its advantages  
- Introduction to Python  
- Basics, Conditionals, and Loops  
- Introduction to Turtle Graphics  
- Functions and Data Structures in Python  
- GUI and App Development in Python  
- Classes and Inheritance  
- Reading/Writing Files in Python  
- Games and AI/ML in Python  
- 3D Modeling, Arduino, AR & VR Projects  
- Platforms: Replit, TinkerCAD, Teachable, and more  
**Awards:** Certificate of Completion from Kidzian Private Limited  

### **4. Artificial Intelligence & Machine Learning (AIML)**
- Introduction to AI and ML  
- Applications of AI/ML  
- Teachable Machine Platform  
- Data Classification in ML  
- Image, File, and Audio Classification Projects  
- Introduction to Pictoblox  
- AI Projects: Face Recognition, Chatbots, Sensors, Language Translator, Object Recognition, Voice Commands  
- Platforms: Pictoblox, Teachable, and more  
**Awards:** Certificate of Completion from Kidzian Private Limited  

### **5. Web Development** (Age Group: 12-17)
- Introduction to Internet & Web Development  
- HTML Structure (Elements, Tags)  
- CSS Basics & UI/UX Design  
- Advanced HTML Forms & CSS Animations  
- JavaScript Basics  
- Build a Personal Website  
- Platforms: Replit and more  
**Awards:** Web Development Certificate + Scholarship & Trophy for Top 3 Performers  

### **6. Java Programming**
- Java Syntax, Data Types, and Conditionals  
- Loops (For, While, Do-While)  
- Arrays, Strings, Methods & Recursion  
- Object-Oriented Programming (OOP)  
- Constructors, Method Overloading  
- Inheritance, Polymorphism  
- Game and Project Development  
- Platforms: Replit and more  
**Awards:** Java Development Certificate + Scholarship & Trophy for Top 3 Performers  

### **7. App Development (Junior)** (Age Group: 12-17)
- Introduction to App Development  
- Coding Concepts with Code.org  
- Loops & Conditional Statements  
- UI Design & Planning Apps  
- Creating Clicker Apps, Image Gallery, Quiz Apps  
- Real-Time Apps and Game Development  
- Platforms: Code.org, Thunkable, and more  
**Awards:** App Development Certificate + Scholarship & Trophy for Top 3 Performers  

---  

## **📞 Contact Information**
- **Website:** [Kidzian](https://www.linkedin.com/company/kidzian/?originalSubdomain=in)  
- **Email:** info@kidzians.com  
- **Phone:** 9599860105  

---  

Join us at **Kidzian**, where learning technology is an exciting adventure! 🎯`



app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `${CONTEXT}\nUser: ${message}\nBot:`;

    const result = await model.generateContent(prompt);
    const botReply = await result.response.text(); // Extracts response text

    console.log(botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
});

app.listen(PORT, () => console.log(`Server is now listening on ${PORT}`));
