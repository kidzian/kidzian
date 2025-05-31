const express = require("express")
const router = express.Router()
const Teacher = require("../models/Teacher")
const User = require("../models/User")
const Batch = require("../models/Batch")
const Course = require("../models/Course")
const Assignment = require("../models/Assignment")
const Attendance = require("../models/Attendence")
const auth = require("../middleware/auth")

// Get teacher profile
router.get("/profile", auth(["teacher"]), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password")

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" })
    }

    res.json(teacher)
  } catch (err) {
    console.error("Error fetching teacher profile:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get teacher's assigned courses
router.get("/courses", auth(["teacher"]), async (req, res) => {
  try {
    // Find batches assigned to this teacher
    const batches = await Batch.find({ teacher: req.user.id }).populate("course")

    // Extract unique courses
    const coursesMap = {}
    batches.forEach((batch) => {
      if (batch.course) {
        const courseId = batch.course._id.toString()
        if (!coursesMap[courseId]) {
          coursesMap[courseId] = {
            ...batch.course.toObject(),
            batches: [],
            upcomingClasses: 0,
          }
        }

        // Add batch to course
        coursesMap[courseId].batches.push(batch)

        // Count upcoming classes (if lectures exist)
        if (batch.lectures && Array.isArray(batch.lectures)) {
          const upcomingLectures = batch.lectures.filter((lecture) => new Date(lecture.date) > new Date()).length
          coursesMap[courseId].upcomingClasses += upcomingLectures
        }
      }
    })

    const courses = Object.values(coursesMap)

    res.json(courses)
  } catch (err) {
    console.error("Error fetching teacher courses:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get batches assigned to the teacher
router.get("/batches", auth(["teacher"]), async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.user.id })
      .populate("course", "title")
      .populate("students", "name email") // Populate students for attendance
    res.json(batches)
  } catch (err) {
    console.error("Error fetching batches:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// FIXED: Get students assigned to teacher
router.get("/students", auth(["teacher"]), async (req, res) => {
  try {
    // Find batches assigned to this teacher
    const batches = await Batch.find({ teacher: req.user.id }).populate(
      "students",
      "name email phoneNumber grade createdAt",
    )

    // Get all unique students from all batches
    const studentsMap = {}

    batches.forEach((batch) => {
      if (batch.students && Array.isArray(batch.students)) {
        batch.students.forEach((student) => {
          const studentId = student._id.toString()

          if (!studentsMap[studentId]) {
            studentsMap[studentId] = {
              ...student.toObject(),
              batches: [],
            }
          }

          // Add batch info to student
          studentsMap[studentId].batches.push({
            batch: batch._id,
            batchName: batch.name,
            courseName: batch.courseName,
            startingDate: batch.startDate,
            completion: 0, // You can calculate this based on attendance/assignments
          })
        })
      }
    })

    const students = Object.values(studentsMap)

    console.log(`Found ${students.length} students for teacher ${req.user.id}`)

    res.json(students)
  } catch (err) {
    console.error("Error fetching teacher students:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get assignments created by teacher
router.get("/assignments", auth(["teacher"]), async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })

    res.json(assignments)
  } catch (err) {
    console.error("Error fetching assignments:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new assignment
router.post("/assignments", auth(["teacher"]), async (req, res) => {
  try {
    const { title, description, dueDate, course, batch, maxMarks } = req.body

    // Validate required fields
    if (!title || !course || !batch) {
      return res.status(400).json({ message: "Title, course, and batch are required" })
    }

    // Verify teacher is assigned to this batch
    const batchDoc = await Batch.findOne({
      _id: batch,
      teacher: req.user.id,
    })

    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to create assignment for this batch" })
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      course,
      batch,
      teacher: req.user.id,
      maxMarks: maxMarks || 100,
    })

    await assignment.save()

    // Populate the assignment before sending response
    await assignment.populate("course", "title")
    await assignment.populate("batch", "name")

    res.status(201).json(assignment)
  } catch (err) {
    console.error("Error creating assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit attendance for a batch
router.post("/attendance", auth(["teacher"]), async (req, res) => {
  try {
    const { batch, date, records } = req.body

    // Validate required fields
    if (!batch || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: "Batch, date, and records are required" })
    }

    // Verify teacher is assigned to this batch
    const batchDoc = await Batch.findOne({
      _id: batch,
      teacher: req.user.id,
    })

    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to mark attendance for this batch" })
    }

    // Check if attendance already exists for this date and batch
    let attendance = await Attendance.findOne({
      batch,
      date: new Date(date),
    })

    if (attendance) {
      // Update existing attendance
      attendance.records = records.map((record) => ({
        student: record.student,
        status: record.status,
      }))
      attendance.markedBy = req.user.id
    } else {
      // Create new attendance record
      attendance = new Attendance({
        batch,
        date: new Date(date),
        records: records.map((record) => ({
          student: record.student,
          status: record.status,
        })),
        markedBy: req.user.id,
      })
    }

    await attendance.save()

    res.json({ message: "Attendance marked successfully", attendance })
  } catch (err) {
    console.error("Error marking attendance:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get attendance for a specific batch and date range
router.get("/attendance/:batchId", auth(["teacher"]), async (req, res) => {
  try {
    const { batchId } = req.params
    const { startDate, endDate } = req.query

    // Verify teacher is assigned to this batch
    const batch = await Batch.findOne({
      _id: batchId,
      teacher: req.user.id,
    })

    if (!batch) {
      return res.status(403).json({ message: "Not authorized to view attendance for this batch" })
    }

    const query = { batch: batchId }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const attendance = await Attendance.find(query).populate("records.student", "name email").sort({ date: -1 })

    res.json(attendance)
  } catch (err) {
    console.error("Error fetching attendance:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete assignment
router.delete("/assignments/:assignmentId", auth(["teacher"]), async (req, res) => {
  try {
    const { assignmentId } = req.params

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: req.user.id,
    })

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or not authorized" })
    }

    await Assignment.findByIdAndDelete(assignmentId)

    res.json({ message: "Assignment deleted successfully" })
  } catch (err) {
    console.error("Error deleting assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update assignment
router.put("/assignments/:assignmentId", auth(["teacher"]), async (req, res) => {
  try {
    const { assignmentId } = req.params
    const { title, description, dueDate, maxMarks } = req.body

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: req.user.id,
    })

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or not authorized" })
    }

    // Update assignment fields
    if (title) assignment.title = title
    if (description !== undefined) assignment.description = description
    if (dueDate) assignment.dueDate = new Date(dueDate)
    if (maxMarks) assignment.maxMarks = maxMarks

    await assignment.save()

    // Populate the assignment before sending response
    await assignment.populate("course", "title")
    await assignment.populate("batch", "name")

    res.json(assignment)
  } catch (err) {
    console.error("Error updating assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
