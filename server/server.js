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
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    user: 'bhadula245@gmail.com',
    pass: 'lhys zsur sufh myvp',
  },
});

app.get('/api/batch/:batchId', async (req, res) => {
  const { batchId } = req.params;
  const batchInfo = await Batch.findById(batchId);

  if (batchInfo) {
      res.json(batchInfo);
  } else {
      res.status(404).json({ error: 'Course not found for the given batchId' });
  }
});


app.post('/api/submit-form', async (req, res) => {
  const { name, phone, course, grade,email } = req.body;
  console.log(email);
 
  try {
    // Send email with form details

    const mailOptions1 = {
      from: 'bhadula245@gmail.com', // Sender address
      to: 'bhadula245@gmail.com', // Recipient address (replace with your email)
      subject: 'Demo Booking Request', // Email subject
      text: `Details:
             Name: ${name}
             Phone Number: ${phone}
             Course: ${course}
             Grade: ${grade}, 
             Email: ${email}`,
    };

    const mailOptions2 = {
      from: 'bhadula245@gmail.com', // Sender address
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
      from: 'bhadula245@gmail.com',
      to: 'bhadula245@gmail.com',
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
      // if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  console.log(user)
      // const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
      
      // if(isMatch){
      //   console.log("macthed")
      // }
      
      // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
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


// app.post('/api/batches/:batchId/add-lecture', async (req, res) => {
//   const { batchId } = req.params;
//   const { title, date } = req.body;

//   try {
//     console.log("Received Data:", req.body);

//     const batch = await Batch.findById(batchId).populate('students');

//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Create new lecture
//     const newLecture = {
//       name: title,
//       date,
//       completed: true,
//       attendance: batch.students.map(student => ({
//         studentId: student._id,
//         attended: false,
//       })),
//     };

//     console.log("New Lecture Data:", newLecture);

//     // Add lecture to batch
//     batch.lectures.push(newLecture);
//     batch.markModified('lectures'); // Force Mongoose to detect changes
//     await batch.save();

//     // Update each student in the batch
//     const updatePromises = batch.students.map(async (student) => {
//       const user = await User.findById(student._id);
//       if (user) {
//         const batchIndex = user.batches.findIndex(b => b.batch.toString() === batchId);
//         if (batchIndex !== -1) {
//           user.batches[batchIndex].lectures.push({
//             name: title,
//             attendance: false,
//           });
//           await user.save();
//         }
//       }
//     });

//     await Promise.all(updatePromises);

//     res.status(201).json({ 
//       message: 'Lecture added successfully and updated in all students.', 
//       updatedBatch: batch 
//     });
//   } catch (error) {
//     console.error('Error adding lecture:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

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
          user.batches[batchIndex].lecturesAttended += 1;
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



// app.patch("/api/batches/:batchId/lectures/:lectureId/attendance", async (req, res) => {
//   try {
//     const { batchId, lectureId } = req.params;
//     let { students } = req.body; // Array of { studentId, present }

//     console.log("Updating attendance for batch:", batchId);
//     console.log("Received students data:", students);

//     // ✅ Remove students where "present" is missing
//     students = students.filter(({ present }) => present !== undefined);

//     if (students.length === 0) {
//       return res.status(400).json({ error: "No valid students found in request." });
//     }

//     // ✅ Fetch the batch and find the lecture
//     const batch = await Batch.findById(batchId);
//     if (!batch) return res.status(404).json({ error: "Batch not found" });

//     const lecture = batch.lectures.find((lec) => lec._id.toString() === lectureId);
//     if (!lecture) return res.status(404).json({ error: "Lecture not found" });

//     const lectureName = lecture.name; // Get lecture name

//     // ✅ Update attendance in Batch model
//     students.forEach(({ studentId, present }) => {
//       const studentRecord = lecture.attendance.find(
//         (att) => att.studentId.toString() === studentId
//       );

//       if (studentRecord) {
//         studentRecord.attended = present; // Update attendance status
//       } else {
//         lecture.attendance.push({ studentId, attended: present }); // Add new attendance entry
//       }
//     });

//     await batch.save(); // Save updated batch document

//     // ✅ Update attendance in User model using `batchId` and `lectureId`
//     const bulkOps = students.map(({ studentId, present }) => ({
//       updateOne: {
//         filter: {
//           _id: studentId,
//           "batches.batch": batchId,
//           "batches.lectures.lectureId": lectureId, // Locate correct lecture
//         },
//         update: {
//           $set: {
//             "batches.$[batchFilter].lectures.$[lectureFilter].attendance": present,
//           },
//         },
//         arrayFilters: [
//           { "batchFilter.batch": batchId },
//           { "lectureFilter.lectureId": lectureId }, // Use lectureId instead of lectureName
//         ],
//       },
//     }));

//     if (bulkOps.length > 0) {
//       await User.bulkWrite(bulkOps);
//     }

//     res.json({ message: "Attendance updated successfully!" });

//   } catch (error) {
//     console.error("Error updating attendance:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });




//hyyyyyyyyyyyyyyy
// app.patch("/api/batches/:batchId/lectures/:lectureId/attendance", async (req, res) => {
//   try {
//     const { batchId, lectureId } = req.params;
//     let { students } = req.body; // Array of { studentId, present }

//     console.log("Updating attendance for batch:", batchId);
//     console.log("Received students data:", students);

//     students = students.filter(({ present }) => present !== undefined);

//     if (students.length === 0) {
//       return res.status(400).json({ error: "No valid students found in request." });
//     }

//     // ✅ Fetch the batch and find the lecture
//     const batch = await Batch.findById(batchId);
//     if (!batch) return res.status(404).json({ error: "Batch not found" });

//     const lecture = batch.lectures.find((lec) => lec._id.toString() === lectureId);
//     if (!lecture) return res.status(404).json({ error: "Lecture not found" });

//     const bulkOps = [];
//     const attendedStudentIds = [];

//     students.forEach(({ studentId, present }) => {
//       // ✅ Update attendance in Batch model
//       let studentRecord = lecture.attendance.find(
//         (att) => att.studentId.toString() === studentId
//       );

//       if (studentRecord) {
//         studentRecord.attended = present;
//       } else {
//         lecture.attendance.push({ studentId, attended: present });
//       }

//       // ✅ Update User model attendance
//       bulkOps.push({
//         updateOne: {
//           filter: {
//             _id: studentId,
//             "batches.batch": batchId,
//             "batches.lectures.lectureId": lectureId,
//           },
//           update: {
//             $set: {
//               "batches.$[batchFilter].lectures.$[lectureFilter].attendance": present,
//             },
//             ...(present ? { $inc: { lecturesAttended: 1 } } : {}),
//           },
//           arrayFilters: [
//             { "batchFilter.batch": batchId },
//             { "lectureFilter.lectureId": lectureId },
//           ],
//         },
//       });

//       if (present) {
//         attendedStudentIds.push(studentId);
//       }
//     });

//     await batch.save();
//     if (bulkOps.length > 0) {
//       await User.bulkWrite(bulkOps);
//     }

//     // ✅ Update `lecturesIncoming`
//     batch.lecturesIncoming = batch.totalClasses - batch.lecturesCompleted;
//     await batch.save();

//     res.json({ message: "Attendance updated successfully!" });

//   } catch (error) {
//     console.error("Error updating attendance:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });


// app.patch("/api/batches/:batchId/lectures/:lectureId/attendance", async (req, res) => {
//   try {
//     const { batchId, lectureId } = req.params;
//     let { students } = req.body; // Array of { studentId, present }

//     console.log("Updating attendance for batch:", batchId);
//     console.log("Received students data:", students);

//     if (!Array.isArray(students) || students.length === 0) {
//       return res.status(400).json({ error: "No valid students found in request." });
//     }

//     // ✅ Fetch the batch and find the lecture
//     const batch = await Batch.findById(batchId);
//     if (!batch) return res.status(404).json({ error: "Batch not found" });

//     const lecture = batch.lectures.find((lec) => lec._id.toString() === lectureId);
//     if (!lecture) return res.status(404).json({ error: "Lecture not found" });

//     const bulkOps = [];
//     const updatedStudentIds = [];

//     students.forEach(({ studentId, present }) => {
//       // ✅ Update attendance in Batch model
//       let studentRecord = lecture.attendance.find(
//         (att) => att.studentId.toString() === studentId
//       );

//       if (studentRecord) {
//         studentRecord.attended = present; // ✅ Set attendance in Batch
//       } else {
//         lecture.attendance.push({ studentId, attended: present });
//       }

//       updatedStudentIds.push(studentId);

//       // ✅ Update User model explicitly for both present and absent cases
//       bulkOps.push({
//         updateOne: {
//           filter: {
//             _id: studentId,
//             "batches.batch": batchId,
//             "batches.lectures.lectureId": lectureId,
//           },
//           update: {
//             $set: {
//               "batches.$[batchFilter].lectures.$[lectureFilter].attendance": present,
//             },
//             $inc: { lecturesAttended: present ? 1 : -1 }, // ✅ Increase or decrease count correctly
//           },
//           arrayFilters: [
//             { "batchFilter.batch": batchId },
//             { "lectureFilter.lectureId": lectureId },
//           ],
//         },
//       });
//     });

//     // ✅ Save batch model with updated attendance
//     await batch.save();

//     // ✅ Ensure attendance is updated in the User model
//     if (bulkOps.length > 0) {
//       await User.bulkWrite(bulkOps);
//     }

//     // ✅ Explicitly verify attendance updates for absent students
//     await User.updateMany(
//       {
//         _id: { $in: updatedStudentIds },
//         "batches.batch": batchId,
//         "batches.lectures.lectureId": lectureId,
//       },
//       {
//         $set: { "batches.$[batchFilter].lectures.$[lectureFilter].attendance": false },
//       },
//       {
//         arrayFilters: [
//           { "batchFilter.batch": batchId },
//           { "lectureFilter.lectureId": lectureId },
//         ],
//       }
//     );

//     // ✅ Update `lecturesIncoming`
//     batch.lecturesIncoming = batch.totalClasses - batch.lecturesCompleted;
//     await batch.save();

//     res.json({ message: "Attendance updated successfully!" });

//   } catch (error) {
//     console.error("Error updating attendance:", error);
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });

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


// app.patch("/api/batches/:batchId/add-existing-students", async (req, res) => {
//   const { batchId } = req.params;
//   const { students } = req.body;

//   try {
//     // 1. Find the batch and get course info
//     const batch = await Batch.findById(batchId).populate("course"); // Assuming 'course' is referenced in Batch
//     if (!batch) return res.status(404).json({ error: "Batch not found" });

//      // Get Course ID
//     const courseId = batch.course._id;
  
//     const courseName = batch.course.name; // Get Course Name
//     console.log(courseName)

//     // 2. Add students to the batch in Batch model
//     await Batch.findByIdAndUpdate(batchId, {
//       $addToSet: { students: { $each: students } }, // Prevents duplicates
//     });

//     // 3. Update each user with batch details
//     await User.updateMany(
//       { _id: { $in: students } }, // Find users in students array
//       {
//         $addToSet: {
//           batches: {
//             batch: batchId,
//             startingDate: new Date(), // Can be modified as needed
//             completion: 0,
//             courseName: courseName,
//             totalClasses: batch.totalClasses || 0,
//             lecturesCompleted: 0,
//             lecturesAttended: 0,
//             lecturesUpcoming: batch.totalClasses || 0,
//             lectures: [],
//           },
//         },
//       }
//     );

//     res.json({ message: "Students added to batch and user updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// app.get('/api/students/search', async (req, res) => {
//   const searchTerm = req.query.term;  // Get search term from query params
//   try {
//     const students = await User.find({
//       $or: [
//         { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for name
//         { 'batches.batch.name': { $regex: searchTerm, $options: 'i' } }, // Search in batch names
//         { 'batches.batch.course.name': { $regex: searchTerm, $options: 'i' } }, // Search in course names
//       ]
//     })
//     .exec();

//     console.log("hii")
//     console.log(students)

//     res.json(students); // Return the found students
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error searching students' });
//   }
// });

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

const genAI = new GoogleGenerativeAI("AIzaSyD33BiuxCwLHsD2MypRLPsrRNAWeVYFeTE"); // Replace with your actual API key
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
