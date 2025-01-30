const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Course = require('./models/Course.js'); 
const User = require('./models/User.js'); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');


require('dotenv').config();
const SECRET_KEY = "your_secret_key";

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhadula245@gmail.com',
    pass: 'lhys zsur sufh myvp',
  },
});


app.post('/api/submit-form', async (req, res) => {
  const { name, phone, course, grade } = req.body;

  try {
    // Send email with form details
    const mailOptions = {
      from: 'bhadula245@gmail.com', // Sender address
      to: 'bhadula245@gmail.com', // Recipient address (replace with your email)
      subject: 'Demo Booking Request', // Email subject
      text: `Details:
             Name: ${name}
             Phone Number: ${phone}
             Course: ${course}
             Grade: ${grade}`, // Email body
    };

    await transporter.sendMail(mailOptions); // Send the email

    // Respond to the client
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Failed to submit form' });
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

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { name, address, email, password, age, phoneNumber, grade } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, address, email, password: hashedPassword, age, phoneNumber, grade });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, SECRET_KEY, { expiresIn: "7d" });

    res.status(200).json({ message: "User registered successfully!", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
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

app.listen(PORT, () => console.log(`Server is now listening on ${PORT}`));
