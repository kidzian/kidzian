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
    res.status(500).json({ message: error });
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





app.get('/api/batches/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;

    // Find the batch by ID and populate the students field
    const batch = await Batch.findById(batchId).populate('students', 'name email'); // Populate student details

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch); // Return the batch details
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Error fetching batch', error: error.message });
  }
});


app.post('/api/batches/:batchId/add-lecture', async (req, res) => {
  const { batchId } = req.params;
  const { title, date } = req.body;

  try {
    console.log("Received Data:", req.body);

    const batch = await Batch.findById(batchId).populate('students');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Create new lecture
    const newLecture = {
      name: title,
      date,
      completed: false,
      attendance: batch.students.map(student => ({
        studentId: student._id,
        attended: false,
      })),
    };

    console.log("New Lecture Data:", newLecture);

    // Add lecture to batch
    batch.lectures.push(newLecture);
    batch.markModified('lectures'); // Force Mongoose to detect changes
    await batch.save();

    // Update each student in the batch
    const updatePromises = batch.students.map(async (student) => {
      const user = await User.findById(student._id);
      if (user) {
        const batchIndex = user.batches.findIndex(b => b.batch.toString() === batchId);
        if (batchIndex !== -1) {
          user.batches[batchIndex].lectures.push({
            name: title,
            attendance: false,
          });
          await user.save();
        }
      }
    });

    await Promise.all(updatePromises);

    res.status(201).json({ 
      message: 'Lecture added successfully and updated in all students.', 
      updatedBatch: batch 
    });
  } catch (error) {
    console.error('Error adding lecture:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    console.log(course)
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

app.get('/api/batches', async (req, res) => {
  try {
    console.log("finding batches...");
    const batches = await Batch.find({ course: req.query.courseId });
    console.log(batches);
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching batches' });
  }
});


app.post('/api/batches', async (req, res) => {
  try {
    const { name, startingDate, courseId } = req.body;

    if (!name || !startingDate || !courseId) {
      return res.status(400).json({ message: "Name, start date, and courseId are required" });
    }

    const batch = new Batch({
      name,
      startingDate: new Date(startingDate),
      course: courseId,
    });

    await batch.save();

    await Course.findByIdAndUpdate(
      courseId,
      { $push: { batches: batch._id } },
      { new: true }
    );

    res.status(201).json(batch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Error creating batch', error: error.message });
  }
});
app.delete('/api/batches/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;

    // Find the batch to get its course reference
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const courseId = batch.course; // Get the course ID from the batch

    // Delete the batch
    await Batch.findByIdAndDelete(batchId);

    // Remove the batch ID from the course's batches array
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { batches: batchId } }, // Remove the batch ID from the batches array
      { new: true }
    );

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error); // Debugging
    res.status(500).json({ message: 'Error deleting batch', error: error.message });
  }
});

app.post('/api/batches/:batchId/add-student', async (req, res) => {
  try {
    console.log("reached here");
    const { name, email, address, phoneNumber, age, grade,password } = req.body;
    const batchId = req.params.batchId;

    // Check if batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      address,
      phoneNumber,
      age,
      grade,
      password,
      batches: [{ batch: batchId, startingDate: batch.startingDate }]
    });

    await newUser.save();

    // Update batch to include this student
    batch.students.push(newUser._id);
    await batch.save();

    res.status(201).json({ message: 'Student added successfully', student: newUser });
  } catch (error) {
    console.error("Error in adding student:", error); // Log for debugging

    let errorMessage = "Server error";
    if (error.name === "ValidationError") {
      errorMessage = "Invalid input data";
    } else if (error.code === 11000) {
      errorMessage = "Duplicate entry detected";
    }

    res.status(500).json({ message: errorMessage, errorDetails: error.message });
  }
});


app.listen(PORT, () => console.log(`Server is now listening on ${PORT}`));
