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
// TEACHER LOGIN
// app.post("/login/teacher", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) return res.status(404).json({ message: "Teacher not found" });

//     const isPasswordCorrect = await bcrypt.compare(password, teacher.password);
//     if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: teacher._id, email: teacher.email, role: "teacher" },
//       SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({ token, user: teacher });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // STUDENT LOGIN
// app.post("/login/student", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const student = await User.findOne({ email });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     const isPasswordCorrect = await bcrypt.compare(password, student.password);
//     if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: student._id, email: student.email, role: "student" },
//       SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({ token, user: student });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// addeed hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
// issue when backend
// const verifyRole = require("./middleware/verifyRole");

// // ADMIN-ONLY ROUTE EXAMPLE
// app.get("/admin/students", verifyRole("admin"), async (req, res) => {
//   const students = await User.find();
//   res.json(students);
// });

// // TEACHER DASHBOARD: Assigned Students
// app.get("/teacher/students", verifyRole("teacher"), async (req, res) => {
//   const teacherId = req.user.id;
//   const batches = await Batch.find({ teacher: teacherId }).populate("students");
//   const students = batches.flatMap(batch => batch.students);
//   res.json(students);
// });

// // STUDENT DASHBOARD: Enrolled Courses
// app.get("/student/courses", verifyRole("student"), async (req, res) => {
//   const student = await User.findById(req.user.id);
//   res.json(student.batches);
// });


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
app.post("/api/admin/signup", async (req, res) => {
  try {
    const { name, email, password, role, address, age, phoneNumber } = req.body;
  
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      age,
      phoneNumber,
    });
    console.log(admin)
    await admin.save();
    res.status(201).json({ message: "Signup successful", adminId: admin._id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

//teacher route
app.post("/api/teacher/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the teacher exists
    const teacher = await Teacher.findOne({ email });
    console.log(teacher)
    if (!teacher || teacher.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Respond with teacher details
    res.status(200).json({
      message: "Login successful",
      teacherId: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Admin Login Route
app.post("/api/admin/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      adminId: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/:courseName", async (req, res) => {
  try {
    
    const courseName = req.params.courseName;
    console.log(courseName)
    // Find course by title (case-insensitive)
    const course = await Course.findOne({ title: new RegExp(`^${courseName}$`, "i") }).populate("batches");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/batches", async (req, res) => {
  try {
      const { name, startingDate, totalClasses, course } = req.body;

      if (!name || !startingDate || !totalClasses || !course) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Ensure the course exists
      const existingCourse = await Course.findById(course);
      if (!existingCourse) {
          return res.status(404).json({ message: "Course not found" });
      }

      // Create a new batch
      const newBatch = new Batch({
          name,
          startingDate,
          totalClasses,
          course
      });

      await newBatch.save();

      // Update the course to include the new batch
      existingCourse.batches.push(newBatch._id);
      await existingCourse.save();

      res.status(201).json({ message: "Batch created successfully", batch: newBatch });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/courses/:courseId/addBatch", async (req, res) => {
  try {
      const { batchId } = req.body;
      const { courseId } = req.params;

      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }

      if (!course.batches.includes(batchId)) {
          course.batches.push(batchId);
          await course.save();
      }

      res.json(course);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
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

app.get("/api/admin/batches/:batchId", async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId).populate("course") ; // Populate course details
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json(batch);
  } catch (error) {
    console.error("Error fetching batch details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/admin/batches/:batchId/add-student", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { name, address, email, password, age, phoneNumber, grade } = req.body;

    // Check if email already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the batch
    const batch = await Batch.findById(batchId).populate("course");
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    // Create new student
    const newStudent = new User({
      name,
      address,
      email,
      password: hashedPassword,
      age,
      phoneNumber,
      grade,
      batches: [
        {
          batch: batch._id,
          startingDate: batch.startingDate,
          courseName: batch.course?.title || "No Course",
          totalClasses: batch.totalClasses,
          lectures: batch.lectures.map((lecture) => ({
            name: lecture.name,
            attendance: false,
          })),
        },
      ],
    });

    await newStudent.save();

    // Add student to batch
    batch.students.push(newStudent._id);

    // Update attendance in batch lectures
    batch.lectures.forEach((lecture) => {
      lecture.attendance.push({
        studentId: newStudent._id,
        attended: false,
      });
    });

    await batch.save();

    res.status(201).json(batch);
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// app.post("/api/admin/batches/:batchId/add-lecture", async (req, res) => {
//   try {
//       const { batchId } = req.params;
//       const { name, date, completed } = req.body;

//       // Find the batch
//       const batch = await Batch.findById(batchId).populate("students");
//       if (!batch) return res.status(404).json({ message: "Batch not found" });

//       // Create new lecture
//       const newLecture = {
//           name,
//           date,
//           completed,
//           attendance: batch.students.map(student => ({
//               studentId: student._id,
//               attended: false,
//           })),
//       };
//       batch.lectures.push(newLecture);
//       await batch.save();

//       // Update students' lecture records
//       for (const student of batch.students) {
//           const user = await User.findById(student._id);
//           if (user) {
//               const batchIndex = user.batches.findIndex(b => b.batch.toString() === batchId);
//               if (batchIndex !== -1) {
//                   user.batches[batchIndex].lectures.push({ name, attendance: false });
//                   await user.save();
//               }
//           }
//       }

//       res.status(201).json({ message: "Lecture added successfully", batch });
//   } catch (error) {
//       res.status(500).json({ message: "Internal Server Error", error });
//   }
// });


app.post("/api/admin/batches/:batchId/add-lecture", async (req, res) => {
  try {
      const { batchId } = req.params;
      const { name, date, completed } = req.body;

      // Find the batch and populate students
      const batch = await Batch.findById(batchId).populate("students");
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      // Create new lecture
      const newLecture = {
          name,
          date,
          completed,
          attendance: batch.students.map(student => ({
              studentId: student._id,
              attended: false,
          })),
      };
      batch.lectures.push(newLecture);
      await batch.save();

      // Update students' lecture records and lecturesCompleted if completed
      for (const student of batch.students) {
          const user = await User.findById(student._id);
          if (user) {
              const batchIndex = user.batches.findIndex(b => b.batch.toString() === batchId);
              if (batchIndex !== -1) {
                  user.batches[batchIndex].lectures.push({ name, attendance: false });

                  // Increase lecturesCompleted if lecture is marked as completed
                  if (completed) {
                      user.batches[batchIndex].lecturesCompleted += 1;
                  }
                  
                  await user.save();
              }
          }
      }

      res.status(201).json({ message: "Lecture added successfully", batch });
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.post("/batches/:batchId/add-student", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { studentId } = req.body;

    // Find the batch
    const batch = await Batch.findById(batchId).populate("students").populate("course");;
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    // Find the student
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check if student is already in batch
    if (batch.students.some((s) => s._id.toString() === studentId)) {
      return res.status(400).json({ message: "Student already in batch" });
    }

    // Add student to batch
    batch.students.push(studentId);

    // Update attendance records for existing lectures in batch
    batch.lectures.forEach((lecture) => {
      lecture.attendance.push({ studentId, attended: false });
    });

    await batch.save();
    
    // Add batch reference to student's enrolled batches
    student.batches.push({
      batch: batchId,
      startingDate: batch.startingDate,
      courseName: batch.course.title ,
      totalClasses: batch.totalClasses || 0,
      lecturesCompleted: batch.lectures.filter(l => l.completed).length,
      lecturesUpcoming: batch.lectures.filter(l => !l.completed).length,
      lecturesAttended: 0, // Initially 0, will update based on attendance
      lectures: batch.lectures.map(l => ({ name: l.name, attendance: false })),
    });


    await student.save();

    res.status(201).json({ message: "Student added successfully", batch });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
app.post('/api/admin/students/details', async (req, res) => {
  try {
    const { students } = req.body;
    console.log("Received student IDs:", students);

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid student IDs provided." });
    }

    // Convert student IDs to ObjectId (if needed)
    const studentIds = students.map(id => new mongoose.Types.ObjectId(id));

    const studentDetails = await User.find({ _id: { $in: studentIds } })
     ; // Fetch only necessary fields

    res.status(200).json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Server error while fetching student details." });
  }
});

app.delete('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove the student ID from all related batches
    await Batch.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    // Remove the student ID from attendance in all lectures
    await Batch.updateMany(
      { 'lectures.attendance.studentId': studentId },
      { $pull: { 'lectures.$[].attendance': { studentId: studentId } } }
    );

    // Delete the student
    await User.findByIdAndDelete(studentId);

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/api/users",  async (req, res) => {
  try {
    console.log("reached here")
    const users = await User.find({}, "-password"); // Exclude passwords from response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

app.post('/admin/create-user', async (req, res) => {
  try {
    // Extract data from the request body
    const { name, address, email, password, age, phoneNumber, grade, certificates } = req.body;

    // Validate required fields
    if (!name || !address || !email || !password || !age || !phoneNumber || !grade) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      address,
      email,
      password, // Note: In a real application, hash the password before saving
      age,
      phoneNumber,
      grade,
      certificates: certificates || 0, // Default to 0 if not provided
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the created user
    res.status(201).json({ message: 'Student created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }

    // Handle other errors
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/batches/:batchId/add-lecture', async (req, res) => {
  const { batchId } = req.params;
  const { title, date } = req.body;

  try {
    console.log("Received Data:", req.body);

    // Fetch batch and populate the course details
    const batch = await Batch.findById(batchId).populate('course').populate('students');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Get the course title from the populated course field
    const courseTitle = batch.course ? batch.course.title : "Unknown Course";

    // Create a new lecture
    const newLecture = {
      name: title,
      date,
      completed: true,
      attendance: batch.students.map(student => ({
        studentId: student._id,
        attended: false,
      })),
    };

    console.log("New Lecture Data:", newLecture);

    // Add lecture to batch
    batch.lectures.push(newLecture);
    batch.markModified('lectures');
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

          // Ensure the correct course title is stored
          user.batches[batchIndex].courseName = courseTitle;

          // Increase lecturesCompleted
          user.batches[batchIndex].lecturesCompleted += 1;
          
          await user.save();
        }
      }
    });

    await Promise.all(updatePromises);

    res.status(201).json({ 
      message: 'Lecture added successfully and course name updated in all students.', 
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

app.post("/api/admin/updateAttendance", async (req, res) => {
  const { lectureId, batchId, updatedAttendance } = req.body;

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    const lecture = batch.lectures.find((l) => l._id.toString() === lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    for (const att of updatedAttendance) {
      const { studentId, attended } = att;

      // Update Attendance in Batch Model
      const studentAttendance = lecture.attendance.find((a) => a.studentId.toString() === studentId);
      const previouslyAttended = studentAttendance?.attended || false;

      if (studentAttendance) {
        studentAttendance.attended = attended;
      } else {
        lecture.attendance.push({ studentId, attended });
      }

      // Update Attendance in User Model
      const user = await User.findById(studentId);
      if (user) {
        const userBatch = user.batches.find((b) => b.batch.toString() === batchId);
        if (userBatch) {
          const userLecture = userBatch.lectures.find((l) => l.name === lecture.name);
          if (userLecture) {
            userLecture.attendance = attended;
          } else {
            userBatch.lectures.push({ name: lecture.name, attendance: attended });
          }

          // Adjust lecturesAttended count
          if (attended && !previouslyAttended) {
            userBatch.lecturesAttended += 1;
           
          } else if (!attended && previouslyAttended) {
            userBatch.lecturesAttended -= 1;
          }
        }
        await user.save();
      }
    }

    await batch.save();
    res.status(200).json({ message: "Attendance updated successfully!" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Failed to update attendance" });
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
    const { name, startingDate, courseId, totalClasses } = req.body;

    if (!name || !startingDate || !courseId || !totalClasses) {
      return res.status(400).json({ message: "Name, start date, courseId and totalClasses are required" });
    }

    console.log(name,startingDate,courseId,totalClasses)

    const batch = new Batch({
      name,
      startingDate: new Date(startingDate),
      course: courseId, 
      
      totalClasses:totalClasses,
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
    console.log("Reached here");

    const { name, email, address, phoneNumber, age, grade, password, courseName } = req.body;
    const batchId = req.params.batchId;

    // Fetch batch details, including totalClasses
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Fetch totalClasses from batch
    const totalClasses = batch.totalClasses; 

    // Create new user with totalClasses from batch
    const newUser = new User({
      name,
      email,
      address,
      phoneNumber,
      age,
      grade,
      password,
      batches: [{
        batch: batchId,
        startingDate: batch.startingDate,
        courseName,
        totalClasses, // ✅ Automatically set from batch
      }]
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


app.get("/api/batches/:batchId/lectures", async (req, res) => {
  try {
    
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).select("lectures");
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    // Log to check the response
    res.json(batch.lectures || []); // Ensure response is always an array
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/batches/:batchId/lectures/:lectureId", async (req, res) => {
  try {
    const { batchId, lectureId } = req.params;

    // Fetch batch and populate students
    const batch = await Batch.findById(batchId).populate("students");
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    // Find the specific lecture
    const lecture = batch.lectures.find((lec) => lec._id.toString() === lectureId);
    if (!lecture) return res.status(404).json({ error: "Lecture not found" });

    res.json({
      lectureId: lecture._id,
      lectureName: lecture.name,
      students: batch.students.map((student) => {
        const attendanceRecord = lecture.attendance.find(
          (att) => att.studentId.toString() === student._id.toString()
        );
        return {
          _id: student._id,
          name: student.name,
          present: attendanceRecord ? attendanceRecord.attended : false, // Show attendance status
        };
      }),
    });

  } catch (error) {
    console.error("Error fetching students for lecture:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    console.log("getting all users")
    const users = await User.find().populate("batches.batch"); // Populating batch details
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get a single user by ID
app.get("/admin/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
});


app.patch("/api/batches/:batchId/lectures/:lectureId/attendance", async (req, res) => {
  try {
    const { batchId, lectureId } = req.params;
    let { students } = req.body; // Expecting array of { studentId, present }

    console.log("Received students data:", students);

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "No students provided" });
    }

    // ✅ Step 1: Find and Update Attendance in Batch Model
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const lecture = batch.lectures.find((lec) => lec._id.toString() === lectureId);
    if (!lecture) return res.status(404).json({ error: "Lecture not found" });

    students.forEach(({ studentId, present }) => {
      if (present === undefined) return; // Skip if present is missing

      let studentRecord = lecture.attendance.find((att) => att.studentId.toString() === studentId);
      if (studentRecord) {
        studentRecord.attended = present;
      } else {
        lecture.attendance.push({ studentId, attended: present });
      }
    });

    await batch.save(); // ✅ Save batch model

    // ✅ Step 2: Update Attendance in User Model
    const bulkOps = students
      .filter(({ studentId, present }) => present !== undefined) // Ensure present is not undefined
      .map(({ studentId, present }) => ({
        updateOne: {
          filter: {
            _id: studentId,
            "batches.batch": batchId,
            "batches.lectures.lectureId": lectureId,
          },
          update: {
            $set: {
              "batches.$[batchFilter].lectures.$[lectureFilter].attendance": present,
            },
            $inc: { "batches.$[batchFilter].lecturesAttended": present ? 1 : -1 }, // Correctly increment/decrement
          },
          arrayFilters: [
            { "batchFilter.batch": batchId },
            { "lectureFilter.lectureId": lectureId },
          ],
        },
      }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }

    res.json({ message: "Attendance updated successfully!" });

  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



app.post('/teachers', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    
    const newTeacher = new Teacher({ name, email, password, phoneNumber });
    
    await newTeacher.save();
    
    res.status(200).json({ message: 'Teacher added successfully', teacher: newTeacher });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Failed to add teacher' });
  }
});


app.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch teachers' });
  }
});

app.delete('/teachers/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting teacher' });
  }
});
app.get('/teachers/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});


app.delete('/admin/users/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Ensure the studentId is an ObjectId by directly passing the string
    const studentObjectId = mongoose.Types.ObjectId(studentId); // This will convert the string to ObjectId

    // Find and delete the student
    const student = await User.findByIdAndDelete(studentObjectId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Remove the student from all batches they are part of
    await Batch.updateMany(
      { students: studentObjectId },
      [
        {
          $pull: { students: studentObjectId }, // Remove student from the 'students' array in the batch
        },
        {
          $set: {
            lectures: {
              $map: {
                input: '$lectures', 
                as: 'lecture',
                in: {
                  $mergeObjects: [
                    '$$lecture',
                    {
                      attendance: {
                        $filter: {
                          input: '$$lecture.attendance',
                          as: 'attend',
                          cond: { $ne: ['$$attend.studentId', studentObjectId] }, // Remove student from attendance
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ]
    );

    res.status(200).json({ message: 'Student, their batch associations, and lecture attendance deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await User.findById(studentId)
      .populate({
        path: 'batches.batch',
        populate: {
          path: 'course', // Populate the course inside the batch
          select: 'title', // Only fetch the course title
        },
      })
      .populate({
        path: 'batches.batch',
        populate: {
          path: 'lectures.attendance.studentId',
          model: 'User',
        },
      })
      .exec();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Transform response to include courseName without affecting original structure
    const studentData = student.toObject();
    studentData.batches = studentData.batches.map(batch => ({
      ...batch,
      courseName: batch.batch?.course?.title || 'Unknown Course', // Extract course title
    }));

    
    console.log(studentData)
    res.json(studentData); // Send the modified student data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get("/api/students", async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



app.patch("/api/batches/:batchId/add-existing-students", async (req, res) => {
  const { batchId } = req.params;
  const { students } = req.body;

  try {
    // 1. Find the batch and populate course details
    const batch = await Batch.findById(batchId).populate("course"); // Ensure 'course' is referenced
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    // Check if the course is present
    if (!batch.course) return res.status(404).json({ error: "Course not found for this batch" });

    // Get Course ID and Course Name
    const courseId = batch.course._id;
    const courseName = batch.course.title; // Ensure the correct field name

    console.log(`Course Name: ${courseName}, Course ID: ${courseId}`);

    // 2. Add students to the batch in the Batch model
    await Batch.findByIdAndUpdate(batchId, {
      $addToSet: { students: { $each: students } }, // Prevent duplicates
    });

    // 3. Update each user with batch details
    await User.updateMany(
      { _id: { $in: students } },
      {
        $addToSet: {
          batches: {
            batch: batchId,
            startingDate: new Date(), // Adjust as needed
            completion: 0,
            courseName: courseName, // Correctly setting courseName
            totalClasses: batch.totalClasses || 0,
            lecturesCompleted: 0,
            lecturesAttended: 0,
            lecturesUpcoming: batch.totalClasses || 0,
            lectures: [],
          },
        },
      }
    );

    res.json({ message: "Students added to batch and user updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/students/search', async (req, res) => {
  const searchTerm = req.query.term;  // Get search term from query params

  try {
    const students = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for name
      ]
    })
    .populate({
      path: 'batches.batch',  // Populate batch details
      populate: {
        path: 'course',  // Populate course details inside batch
        select: 'title'  // Get only the title of the course
      }
    })
    .exec();

    // Format the response to include course names
    const formattedStudents = students.map(student => ({
      ...student.toObject(),
      batches: student.batches.map(batch => ({
        batchId: batch.batch?._id,
        batchName: batch.batch?.name,
        courseId: batch.batch?.course?._id,
        courseName: batch.batch?.course?.title || 'N/A'  // Get course title
      }))
    }));

    console.log(formattedStudents)
    res.json(formattedStudents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error searching students' });
  }
});

app.put('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;
  const updateData = req.body; // Assume the request body contains the fields to be updated
  console.log(updateData)
  

  try {
    const updatedStudent = await User.findByIdAndUpdate(studentId, updateData, { new: true }).exec();

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

   
   
    res.json(updatedStudent); // Return the updated student details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student' });
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
