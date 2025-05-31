const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
const User = require("../models/User")
const Teacher = require("../models/Teacher")
const Course = require("../models/Course")
const Batch = require("../models/Batch")
const auth = require("../middleware/auth")

// Get admin profile
router.get("/profile", auth(["admin"]), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password")
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }
    res.json(admin)
  } catch (err) {
    console.error("Error fetching admin profile:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get dashboard stats
router.get("/stats", auth(["admin"]), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments()
    const totalTeachers = await Teacher.countDocuments()
    const totalCourses = await Course.countDocuments()
    const activeBatches = await Batch.countDocuments({
      endDate: { $gte: new Date() },
    })
    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      activeBatches,
    })
  } catch (err) {
    console.error("Error fetching admin stats:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all courses
router.get("/courses", auth(["admin"]), async (req, res) => {
  try {
    const courses = await Course.find().populate("batches")
    res.json(courses)
  } catch (err) {
    console.error("Error fetching courses:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all batches
router.get("/batches", auth(["admin"]), async (req, res) => {
  try {
    const batches = await Batch.find().populate("students", "name email")
    console.log("batches", batches)
    res.json(batches)
  } catch (err) {
    console.error("Error fetching Batches:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a batch
router.put("/batches/:id", auth(["admin"]), async (req, res) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" })
    }
    res.status(200).json(updatedBatch)
  } catch (err) {
    console.error("Error updating batch:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all teachers
router.get("/teachers", auth(["admin"]), async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.json(teachers)
  } catch (err) {
    console.error("Error fetching Teacher:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a batch
router.delete("/batches/:id", auth(["admin"]), async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Batch deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete batch" })
  }
})

// Get recent students
router.get("/recent-students", auth(["admin"]), async (req, res) => {
  try {
    const recentStudents = await User.find().sort({ createdAt: -1 }).limit(10).select("-password")
    res.json(recentStudents)
  } catch (err) {
    console.error("Error fetching recent students:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete a student
router.delete("/students/:id", auth(["admin"]), async (req, res) => {
  try {
    const deletedStudent = await User.findByIdAndDelete(req.params.id)
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" })
    }
    res.status(200).json({ message: "Student deleted successfully" })
  } catch (err) {
    console.error("Error deleting student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/courses/:id", auth(["admin"]), async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" })
    }

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    await Course.findByIdAndDelete(id)
    res.status(200).json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    res.status(500).json({ message: "Server error while deleting course" })
  }
})

router.delete("/teachers/:id", auth(["admin"]), async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" })
    }

    const teacher = await Teacher.findById(id)

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }

    await Teacher.findByIdAndDelete(id)
    res.status(200).json({ message: "Teacher deleted successfully" })
  } catch (err) {
    console.error("Error deleting teacher:", err.message)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new student
router.post("/add-student", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, address, age, phoneNumber, grade } = req.body
    const existingStudent = await User.findOne({ email })
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newStudent = new User({
      name,
      email,
      address,
      age,
      phoneNumber,
      grade,
      password: hashedPassword,
    })
    await newStudent.save()
    res.status(201).json({ message: "Student added successfully", student: newStudent })
  } catch (err) {
    console.error("Error adding student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new teacher
router.post("/add-teacher", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body
    const existingTeacher = await Teacher.findOne({ email })
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newTeacher = new Teacher({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    })
    await newTeacher.save()
    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher })
  } catch (err) {
    console.error("Error adding teacher:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a new course
router.post("/add-course", auth(["admin"]), async (req, res) => {
  try {
    const { title, image, pdf, ageGroup, about, learningOutcomes } = req.body
    const course = new Course({
      title,
      image,
      pdf,
      ageGroup,
      about,
      learningOutcomes,
      batches: [],
    })
    await course.save()
    res.status(201).json({ message: "Course added successfully", course })
  } catch (err) {
    console.error("Error adding course:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new batch
router.post("/add-batch", auth(["admin"]), async (req, res) => {
  try {
    const { name, courseId, teacherId, startDate, endDate, schedule, maxStudents, lectures } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }

    const batch = new Batch({
      name,
      course: courseId,
      courseName: course.title,
      teacher: teacherId,
      startDate,
      endDate,
      schedule,
      maxStudents,
      currentStudents: 0,
      students: [], // Initialize empty students array
      lectures: lectures || [],
    })

    await batch.save()

    course.batches.push(batch._id)
    await course.save()

    res.status(201).json({ message: "Batch created successfully", batch })
  } catch (err) {
    console.error("Error creating batch:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// FIXED: Enroll student in a batch
router.post("/enroll-student", auth(["admin"]), async (req, res) => {
  try {
    const { studentId, batchId } = req.body

    // Validate input
    if (!studentId || !batchId) {
      return res.status(400).json({ message: "Student ID and Batch ID are required" })
    }

    // Find student and batch
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const batch = await Batch.findById(batchId).populate("course")
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" })
    }

    // Check if student is already enrolled in this batch
    const alreadyEnrolled = student.batches.some((enrollment) => enrollment.batch.toString() === batchId)

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Student already enrolled in this batch" })
    }

    // Check if batch is full
    if (batch.currentStudents >= batch.maxStudents) {
      return res.status(400).json({ message: "Batch is full" })
    }

    // Check if student is already in batch's students array
    const studentInBatch = batch.students.includes(studentId)
    if (studentInBatch) {
      return res.status(400).json({ message: "Student already in batch students list" })
    }

    // Create enrollment object for student
    const enrollment = {
      batch: batchId,
      course: batch.course._id,
      startingDate: new Date(),
      completion: 0,
      courseName: batch.courseName,
      totalClasses: batch.lectures.length,
      lecturesCompleted: 0,
      lecturesAttended: 0,
      lecturesUpcoming: batch.lectures.length,
      lectures: batch.lectures.map((lecture) => ({
        name: lecture.name,
        attendance: false,
      })),
    }

    // Update student's batches array
    student.batches.push(enrollment)
    await student.save()

    // Update batch's students array and currentStudents count
    batch.students.push(studentId)
    batch.currentStudents = batch.students.length
    await batch.save()

    console.log(`Student ${student.name} enrolled in batch ${batch.name}`)
    console.log(`Batch now has ${batch.currentStudents} students`)

    res.json({
      message: "Student enrolled successfully",
      batchStudentCount: batch.currentStudents,
      maxStudents: batch.maxStudents,
    })
  } catch (err) {
    console.error("Error enrolling student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// NEW: Get all students (for admin dashboard)
router.get("/students", auth(["admin"]), async (req, res) => {
  try {
    const students = await User.find()
      .select("-password")
      .populate("batches.batch", "name courseName")
      .sort({ createdAt: -1 })
    res.json(students)
  } catch (err) {
    console.error("Error fetching students:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// NEW: Remove student from batch
router.post("/remove-student-from-batch", auth(["admin"]), async (req, res) => {
  try {
    const { studentId, batchId } = req.body

    if (!studentId || !batchId) {
      return res.status(400).json({ message: "Student ID and Batch ID are required" })
    }

    // Find student and batch
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const batch = await Batch.findById(batchId)
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" })
    }

    // Remove from student's batches array
    student.batches = student.batches.filter((enrollment) => enrollment.batch.toString() !== batchId)
    await student.save()

    // Remove from batch's students array
    batch.students = batch.students.filter((id) => id.toString() !== studentId)
    batch.currentStudents = batch.students.length
    await batch.save()

    res.json({
      message: "Student removed from batch successfully",
      batchStudentCount: batch.currentStudents,
    })
  } catch (err) {
    console.error("Error removing student from batch:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
