const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const User = require("../models/User")
const Batch = require("../models/Batch")
const Course = require("../models/Course")
const Assignment = require("../models/Assignment")
const Submission = require("../models/subm")
const Attendance = require("../models/Attendence")
const auth = require("../middleware/auth")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  },
})

// Get student profile
router.get("/profile", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password").populate({
      path: "batches.batch",
      select: "name startDate endDate courseName",
    })

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(student)
  } catch (err) {
    console.error("Error fetching student profile:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student enrollments/courses
// Get student enrollments/courses
router.get("/enrollments", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate({
      path: "batches.batch",
      populate: {
        path: "course",
        select: "title description",
      },
    })

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Filter out enrollments with null batch
    const validEnrollments = student.batches.filter((enrollment) => enrollment.batch !== null)

    const enrollments = validEnrollments.map((enrollment) => ({
      _id: enrollment._id,
      batch: enrollment.batch._id,
      batchName: enrollment.batch.name,
      course: enrollment.batch.course?._id,
      courseName: enrollment.batch.course?.title || enrollment.batch.courseName,
      startingDate: enrollment.batch.startDate,
      completion: enrollment.completion || 0,
      totalClasses: enrollment.totalClasses || 0,
      lecturesCompleted: enrollment.lecturesCompleted || 0,
      lecturesAttended: enrollment.lecturesAttended || 0,
      lecturesUpcoming: enrollment.lecturesUpcoming || 0,
      lectures: enrollment.lectures || [],
    }))

    res.json(enrollments)
  } catch (err) {
    console.error("Error fetching student enrollments:", err)
    res.status(500).json({ message: "Server error" })
  }
})


// Get assignments for student
router.get("/assignments", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Get all batch IDs the student is enrolled in
    const batchIds = student.batches.map((enrollment) => enrollment.batch)

    // Find assignments for these batches
    const assignments = await Assignment.find({
      batch: { $in: batchIds },
    })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })

    res.json(assignments)
  } catch (err) {
    console.error("Error fetching student assignments:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student attendance records
router.get("/attendance", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Get all batch IDs the student is enrolled in
    const batchIds = student.batches.map((enrollment) => enrollment.batch)

    // Find attendance records for these batches where this student is present
    const attendanceRecords = await Attendance.find({
      batch: { $in: batchIds },
      "records.student": req.user.id,
    }).sort({ date: -1 })

    // Format attendance data for frontend
    const formattedAttendance = []

    attendanceRecords.forEach((record) => {
      const studentRecord = record.records.find((r) => r.student.toString() === req.user.id)
      if (studentRecord) {
        formattedAttendance.push({
          _id: record._id,
          batch: record.batch,
          date: record.date,
          status: studentRecord.status,
        })
      }
    })

    res.json(formattedAttendance)
  } catch (err) {
    console.error("Error fetching student attendance:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student submissions
router.get("/submissions", auth(["student"]), async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user.id,
    })
      .populate("assignment", "title maxMarks")
      .populate("batch", "name")
      .sort({ submittedAt: -1 })

    res.json(submissions)
  } catch (err) {
    console.error("Error fetching student submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit assignment
router.post("/submit-assignment", auth(["student"]), upload.single("file"), async (req, res) => {
  try {
    const { assignmentId, content, notes } = req.body
    const file = req.file

    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID is required" })
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    // Check if student is enrolled in the batch for this assignment
    const student = await User.findById(req.user.id)
    const isEnrolled = student.batches.some((enrollment) => enrollment.batch.toString() === assignment.batch.toString())

    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this batch" })
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    })

    if (existingSubmission) {
      return res.status(400).json({ message: "Assignment already submitted" })
    }

    // Create submission
    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      batch: assignment.batch,
      content: content || "",
      notes: notes || "",
      filePath: file ? file.path : null,
      fileName: file ? file.originalname : null,
      submittedAt: new Date(),
    })

    await submission.save()

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    })
  } catch (err) {
    console.error("Error submitting assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get specific assignment details
router.get("/assignment/:assignmentId", auth(["student"]), async (req, res) => {
  try {
    const { assignmentId } = req.params

    const assignment = await Assignment.findById(assignmentId).populate("course", "title").populate("batch", "name")

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    // Check if student is enrolled in the batch
    const student = await User.findById(req.user.id)
    const isEnrolled = student.batches.some(
      (enrollment) => enrollment.batch.toString() === assignment.batch._id.toString(),
    )

    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this batch" })
    }

    // Get submission if exists
    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    })

    res.json({
      assignment,
      submission,
    })
  } catch (err) {
    console.error("Error fetching assignment details:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student course details
router.get("/course/:courseId", auth(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params
    const student = await User.findById(req.user.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Find the batch enrollment for this course
    const batchEnrollment = student.batches.find((enrollment) => enrollment.batch.toString() === courseId)

    if (!batchEnrollment) {
      return res.status(404).json({ message: "Course enrollment not found" })
    }

    // Get course details
    const batch = await Batch.findById(courseId).populate("course")

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" })
    }

    // Combine batch and enrollment data
    const courseData = {
      batchDetails: batch,
      enrollmentDetails: batchEnrollment,
      courseDetails: batch.course,
    }

    res.json(courseData)
  } catch (err) {
    console.error("Error fetching student course details:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update student attendance for a lecture (if needed for manual marking)
router.post("/attendance/:batchId/:lectureIndex", auth(["student"]), async (req, res) => {
  try {
    const { batchId, lectureIndex } = req.params
    const student = await User.findById(req.user.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Find the batch enrollment
    const batchIndex = student.batches.findIndex((enrollment) => enrollment.batch.toString() === batchId)

    if (batchIndex === -1) {
      return res.status(404).json({ message: "Batch enrollment not found" })
    }

    // Update lecture attendance
    if (!student.batches[batchIndex].lectures[lectureIndex]) {
      return res.status(404).json({ message: "Lecture not found" })
    }

    student.batches[batchIndex].lectures[lectureIndex].attendance = true
    student.batches[batchIndex].lecturesAttended += 1

    await student.save()

    res.json({ message: "Attendance marked successfully" })
  } catch (err) {
    console.error("Error updating attendance:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Download assignment file
router.get("/download/:submissionId", auth(["student"]), async (req, res) => {
  try {
    const { submissionId } = req.params

    const submission = await Submission.findOne({
      _id: submissionId,
      student: req.user.id,
    })

    if (!submission || !submission.filePath) {
      return res.status(404).json({ message: "File not found" })
    }

    res.download(submission.filePath, submission.fileName)
  } catch (err) {
    console.error("Error downloading file:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
