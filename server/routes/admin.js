const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcryptjs")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Admin = require("../models/Admin")
const User = require("../models/User")
const Teacher = require("../models/Teacher")
const Course = require("../models/Course")
const Batch = require("../models/Batch")
const auth = require("../middleware/auth")

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads")
const coursesDir = path.join(uploadsDir, "courses")
const imagesDir = path.join(coursesDir, "images")
const pdfsDir = path.join(coursesDir, "pdfs")
;[uploadsDir, coursesDir, imagesDir, pdfsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, imagesDir)
    } else if (file.fieldname === "pdf") {
      cb(null, pdfsDir)
    } else {
      cb(new Error("Invalid field name"), null)
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const name = file.fieldname + "-" + uniqueSuffix + ext
    cb(null, name)
  },
})

// File filter for security
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed for course images"), false)
    }
  } else if (file.fieldname === "pdf") {
    // Accept only PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed for course materials"), false)
    }
  } else {
    cb(new Error("Invalid field name"), false)
  }
}

// Configure multer with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 2, // Maximum 2 files (image + pdf)
  },
  fileFilter: fileFilter,
})

// Helper function to delete files
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath)
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }
}

// Helper function to get file URL
const getFileUrl = (filename, type) => {
  if (!filename) return null
  return `/uploads/courses/${type}s/${filename}`
}

// Get admin profile
router.get("/profile", auth(["admin"]), async (req, res) => {
  try {
    // Assuming admin info is stored in the token or database
    const admin = await Admin.findById(req.user.id).select("-password")
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }
    res.json(admin)
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get dashboard stats
router.get("/stats", auth(["admin"]), async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, activeBatches] = await Promise.all([
      User.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),
      Batch.countDocuments({ endDate: { $gte: new Date() } }),
    ])

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      activeBatches,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all courses
router.get("/courses", auth(["admin"]), async (req, res) => {
  try {
    const courses = await Course.find().populate("batches")
    res.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all batches
router.get("/batches", auth(["admin"]), async (req, res) => {
  try {
    const batches = await Batch.find().populate("students", "name email")
    res.json(batches)
  } catch (err) {
    console.error("Error fetching Batches:", err)
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

// Get all students
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

// Add a new student
router.post("/add-student", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, address, age, phoneNumber, grade } = req.body
    const existingStudent = await User.findOne({ email })
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" })
    }

    const newStudent = new User({
      name,
      email,
      address,
      age,
      phoneNumber,
      grade,
      password,
    })
    await newStudent.save()
    res.status(201).json({ message: "Student added successfully", student: newStudent })
  } catch (err) {
    console.error("Error adding student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a student
router.put("/students/:id", auth(["admin"]), async (req, res) => {
 try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password && updateData.password.trim() !== '') {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      console.log('Password hashed for student update:', id);
    }

    // Update student in database
    const updatedStudent = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Failed to update student' });
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

// Add a new teacher
router.post("/add-teacher", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body
    const existingTeacher = await Teacher.findOne({ email })
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" })
    }

    const newTeacher = new Teacher({
      name,
      email,
      phoneNumber,
      password,
    })
    await newTeacher.save()
    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher })
  } catch (err) {
    console.error("Error adding teacher:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update a teacher
router.put("/teachers/:id", auth(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password && updateData.password.trim() !== '') {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      console.log('Password hashed for teacher update:', id);
    }

    // Update teacher in database
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
    
    res.json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Failed to update teacher' });
  }
})

// Delete teacher
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

// Add new course with file upload
router.post(
  "/add-course",
  auth(["admin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, ageGroup, about, learningOutcomes } = req.body

      // Validate required fields
      if (!title) {
        return res.status(400).json({ message: "Course title is required" })
      }

      // Get uploaded file paths
      const imageFile = req.files?.image?.[0]
      const pdfFile = req.files?.pdf?.[0]

      const courseData = {
        title,
        ageGroup,
        about,
        learningOutcomes,
        image: imageFile ? getFileUrl(imageFile.filename, "image") : null,
        pdf: pdfFile ? getFileUrl(pdfFile.filename, "pdf") : null,
      }

      const course = new Course(courseData)
      await course.save()

      res.status(201).json({ message: "Course created successfully", course })
    } catch (error) {
      console.error("Error creating course:", error)

      // Clean up uploaded files if course creation fails
      if (req.files?.image?.[0]) {
        deleteFile(req.files.image[0].path)
      }
      if (req.files?.pdf?.[0]) {
        deleteFile(req.files.pdf[0].path)
      }

      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update course with file upload
router.put(
  "/courses/:id",
  auth(["admin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, ageGroup, about, learningOutcomes } = req.body
      const courseId = req.params.id

      // Find existing course
      const existingCourse = await Course.findById(courseId)
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" })
      }

      // Get uploaded file paths
      const imageFile = req.files?.image?.[0]
      const pdfFile = req.files?.pdf?.[0]

      const updateData = {
        title,
        ageGroup,
        about,
        learningOutcomes,
      }

      // Handle image update
      if (imageFile) {
        // Delete old image if exists
        if (existingCourse.image) {
          const oldImagePath = path.join(__dirname, "../uploads/courses/images", path.basename(existingCourse.image))
          deleteFile(oldImagePath)
        }
        updateData.image = getFileUrl(imageFile.filename, "image")
      }

      // Handle PDF update
      if (pdfFile) {
        // Delete old PDF if exists
        if (existingCourse.pdf) {
          const oldPdfPath = path.join(__dirname, "../uploads/courses/pdfs", path.basename(existingCourse.pdf))
          deleteFile(oldPdfPath)
        }
        updateData.pdf = getFileUrl(pdfFile.filename, "pdf")
      }

      const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
      res.json({ message: "Course updated successfully", course })
    } catch (error) {
      console.error("Error updating course:", error)

      // Clean up uploaded files if update fails
      if (req.files?.image?.[0]) {
        deleteFile(req.files.image[0].path)
      }
      if (req.files?.pdf?.[0]) {
        deleteFile(req.files.pdf[0].path)
      }

      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete course
router.delete("/courses/:id", auth(["admin"]), async (req, res) => {
  try {
    const courseId = req.params.id
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Delete associated files
    if (course.image) {
      const imagePath = path.join(__dirname, "../uploads/courses/images", path.basename(course.image))
      deleteFile(imagePath)
    }

    if (course.pdf) {
      const pdfPath = path.join(__dirname, "../uploads/courses/pdfs", path.basename(course.pdf))
      deleteFile(pdfPath)
    }

    // Delete course from database
    await Course.findByIdAndDelete(courseId)

    // Update any batches that reference this course
    await Batch.updateMany({ course: courseId }, { $unset: { course: 1 } })

    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
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
      students: [],
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

// Delete a batch
router.delete("/batches/:id", auth(["admin"]), async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Batch deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete batch" })
  }
})

// Enroll student in a batch
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

// Remove student from batch
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

// Serve uploaded files
router.use("/uploads", express.static(path.join(__dirname, "../uploads")))

module.exports = router
