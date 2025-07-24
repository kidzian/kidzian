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
const TeacherNote = require("../models/TeacherNote")
const StudentCertificate = require("../models/StudentCertificate")
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
  notifyAssignmentUpdated,
  notifyAssessmentUpdated,
  notifyProjectUpdated,
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
    await notifyAssignmentCreated(assignment)
    res.status(201).json(assignment)
  } catch (err) {
    console.error("Error creating assignment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update assignment
router.put("/assignments/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, dueDate, course, batch, maxMarks } = req.body
    if (!title || !course || !batch) {
      return res.status(400).json({ message: "Title, course, and batch are required" })
    }
    const assignment = await Assignment.findOne({ _id: id, teacher: req.user.id })
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found or not authorized" })
    }
    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to assign to this batch" })
    }
    assignment.title = title
    assignment.description = description
    assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate
    assignment.course = course
    assignment.batch = batch
    assignment.maxMarks = maxMarks || assignment.maxMarks
    assignment.updatedAt = new Date()
    await assignment.save()
    await assignment.populate("course", "title")
    await assignment.populate("batch", "name")
    await notifyAssignmentUpdated(assignment)
    res.json({
      message: "Assignment updated successfully",
      assignment,
    })
  } catch (err) {
    console.error("Error updating assignment:", err)
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
    const cleanupResult = await cleanupAssignmentFiles(id, { Submission })
    await Assignment.findByIdAndDelete(id)
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
    await notifyAssessmentCreated(assessment)
    res.status(201).json(assessment)
  } catch (err) {
    console.error("Error creating assessment:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update assessment
router.put("/assessments/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, type, questions, course, batch, dueDate, duration, maxMarks } = req.body
    if (!title || !course || !batch || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title, course, batch, and questions are required" })
    }
    const assessment = await Assessment.findOne({ _id: id, teacher: req.user.id })
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found or not authorized" })
    }
    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to assign to this batch" })
    }
    assessment.title = title
    assessment.description = description
    assessment.type = type
    assessment.questions = questions
    assessment.course = course
    assessment.batch = batch
    assessment.dueDate = dueDate ? new Date(dueDate) : assessment.dueDate
    assessment.duration = duration || assessment.duration
    assessment.maxMarks = maxMarks || questions.reduce((sum, q) => sum + (q.points || 1), 0)
    assessment.updatedAt = new Date()
    await assessment.save()
    await assessment.populate("course", "title")
    await assessment.populate("batch", "name")
    await notifyAssessmentUpdated(assessment)
    res.json({
      message: "Assessment updated successfully",
      assessment,
    })
  } catch (err) {
    console.error("Error updating assessment:", err)
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
    const cleanupResult = await cleanupAssessmentFiles(id, { AssessmentSubmission })
    await Assessment.findByIdAndDelete(id)
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
      .populate("assessment", "title maxMarks questions")
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
    await notifyProjectCreated(project)
    res.status(201).json(project)
  } catch (err) {
    console.error("Error creating project:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update project
router.put("/projects/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, requirements, deliverables, course, batch, dueDate, maxMarks, teamSize } = req.body
    if (!title || !description || !course || !batch || !dueDate) {
      return res.status(400).json({ message: "Title, description, course, batch, and due date are required" })
    }
    const project = await Project.findOne({ _id: id, teacher: req.user.id })
    if (!project) {
      return res.status(404).json({ message: "Project not found or not authorized" })
    }
    const batchDoc = await Batch.findOne({ _id: batch, teacher: req.user.id })
    if (!batchDoc) {
      return res.status(403).json({ message: "Not authorized to assign to this batch" })
    }
    project.title = title
    project.description = description
    project.requirements = requirements || project.requirements
    project.deliverables = deliverables || project.deliverables
    project.course = course
    project.batch = batch
    project.dueDate = new Date(dueDate)
    project.maxMarks = maxMarks || project.maxMarks
    project.teamSize = teamSize || project.teamSize
    project.updatedAt = new Date()
    await project.save()
    await project.populate("course", "title")
    await project.populate("batch", "name")
    await notifyProjectUpdated(project)
    res.json({
      message: "Project updated successfully",
      project,
    })
  } catch (err) {
    console.error("Error updating project:", err)
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
    const cleanupResult = await cleanupProjectFiles(id, { ProjectSubmission })
    await Project.findByIdAndDelete(id)
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

// Get student report with enhanced features
router.get("/students/:id/report", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query
    const batches = await Batch.find({ teacher: req.user.id, students: id })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view this student's report" })
    }
    const student = await User.findById(id).select("-password")
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }
    const batchIds = batches.map((b) => b._id)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    const [
      assignments,
      assessments,
      projects,
      assignmentSubmissions,
      assessmentSubmissions,
      projectSubmissions,
      attendance,
      activities,
      teacherNote,
      certificates,
    ] = await Promise.all([
      Assignment.find({ batch: { $in: batchIds } }),
      Assessment.find({ batch: { $in: batchIds } }),
      Project.find({ batch: { $in: batchIds } }),
      Submission.find({ student: id, submittedAt: { $gte: start, $lte: end } }),
      AssessmentSubmission.find({ student: id, submittedAt: { $gte: start, $lte: end } }).populate(
        "assessment",
        "questions",
      ),
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
      TeacherNote.findOne({ teacher: req.user.id, student: id }),
      StudentCertificate.find({ student: id, teacher: req.user.id }),
    ])
    const attendanceRecords = attendance
      .map((record) => {
        const studentRecord = record.records.find((r) => r.student.toString() === id)
        return studentRecord ? { date: record.date, status: studentRecord.status } : null
      })
      .filter(Boolean)
    const attendanceDays = attendanceRecords.filter((r) => r.status === "present").length
    const assignmentCompletion =
      assignments.length > 0 ? Math.round((assignmentSubmissions.length / assignments.length) * 100) : 0
    const assessmentCompletion =
      assessments.length > 0 ? Math.round((assessmentSubmissions.length / assessments.length) * 100) : 0
    const projectCompletion = projects.length > 0 ? Math.round((projectSubmissions.length / projects.length) * 100) : 0
    let totalScore = 0
    let totalQuestions = 0
    assessmentSubmissions.forEach((submission) => {
      if (submission.assessment && submission.assessment.questions) {
        const questionCount = submission.assessment.questions.length
        const scorePercentage =
          (submission.score / submission.assessment.questions.reduce((sum, q) => sum + (q.points || 1), 0)) * 100
        totalScore += scorePercentage
        totalQuestions += 1
      }
    })
    const avgAssessmentScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0
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
        attendanceDays: attendanceDays,
        totalAttendanceDays: attendanceRecords.length,
        assignmentCompletion,
        assessmentCompletion,
        projectCompletion,
        avgAssessmentScore,
        totalPointsEarned: totalPoints,
        assessmentsCompleted: assessmentSubmissions.length,
        assignmentsSubmitted: assignmentSubmissions.length,
        projectsCompleted: projectSubmissions.length,
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
      teacherNote: teacherNote,
      certificates: certificates,
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

// TEACHER NOTES ROUTES
// Get all teacher notes
router.get("/notes", auth(["teacher"]), async (req, res) => {
  try {
    const notes = await TeacherNote.find({ teacher: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    console.error("Error fetching teacher notes:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new teacher note
router.post("/notes", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId, title, content, rating, suggestions, strengths, areasForImprovement, classesTaken } = req.body
    if (!studentId || !title || !content) {
      return res.status(400).json({ message: "Student ID, title, and content are required" })
    }
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to add notes for this student" })
    }
    const existingNote = await TeacherNote.findOne({
      teacher: req.user.id,
      studentId: studentId,
    })
    if (existingNote) {
      return res.status(400).json({ message: "Note already exists for this student. Use PUT to update." })
    }
    const teacherNote = new TeacherNote({
      teacher: req.user.id,
      student: studentId,
      studentId: studentId,
      title,
      content,
      rating: rating || 5,
      suggestions: suggestions || "",
      strengths: strengths || "",
      areasForImprovement: areasForImprovement || "",
      classesTaken: classesTaken || [],
    })
    await teacherNote.save()
    await teacherNote.populate("student", "name email")
    res.status(201).json(teacherNote)
  } catch (err) {
    console.error("Error creating teacher note:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Update teacher note
router.put("/notes/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, rating, suggestions, strengths, areasForImprovement, classesTaken } = req.body
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }
    const teacherNote = await TeacherNote.findOne({ _id: id, teacher: req.user.id })
    if (!teacherNote) {
      return res.status(404).json({ message: "Teacher note not found or not authorized" })
    }
    teacherNote.title = title
    teacherNote.content = content
    teacherNote.rating = rating || teacherNote.rating
    teacherNote.suggestions = suggestions || teacherNote.suggestions
    teacherNote.strengths = strengths || teacherNote.strengths
    teacherNote.areasForImprovement = areasForImprovement || teacherNote.areasForImprovement
    teacherNote.classesTaken = classesTaken || teacherNote.classesTaken
    teacherNote.updatedAt = new Date()
    await teacherNote.save()
    await teacherNote.populate("student", "name email")
    res.json({
      message: "Teacher note updated successfully",
      teacherNote,
    })
  } catch (err) {
    console.error("Error updating teacher note:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete teacher note
router.delete("/notes/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const teacherNote = await TeacherNote.findOne({ _id: id, teacher: req.user.id })
    if (!teacherNote) {
      return res.status(404).json({ message: "Teacher note not found or not authorized" })
    }
    await TeacherNote.findByIdAndDelete(id)
    res.json({ message: "Teacher note deleted successfully" })
  } catch (err) {
    console.error("Error deleting teacher note:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get teacher note for specific student
router.get("/notes/student/:studentId", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId } = req.params
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view notes for this student" })
    }
    const teacherNote = await TeacherNote.findOne({
      teacher: req.user.id,
      student: studentId,
    }).populate("student", "name email")
    if (!teacherNote) {
      return res.status(404).json({ message: "No note found for this student" })
    }
    res.json(teacherNote)
  } catch (err) {
    console.error("Error fetching teacher note for student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// STUDENT CERTIFICATES ROUTES
// Get all certificates for teacher's students
router.get("/certificates", auth(["teacher"]), async (req, res) => {
  try {
    const certificates = await StudentCertificate.find({ teacher: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 })
    res.json(certificates)
  } catch (err) {
    console.error("Error fetching certificates:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new certificate for student
router.post("/certificates", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId, certificateName, issuedBy, dateIssued, description } = req.body
    if (!studentId || !certificateName) {
      return res.status(400).json({ message: "Student ID and certificate name are required" })
    }
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to issue certificate for this student" })
    }
    const certificate = new StudentCertificate({
      teacher: req.user.id,
      student: studentId,
      certificateName,
      issuedBy: issuedBy || "KIDZIAN",
      dateIssued: dateIssued ? new Date(dateIssued) : new Date(),
      description: description || "",
    })
    await certificate.save()
    await certificate.populate("student", "name email")
    res.status(201).json(certificate)
  } catch (err) {
    console.error("Error creating certificate:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Update certificate
router.put("/certificates/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const { certificateName, issuedBy, dateIssued, description } = req.body
    if (!certificateName) {
      return res.status(400).json({ message: "Certificate name is required" })
    }
    const certificate = await StudentCertificate.findOne({ _id: id, teacher: req.user.id })
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found or not authorized" })
    }
    certificate.certificateName = certificateName
    certificate.issuedBy = issuedBy || certificate.issuedBy
    certificate.dateIssued = dateIssued ? new Date(dateIssued) : certificate.dateIssued
    certificate.description = description || certificate.description
    certificate.updatedAt = new Date()
    await certificate.save()
    await certificate.populate("student", "name email")
    res.json({
      message: "Certificate updated successfully",
      certificate,
    })
  } catch (err) {
    console.error("Error updating certificate:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete certificate
router.delete("/certificates/:id", auth(["teacher"]), async (req, res) => {
  try {
    const { id } = req.params
    const certificate = await StudentCertificate.findOne({ _id: id, teacher: req.user.id })
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found or not authorized" })
    }
    await StudentCertificate.findByIdAndDelete(id)
    res.json({ message: "Certificate deleted successfully" })
  } catch (err) {
    console.error("Error deleting certificate:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get certificates for specific student
router.get("/certificates/student/:studentId", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId } = req.params
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view certificates for this student" })
    }
    const certificates = await StudentCertificate.find({
      teacher: req.user.id,
      student: studentId,
    }).populate("student", "name email")
    res.json(certificates)
  } catch (err) {
    console.error("Error fetching certificates for student:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// DETAILED SUBMISSION ROUTES FOR PDF REPORTS
// Get student's assignment submissions with details
router.get("/students/:studentId/assignment-submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId } = req.params
    const { startDate, endDate } = req.query
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view this student's submissions" })
    }
    const query = { student: studentId }
    if (startDate && endDate) {
      query.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
    const submissions = await Submission.find(query)
      .populate("assignment", "title maxMarks dueDate course batch")
      .populate("assignment.course", "title")
      .populate("assignment.batch", "name")
      .sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (err) {
    console.error("Error fetching student assignment submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student's assessment submissions with details
router.get("/students/:studentId/assessment-submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId } = req.params
    const { startDate, endDate } = req.query
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view this student's submissions" })
    }
    const query = { student: studentId }
    if (startDate && endDate) {
      query.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
    const submissions = await AssessmentSubmission.find(query)
      .populate("assessment", "title type maxMarks questions duration course batch")
      .populate("assessment.course", "title")
      .populate("assessment.batch", "name")
      .sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (err) {
    console.error("Error fetching student assessment submissions:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student's project submissions with details
router.get("/students/:studentId/project-submissions", auth(["teacher"]), async (req, res) => {
  try {
    const { studentId } = req.params
    const { startDate, endDate } = req.query
    const batches = await Batch.find({ teacher: req.user.id, students: studentId })
    if (batches.length === 0) {
      return res.status(403).json({ message: "Not authorized to view this student's submissions" })
    }
    const query = { student: studentId }
    if (startDate && endDate) {
      query.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
    const submissions = await ProjectSubmission.find(query)
      .populate("project", "title maxMarks teamSize dueDate course batch")
      .populate("project.course", "title")
      .populate("project.batch", "name")
      .sort({ submittedAt: -1 })
    res.json(submissions)
  } catch (err) {
    console.error("Error fetching student project submissions:", err)
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
