const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

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

// Import email notification middleware
const {
  notifyAssignmentSubmitted,
  notifyAssessmentSubmitted,
  notifyProjectSubmitted,
} = require("../middleware/email-notifications")

// Ensure upload directory exists
const uploadDir = "uploads/assignments"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) return cb(null, true)
    cb(new Error("Only certain file types are allowed"))
  },
})

// Helper function to track daily login and award points
const trackDailyLogin = async (studentId) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activity = await StudentActivity.findOne({
      student: studentId,
      date: today,
    })

    if (!activity) {
      activity = new StudentActivity({
        student: studentId,
        date: today,
        loginCount: 1,
        pointsEarned: 10, // 10 points for daily login
        activitiesCompleted: [
          {
            type: "login",
            points: 10,
            completedAt: new Date(),
          },
        ],
      })
      await activity.save()

      // Update user's total points
      await User.findByIdAndUpdate(studentId, {
        $inc: { totalPoints: 10 },
      })
    } else if (activity.loginCount === 0) {
      activity.loginCount = 1
      activity.pointsEarned += 10
      activity.activitiesCompleted.push({
        type: "login",
        points: 10,
        completedAt: new Date(),
      })
      await activity.save()

      // Update user's total points
      await User.findByIdAndUpdate(studentId, {
        $inc: { totalPoints: 10 },
      })
    } else {
      activity.loginCount += 1
      await activity.save()
    }

    return activity
  } catch (err) {
    console.error("Error tracking daily login:", err)
  }
}

// Helper function to update total points
const updateTotalPoints = async (studentId) => {
  try {
    const totalPoints = await StudentActivity.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: null, totalPoints: { $sum: "$pointsEarned" } } },
    ])

    const points = totalPoints.length > 0 ? totalPoints[0].totalPoints : 0

    await User.findByIdAndUpdate(studentId, {
      totalPoints: points,
    })

    return points
  } catch (err) {
    console.error("Error updating total points:", err)
    return 0
  }
}

// Student Profile with login tracking
router.get("/profile", auth(["student"]), async (req, res) => {
  try {
    // Track daily login
    await trackDailyLogin(req.user.id)

    const student = await User.findById(req.user.id)
      .select("-password")
      .populate("batches.batch", "name startDate endDate courseName")

    if (!student) return res.status(404).json({ message: "Student not found" })

    // Get updated total points
    const totalPoints = await updateTotalPoints(req.user.id)
    student.totalPoints = totalPoints

    res.json(student)
  } catch (err) {
    console.error("Profile error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Enrollments / Courses
router.get("/enrollments", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate({
      path: "batches.batch",
      populate: { path: "course", select: "title description" },
    })

    if (!student) return res.status(404).json({ message: "Student not found" })

    const enrollments = student.batches
      .filter((enr) => enr.batch !== null)
      .map((enr) => ({
        _id: enr._id,
        batch: enr.batch._id,
        batchName: enr.batch.name,
        course: enr.batch.course?._id,
        courseName: enr.batch.course?.title || enr.batch.courseName,
        startingDate: enr.batch.startDate,
        completion: enr.completion || 0,
        totalClasses: enr.totalClasses || 0,
        lecturesCompleted: enr.lecturesCompleted || 0,
        lecturesAttended: enr.lecturesAttended || 0,
        lecturesUpcoming: enr.lecturesUpcoming || 0,
        lectures: enr.lectures || [],
      }))

    res.json(enrollments)
  } catch (err) {
    console.error("Enrollments error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Assignments
router.get("/assignments", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
    if (!student) return res.status(404).json({ message: "Student not found" })

    const batchIds = student.batches.map((e) => e.batch)
    const assignments = await Assignment.find({ batch: { $in: batchIds } })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })

    res.json(assignments)
  } catch (err) {
    console.error("Assignments error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Assessments
router.get("/assessments", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
    if (!student) return res.status(404).json({ message: "Student not found" })

    const batchIds = student.batches.map((e) => e.batch)
    const assessments = await Assessment.find({ batch: { $in: batchIds } })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })

    res.json(assessments)
  } catch (err) {
    console.error("Assessments error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Projects
router.get("/projects", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
    if (!student) return res.status(404).json({ message: "Student not found" })

    const batchIds = student.batches.map((e) => e.batch)
    const projects = await Project.find({ batch: { $in: batchIds } })
      .populate("course", "title")
      .populate("batch", "name")
      .sort({ createdAt: -1 })

    res.json(projects)
  } catch (err) {
    console.error("Projects error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit Assignment
router.post("/submit-assignment", auth(["student"]), upload.single("file"), async (req, res) => {
  try {
    const { assignmentId, content, notes } = req.body
    const file = req.file

    if (!assignmentId) return res.status(400).json({ message: "Assignment ID required" })

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) return res.status(404).json({ message: "Assignment not found" })

    const student = await User.findById(req.user.id)
    const isEnrolled = student.batches.some((enr) => enr.batch.toString() === assignment.batch.toString())

    if (!isEnrolled) return res.status(403).json({ message: "Not enrolled in this batch" })

    const existing = await Submission.findOne({ assignment: assignmentId, student: req.user.id })
    if (existing) return res.status(400).json({ message: "Already submitted" })

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

    // Send email notification to teacher
    await notifyAssignmentSubmitted(submission)

    // Award points for assignment submission
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activity = await StudentActivity.findOne({
      student: req.user.id,
      date: today,
    })

    if (!activity) {
      activity = new StudentActivity({
        student: req.user.id,
        date: today,
        pointsEarned: 20,
        activitiesCompleted: [
          {
            type: "assignment",
            id: assignmentId,
            points: 20,
            completedAt: new Date(),
          },
        ],
      })
    } else {
      activity.pointsEarned += 20
      activity.activitiesCompleted.push({
        type: "assignment",
        id: assignmentId,
        points: 20,
        completedAt: new Date(),
      })
    }

    await activity.save()

    // Update user's total points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: 20 },
    })

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
      pointsEarned: 20,
    })
  } catch (err) {
    console.error("Submit error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit Assessment
router.post("/submit-assessment", auth(["student"]), async (req, res) => {
  try {
    const { assessmentId, answers, timeSpent } = req.body

    if (!assessmentId || !answers) {
      return res.status(400).json({ message: "Assessment ID and answers are required" })
    }

    const assessment = await Assessment.findById(assessmentId)
    if (!assessment) return res.status(404).json({ message: "Assessment not found" })

    const student = await User.findById(req.user.id)
    const isEnrolled = student.batches.some((enr) => enr.batch.toString() === assessment.batch.toString())

    if (!isEnrolled) return res.status(403).json({ message: "Not enrolled in this batch" })

    const existing = await AssessmentSubmission.findOne({
      assessment: assessmentId,
      student: req.user.id,
    })
    if (existing) return res.status(400).json({ message: "Already submitted" })

    // Calculate score
    let totalScore = 0
    const processedAnswers = answers.map((answer, index) => {
      const question = assessment.questions[index]
      const isCorrect = question && answer.answer === question.correctAnswer
      const pointsEarned = isCorrect ? question.points || 1 : 0
      totalScore += pointsEarned

      return {
        questionIndex: index,
        answer: answer.answer,
        isCorrect,
        pointsEarned,
      }
    })

    const percentage = Math.round((totalScore / assessment.maxMarks) * 100)

    const submission = new AssessmentSubmission({
      assessment: assessmentId,
      student: req.user.id,
      batch: assessment.batch,
      answers: processedAnswers,
      score: totalScore,
      percentage,
      timeSpent: timeSpent || 0,
      isCompleted: true,
      submittedAt: new Date(),
    })

    await submission.save()

    // Send email notification to teacher
    await notifyAssessmentSubmitted(submission)

    // Award points for assessment completion
    const points = Math.max(10, Math.round(percentage / 5)) // 10-20 points based on performance
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activity = await StudentActivity.findOne({
      student: req.user.id,
      date: today,
    })

    if (!activity) {
      activity = new StudentActivity({
        student: req.user.id,
        date: today,
        pointsEarned: points,
        activitiesCompleted: [
          {
            type: "assessment",
            id: assessmentId,
            points,
            completedAt: new Date(),
          },
        ],
      })
    } else {
      activity.pointsEarned += points
      activity.activitiesCompleted.push({
        type: "assessment",
        id: assessmentId,
        points,
        completedAt: new Date(),
      })
    }

    await activity.save()

    // Update user's total points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: points },
    })

    res.status(201).json({
      message: "Assessment submitted successfully",
      submission,
      pointsEarned: points,
      score: totalScore,
      percentage,
    })
  } catch (err) {
    console.error("Assessment submit error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit Project
router.post("/submit-project", auth(["student"]), upload.single("file"), async (req, res) => {
  try {
    const { projectId, title, description, githubUrl, liveUrl, teamMembers } = req.body
    const file = req.file

    if (!projectId || !title || !description) {
      return res.status(400).json({ message: "Project ID, title, and description are required" })
    }

    const project = await Project.findById(projectId)
    if (!project) return res.status(404).json({ message: "Project not found" })

    const student = await User.findById(req.user.id)
    const isEnrolled = student.batches.some((enr) => enr.batch.toString() === project.batch.toString())

    if (!isEnrolled) return res.status(403).json({ message: "Not enrolled in this batch" })

    const existing = await ProjectSubmission.findOne({
      project: projectId,
      student: req.user.id,
    })
    if (existing) return res.status(400).json({ message: "Already submitted" })

    const submission = new ProjectSubmission({
      project: projectId,
      student: req.user.id,
      batch: project.batch,
      title,
      description,
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      filePath: file ? file.path : null,
      fileName: file ? file.originalname : null,
      teamMembers: teamMembers ? teamMembers.split(",").map((m) => m.trim()) : [],
      submittedAt: new Date(),
    })

    await submission.save()

    // Send email notification to teacher
    await notifyProjectSubmitted(submission)

    // Award points for project submission
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let activity = await StudentActivity.findOne({
      student: req.user.id,
      date: today,
    })

    if (!activity) {
      activity = new StudentActivity({
        student: req.user.id,
        date: today,
        pointsEarned: 30,
        activitiesCompleted: [
          {
            type: "project",
            id: projectId,
            points: 30,
            completedAt: new Date(),
          },
        ],
      })
    } else {
      activity.pointsEarned += 30
      activity.activitiesCompleted.push({
        type: "project",
        id: projectId,
        points: 30,
        completedAt: new Date(),
      })
    }

    await activity.save()

    // Update user's total points
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: 30 },
    })

    res.status(201).json({
      message: "Project submitted successfully",
      submission,
      pointsEarned: 30,
    })
  } catch (err) {
    console.error("Project submit error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all submissions
router.get("/submissions", auth(["student"]), async (req, res) => {
  try {
    const [assignments, assessments, projects] = await Promise.all([
      Submission.find({ student: req.user.id })
        .populate("assignment", "title maxMarks")
        .populate("batch", "name")
        .sort({ submittedAt: -1 }),
      AssessmentSubmission.find({ student: req.user.id })
        .populate("assessment", "title maxMarks")
        .populate("batch", "name")
        .sort({ submittedAt: -1 }),
      ProjectSubmission.find({ student: req.user.id })
        .populate("project", "title maxMarks")
        .populate("batch", "name")
        .sort({ submittedAt: -1 }),
    ])

    res.json({
      assignments,
      assessments,
      projects,
    })
  } catch (err) {
    console.error("Submissions error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student analytics
router.get("/analytics", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
    if (!student) return res.status(404).json({ message: "Student not found" })

    const batchIds = student.batches.map((e) => e.batch)

    // Get all data in parallel
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
      Submission.find({ student: req.user.id }),
      AssessmentSubmission.find({ student: req.user.id }),
      ProjectSubmission.find({ student: req.user.id }),
      Attendance.find({
        batch: { $in: batchIds },
        "records.student": req.user.id,
      }),
      StudentActivity.find({ student: req.user.id }).sort({ date: -1 }).limit(30),
    ])

    // Calculate student performance
    const studentAttendance = attendance
      .map((record) => {
        const studentRecord = record.records.find((r) => r.student.toString() === req.user.id)
        return studentRecord ? { ...record.toObject(), status: studentRecord.status } : null
      })
      .filter(Boolean)

    const attendancePercentage =
      studentAttendance.length > 0
        ? Math.round((studentAttendance.filter((r) => r.status === "present").length / studentAttendance.length) * 100)
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

    // Generate monthly data for charts
    const monthlyData = activities
      .slice(0, 30)
      .reverse()
      .map((activity, index) => ({
        day: index + 1,
        date: activity.date.toISOString().split("T")[0],
        pointsEarned: activity.pointsEarned,
        activitiesCompleted: activity.activitiesCompleted.length,
      }))

    // Average student data for comparison (mock data for now)
    const avgData = {
      attendance: 85,
      assessmentScore: 75,
      assignmentCompletion: 80,
      assessmentCompletion: 75,
      projectCompletion: 70,
    }

    res.json({
      student: {
        attendance: attendancePercentage,
        assignmentCompletion,
        assessmentCompletion,
        projectCompletion,
        avgAssessmentScore,
        totalPoints,
        totalActivities: activities.length,
      },
      average: avgData,
      monthlyData,
      totalCounts: {
        assignments: assignments.length,
        assessments: assessments.length,
        projects: projects.length,
        assignmentSubmissions: assignmentSubmissions.length,
        assessmentSubmissions: assessmentSubmissions.length,
        projectSubmissions: projectSubmissions.length,
      },
    })
  } catch (err) {
    console.error("Analytics error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get monthly performance report
router.get("/monthly-report/:month/:year", auth(["student"]), async (req, res) => {
  try {
    const { month, year } = req.params
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const activities = await StudentActivity.find({
      student: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 })

    const monthlyStats = {
      totalDays: activities.length,
      totalPoints: activities.reduce((sum, activity) => sum + activity.pointsEarned, 0),
      totalActivities: activities.reduce((sum, activity) => sum + activity.activitiesCompleted.length, 0),
      averagePointsPerDay:
        activities.length > 0
          ? Math.round(activities.reduce((sum, activity) => sum + activity.pointsEarned, 0) / activities.length)
          : 0,
      activitiesByType: {
        assignment: 0,
        assessment: 0,
        project: 0,
        login: 0,
      },
    }

    activities.forEach((activity) => {
      activity.activitiesCompleted.forEach((completed) => {
        if (monthlyStats.activitiesByType[completed.type] !== undefined) {
          monthlyStats.activitiesByType[completed.type]++
        }
      })
    })

    const dailyData = activities.map((activity) => ({
      date: activity.date.toISOString().split("T")[0],
      pointsEarned: activity.pointsEarned,
      activitiesCompleted: activity.activitiesCompleted.length,
    }))

    res.json({
      month: Number.parseInt(month),
      year: Number.parseInt(year),
      stats: monthlyStats,
      dailyData,
    })
  } catch (err) {
    console.error("Monthly report error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Attendance
router.get("/attendance", auth(["student"]), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
    if (!student) return res.status(404).json({ message: "Student not found" })

    const batchIds = student.batches.map((e) => e.batch)
    const attendanceRecords = await Attendance.find({
      batch: { $in: batchIds },
      "records.student": req.user.id,
    }).sort({ date: -1 })

    const formatted = attendanceRecords
      .map((record) => {
        const studentRecord = record.records.find((r) => r.student.toString() === req.user.id)
        return studentRecord
          ? { _id: record._id, batch: record.batch, date: record.date, status: studentRecord.status }
          : null
      })
      .filter(Boolean)

    res.json(formatted)
  } catch (err) {
    console.error("Attendance error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
