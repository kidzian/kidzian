"use client"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Download,
  Eye,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Brain,
  Code,
  Award,
  Edit,
  Save,
  X,
  Settings,
  BarChart3,
  Clock,
  GraduationCap,
} from "lucide-react"
import jsPDF from "jspdf"

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [assignments, setAssignments] = useState([])
  const [assessments, setAssessments] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null)
  const [courseLearnings, setCourseLearnings] = useState([])
  const [generatingPDF, setGeneratingPDF] = useState(false)

  // Chart refs for PDF generation
  const performanceChartRef = useRef(null)
  const activityChartRef = useRef(null)
  const pieChartRef = useRef(null)

  // Modal states
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showStudentReportModal, setShowStudentReportModal] = useState(false)
  const [showBatchDetailsModal, setShowBatchDetailsModal] = useState(false)
  const [showCourseManagementModal, setShowCourseManagementModal] = useState(false)

  // Edit states
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [editingAssessment, setEditingAssessment] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [submissions, setSubmissions] = useState([])
  const [studentReport, setStudentReport] = useState(null)

  // Course management states
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseStats, setCourseStats] = useState(null)
  const [courseBatches, setCourseBatches] = useState([])
  const [courseStudents, setCourseStudents] = useState([])

  // Form data states
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
    course: "",
    batch: "",
    maxMarks: 100,
  })

  const [assessmentData, setAssessmentData] = useState({
    title: "",
    description: "",
    type: "quiz",
    course: "",
    batch: "",
    dueDate: "",
    duration: 60,
    maxMarks: 100,
    questions: [],
  })

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    requirements: [],
    deliverables: [],
    course: "",
    batch: "",
    dueDate: "",
    maxMarks: 100,
    teamSize: 1,
  })

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  })

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  // API headers
  const getHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  })

  // Fetch all teacher data
  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        return
      }

      const headers = getHeaders()

      // Fetch teacher data in parallel
      const [profileRes, coursesRes, studentsRes, batchesRes, assignmentsRes, assessmentsRes, projectsRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/api/teachers/profile`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/api/teachers/courses`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/teachers/students`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/teachers/batches`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/teachers/assignments`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/teachers/assessments`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/teachers/projects`, { headers }).catch(() => ({ data: [] })),
        ])

      setTeacher(profileRes.data)
      setCourses(coursesRes.data)
      setStudents(studentsRes.data)
      setBatches(batchesRes.data)
      setAssignments(assignmentsRes.data)
      setAssessments(assessmentsRes.data)
      setProjects(projectsRes.data)
      setError("")
      fetchCourseLearnings()
    } catch (err) {
      setError("Failed to load teacher data")
      console.error("Error fetching teacher data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch course learnings with actual course data
  const fetchCourseLearnings = async () => {
    try {
      const headers = getHeaders()
      const response = await axios.get(`${API_BASE_URL}/api/students/course-learnings`, { headers })
      setCourseLearnings(response.data || [])
    } catch (err) {
      console.error("Error fetching course learnings:", err)
    }
  }

  // FIXED: Manage Course Function with correct filtering logic
  const manageCourse = async (course) => {
    try {
      setSelectedCourse(course)

      // Get batches for this course
      const courseBatchesData = batches.filter((batch) => {
        const batchCourseId = batch.course?._id || batch.course
        const selectedCourseId = course._id
        return batchCourseId === selectedCourseId
      })
      setCourseBatches(courseBatchesData)

      // Get students for this course
      const courseStudentsData = students.filter((student) =>
        student.batches?.some((enrollment) =>
          courseBatchesData.some(
            (batch) => batch._id === enrollment.batch?.toString() || batch._id === enrollment.batch,
          ),
        ),
      )
      setCourseStudents(courseStudentsData)

      // FIXED: Calculate course statistics with proper filtering
      const courseAssignments = assignments.filter((assignment) => {
        const assignmentCourseId = assignment.course?._id || assignment.course
        const selectedCourseId = course._id
        return assignmentCourseId === selectedCourseId
      })

      const courseAssessments = assessments.filter((assessment) => {
        const assessmentCourseId = assessment.course?._id || assessment.course
        const selectedCourseId = course._id
        return assessmentCourseId === selectedCourseId
      })

      const courseProjects = projects.filter((project) => {
        const projectCourseId = project.course?._id || project.course
        const selectedCourseId = course._id
        return projectCourseId === selectedCourseId
      })

      console.log("Course filtering debug:", {
        selectedCourseId: course._id,
        totalAssignments: assignments.length,
        courseAssignments: courseAssignments.length,
        totalAssessments: assessments.length,
        courseAssessments: courseAssessments.length,
        totalProjects: projects.length,
        courseProjects: courseProjects.length,
      })

      setCourseStats({
        totalBatches: courseBatchesData.length,
        totalStudents: courseStudentsData.length,
        totalAssignments: courseAssignments.length,
        totalAssessments: courseAssessments.length,
        totalProjects: courseProjects.length,
        upcomingClasses: course.upcomingClasses || 0,
      })

      setShowCourseManagementModal(true)
    } catch (err) {
      console.error("Error managing course:", err)
      alert("Failed to load course details")
    }
  }

  // FIXED: PDF Report Generation with dynamic student data
  const downloadStudentPDFReport = async (student) => {
    if (!studentReport || !student) return
    try {
      setGeneratingPDF(true)
      // Wait for charts to render properly
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a PDF document
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Colors
      const tealColor = [20, 184, 166]
      const darkTeal = [15, 118, 110]
      const lightTeal = [204, 251, 241]

      // Header with Logo and Branding
      pdf.setFillColor(...tealColor)
      pdf.rect(0, 0, pageWidth, 40, "F")

      // Logo placeholder
      pdf.setFillColor(255, 255, 255)
      pdf.circle(25, 20, 12, "F")
      pdf.setTextColor(20, 184, 166)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("K", 22, 24)

      // Title
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont("helvetica", "bold")
      pdf.text("KIDZIAN LEARNING PLATFORM", 45, 20)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text("Founded by Rashmi", 45, 28)

      // Report Title
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("STUDENT PERFORMANCE REPORT", 20, 55)

      // Teacher Information
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Generated by: ${teacher?.name || "Teacher"}`, 20, 65)
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 120, 65)

      // FIXED: Student Information Section with dynamic data
      pdf.setFillColor(...lightTeal)
      pdf.rect(15, 75, pageWidth - 30, 35, "F")
      pdf.setTextColor(...darkTeal)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("STUDENT INFORMATION", 20, 85)

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(0, 0, 0)
      // Use dynamic student data
      pdf.text(`Name: ${student.name || "N/A"}`, 20, 95)
      pdf.text(`Email: ${student.email || "N/A"}`, 20, 102)
      pdf.text(`Total Points: ${studentReport.performance?.totalPointsEarned || 0}`, 120, 95)
      pdf.text(`Phone: ${student.phone || "Not provided"}`, 120, 102)

      // Performance Summary Section
      let yPos = 125
      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("PERFORMANCE SUMMARY", 20, yPos + 6)

      yPos += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")

      const performanceStats = [
        [
          `Total Points Earned: ${studentReport.performance?.totalPointsEarned || 0}`,
          `Attendance Rate: ${studentReport.performance?.attendance || 0}%`,
        ],
        [
          `Assignments Completed: ${studentReport.submissions?.assignments || 0}`,
          `Assessments Completed: ${studentReport.submissions?.assessments || 0}`,
        ],
        [
          `Projects Completed: ${studentReport.submissions?.projects || 0}`,
          `Avg Assessment Score: ${studentReport.performance?.avgAssessmentScore || 0}%`,
        ],
      ]

      performanceStats.forEach(([left, right]) => {
        pdf.text(left, 20, yPos)
        pdf.text(right, 120, yPos)
        yPos += 7
      })

      // Activities Breakdown
      yPos += 10
      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("ACTIVITIES BREAKDOWN", 20, yPos + 6)

      yPos += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(10)

      const activities = [
        [
          `Assignments: ${studentReport.submissions?.assignments || 0}`,
          `Assessments: ${studentReport.submissions?.assessments || 0}`,
        ],
        [
          `Projects: ${studentReport.submissions?.projects || 0}`,
          `Attendance Days: ${studentReport.performance?.attendanceDays || 0}`,
        ],
      ]

      activities.forEach(([left, right]) => {
        pdf.text(left, 20, yPos)
        pdf.text(right, 120, yPos)
        yPos += 7
      })

      // Course Learnings Section - ENHANCED WITH ACTUAL COURSE DATA
      yPos += 15
      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("WHAT STUDENT HAS LEARNED IN COURSES", 20, yPos + 6)

      yPos += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(10)

      if (courseLearnings.length > 0) {
        courseLearnings.forEach((course) => {
          // Check if we need a new page
          if (yPos > pageHeight - 60) {
            pdf.addPage()
            yPos = 20
          }

          // Course title
          pdf.setFont("helvetica", "bold")
          pdf.text(`${course.title}:`, 20, yPos)
          yPos += 7

          // Age Group
          if (course.ageGroup) {
            pdf.setFont("helvetica", "normal")
            pdf.text(`Age Group: ${course.ageGroup}`, 25, yPos)
            yPos += 5
          }

          // About section
          if (course.about && course.about.length > 0) {
            pdf.setFont("helvetica", "bold")
            pdf.text("About this course:", 25, yPos)
            yPos += 5
            pdf.setFont("helvetica", "normal")
            course.about.forEach((aboutItem) => {
              const lines = pdf.splitTextToSize(`• ${aboutItem}`, pageWidth - 50)
              lines.forEach((line) => {
                if (yPos > pageHeight - 20) {
                  pdf.addPage()
                  yPos = 20
                }
                pdf.text(line, 30, yPos)
                yPos += 5
              })
            })
            yPos += 3
          }

          // Learning outcomes
          if (course.learningOutcomes && course.learningOutcomes.length > 0) {
            pdf.setFont("helvetica", "bold")
            pdf.text("Learning Outcomes:", 25, yPos)
            yPos += 5
            pdf.setFont("helvetica", "normal")
            course.learningOutcomes.forEach((outcome) => {
              const lines = pdf.splitTextToSize(`• ${outcome}`, pageWidth - 50)
              lines.forEach((line) => {
                if (yPos > pageHeight - 20) {
                  pdf.addPage()
                  yPos = 20
                }
                pdf.text(line, 30, yPos)
                yPos += 5
              })
            })
          }

          yPos += 8 // Space between courses
        })
      } else {
        pdf.text("No course learning data available", 20, yPos)
        yPos += 10
      }

      // Batch Enrollments
      yPos += 10
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("BATCH ENROLLMENTS", 20, yPos + 6)

      yPos += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(10)

      if (studentReport.batches?.length > 0) {
        studentReport.batches.forEach((batch) => {
          pdf.text(`• ${batch.name} (${batch.courseName})`, 20, yPos)
          yPos += 7
        })
      } else {
        pdf.text("No batch enrollments found", 20, yPos)
        yPos += 7
      }

      // Recent Activities
      yPos += 10
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      // pdf.text("RECENT ACTIVITIES", 20, yPos + 6)

      // yPos += 15
      // pdf.setTextColor(0, 0, 0)
      // pdf.setFontSize(10)

      // if (studentReport.activities?.length > 0) {
      //   studentReport.activities.slice(0, 10).forEach((activity) => {
      //     if (yPos > pageHeight - 20) {
      //       pdf.addPage()
      //       yPos = 20
      //     }
      //     pdf.text(
      //       `• ${new Date(activity.date).toLocaleDateString()}: ${activity.pointsEarned} points, ${activity.activitiesCount} activities`,
      //       20,
      //       yPos,
      //     )
      //     yPos += 7
      //   })
      // } else {
      //   pdf.text("No recent activities found", 20, yPos)
      // }

      // Footer
      // pdf.setFillColor(...tealColor)
      pdf.rect(0, pageHeight - 20, pageWidth, 20, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.text("© 2024 Kidzian Learning Platform ", 20, pageHeight - 10)
      pdf.text("Empowering Students Through Technology", 20, pageHeight - 5)

      // Save the PDF with dynamic student name
      pdf.save(
        `Kidzian_Student_Report_${student.name?.replace(/\s+/g, "_") || "Unknown_Student"}_${new Date().toISOString().split("T")[0]}.pdf`,
      )
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
    } finally {
      setGeneratingPDF(false)
    }
  }

  // Get students for selected batch
  const getStudentsForBatch = () => {
    if (!selectedBatch) return []
    const filteredStudents = students.filter((student) => {
      if (!student.batches || !Array.isArray(student.batches)) {
        return false
      }
      return student.batches.some((enrollment) => {
        const enrollmentBatchId = enrollment.batch?.toString() || enrollment.batch
        const selectedBatchId = selectedBatch.toString()
        return enrollmentBatchId === selectedBatchId
      })
    })
    return filteredStudents
  }

  // Submit attendance
  const submitAttendance = async () => {
    try {
      if (!selectedBatch) {
        alert("Please select a batch")
        return
      }

      const studentsInBatch = getStudentsForBatch()
      if (studentsInBatch.length === 0) {
        alert("No students found in the selected batch")
        return
      }

      const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
        student: studentId,
        status: status,
        date: attendanceDate,
      }))

      if (attendanceRecords.length === 0) {
        alert("Please mark attendance for at least one student")
        return
      }

      await axios.post(
        `${API_BASE_URL}/api/teachers/attendance`,
        {
          batch: selectedBatch,
          date: attendanceDate,
          records: attendanceRecords,
        },
        {
          headers: getHeaders(),
        },
      )

      setShowAttendanceModal(false)
      setAttendanceData({})
      setSelectedBatch("")
      alert("Attendance submitted successfully!")
    } catch (err) {
      console.error("Error submitting attendance:", err)
      alert("Failed to submit attendance: " + (err.response?.data?.message || err.message))
    }
  }

  // Edit Assignment Functions
  const startEditingAssignment = (assignment) => {
    setEditingAssignment(assignment)
    setAssignmentData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split("T")[0] : "",
      course: assignment.course?._id || assignment.course,
      batch: assignment.batch?._id || assignment.batch,
      maxMarks: assignment.maxMarks,
    })
    setIsEditMode(true)
    setShowAssignmentModal(true)
  }

  const updateAssignment = async () => {
    try {
      if (!assignmentData.title || !assignmentData.course || !assignmentData.batch) {
        alert("Please fill in all required fields")
        return
      }

      await axios.put(`${API_BASE_URL}/api/teachers/assignments/${editingAssignment._id}`, assignmentData, {
        headers: getHeaders(),
      })

      setShowAssignmentModal(false)
      setIsEditMode(false)
      setEditingAssignment(null)
      setAssignmentData({
        title: "",
        description: "",
        dueDate: "",
        course: "",
        batch: "",
        maxMarks: 100,
      })

      // Refresh assignments
      const assignmentsRes = await axios.get(`${API_BASE_URL}/api/teachers/assignments`, { headers: getHeaders() })
      setAssignments(assignmentsRes.data)
      alert("Assignment updated successfully!")
    } catch (err) {
      console.error("Error updating assignment:", err)
      alert("Failed to update assignment: " + (err.response?.data?.message || err.message))
    }
  }

  // Create assignment
  const createAssignment = async () => {
    try {
      if (!assignmentData.title || !assignmentData.course || !assignmentData.batch) {
        alert("Please fill in all required fields")
        return
      }

      await axios.post(`${API_BASE_URL}/api/teachers/assignments`, assignmentData, {
        headers: getHeaders(),
      })

      setShowAssignmentModal(false)
      setAssignmentData({
        title: "",
        description: "",
        dueDate: "",
        course: "",
        batch: "",
        maxMarks: 100,
      })

      // Refresh assignments
      const assignmentsRes = await axios.get(`${API_BASE_URL}/api/teachers/assignments`, { headers: getHeaders() })
      setAssignments(assignmentsRes.data)
      alert("Assignment created successfully!")
    } catch (err) {
      console.error("Error creating assignment:", err)
      alert("Failed to create assignment: " + (err.response?.data?.message || err.message))
    }
  }

  // Edit Assessment Functions
  const startEditingAssessment = (assessment) => {
    setEditingAssessment(assessment)
    setAssessmentData({
      title: assessment.title,
      description: assessment.description,
      type: assessment.type,
      course: assessment.course?._id || assessment.course,
      batch: assessment.batch?._id || assessment.batch,
      dueDate: assessment.dueDate ? new Date(assessment.dueDate).toISOString().split("T")[0] : "",
      duration: assessment.duration,
      maxMarks: assessment.maxMarks,
      questions: assessment.questions || [],
    })
    setIsEditMode(true)
    setShowAssessmentModal(true)
  }

  const updateAssessment = async () => {
    try {
      if (
        !assessmentData.title ||
        !assessmentData.course ||
        !assessmentData.batch ||
        assessmentData.questions.length === 0
      ) {
        alert("Please fill in all required fields and add at least one question")
        return
      }

      await axios.put(`${API_BASE_URL}/api/teachers/assessments/${editingAssessment._id}`, assessmentData, {
        headers: getHeaders(),
      })

      setShowAssessmentModal(false)
      setIsEditMode(false)
      setEditingAssessment(null)
      setAssessmentData({
        title: "",
        description: "",
        type: "quiz",
        course: "",
        batch: "",
        dueDate: "",
        duration: 60,
        maxMarks: 100,
        questions: [],
      })

      // Refresh assessments
      const assessmentsRes = await axios.get(`${API_BASE_URL}/api/teachers/assessments`, { headers: getHeaders() })
      setAssessments(assessmentsRes.data)
      alert("Assessment updated successfully!")
    } catch (err) {
      console.error("Error updating assessment:", err)
      alert("Failed to update assessment: " + (err.response?.data?.message || err.message))
    }
  }

  // Create assessment
  const createAssessment = async () => {
    try {
      if (
        !assessmentData.title ||
        !assessmentData.course ||
        !assessmentData.batch ||
        assessmentData.questions.length === 0
      ) {
        alert("Please fill in all required fields and add at least one question")
        return
      }

      await axios.post(`${API_BASE_URL}/api/teachers/assessments`, assessmentData, {
        headers: getHeaders(),
      })

      setShowAssessmentModal(false)
      setAssessmentData({
        title: "",
        description: "",
        type: "quiz",
        course: "",
        batch: "",
        dueDate: "",
        duration: 60,
        maxMarks: 100,
        questions: [],
      })

      // Refresh assessments
      const assessmentsRes = await axios.get(`${API_BASE_URL}/api/teachers/assessments`, { headers: getHeaders() })
      setAssessments(assessmentsRes.data)
      alert("Assessment created successfully!")
    } catch (err) {
      console.error("Error creating assessment:", err)
      alert("Failed to create assessment: " + (err.response?.data?.message || err.message))
    }
  }

  // Edit Project Functions
  const startEditingProject = (project) => {
    setEditingProject(project)
    setProjectData({
      title: project.title,
      description: project.description,
      requirements: project.requirements || [],
      deliverables: project.deliverables || [],
      course: project.course?._id || project.course,
      batch: project.batch?._id || project.batch,
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split("T")[0] : "",
      maxMarks: project.maxMarks,
      teamSize: project.teamSize,
    })
    setIsEditMode(true)
    setShowProjectModal(true)
  }

  const updateProject = async () => {
    try {
      if (
        !projectData.title ||
        !projectData.description ||
        !projectData.course ||
        !projectData.batch ||
        !projectData.dueDate
      ) {
        alert("Please fill in all required fields")
        return
      }

      await axios.put(`${API_BASE_URL}/api/teachers/projects/${editingProject._id}`, projectData, {
        headers: getHeaders(),
      })

      setShowProjectModal(false)
      setIsEditMode(false)
      setEditingProject(null)
      setProjectData({
        title: "",
        description: "",
        requirements: [],
        deliverables: [],
        course: "",
        batch: "",
        dueDate: "",
        maxMarks: 100,
        teamSize: 1,
      })

      // Refresh projects
      const projectsRes = await axios.get(`${API_BASE_URL}/api/teachers/projects`, { headers: getHeaders() })
      setProjects(projectsRes.data)
      alert("Project updated successfully!")
    } catch (err) {
      console.error("Error updating project:", err)
      alert("Failed to update project: " + (err.response?.data?.message || err.message))
    }
  }

  // Create project
  const createProject = async () => {
    try {
      if (
        !projectData.title ||
        !projectData.description ||
        !projectData.course ||
        !projectData.batch ||
        !projectData.dueDate
      ) {
        alert("Please fill in all required fields")
        return
      }

      await axios.post(`${API_BASE_URL}/api/teachers/projects`, projectData, {
        headers: getHeaders(),
      })

      setShowProjectModal(false)
      setProjectData({
        title: "",
        description: "",
        requirements: [],
        deliverables: [],
        course: "",
        batch: "",
        dueDate: "",
        maxMarks: 100,
        teamSize: 1,
      })

      // Refresh projects
      const projectsRes = await axios.get(`${API_BASE_URL}/api/teachers/projects`, { headers: getHeaders() })
      setProjects(projectsRes.data)
      alert("Project created successfully!")
    } catch (err) {
      console.error("Error creating project:", err)
      alert("Failed to create project: " + (err.response?.data?.message || err.message))
    }
  }

  // Add question to assessment
  const addQuestionToAssessment = () => {
    if (!currentQuestion.question.trim()) {
      alert("Please enter a question")
      return
    }

    if (currentQuestion.type === "multiple-choice" && currentQuestion.options.some((opt) => !opt.trim())) {
      alert("Please fill in all options for multiple choice questions")
      return
    }

    if (!currentQuestion.correctAnswer.trim()) {
      alert("Please provide the correct answer")
      return
    }

    setAssessmentData({
      ...assessmentData,
      questions: [...assessmentData.questions, { ...currentQuestion }],
    })

    setCurrentQuestion({
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    })
  }

  // Remove question from assessment
  const removeQuestionFromAssessment = (index) => {
    const updatedQuestions = assessmentData.questions.filter((_, i) => i !== index)
    setAssessmentData({
      ...assessmentData,
      questions: updatedQuestions,
    })
  }

  // Delete assignment
  const deleteAssignment = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/teachers/assignments/${assignmentId}`, {
        headers: getHeaders(),
      })
      setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId))
      alert("Assignment deleted successfully!")
    } catch (err) {
      console.error("Error deleting assignment:", err)
      alert("Failed to delete assignment: " + (err.response?.data?.message || err.message))
    }
  }

  // Delete assessment
  const deleteAssessment = async (assessmentId) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/teachers/assessments/${assessmentId}`, {
        headers: getHeaders(),
      })
      setAssessments(assessments.filter((assessment) => assessment._id !== assessmentId))
      alert("Assessment deleted successfully!")
    } catch (err) {
      console.error("Error deleting assessment:", err)
      alert("Failed to delete assessment: " + (err.response?.data?.message || err.message))
    }
  }

  // Delete project
  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/teachers/projects/${projectId}`, {
        headers: getHeaders(),
      })
      setProjects(projects.filter((project) => project._id !== projectId))
      alert("Project deleted successfully!")
    } catch (err) {
      console.error("Error deleting project:", err)
      alert("Failed to delete project: " + (err.response?.data?.message || err.message))
    }
  }

  // View submissions
  const viewSubmissions = async (type, itemId) => {
    try {
      let response
      let selectedItem

      if (type === "assignment") {
        response = await axios.get(`${API_BASE_URL}/api/teachers/assignments/${itemId}/submissions`, {
          headers: getHeaders(),
        })
        selectedItem = assignments.find((a) => a._id === itemId)
      } else if (type === "assessment") {
        response = await axios.get(`${API_BASE_URL}/api/teachers/assessments/${itemId}/submissions`, {
          headers: getHeaders(),
        })
        selectedItem = assessments.find((a) => a._id === itemId)
      } else if (type === "project") {
        response = await axios.get(`${API_BASE_URL}/api/teachers/projects/${itemId}/submissions`, {
          headers: getHeaders(),
        })
        selectedItem = projects.find((p) => p._id === itemId)
      }

      setSubmissions(response.data.submissions || response.data)
      setSelectedAssignment({ ...selectedItem, type })
      setShowSubmissionsModal(true)
    } catch (err) {
      console.error("Error fetching submissions:", err)
      alert("Failed to fetch submissions: " + (err.response?.data?.message || err.message))
    }
  }

  // Generate student report
  const generateStudentReport = async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers/students/${studentId}/report`, {
        headers: getHeaders(),
      })
      setStudentReport(response.data)
      setShowStudentReportModal(true)
    } catch (err) {
      console.error("Error generating student report:", err)
      alert("Failed to generate student report: " + (err.response?.data?.message || err.message))
    }
  }

  // View batch details
  const viewBatchDetails = async (batchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/teachers/attendance/${batchId}`, {
        headers: getHeaders(),
      })
      const batch = batches.find((b) => b._id === batchId)
      setSelectedBatchDetails({
        ...batch,
        attendanceRecords: response.data,
      })
      setShowBatchDetailsModal(true)
    } catch (err) {
      console.error("Error fetching batch details:", err)
      alert("Failed to fetch batch details: " + (err.response?.data?.message || err.message))
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/lms"
  }

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditMode(false)
    setEditingAssignment(null)
    setEditingAssessment(null)
    setEditingProject(null)
    setAssignmentData({
      title: "",
      description: "",
      dueDate: "",
      course: "",
      batch: "",
      maxMarks: 100,
    })
    setAssessmentData({
      title: "",
      description: "",
      type: "quiz",
      course: "",
      batch: "",
      dueDate: "",
      duration: 60,
      maxMarks: 100,
      questions: [],
    })
    setProjectData({
      title: "",
      description: "",
      requirements: [],
      deliverables: [],
      course: "",
      batch: "",
      dueDate: "",
      maxMarks: 100,
      teamSize: 1,
    })
    setCurrentQuestion({
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-teal-700 font-semibold text-lg">Loading Kidzian Teacher Dashboard...</p>
          <p className="mt-2 text-teal-600">Preparing your teaching experience</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={fetchTeacherData}
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                <img
                  src={teacher?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Kidzian Learning Platform</h1>
                <p className="text-teal-100 mt-1">Welcome back, {teacher?.name || "teacher"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Mark Attendance
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setShowAssignmentModal(true)
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Create Assignment
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setShowAssessmentModal(true)
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Create Assessment
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setShowProjectModal(true)
                }}
                className="bg-slate-400 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Create Project
              </button>
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-100 text-teal-700 px-6 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-blue-700">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-emerald-700">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Batches</p>
                <p className="text-2xl font-bold text-purple-700">{batches.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-amber-700">{assignments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assessments</p>
                <p className="text-2xl font-bold text-indigo-700">{assessments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-cyan-700">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {["overview", "courses", "students", "batches", "assignments", "assessments", "projects"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-2" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => setShowAttendanceModal(true)}
                      className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-emerald-600 font-semibold text-lg">Mark Attendance</div>
                      <div className="text-emerald-500 text-sm mt-1">Record student attendance</div>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowAssignmentModal(true)
                      }}
                      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-purple-600 font-semibold text-lg">Create Assignment</div>
                      <div className="text-purple-500 text-sm mt-1">Add new assignment</div>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowAssessmentModal(true)
                      }}
                      className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-indigo-600 font-semibold text-lg">Create Assessment</div>
                      <div className="text-indigo-500 text-sm mt-1">Add new assessment</div>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowProjectModal(true)
                      }}
                      className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-blue-600 font-semibold text-lg">Create Project</div>
                      <div className="text-blue-500 text-sm mt-1">Add new project</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Recent Activities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                      <h4 className="font-semibold text-gray-700 mb-4">Recent Assignments</h4>
                      {assignments.length > 0 ? (
                        <div className="space-y-3">
                          {assignments.slice(0, 3).map((assignment) => (
                            <div
                              key={assignment._id}
                              className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm"
                            >
                              <span className="font-medium text-sm">{assignment.title}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">No assignments created yet.</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                      <h4 className="font-semibold text-gray-700 mb-4">Recent Assessments</h4>
                      {assessments.length > 0 ? (
                        <div className="space-y-3">
                          {assessments.slice(0, 3).map((assessment) => (
                            <div
                              key={assessment._id}
                              className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm"
                            >
                              <span className="font-medium text-sm">{assessment.title}</span>
                              <span className="text-xs text-gray-500">
                                {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : "No due date"}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">No assessments created yet.</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                      <h4 className="font-semibold text-gray-700 mb-4">Recent Projects</h4>
                      {projects.length > 0 ? (
                        <div className="space-y-3">
                          {projects.slice(0, 3).map((project) => (
                            <div
                              key={project._id}
                              className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm"
                            >
                              <span className="font-medium text-sm">{project.title}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(project.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">No projects created yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-teal-700 flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    Your Students
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {students.length > 0 ? (
                  <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                            Batches
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-sm font-bold text-white">
                                    {student.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.batches?.length || 0} batch(es)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowStudentModal(true)
                                }}
                                className="text-teal-600 hover:text-teal-900 mr-4 font-medium"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => generateStudentReport(student._id)}
                                className="text-emerald-600 hover:text-emerald-900 font-medium"
                              >
                                Generate Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No students assigned yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-teal-700 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    Your Assignments
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditMode(false)
                      setShowAssignmentModal(true)
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                  >
                    Create New Assignment
                  </button>
                </div>
                {assignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Course: {assignment.course?.title || "N/A"}</div>
                          <div>Batch: {assignment.batch?.name || "N/A"}</div>
                          <div>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                          <div>Max Marks: {assignment.maxMarks}</div>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <button
                            onClick={() => startEditingAssignment(assignment)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => viewSubmissions("assignment", assignment._id)}
                            className="flex-1 bg-teal-50 text-teal-600 py-2 px-3 rounded-xl hover:bg-teal-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => deleteAssignment(assignment._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-4">No assignments created yet.</p>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowAssignmentModal(true)
                      }}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                    >
                      Create Your First Assignment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === "assessments" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-teal-700 flex items-center">
                    <Brain className="w-6 h-6 mr-2" />
                    Your Assessments
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditMode(false)
                      setShowAssessmentModal(true)
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                  >
                    Create New Assessment
                  </button>
                </div>
                {assessments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment) => (
                      <div
                        key={assessment._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{assessment.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{assessment.description}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Type: {assessment.type}</div>
                          <div>Course: {assessment.course?.title || "N/A"}</div>
                          <div>Batch: {assessment.batch?.name || "N/A"}</div>
                          <div>Duration: {assessment.duration} minutes</div>
                          <div>Questions: {assessment.questions?.length || 0}</div>
                          <div>Max Marks: {assessment.maxMarks}</div>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <button
                            onClick={() => startEditingAssessment(assessment)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => viewSubmissions("assessment", assessment._id)}
                            className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-3 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => deleteAssessment(assessment._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-4">No assessments created yet.</p>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowAssessmentModal(true)
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                    >
                      Create Your First Assessment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-teal-700 flex items-center">
                    <Code className="w-6 h-6 mr-2" />
                    Your Projects
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditMode(false)
                      setShowProjectModal(true)
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                  >
                    Create New Project
                  </button>
                </div>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Course: {project.course?.title || "N/A"}</div>
                          <div>Batch: {project.batch?.name || "N/A"}</div>
                          <div>Due Date: {new Date(project.dueDate).toLocaleDateString()}</div>
                          <div>Team Size: {project.teamSize}</div>
                          <div>Max Marks: {project.maxMarks}</div>
                        </div>
                        <div className="mt-6 flex gap-2">
                          <button
                            onClick={() => startEditingProject(project)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => viewSubmissions("project", project._id)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-4">No projects created yet.</p>
                    <button
                      onClick={() => {
                        setIsEditMode(false)
                        setShowProjectModal(true)
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                    >
                      Create Your First Project
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab - UPDATED WITH MANAGE COURSE FUNCTIONALITY */}
            {activeTab === "courses" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  Your Courses
                </h3>
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-semibold text-gray-900">{course.title || course.name}</h4>
                            <p className="text-sm text-gray-500">{course.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Batches: {course.batches?.length || 0}</div>
                          <div>Duration: {course.duration || "Not specified"}</div>
                          <div>Upcoming Classes: {course.upcomingClasses || 0}</div>
                        </div>
                        <button
                          onClick={() => manageCourse(course)}
                          className="mt-6 w-full bg-teal-50 text-teal-600 py-3 px-4 rounded-xl hover:bg-teal-100 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Manage Course
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No courses assigned yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === "batches" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Your Batches
                </h3>
                {batches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batches.map((batch) => (
                      <div
                        key={batch._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{batch.name}</h4>
                            <p className="text-sm text-gray-500">{batch.course?.title}</p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                            Active
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            Students: {batch.students?.length || 0}/{batch.maxStudents || "N/A"}
                          </div>
                          <div>Start Date: {new Date(batch.startDate).toLocaleDateString()}</div>
                          <div>End Date: {new Date(batch.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => viewBatchDetails(batch._id)}
                            className="flex-1 bg-teal-50 text-teal-600 py-2 px-4 rounded-xl hover:bg-teal-100 transition-colors font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch._id)
                              setShowAttendanceModal(true)
                            }}
                            className="flex-1 bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
                          >
                            Mark Attendance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No batches assigned yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Management Modal */}
      {showCourseManagementModal && selectedCourse && courseStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Course Management</h2>
                  <p className="text-blue-100 mt-1">{selectedCourse.title || selectedCourse.name}</p>
                </div>
                <button
                  onClick={() => setShowCourseManagementModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Course Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-blue-600 text-xs font-medium">Batches</div>
                      <div className="text-xl font-bold text-blue-700">{courseStats.totalBatches}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-emerald-600 mr-2" />
                    <div>
                      <div className="text-emerald-600 text-xs font-medium">Students</div>
                      <div className="text-xl font-bold text-emerald-700">{courseStats.totalStudents}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <div className="text-purple-600 text-xs font-medium">Assignments</div>
                      <div className="text-xl font-bold text-purple-700">{courseStats.totalAssignments}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 text-indigo-600 mr-2" />
                    <div>
                      <div className="text-indigo-600 text-xs font-medium">Assessments</div>
                      <div className="text-xl font-bold text-indigo-700">{courseStats.totalAssessments}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-cyan-600 mr-2" />
                    <div>
                      <div className="text-cyan-600 text-xs font-medium">Projects</div>
                      <div className="text-xl font-bold text-cyan-700">{courseStats.totalProjects}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-amber-600 mr-2" />
                    <div>
                      <div className="text-amber-600 text-xs font-medium">Upcoming</div>
                      <div className="text-xl font-bold text-amber-700">{courseStats.upcomingClasses}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Batches */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Course Batches ({courseBatches.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {courseBatches.length > 0 ? (
                      courseBatches.map((batch) => (
                        <div key={batch._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{batch.name}</h5>
                              <p className="text-sm text-gray-500">
                                {batch.students?.length || 0}/{batch.maxStudents || "N/A"} students
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>Start: {new Date(batch.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(batch.endDate).toLocaleDateString()}</div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => {
                                setShowCourseManagementModal(false)
                                viewBatchDetails(batch._id)
                              }}
                              className="flex-1 bg-teal-50 text-teal-600 py-1 px-3 rounded-lg hover:bg-teal-100 transition-colors text-xs font-medium"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBatch(batch._id)
                                setShowCourseManagementModal(false)
                                setShowAttendanceModal(true)
                              }}
                              className="flex-1 bg-emerald-50 text-emerald-600 py-1 px-3 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-medium"
                            >
                              Attendance
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No batches found for this course</p>
                    )}
                  </div>
                </div>

                {/* Course Students */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Course Students ({courseStudents.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {courseStudents.length > 0 ? (
                      courseStudents.map((student) => (
                        <div key={student._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg mr-3">
                                <span className="text-xs font-bold text-white">
                                  {student.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowCourseManagementModal(false)
                                  setShowStudentModal(true)
                                }}
                                className="bg-teal-50 text-teal-600 py-1 px-3 rounded-lg hover:bg-teal-100 transition-colors text-xs font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setShowCourseManagementModal(false)
                                  generateStudentReport(student._id)
                                }}
                                className="bg-emerald-50 text-emerald-600 py-1 px-3 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-medium"
                              >
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No students enrolled in this course</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions for Course */}
              <div className="mt-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                <h4 className="font-semibold text-teal-700 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Quick Actions for {selectedCourse.title || selectedCourse.name}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      setAssignmentData({ ...assignmentData, course: selectedCourse._id })
                      setShowCourseManagementModal(false)
                      setIsEditMode(false)
                      setShowAssignmentModal(true)
                    }}
                    className="p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-purple-200 text-center"
                  >
                    <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-700">Create Assignment</div>
                  </button>
                  <button
                    onClick={() => {
                      setAssessmentData({ ...assessmentData, course: selectedCourse._id })
                      setShowCourseManagementModal(false)
                      setIsEditMode(false)
                      setShowAssessmentModal(true)
                    }}
                    className="p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-indigo-200 text-center"
                  >
                    <Brain className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-indigo-700">Create Assessment</div>
                  </button>
                  <button
                    onClick={() => {
                      setProjectData({ ...projectData, course: selectedCourse._id })
                      setShowCourseManagementModal(false)
                      setIsEditMode(false)
                      setShowProjectModal(true)
                    }}
                    className="p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-blue-200 text-center"
                  >
                    <Code className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-700">Create Project</div>
                  </button>
                  <button
                    onClick={() => {
                      if (courseBatches.length > 0) {
                        setSelectedBatch(courseBatches[0]._id)
                        setShowCourseManagementModal(false)
                        setShowAttendanceModal(true)
                      } else {
                        alert("No batches found for this course")
                      }
                    }}
                    className="p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-emerald-200 text-center"
                  >
                    <GraduationCap className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-emerald-700">Mark Attendance</div>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowCourseManagementModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Report Modal with PDF download */}
      {showStudentReportModal && studentReport && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Student Report - {selectedStudent.name}</h2>
                  <p className="text-teal-100 mt-1">Kidzian Learning Platform • Founded by Rashmi</p>
                </div>
                <button
                  onClick={() => downloadStudentPDFReport(selectedStudent)}
                  disabled={generatingPDF}
                  className={`${
                    generatingPDF ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                  } text-teal-700 px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium shadow-lg`}
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-teal-700 border-t-transparent rounded-full"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF Report
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
                  <div className="text-teal-600 text-sm font-medium">Total Points</div>
                  <div className="text-3xl font-bold text-teal-700">
                    {studentReport.performance?.totalPointsEarned || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-medium">Assignments</div>
                  <div className="text-3xl font-bold text-emerald-700">
                    {studentReport.submissions?.assignments || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="text-purple-600 text-sm font-medium">Assessments</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {studentReport.submissions?.assessments || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="text-amber-600 text-sm font-medium">Attendance</div>
                  <div className="text-3xl font-bold text-amber-700">{studentReport.performance?.attendance || 0}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-700 mb-4">Recent Activities</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {studentReport.activities?.length > 0 ? (
                      studentReport.activities.slice(0, 10).map((activity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm"
                        >
                          <span className="text-sm">{new Date(activity.date).toLocaleDateString()}</span>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Points: {activity.pointsEarned}</div>
                            <div className="text-xs text-gray-500">Activities: {activity.activitiesCount}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No recent activities</p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-700 mb-4">Performance Summary</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assignment Completion:</span>
                      <span className="font-medium">{studentReport.performance?.assignmentCompletion || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assessment Completion:</span>
                      <span className="font-medium">{studentReport.performance?.assessmentCompletion || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Project Completion:</span>
                      <span className="font-medium">{studentReport.performance?.projectCompletion || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Assessment Score:</span>
                      <span className="font-medium">{studentReport.performance?.avgAssessmentScore || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-4">Batch Enrollments</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentReport.batches?.length > 0 ? (
                    studentReport.batches.map((batch, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
                        <div className="font-medium">{batch.name}</div>
                        <div className="text-sm text-gray-600">{batch.courseName}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No batch enrollments</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowStudentReportModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All other modals remain the same... */}
      {/* Enhanced Assessment Creation Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {isEditMode ? "Edit Assessment" : "Create Assessment"}
                </h2>
                {isEditMode && (
                  <button onClick={cancelEdit} className="text-white hover:text-gray-200 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Title *</label>
                  <input
                    type="text"
                    value={assessmentData.title}
                    onChange={(e) => setAssessmentData({ ...assessmentData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter assessment title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={assessmentData.type}
                    onChange={(e) => setAssessmentData({ ...assessmentData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assessmentData.description}
                  onChange={(e) => setAssessmentData({ ...assessmentData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter assessment description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    value={assessmentData.course}
                    onChange={(e) => setAssessmentData({ ...assessmentData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                  <select
                    value={assessmentData.batch}
                    onChange={(e) => setAssessmentData({ ...assessmentData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={assessmentData.dueDate}
                    onChange={(e) => setAssessmentData({ ...assessmentData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={assessmentData.duration}
                    onChange={(e) =>
                      setAssessmentData({ ...assessmentData, duration: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                  <input
                    type="number"
                    value={assessmentData.maxMarks}
                    onChange={(e) =>
                      setAssessmentData({ ...assessmentData, maxMarks: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Questions ({assessmentData.questions.length})
                </h3>

                {/* Add Question Form */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-4">
                  <h4 className="font-medium text-gray-700 mb-3">Add New Question</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your question"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                        <select
                          value={currentQuestion.type}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="essay">Essay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                        <input
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                        <input
                          type="text"
                          value={currentQuestion.correctAnswer}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter correct answer"
                        />
                      </div>
                    </div>
                    {currentQuestion.type === "multiple-choice" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        <div className="grid grid-cols-2 gap-2">
                          {currentQuestion.options.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options]
                                newOptions[index] = e.target.value
                                setCurrentQuestion({ ...currentQuestion, options: newOptions })
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Option ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={addQuestionToAssessment}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-colors font-medium"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                {/* Questions List */}
                {assessmentData.questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Added Questions:</h4>
                    {assessmentData.questions.map((question, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              Q{index + 1}: {question.question}
                            </h5>
                            <div className="text-sm text-gray-600 mt-1">
                              Type: {question.type} | Points: {question.points} | Answer: {question.correctAnswer}
                            </div>
                            {question.type === "multiple-choice" && (
                              <div className="text-sm text-gray-500 mt-1">Options: {question.options.join(", ")}</div>
                            )}
                          </div>
                          <button
                            onClick={() => removeQuestionFromAssessment(index)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={isEditMode ? updateAssessment : createAssessment}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isEditMode ? <Save className="w-5 h-5" /> : <></>}
                  {isEditMode ? "Update Assessment" : "Create Assessment"}
                </button>
                <button
                  onClick={() => {
                    setShowAssessmentModal(false)
                    cancelEdit()
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{isEditMode ? "Edit Project" : "Create Project"}</h2>
                {isEditMode && (
                  <button onClick={cancelEdit} className="text-white hover:text-gray-200 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    value={projectData.course}
                    onChange={(e) => setProjectData({ ...projectData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                  <select
                    value={projectData.batch}
                    onChange={(e) => setProjectData({ ...projectData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={projectData.dueDate}
                    onChange={(e) => setProjectData({ ...projectData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={projectData.teamSize}
                    onChange={(e) => setProjectData({ ...projectData, teamSize: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                  <input
                    type="number"
                    value={projectData.maxMarks}
                    onChange={(e) => setProjectData({ ...projectData, maxMarks: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  value={projectData.requirements.join("\n")}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      requirements: e.target.value.split("\n").filter((req) => req.trim()),
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each requirement on a new line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables</label>
                <textarea
                  value={projectData.deliverables.join("\n")}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      deliverables: e.target.value.split("\n").filter((del) => del.trim()),
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each deliverable on a new line"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={isEditMode ? updateProject : createProject}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isEditMode ? <Save className="w-5 h-5" /> : <></>}
                  {isEditMode ? "Update Project" : "Create Project"}
                </button>
                <button
                  onClick={() => {
                    setShowProjectModal(false)
                    cancelEdit()
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Submissions Modal */}
      {showSubmissionsModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">
                Submissions for: {selectedAssignment.title} ({selectedAssignment.type})
              </h2>
            </div>
            <div className="p-6">
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{submission.student?.name || "Unknown Student"}</h4>
                          <p className="text-sm text-gray-500">{submission.student?.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                          {submission.grade !== undefined && submission.grade !== null && (
                            <div className="text-sm font-medium text-green-600">
                              Grade: {submission.grade}/{selectedAssignment.maxMarks}
                            </div>
                          )}
                          {submission.score !== undefined && (
                            <div className="text-sm font-medium text-green-600">
                              Score: {submission.score}/{selectedAssignment.maxMarks} ({submission.percentage}%)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {submission.content && <p className="text-sm text-gray-700 mb-2">{submission.content}</p>}
                        {submission.title && (
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Title:</strong> {submission.title}
                          </p>
                        )}
                        {submission.description && (
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Description:</strong> {submission.description}
                          </p>
                        )}
                        {submission.githubUrl && (
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>GitHub:</strong>{" "}
                            <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer">
                              {submission.githubUrl}
                            </a>
                          </p>
                        )}
                        {submission.liveUrl && (
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Live URL:</strong>{" "}
                            <a href={submission.liveUrl} target="_blank" rel="noopener noreferrer">
                              {submission.liveUrl}
                            </a>
                          </p>
                        )}
                        {submission.fileName && (
                          <div className="mt-2">
                            <span className="text-sm text-blue-600">📎 {submission.fileName}</span>
                          </div>
                        )}
                        {submission.notes && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Notes: {submission.notes}</span>
                          </div>
                        )}
                        {submission.answers && submission.answers.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">
                              Answers: {submission.answers.filter((a) => a.isCorrect).length}/
                              {submission.answers.length} correct
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No submissions yet for this {selectedAssignment.type}.</p>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSubmissionsModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Batch Details Modal */}
      {showBatchDetailsModal && selectedBatchDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">Batch Details - {selectedBatchDetails.name}</h2>
              <p className="text-teal-100 mt-1">{selectedBatchDetails.course?.title}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-blue-600 text-sm font-medium">Total Students</div>
                  <div className="text-2xl font-bold text-blue-700">{selectedBatchDetails.students?.length || 0}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-green-600 text-sm font-medium">Start Date</div>
                  <div className="text-lg font-bold text-green-700">
                    {new Date(selectedBatchDetails.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-purple-600 text-sm font-medium">End Date</div>
                  <div className="text-lg font-bold text-purple-700">
                    {new Date(selectedBatchDetails.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-4">Students List</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedBatchDetails.students?.length > 0 ? (
                      selectedBatchDetails.students.map((student, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="font-medium text-sm">{student.name}</span>
                          <span className="text-xs text-gray-500">{student.email}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No students enrolled</p>
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-4">Recent Attendance</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedBatchDetails.attendanceRecords?.length > 0 ? (
                      selectedBatchDetails.attendanceRecords.slice(0, 10).map((record, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                          <span className="text-sm">{new Date(record.date).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">
                            {record.records?.filter((r) => r.status === "present").length || 0} present
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No attendance records</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => {
                    setSelectedBatch(selectedBatchDetails._id)
                    setShowBatchDetailsModal(false)
                    setShowAttendanceModal(true)
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => setShowBatchDetailsModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-emerald-600 to-green-600">
              <h2 className="text-2xl font-bold text-white">Mark Attendance</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value)
                    setAttendanceData({})
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name} - {batch.course?.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {selectedBatch && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Students ({getStudentsForBatch().length} found)
                  </h3>
                  {getStudentsForBatch().length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {getStudentsForBatch().map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-xl"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAttendanceData({ ...attendanceData, [student._id]: "present" })}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                attendanceData[student._id] === "present"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendanceData({ ...attendanceData, [student._id]: "absent" })}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                attendanceData[student._id] === "absent"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No students found in this batch.</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={submitAttendance}
                  disabled={
                    !selectedBatch || getStudentsForBatch().length === 0 || Object.keys(attendanceData).length === 0
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Submit Attendance
                </button>
                <button
                  onClick={() => {
                    setShowAttendanceModal(false)
                    setAttendanceData({})
                    setSelectedBatch("")
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {isEditMode ? "Edit Assignment" : "Create Assignment"}
                </h2>
                {isEditMode && (
                  <button onClick={cancelEdit} className="text-white hover:text-gray-200 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  value={assignmentData.title}
                  onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assignmentData.description}
                  onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter assignment description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    value={assignmentData.course}
                    onChange={(e) => setAssignmentData({ ...assignmentData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title || course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                  <select
                    value={assignmentData.batch}
                    onChange={(e) => setAssignmentData({ ...assignmentData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={assignmentData.dueDate}
                  onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks</label>
                <input
                  type="number"
                  value={assignmentData.maxMarks}
                  onChange={(e) => setAssignmentData({ ...assignmentData, maxMarks: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="100"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={isEditMode ? updateAssignment : createAssignment}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isEditMode ? <Save className="w-5 h-5" /> : <></>}
                  {isEditMode ? "Update Assignment" : "Create Assignment"}
                </button>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false)
                    cancelEdit()
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">Student Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">{selectedStudent.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Contact Information</h4>
                <p className="text-sm text-gray-600">Email: {selectedStudent.email}</p>
                <p className="text-sm text-gray-600">Phone: {selectedStudent.phone || "Not provided"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Batch Enrollments</h4>
                {selectedStudent.batches?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedStudent.batches.map((enrollment) => (
                      <li key={enrollment._id} className="text-sm text-gray-600">
                        {enrollment.batch?.name || "N/A"} ({enrollment.course?.title || "N/A"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No batch enrollments</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherDashboard
