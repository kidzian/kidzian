const express = require("express")
const router = express.Router()
const Teacher = require("../models/Teacher")
const User = require("../models/User")
const Batch = require("../models/Batch")
const Course = require("../models/Course")
const Assignment = require("../models/Assignment")
const Assessment = require("../models/Assessment")
const Project = require("../models/Project")
const Submission = require("../models/subm")
const AssessmentSubmission = require("../models/AssessmentSubmission")
const ProjectSubmission = require("../models/ProjectSubmission")
const Attendance = require("../models/Attendence")
const StudentActivity = require("../models/StudentActivity")
const auth = require("../middleware/auth")

// Import file cleanup functions
const {
  cleanupAssignmentFiles,
  cleanupAssessmentFiles,
  cleanupProjectFiles,
  cleanupOrphanedFiles,
} = require("../middleware/filecleanup")

// Import email notification middleware
const {
  notifyAssignmentCreated,
  notifyAssessmentCreated,
  notifyProjectCreated,
} = require("../middleware/email-notifications")

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
    const batches = await Batch.find({ teacher: req.user.id }).populate("course")
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
        coursesMap[courseId].batches.push(batch)
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
      .populate("students", "name email")
    res.json(batches)
  } catch (err) {
    console.error("Error fetching batches:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get students assigned to teacher
router.get("/students", auth(["teacher"]), async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.user.id }).populate(
      "students",
      "name email phoneNumber grade createdAt totalPoints",
    )

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
          studentsMap[studentId].batches.push({
            batch: batch._id,
            batchName: batch.name,
            courseName: batch.courseName,
            startingDate: batch.startDate,
            completion: 0,
          })
        })
      }
    })

    const students = Object.values(studentsMap)
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

    if (!title || !course || !batch) {
      return res.status(400).json({ message: "Title, course, and batch are required" })
    }

    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
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
    await assignment.populate("course", "title")
    await assignment.populate("batch", "name")

    // Send email notifications to students
    await notifyAssignmentCreated(assignment)

    res.status(201).json(assignment)
  } catch (err) {
    console.error("Error creating assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Enhanced Delete Assignment Route with File Cleanup
router.delete("/assignments/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const assignment = await Assignment.findOne({ _id: id, teacher: req.user.id })
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or not authorized" })
    }

    console.log(`Cleaning up files for assignment: ${assignment.title}`)

    // Clean up associated files before deleting the assignment
    const cleanupResult = await cleanupAssignmentFiles(id, { Submission })

    // Delete the assignment from database
    await Assignment.findByIdAndDelete(id)

    // Log the cleanup results
    if (cleanupResult.success) {
      console.log(`Successfully deleted assignment and ${cleanupResult.deletedFiles} associated files`)
    } else {
      console.warn(`Assignment deleted but some files could not be removed:`, cleanupResult.errors)
    }

    res.json({
      success: true,
      message: "Assignment deleted successfully",
      filesDeleted: cleanupResult.deletedFiles,
      cleanupErrors: cleanupResult.errors.length > 0 ? cleanupResult.errors : undefined,
    })
  } catch (err) {
    console.error("Error deleting assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get assignment submissions
router.get("/assignments/:id/submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const assignment = await Assignment.findOne({ _id: id, teacher: req.user.id })
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or not authorized" })
    }

    const submissions = await Submission.find({ assignment: id })
      .populate("student", "name email")
      .populate("assignment", "title maxMarks")
      .sort({ submittedAt: -1 })

    res.json({
      assignment,
      submissions,
    })
  } catch (err) {
    console.error("Error fetching assignment submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Grade assignment submission
router.put("/assignments/submissions/:id/grade", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { grade, feedback } = req.body

    const submission = await Submission.findById(id).populate("assignment")
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }

    // Check if teacher owns this assignment
    const assignment = await Assignment.findOne({ _id: submission.assignment._id, teacher: req.user.id })
    if (!assignment) {
      return res.status(403).json({ message: "Not authorized to grade this submission" })
    }

    submission.grade = grade
    submission.feedback = feedback
    submission.gradedAt = new Date()
    submission.gradedBy = req.user.id

    await submission.save()

    res.json({ message: "Submission graded successfully", submission })
  } catch (err) {
    console.error("Error grading submission:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get assessments created by teacher
router.get("/assessments", auth(["teacher"]), async (req, res) => {
  try {
    const assessments = await Assessment.find({ teacher: req.user.id })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })
    res.json(assessments)
  } catch (err) {
    console.error("Error fetching assessments:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new assessment
router.post("/assessments", auth(["teacher"]), async (req, res) => {
  try {
    const { title, description, type, questions, course, batch, dueDate, duration, maxMarks } = req.body

    if (!title || !course || !batch || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title, course, batch, and questions are required" })
    }

    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to create assessment for this batch" })
    }

    const assessment = new Assessment({
      title,
      description,
      type,
      questions,
      course,
      batch,
      teacher: req.user.id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      duration: duration || 60,
      maxMarks: maxMarks || questions.reduce((sum, q) => sum + (q.points || 1), 0),
    })

    await assessment.save()
    await assessment.populate("course", "title")
    await assessment.populate("batch", "name")

    // Send email notifications to students
    await notifyAssessmentCreated(assessment)

    res.status(201).json(assessment)
  } catch (err) {
    console.error("Error creating assessment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Enhanced Delete Assessment Route with File Cleanup
router.delete("/assessments/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const assessment = await Assessment.findOne({ _id: id, teacher: req.user.id })
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found or not authorized" })
    }

    console.log(`Cleaning up files for assessment: ${assessment.title}`)

    // Clean up associated files before deleting the assessment
    const cleanupResult = await cleanupAssessmentFiles(id, { AssessmentSubmission })

    // Delete the assessment from database
    await Assessment.findByIdAndDelete(id)

    // Log the cleanup results
    if (cleanupResult.success) {
      console.log(`Successfully deleted assessment and ${cleanupResult.deletedFiles} associated files`)
    } else {
      console.warn(`Assessment deleted but some files could not be removed:`, cleanupResult.errors)
    }

    res.json({
      success: true,
      message: "Assessment deleted successfully",
      filesDeleted: cleanupResult.deletedFiles,
      cleanupErrors: cleanupResult.errors.length > 0 ? cleanupResult.errors : undefined,
    })
  } catch (err) {
    console.error("Error deleting assessment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get assessment submissions
router.get("/assessments/:id/submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const assessment = await Assessment.findOne({ _id: id, teacher: req.user.id })
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found or not authorized" })
    }

    const submissions = await AssessmentSubmission.find({ assessment: id })
      .populate("student", "name email")
      .populate("assessment", "title maxMarks")
      .sort({ submittedAt: -1 })

    res.json({
      assessment,
      submissions,
    })
  } catch (err) {
    console.error("Error fetching assessment submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get projects created by teacher
router.get("/projects", auth(["teacher"]), async (req, res) => {
  try {
    const projects = await Project.find({ teacher: req.user.id })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    console.error("Error fetching projects:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new project
router.post("/projects", auth(["teacher"]), async (req, res) => {
  try {
    const { title, description, requirements, deliverables, course, batch, dueDate, maxMarks, teamSize } = req.body

    if (!title || !description || !course || !batch || !dueDate) {
      return res.status(400).json({ message: "Title, description, course, batch, and due date are required" })
    }

    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to create project for this batch" })
    }

    const project = new Project({
      title,
      description,
      requirements: requirements || [],
      deliverables: deliverables || [],
      course,
      batch,
      teacher: req.user.id,
      dueDate: new Date(dueDate),
      maxMarks: maxMarks || 100,
      teamSize: teamSize || 1,
    })

    await project.save()
    await project.populate("course", "title")
    await project.populate("batch", "name")

    // Send email notifications to students
    await notifyProjectCreated(project)

    res.status(201).json(project)
  } catch (err) {
    console.error("Error creating project:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Enhanced Delete Project Route with File Cleanup
router.delete("/projects/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({ _id: id, teacher: req.user.id })
    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" })
    }

    console.log(`Cleaning up files for project: ${project.title}`)

    // Clean up associated files before deleting the project
    const cleanupResult = await cleanupProjectFiles(id, { ProjectSubmission })

    // Delete the project from database
    await Project.findByIdAndDelete(id)

    // Log the cleanup results
    if (cleanupResult.success) {
      console.log(`Successfully deleted project and ${cleanupResult.deletedFiles} associated files`)
    } else {
      console.warn(`Project deleted but some files could not be removed:`, cleanupResult.errors)
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
      filesDeleted: cleanupResult.deletedFiles,
      cleanupErrors: cleanupResult.errors.length > 0 ? cleanupResult.errors : undefined,
    })
  } catch (err) {
    console.error("Error deleting project:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get project submissions
router.get("/projects/:id/submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({ _id: id, teacher: req.user.id })
    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" })
    }

    const submissions = await ProjectSubmission.find({ project: id })
      .populate("student", "name email")
      .populate("project", "title maxMarks")
      .sort({ submittedAt: -1 })

    res.json({
      project,
      submissions,
    })
  } catch (err) {
    console.error("Error fetching project submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit attendance for a batch
router.post("/attendance", auth(["teacher"]), async (req, res) => {
  try {
    const { batch, date, records } = req.body

    if (!batch || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: "Batch, date, and records are required" })
    }

    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to mark attendance for this batch" })
    }

    let attendance = await Attendance.findOne({ batch, date: new Date(date) })

    if (attendance) {
      attendance.records = records.map((record) => ({
        student: record.student,
        status: record.status,
      }))
      attendance.markedBy = req.user.id
    } else {
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

    // Award attendance points to present students
    const presentStudents = records.filter((record) => record.status === "present")
    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    for (const record of presentStudents) {
      let activity = await StudentActivity.findOne({
        student: record.student,
        date: attendanceDate,
      })

      if (!activity) {
        activity = new StudentActivity({
          student: record.student,
          date: attendanceDate,
          pointsEarned: 5,
          activitiesCompleted: [
            {
              type: "attendance",
              points: 5,
              completedAt: new Date(),
            },
          ],
        })
      } else {
        // Check if attendance already recorded for this day
        const hasAttendance = activity.activitiesCompleted.some((ac) => ac.type === "attendance")
        if (!hasAttendance) {
          activity.pointsEarned += 5
          activity.activitiesCompleted.push({
            type: "attendance",
            points: 5,
            completedAt: new Date(),
          })
        }
      }

      await activity.save()

      // Update user's total points
      await User.findByIdAndUpdate(record.student, {
        $inc: { totalPoints: 5 },
      })
    }

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

    const batch = await Batch.findOne({ _id: batchId, teacher: req.user.id })
    if (!batch) {
      return res.status(403).json({ message: "Not authorized to view attendance for this batch" })
    }

    const query = { batch: batchId }
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

// Get student report
router.get("/students/:id/report", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query

    // Check if student is in teacher's batches
    const batches = await Batch.find({ teacher: req.user.id, students: id })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view this student's report" })
    }

    const student = await User.findById(id).select("-password")
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const batchIds = batches.map((b) => b._id)

    // Date range for report
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    const end = endDate ? new Date(endDate) : new Date()

    // Get student data
    const [
      assignments,
      assessments,
      projects,
      assignmentSubmissions,
      assessmentSubmissions,
      projectSubmissions,
      attendance,
      activities,
    ] = await Promise.all([
      Assignment.find({ batch: { $in: batchIds } }),
      Assessment.find({ batch: { $in: batchIds } }),
      Project.find({ batch: { $in: batchIds } }),
      Submission.find({ student: id, submittedAt: { $gte: start, $lte: end } }),
      AssessmentSubmission.find({ student: id, submittedAt: { $gte: start, $lte: end } }),
      ProjectSubmission.find({ student: id, submittedAt: { $gte: start, $lte: end } }),
      Attendance.find({
        batch: { $in: batchIds },
        date: { $gte: start, $lte: end },
        "records.student": id,
      }),
      StudentActivity.find({
        student: id,
        date: { $gte: start, $lte: end },
      }).sort({ date: -1 }),
    ])

    // Calculate metrics
    const attendanceRecords = attendance
      .map((record) => {
        const studentRecord = record.records.find((r) => r.student.toString() === id)
        return studentRecord ? { date: record.date, status: studentRecord.status } : null
      })
      .filter(Boolean)

    const attendancePercentage =
      attendanceRecords.length > 0
        ? Math.round((attendanceRecords.filter((r) => r.status === "present").length / attendanceRecords.length) * 100)
        : 0

    const assignmentCompletion =
      assignments.length > 0 ? Math.round((assignmentSubmissions.length / assignments.length) * 100) : 0

    const assessmentCompletion =
      assessments.length > 0 ? Math.round((assessmentSubmissions.length / assessments.length) * 100) : 0

    const projectCompletion = projects.length > 0 ? Math.round((projectSubmissions.length / projects.length) * 100) : 0

    const avgAssessmentScore =
      assessmentSubmissions.length > 0
        ? Math.round(assessmentSubmissions.reduce((sum, sub) => sum + sub.percentage, 0) / assessmentSubmissions.length)
        : 0

    const totalPoints = activities.reduce((sum, activity) => sum + activity.pointsEarned, 0)

    const report = {
      student: {
        name: student.name,
        email: student.email,
        totalPoints: student.totalPoints || 0,
      },
      reportPeriod: {
        startDate: start,
        endDate: end,
      },
      performance: {
        attendance: attendancePercentage,
        assignmentCompletion,
        assessmentCompletion,
        projectCompletion,
        avgAssessmentScore,
        totalPointsEarned: totalPoints,
      },
      submissions: {
        assignments: assignmentSubmissions.length,
        assessments: assessmentSubmissions.length,
        projects: projectSubmissions.length,
      },
      activities: activities.map((activity) => ({
        date: activity.date,
        pointsEarned: activity.pointsEarned,
        activitiesCount: activity.activitiesCompleted.length,
      })),
      batches: batches.map((batch) => ({
        name: batch.name,
        courseName: batch.courseName,
      })),
    }

    res.json(report)
  } catch (err) {
    console.error("Error generating student report:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get teacher analytics/dashboard stats
router.get("/analytics", auth(["teacher"]), async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.user.id })
    const batchIds = batches.map((b) => b._id)

    const [totalAssignments, totalAssessments, totalProjects, totalSubmissions, recentActivities] = await Promise.all([
      Assignment.countDocuments({ teacher: req.user.id }),
      Assessment.countDocuments({ teacher: req.user.id }),
      Project.countDocuments({ teacher: req.user.id }),
      Submission.countDocuments({ batch: { $in: batchIds } }),
      StudentActivity.find({
        student: { $in: batches.flatMap((b) => b.students || []) },
      })
        .sort({ date: -1 })
        .limit(10)
        .populate("student", "name"),
    ])

    res.json({
      totalAssignments,
      totalAssessments,
      totalProjects,
      totalSubmissions,
      totalBatches: batches.length,
      totalStudents: [...new Set(batches.flatMap((b) => b.students || []))].length,
      recentActivities,
    })
  } catch (err) {
    console.error("Error fetching teacher analytics:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Utility route for cleaning up orphaned files (admin/teacher only)
router.post("/cleanup-orphaned-files", auth(["teacher", "admin"]), async (req, res) => {
  try {
    const { deleteOrphaned = false } = req.body

    const cleanupResult = await cleanupOrphanedFiles({
      Submission,
      AssessmentSubmission,
      ProjectSubmission,
    })

    if (!cleanupResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to scan for orphaned files",
        error: cleanupResult.error,
      })
    }

    let deletedCount = 0
    const deletionErrors = []

    // If requested, delete the orphaned files
    if (deleteOrphaned && cleanupResult.orphanedFiles.length > 0) {
      const fs = require("fs").promises
      const path = require("path")
      const uploadsDir = path.join(process.cwd(), "uploads", "assignments")

      for (const file of cleanupResult.orphanedFiles) {
        try {
          const filePath = path.join(uploadsDir, file)
          await fs.unlink(filePath)
          deletedCount++
          console.log(`Deleted orphaned file: ${file}`)
        } catch (error) {
          console.error(`Failed to delete orphaned file ${file}:`, error)
          deletionErrors.push(`Failed to delete: ${file}`)
        }
      }
    }

    res.json({
      success: true,
      message: `Scanned ${cleanupResult.checkedFiles} files`,
      orphanedFiles: cleanupResult.orphanedFiles,
      orphanedCount: cleanupResult.orphanedFiles.length,
      deletedFiles: deletedCount,
      deletionErrors: deletionErrors.length > 0 ? deletionErrors : undefined,
    })
  } catch (error) {
    console.error("Error in cleanup utility:", error)
    res.status(500).json({
      success: false,
      message: "Failed to run cleanup utility",
      error: error.message,
    })
  }
})

module.exports = router
