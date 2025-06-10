"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Download, Eye, Trash2, Users, BookOpen, Calendar, FileText, Brain, Code, Sparkles, Award } from "lucide-react"
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

  // Modal states
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showStudentReportModal, setShowStudentReportModal] = useState(false)
  const [showBatchDetailsModal, setShowBatchDetailsModal] = useState(false)

  const [attendanceData, setAttendanceData] = useState({})
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [submissions, setSubmissions] = useState([])
  const [studentReport, setStudentReport] = useState(null)

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
    } catch (err) {
      setError("Failed to load teacher data")
      console.error("Error fetching teacher data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced PDF Report Generation for Teachers
  const downloadStudentPDFReport = async (student) => {
    if (!studentReport) return

    try {
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

      // Student Information Section
      pdf.setFillColor(...lightTeal)
      pdf.rect(15, 75, pageWidth - 30, 35, "F")

      pdf.setTextColor(...darkTeal)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("STUDENT INFORMATION", 20, 85)

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Name: ${student?.name || "N/A"}`, 20, 95)
      pdf.text(`Email: ${student?.email || "N/A"}`, 20, 102)
      pdf.text(`Total Points: ${student?.totalPoints || 0}`, 120, 95)
      pdf.text(`Phone: ${student?.phone || "Not provided"}`, 120, 102)

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

      // Batch Enrollments
      yPos += 10
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
      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("RECENT ACTIVITIES", 20, yPos + 6)

      yPos += 15
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(10)

      if (studentReport.activities?.length > 0) {
        studentReport.activities.slice(0, 10).forEach((activity) => {
          pdf.text(
            `• ${new Date(activity.date).toLocaleDateString()}: ${activity.pointsEarned} points, ${activity.activitiesCount} activities`,
            20,
            yPos,
          )
          yPos += 7
        })
      } else {
        pdf.text("No recent activities found", 20, yPos)
      }

      // Footer
      pdf.setFillColor(...tealColor)
      pdf.rect(0, pageHeight - 20, pageWidth, 20, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.text("© 2024 Kidzian Learning Platform - Founded by Rashmi", 20, pageHeight - 10)
      pdf.text("Empowering Students Through Technology", 20, pageHeight - 5)

      // Save the PDF
      pdf.save(
        `Kidzian_Student_Report_${student?.name?.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
      )
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
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
    <p className="text-teal-100 mt-1">Welcome back, {teacher?.name || "teacher"} </p>
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
                onClick={() => setShowAssignmentModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Create Assignment
              </button>
              <button
                onClick={() => setShowAssessmentModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
              >
                Create Assessment
              </button>
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg"
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
                      onClick={() => setShowAssignmentModal(true)}
                      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-purple-600 font-semibold text-lg">Create Assignment</div>
                      <div className="text-purple-500 text-sm mt-1">Add new assignment</div>
                    </button>
                    <button
                      onClick={() => setShowAssessmentModal(true)}
                      className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      <div className="text-indigo-600 font-semibold text-lg">Create Assessment</div>
                      <div className="text-indigo-500 text-sm mt-1">Add new assessment</div>
                    </button>
                    <button
                      onClick={() => setShowProjectModal(true)}
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
                          {/* <th className="px-6 py-4 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                            Total Points
                          </th> */}
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
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {student.totalPoints || 0} points
                              </span> */}
                            {/* </td> */}
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
                    onClick={() => setShowAssignmentModal(true)}
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
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => viewSubmissions("assignment", assignment._id)}
                            className="flex-1 bg-teal-50 text-teal-600 py-2 px-4 rounded-xl hover:bg-teal-100 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Submissions
                          </button>
                          <button
                            onClick={() => deleteAssignment(assignment._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
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
                      onClick={() => setShowAssignmentModal(true)}
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
                    onClick={() => setShowAssessmentModal(true)}
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
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => viewSubmissions("assessment", assessment._id)}
                            className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Submissions
                          </button>
                          <button
                            onClick={() => deleteAssessment(assessment._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
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
                      onClick={() => setShowAssessmentModal(true)}
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
                    onClick={() => setShowProjectModal(true)}
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
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => viewSubmissions("project", project._id)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Submissions
                          </button>
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
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
                      onClick={() => setShowProjectModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
                    >
                      Create Your First Project
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
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
                        <button className="mt-6 w-full bg-teal-50 text-teal-600 py-3 px-4 rounded-xl hover:bg-teal-100 transition-colors font-medium">
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

      {/* Enhanced Student Report Modal with PDF download */}
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
                  className="bg-white hover:bg-gray-100 text-teal-700 px-6 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download PDF Report
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

      {/* Enhanced Assessment Creation Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4  z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
              <h2 className="text-2xl font-bold text-white">Create Assessment</h2>
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
                  onClick={createAssessment}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Create Assessment
                </button>
                <button
                  onClick={() => {
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
                    setCurrentQuestion({
                      question: "",
                      type: "multiple-choice",
                      options: ["", "", "", ""],
                      correctAnswer: "",
                      points: 1,
                    })
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
              <h2 className="text-2xl font-bold text-white">Create Project</h2>
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
                  onClick={createProject}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Create Project
                </button>
                <button
                  onClick={() => {
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
              <h2 className="text-2xl font-bold text-white">Create Assignment</h2>
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

              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      setAssignmentData({ ...assignmentData, maxMarks: Number.parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createAssignment}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
                >
                  Create Assignment
                </button>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false)
                    setAssignmentData({
                      title: "",
                      description: "",
                      dueDate: "",
                      course: "",
                      batch: "",
                      maxMarks: 100,
                    })
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
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">Student Profile</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedStudent.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedStudent.email}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedStudent.phone || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Points:</span>
                      <span className="ml-2 font-medium">{selectedStudent.totalPoints || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Total Batches:</span>
                      <span className="ml-2 font-medium">{selectedStudent.batches?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Joined:</span>
                      <span className="ml-2 font-medium">
                        {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Enrollments</h3>
                {selectedStudent.batches && selectedStudent.batches.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.batches.map((enrollment, index) => (
                      <div key={index} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="font-medium">{enrollment.batchName || "Unknown Batch"}</div>
                        <div className="text-sm text-gray-600">{enrollment.courseName || "Unknown Course"}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No batch enrollments found.</p>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => generateStudentReport(selectedStudent._id)}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Generate Report
                </button>
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
