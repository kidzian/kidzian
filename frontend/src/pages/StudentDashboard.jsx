"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  BookOpen,
  Calendar,
  FileText,
  Upload,
  Eye,
  Award,
  Clock,
  Brain,
  Code,
  Trophy,
  Download,
  Gem,
} from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
} from "recharts"

const StudentDashboard = () => {
  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [assignments, setAssignments] = useState([])
  const [assessments, setAssessments] = useState([])
  const [projects, setProjects] = useState([])
  const [attendance, setAttendance] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [analytics, setAnalytics] = useState(null)
  const [monthlyReport, setMonthlyReport] = useState(null)
  const [courseLearnings, setCourseLearnings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  // Chart refs for PDF generation
  const performanceChartRef = useRef(null)
  const activityChartRef = useRef(null)
  const pieChartRef = useRef(null)

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Selected items
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  // Form states
  const [submissionForm, setSubmissionForm] = useState({
    type: "",
    id: "",
    content: "",
    file: null,
    notes: "",
    answers: [],
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    teamMembers: "",
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

  // Calculate attendance days from attendance records
  const calculateAttendanceDays = () => {
    if (!attendance || !Array.isArray(attendance)) return 0
    return attendance.filter((record) => record.status === "present").length
  }

  // Fetch all student data - ENHANCED VERSION
  useEffect(() => {
    fetchStudentData()
    fetchCourseLearnings()
    // Set up interval to refresh data every 30 seconds to catch point updates
    const interval = setInterval(() => {
      fetchStudentProfile() // Only refresh profile for points update
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Separate function to fetch just profile data for points update
  const fetchStudentProfile = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const headers = getHeaders()
      const profileRes = await axios.get(`${API_BASE_URL}/api/students/profile`, { headers })

      if (profileRes.data) {
        setStudent((prevStudent) => ({
          ...prevStudent,
          ...profileRes.data,
          totalPoints: profileRes.data.totalPoints || 0,
        }))
      }
    } catch (err) {
      console.error("Error fetching student profile:", err)
    }
  }

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()

      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        return
      }

      const headers = getHeaders()

      // Fetch student data in parallel
      const [
        profileRes,
        enrollmentsRes,
        assignmentsRes,
        assessmentsRes,
        projectsRes,
        attendanceRes,
        submissionsRes,
        analyticsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students/profile`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/students/enrollments`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/assignments`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/assessments`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/projects`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/attendance`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/submissions`, { headers }).catch(() => ({ data: {} })),
        axios.get(`${API_BASE_URL}/api/students/analytics`, { headers }).catch(() => ({ data: null })),
      ])

      // Set all data with proper fallbacks
      setStudent({
        ...profileRes.data,
        totalPoints: profileRes.data?.totalPoints || 0,
      })
      setEnrollments(enrollmentsRes.data || [])
      setAssignments(assignmentsRes.data || [])
      setAssessments(assessmentsRes.data || [])
      setProjects(projectsRes.data || [])
      setAttendance(attendanceRes.data || [])
      setSubmissions(submissionsRes.data || {})
      setAnalytics(analyticsRes.data)
      setError("")
    } catch (err) {
      setError("Failed to load student data")
      console.error("Error fetching student data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Submit assignment with proper points update
  const submitAssignment = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("assignmentId", submissionForm.id)
      formData.append("content", submissionForm.content)
      formData.append("notes", submissionForm.notes)
      if (submissionForm.file) {
        formData.append("file", submissionForm.file)
      }

      const response = await axios.post(`${API_BASE_URL}/api/students/submit-assignment`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setShowSubmissionModal(false)
      resetSubmissionForm()

      // Refresh all data to update points and submissions
      await fetchStudentData()

      alert(`Assignment submitted successfully! You earned ${response.data.pointsEarned || 20} points!`)
    } catch (err) {
      console.error("Error submitting assignment:", err)
      alert("Failed to submit assignment: " + (err.response?.data?.message || err.message))
    }
  }

  // Submit assessment with proper points update
  const submitAssessment = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/students/submit-assessment`,
        {
          assessmentId: submissionForm.id,
          answers: submissionForm.answers,
          timeSpent: 30,
        },
        {
          headers: getHeaders(),
        },
      )

      setShowSubmissionModal(false)
      resetSubmissionForm()

      // Refresh all data to update points and submissions
      await fetchStudentData()

      const pointsEarned = response.data.pointsEarned || 15
      alert(`Assessment submitted successfully! You earned ${pointsEarned} points! Score: ${response.data.percentage}%`)
    } catch (err) {
      console.error("Error submitting assessment:", err)
      alert("Failed to submit assessment: " + (err.response?.data?.message || err.message))
    }
  }

  // Submit project with proper points update
  const submitProject = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("projectId", submissionForm.id)
      formData.append("title", submissionForm.title)
      formData.append("description", submissionForm.description)
      formData.append("githubUrl", submissionForm.githubUrl)
      formData.append("liveUrl", submissionForm.liveUrl)
      formData.append("teamMembers", submissionForm.teamMembers)
      if (submissionForm.file) {
        formData.append("file", submissionForm.file)
      }

      const response = await axios.post(`${API_BASE_URL}/api/students/submit-project`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setShowSubmissionModal(false)
      resetSubmissionForm()

      // Refresh all data to update points and submissions
      await fetchStudentData()

      alert(`Project submitted successfully! You earned ${response.data.pointsEarned || 30} points!`)
    } catch (err) {
      console.error("Error submitting project:", err)
      alert("Failed to submit project: " + (err.response?.data?.message || err.message))
    }
  }

  const resetSubmissionForm = () => {
    setSubmissionForm({
      type: "",
      id: "",
      content: "",
      file: null,
      notes: "",
      answers: [],
      title: "",
      description: "",
      githubUrl: "",
      liveUrl: "",
      teamMembers: "",
    })
  }

  // FIXED: Get submission status - corrected logic
  const getSubmissionStatus = (type, itemId) => {
    if (!submissions || !submissions[type]) return "Not Submitted"

    const submission = submissions[type].find((sub) => {
      // Handle different submission structures
      let subItemId
      if (type === "assignments") {
        subItemId = sub.assignment?._id || sub.assignment
      } else if (type === "assessments") {
        subItemId = sub.assessment?._id || sub.assessment
      } else if (type === "projects") {
        subItemId = sub.project?._id || sub.project
      }

      return subItemId?.toString() === itemId.toString()
    })

    if (!submission) return "Not Submitted"
    if (submission.grade !== undefined && submission.grade !== null) return "Graded"
    return "Submitted"
  }

  // Generate performance comparison data - FIXED VERSION
  const generateComparisonData = () => {
    if (!analytics) return []

    return [
      {
        metric: "Attendance",
        student: analytics.student?.attendance || 0,
        average: analytics.average?.attendance || 0,
        fullMark: 100,
      },
      {
        metric: "Assignments",
        student: analytics.student?.assignmentCompletion || 0,
        average: analytics.average?.assignmentCompletion || 0,
        fullMark: 100,
      },
      {
        metric: "Assessments",
        student: analytics.student?.assessmentCompletion || 0,
        average: analytics.average?.assessmentCompletion || 0,
        fullMark: 100,
      },
      {
        metric: "Projects",
        student: analytics.student?.projectCompletion || 0,
        average: analytics.average?.projectCompletion || 0,
        fullMark: 100,
      },
      {
        metric: "Avg Score",
        student: analytics.student?.avgAssessmentScore || 0,
        average: analytics.average?.assessmentScore || 0,
        fullMark: 100,
      },
    ]
  }

  // Generate activity trend data - FIXED VERSION
  const generateActivityTrendData = () => {
    if (!analytics?.monthlyData) return []

    return analytics.monthlyData.map((activity, index) => ({
      day: index + 1,
      points: activity.pointsEarned || 0,
      activities: activity.activitiesCompleted?.length || 0,
      date: new Date(activity.date).toLocaleDateString(),
    }))
  }

  // Generate performance pie chart data - FIXED VERSION
  const generatePerformancePieData = () => {
    if (!analytics) return []

    const COLORS = ["#14b8a6", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

    return [
      { name: "Assignments", value: analytics.student?.assignmentCompletion || 0, color: COLORS[0] },
      { name: "Assessments", value: analytics.student?.assessmentCompletion || 0, color: COLORS[1] },
      { name: "Projects", value: analytics.student?.projectCompletion || 0, color: COLORS[2] },
      { name: "Attendance", value: analytics.student?.attendance || 0, color: COLORS[3] },
    ]
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/lms"
  }

  // Fetch monthly report
  const fetchMonthlyReport = async (month, year) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/monthly-report/${month}/${year}`, {
        headers: getHeaders(),
      })
      setMonthlyReport(response.data)
      setShowReportModal(true)
    } catch (err) {
      console.error("Error fetching monthly report:", err)
      alert("Failed to fetch monthly report")
    }
  }

  // ENHANCED: PDF Report Generation with Charts and Course Learnings - FIXED CHART RENDERING
  const downloadPDFReport = async (month, year) => {
    if (!monthlyReport) return

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
      const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" })
      pdf.text(`STUDENT PERFORMANCE REPORT - ${monthName} ${year}`, 20, 55)

      // Student Information Section
      pdf.setFillColor(...lightTeal)
      pdf.rect(15, 65, pageWidth - 30, 35, "F")

      pdf.setTextColor(...darkTeal)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("STUDENT INFORMATION", 20, 75)

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Name: ${student?.name || "N/A"}`, 20, 85)
      pdf.text(`Email: ${student?.email || "N/A"}`, 20, 92)
      pdf.text(`Total Points: ${analytics?.student?.totalPoints || 0}`, 120, 85)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 120, 92)

      // Performance Summary Section
      let yPos = 115
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

      const stats = [
        [
          `Total Days Active: ${monthlyReport.stats.totalDays}`,
          `Total Points Earned: ${monthlyReport.stats.totalPoints}`,
        ],
        [
          `Activities Completed: ${monthlyReport.stats.totalActivities}`,
          `Average Points/Day: ${monthlyReport.stats.averagePointsPerDay}`,
        ],
      ]

      stats.forEach(([left, right]) => {
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

      // FIXED: Get attendance days count
      const attendanceDays = calculateAttendanceDays()

      const activities = [
        [
          `Assignments: ${monthlyReport.stats.activitiesByType.assignment || 0}`,
          `Assessments: ${monthlyReport.stats.activitiesByType.assessment || 0}`,
        ],
        [
          `Projects: ${monthlyReport.stats.activitiesByType.project || 0}`,
          `Attendance Days: ${monthlyReport.stats.activitiesByType.attendance || attendanceDays || 0}`,
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
      pdf.text("WHAT YOU HAVE LEARNED IN YOUR COURSES", 20, yPos + 6)

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

      // Performance Charts Section - FIXED CHART RENDERING
      yPos += 10
      if (yPos > pageHeight - 100) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFillColor(...tealColor)
      pdf.rect(15, yPos, pageWidth - 30, 8, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("PERFORMANCE ANALYTICS", 20, yPos + 6)
      yPos += 15

      // Capture and add charts with improved rendering
      if (analytics) {
        try {
          // Performance Comparison Chart
          if (performanceChartRef.current) {
            const performanceCanvas = await html2canvas(performanceChartRef.current, {
              scale: 1.5,
              backgroundColor: "#ffffff",
              logging: false,
              useCORS: true,
              allowTaint: true,
              width: performanceChartRef.current.offsetWidth,
              height: performanceChartRef.current.offsetHeight,
            })
            const performanceImgData = performanceCanvas.toDataURL("image/png", 1.0)
            pdf.addImage(performanceImgData, "PNG", 15, yPos, pageWidth - 30, 60)
            yPos += 65
          }

          // Check if we need a new page
          if (yPos > pageHeight - 80) {
            pdf.addPage()
            yPos = 20
          }

          // Activity Trend Chart
          if (activityChartRef.current) {
            const activityCanvas = await html2canvas(activityChartRef.current, {
              scale: 1.5,
              backgroundColor: "#ffffff",
              logging: false,
              useCORS: true,
              allowTaint: true,
              width: activityChartRef.current.offsetWidth,
              height: activityChartRef.current.offsetHeight,
            })
            const activityImgData = activityCanvas.toDataURL("image/png", 1.0)
            pdf.addImage(activityImgData, "PNG", 15, yPos, pageWidth - 30, 60)
            yPos += 65
          }

          // Check if we need a new page
          if (yPos > pageHeight - 80) {
            pdf.addPage()
            yPos = 20
          }

          // Performance Distribution Chart
          if (pieChartRef.current) {
            const pieCanvas = await html2canvas(pieChartRef.current, {
              scale: 1.5,
              backgroundColor: "#ffffff",
              logging: false,
              useCORS: true,
              allowTaint: true,
              width: pieChartRef.current.offsetWidth,
              height: pieChartRef.current.offsetHeight,
            })
            const pieImgData = pieCanvas.toDataURL("image/png", 1.0)
            pdf.addImage(pieImgData, "PNG", 15, yPos, pageWidth - 30, 60)
          }
        } catch (error) {
          console.error("Error adding charts to PDF:", error)

          // Fallback to text-based analytics if chart capture fails
          pdf.setTextColor(0, 0, 0)
          pdf.setFontSize(10)
          pdf.text("Performance Analytics (Text Summary):", 20, yPos)
          yPos += 10

          const performanceData = [
            `Assignment Completion: ${analytics.student?.assignmentCompletion || 0}%`,
            `Assessment Completion: ${analytics.student?.assessmentCompletion || 0}%`,
            `Project Completion: ${analytics.student?.projectCompletion || 0}%`,
            `Attendance Rate: ${analytics.student?.attendance || 0}%`,
            `Average Assessment Score: ${analytics.student?.avgAssessmentScore || 0}%`,
          ]

          performanceData.forEach((text) => {
            pdf.text(text, 25, yPos)
            yPos += 7
          })
        }
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
      pdf.save(`Kidzian_Report_${student?.name?.replace(/\s+/g, "_")}_${monthName}_${year}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
    } finally {
      setGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-teal-700 font-semibold text-lg">Loading Kidzian Dashboard...</p>
          <p className="mt-2 text-teal-600">Preparing your learning experience</p>
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
            onClick={fetchStudentData}
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
                  src={student?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Kidzian Learning Platform</h1>
                <p className="text-teal-100 mt-1">Welcome back, {student?.name || "Student"} </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-white text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Gem className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-lg">{analytics?.student?.totalPoints || 0} Points</span>
                </div>
                <div className="text-teal-100">{student?.email}</div>
              </div>
              <button
                onClick={fetchStudentProfile}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
              >
                Refresh Points
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-purple-700">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-blue-700">{assignments.length}</p>
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

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-emerald-700">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Days</p>
                <p className="text-2xl font-bold text-amber-700">{calculateAttendanceDays()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {["overview", "assignments", "assessments", "projects", "analytics", "learnings", "reports"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "learnings" ? "Course Learnings" : tab}
                  </button>
                ),
              )}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Performance Overview */}
                <div>
                  <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-2" />
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Radar Chart */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                      <h4 className="text-lg font-semibold text-teal-700 mb-4">Performance vs Average</h4>
                      <div className="h-64" ref={performanceChartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={generateComparisonData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar name="You" dataKey="student" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                            <Radar name="Average" dataKey="average" stroke="#6b7280" fill="#6b7280" fillOpacity={0.1} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Performance Distribution */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
                      <h4 className="text-lg font-semibold text-teal-700 mb-4">Performance Distribution</h4>
                      <div className="h-64" ref={pieChartRef}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={generatePerformancePieData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}%`}
                            >
                              {generatePerformancePieData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Trend */}
                <div>
                  <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Activity Trend (Last 30 Days)
                  </h3>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="h-64" ref={activityChartRef}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={generateActivityTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="points"
                            fill="#14b8a6"
                            stroke="#14b8a6"
                            fillOpacity={0.3}
                            name="Points Earned"
                          />
                          <Bar yAxisId="right" dataKey="activities" fill="#3b82f6" name="Activities Completed" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Learnings Tab - ENHANCED WITH ACTUAL COURSE DATA */}
            {activeTab === "learnings" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  What You've Learned in Your Courses
                </h3>
                {courseLearnings.length > 0 ? (
                  <div className="space-y-6">
                    {courseLearnings.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-xl font-semibold text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-500">Age Group: {course.ageGroup}</p>
                          </div>
                        </div>

                        {course.about && course.about.length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-lg font-medium text-gray-700 mb-3">About This Course:</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                              {course.about.map((item, index) => (
                                <li key={index} className="text-sm">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-lg font-medium text-gray-700 mb-3">Learning Outcomes:</h5>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                              {course.learningOutcomes.map((outcome, index) => (
                                <li key={index} className="text-sm">
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                          <div className="flex items-center gap-2 text-teal-700">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Course Progress</span>
                          </div>
                          <div className="mt-2 text-sm text-teal-600">
                            You're actively learning and growing in this course!
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No course learning data available yet.</p>
                    <p className="text-sm mt-2">Complete some courses to see your learning outcomes here!</p>
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  My Assignments
                </h3>
                {assignments.length > 0 ? (
                  <div className="space-y-6">
                    {assignments.map((assignment) => {
                      const status = getSubmissionStatus("assignments", assignment._id)
                      const isOverdue = new Date(assignment.dueDate) < new Date() && status === "Not Submitted"

                      return (
                        <div
                          key={assignment._id}
                          className={`bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                            isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 hover:-translate-y-1"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-teal-700">{assignment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            </div>
                            <span
                              className={`px-4 py-2 text-sm rounded-full font-medium ${
                                status === "Graded"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : status === "Submitted"
                                    ? "bg-teal-100 text-teal-800"
                                    : isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isOverdue ? "Overdue" : status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Course:</span> {assignment.course?.title || "Unknown"}
                            </div>
                            <div>
                              <span className="font-medium">Due Date:</span>{" "}
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Max Marks:</span> {assignment.maxMarks}
                            </div>
                            <div>
                              <span className="font-medium">Points:</span> 20
                            </div>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment)
                                setShowAssignmentModal(true)
                              }}
                              className="bg-teal-50 text-teal-600 py-2 px-4 rounded-xl hover:bg-teal-100 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            {status === "Not Submitted" && !isOverdue && (
                              <button
                                onClick={() => {
                                  setSubmissionForm({
                                    ...submissionForm,
                                    type: "assignment",
                                    id: assignment._id,
                                  })
                                  setShowSubmissionModal(true)
                                }}
                                className="bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl hover:bg-emerald-100 transition-colors flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No assignments available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Assessments Tab */}
            {activeTab === "assessments" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  My Assessments
                </h3>
                {assessments.length > 0 ? (
                  <div className="space-y-6">
                    {assessments.map((assessment) => {
                      const status = getSubmissionStatus("assessments", assessment._id)
                      const isOverdue = new Date(assessment.dueDate) < new Date() && status === "Not Submitted"

                      return (
                        <div
                          key={assessment._id}
                          className={`bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                            isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 hover:-translate-y-1"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-indigo-700">{assessment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{assessment.description}</p>
                            </div>
                            <span
                              className={`px-4 py-2 text-sm rounded-full font-medium ${
                                status === "Graded"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : status === "Submitted"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isOverdue ? "Overdue" : status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Course:</span> {assessment.course?.title || "Unknown"}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {assessment.duration} minutes
                            </div>
                            <div>
                              <span className="font-medium">Questions:</span> {assessment.questions?.length || 0}
                            </div>
                            <div>
                              <span className="font-medium">Max Marks:</span> {assessment.maxMarks}
                            </div>
                          </div>

                          {assessment.instructions && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                              <h5 className="font-medium text-blue-800 mb-1">Instructions:</h5>
                              <p className="text-sm text-blue-700">{assessment.instructions}</p>
                            </div>
                          )}

                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedAssessment(assessment)
                                setShowAssessmentModal(true)
                              }}
                              className="bg-indigo-50 text-indigo-600 py-2 px-4 rounded-xl hover:bg-indigo-100 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            {status === "Not Submitted" && !isOverdue && (
                              <button
                                onClick={() => {
                                  setSelectedAssessment(assessment)
                                  setSubmissionForm({
                                    ...submissionForm,
                                    type: "assessment",
                                    id: assessment._id,
                                    answers: new Array(assessment.questions?.length || 0).fill({ answer: "" }),
                                  })
                                  setShowSubmissionModal(true)
                                }}
                                className="bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl hover:bg-emerald-100 transition-colors flex items-center"
                              >
                                <Brain className="w-4 h-4 mr-2" />
                                Take Assessment
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No assessments available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <Code className="w-6 h-6 mr-2" />
                  My Projects
                </h3>
                {projects.length > 0 ? (
                  <div className="space-y-6">
                    {projects.map((project) => {
                      const status = getSubmissionStatus("projects", project._id)
                      const isOverdue = new Date(project.dueDate) < new Date() && status === "Not Submitted"

                      return (
                        <div
                          key={project._id}
                          className={`bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ${
                            isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 hover:-translate-y-1"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-700">{project.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            </div>
                            <span
                              className={`px-4 py-2 text-sm rounded-full font-medium ${
                                status === "Graded"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : status === "Submitted"
                                    ? "bg-blue-100 text-blue-800"
                                    : isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isOverdue ? "Overdue" : status}
                            </span>
                          </div>

                          {project.requirements && project.requirements.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-700 mb-2">Requirements:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {project.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Due Date:</span>{" "}
                              {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Team Size:</span> {project.teamSize}
                            </div>
                            <div>
                              <span className="font-medium">Max Marks:</span> {project.maxMarks}
                            </div>
                            <div>
                              <span className="font-medium">Points:</span> 30
                            </div>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedProject(project)
                                setShowProjectModal(true)
                              }}
                              className="bg-blue-50 text-blue-600 py-2 px-4 rounded-xl hover:bg-blue-100 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            {status === "Not Submitted" && !isOverdue && (
                              <button
                                onClick={() => {
                                  setSubmissionForm({
                                    ...submissionForm,
                                    type: "project",
                                    id: project._id,
                                  })
                                  setShowSubmissionModal(true)
                                }}
                                className="bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl hover:bg-emerald-100 transition-colors flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Submit Project
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
                    <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No projects available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && analytics && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-2" />
                  Performance Analytics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Performance Comparison */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-teal-700 mb-4">You vs Average Student</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generateComparisonData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="metric" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`${value}%`, ""]} />
                          <Legend />
                          <Bar dataKey="student" fill="#14b8a6" name="Your Performance" />
                          <Bar dataKey="average" fill="#6b7280" name="Average Performance" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Activity Points Trend */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-teal-700 mb-4">Daily Points & Activities</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateActivityTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="points" stroke="#14b8a6" strokeWidth={2} name="Points" />
                          <Line
                            type="monotone"
                            dataKey="activities"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Activities"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-teal-700 mb-4">Performance Summary</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Assignment Completion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full"
                              style={{ width: `${analytics.student?.assignmentCompletion || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{analytics.student?.assignmentCompletion || 0}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Assessment Completion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${analytics.student?.assessmentCompletion || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{analytics.student?.assessmentCompletion || 0}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Project Completion</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${analytics.student?.projectCompletion || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{analytics.student?.projectCompletion || 0}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Attendance</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${analytics.student?.attendance || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{analytics.student?.attendance || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Points Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-teal-700 mb-4">Points Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-600" />
                          <span>Total Points Earned</span>
                        </div>
                        <span className="font-bold text-amber-600">{analytics.student?.totalPoints || 0}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>• Daily Login (10 pts/day)</span>
                          <span>Automatic</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Assignment Submission (20 pts)</span>
                          <span>Per submission</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Assessment Completion (10-20 pts)</span>
                          <span>Based on score</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Project Submission (30 pts)</span>
                          <span>Per submission</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div>
                <h3 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Performance Reports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Monthly Report Cards */}
                  {[...Array(6)].map((_, index) => {
                    const date = new Date()
                    date.setMonth(date.getMonth() - index)
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const monthName = date.toLocaleString("default", { month: "long" })

                    return (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-teal-700">
                            {monthName} {year}
                          </h4>
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div>Performance summary for {monthName}</div>
                          <div>Activities, points, and progress</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchMonthlyReport(month, year)}
                            className="flex-1 bg-teal-50 text-teal-600 py-2 px-4 rounded-xl hover:bg-teal-100 transition-colors"
                          >
                            View Report
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Monthly Report Modal */}
      {showReportModal && monthlyReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Kidzian Monthly Report -{" "}
                    {new Date(2024, monthlyReport.month - 1).toLocaleString("default", { month: "long" })}{" "}
                    {monthlyReport.year}
                  </h2>
                  <p className="text-teal-100 mt-1">Founded by Rashmi</p>
                </div>
                <button
                  onClick={() => downloadPDFReport(monthlyReport.month, monthlyReport.year)}
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
                  <div className="text-teal-600 text-sm font-medium">Total Days Active</div>
                  <div className="text-3xl font-bold text-teal-700">{monthlyReport.stats.totalDays}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="text-amber-600 text-sm font-medium">Total Points</div>
                  <div className="text-3xl font-bold text-amber-700">{monthlyReport.stats.totalPoints}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium">Activities Completed</div>
                  <div className="text-3xl font-bold text-blue-700">{monthlyReport.stats.totalActivities}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-medium">Attendance Days</div>
                  <div className="text-3xl font-bold text-emerald-700">{calculateAttendanceDays()}</div>
                </div>
              </div>

              {/* Course Learnings in Report Modal */}
              {courseLearnings.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-teal-700 mb-4">Course Learnings This Month</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseLearnings.slice(0, 4).map((course) => (
                      <div
                        key={course._id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm"
                      >
                        <h5 className="font-medium text-gray-700 mb-2">{course.title}</h5>
                        <div className="text-sm text-gray-600">
                          {course.learningOutcomes?.slice(0, 2).map((outcome, index) => (
                            <div key={index} className="mb-1">
                              • {outcome}
                            </div>
                          ))}
                          {course.learningOutcomes?.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{course.learningOutcomes.length - 2} more outcomes
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">{selectedAssignment.title}</h2>
              <p className="text-teal-100 mt-2">{selectedAssignment.description}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                  <div className="text-teal-600 text-sm font-medium">Due Date</div>
                  <div className="text-xl font-bold text-teal-700">
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium">Max Marks</div>
                  <div className="text-xl font-bold text-blue-700">{selectedAssignment.maxMarks}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-medium">Points</div>
                  <div className="text-xl font-bold text-emerald-700">20</div>
                </div>
              </div>

              {selectedAssignment.instructions && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-medium text-amber-800 mb-2">Instructions:</h4>
                  <p className="text-amber-700">{selectedAssignment.instructions}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Details Modal */}
      {showAssessmentModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h2 className="text-2xl font-bold text-white">{selectedAssessment.title}</h2>
              <p className="text-indigo-100 mt-2">{selectedAssessment.description}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div className="text-indigo-600 text-sm font-medium">Duration</div>
                  <div className="text-xl font-bold text-indigo-700">{selectedAssessment.duration} min</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium">Questions</div>
                  <div className="text-xl font-bold text-blue-700">{selectedAssessment.questions?.length || 0}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-purple-600 text-sm font-medium">Max Marks</div>
                  <div className="text-xl font-bold text-purple-700">{selectedAssessment.maxMarks}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-medium">Points</div>
                  <div className="text-xl font-bold text-emerald-700">10-20</div>
                </div>
              </div>

              {selectedAssessment.instructions && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="font-medium text-amber-800 mb-2">Instructions:</h4>
                  <p className="text-amber-700">{selectedAssessment.instructions}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAssessmentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              <p className="text-blue-100 mt-2">{selectedProject.description}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-blue-600 text-sm font-medium">Due Date</div>
                  <div className="text-xl font-bold text-blue-700">
                    {new Date(selectedProject.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-purple-600 text-sm font-medium">Team Size</div>
                  <div className="text-xl font-bold text-purple-700">{selectedProject.teamSize}</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div className="text-indigo-600 text-sm font-medium">Max Marks</div>
                  <div className="text-xl font-bold text-indigo-700">{selectedProject.maxMarks}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="text-emerald-600 text-sm font-medium">Points</div>
                  <div className="text-xl font-bold text-emerald-700">30</div>
                </div>
              </div>

              {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {selectedProject.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600">
              <h2 className="text-2xl font-bold text-white">
                Submit{" "}
                {submissionForm.type === "assignment"
                  ? "Assignment"
                  : submissionForm.type === "assessment"
                    ? "Assessment"
                    : "Project"}
              </h2>
            </div>

            {submissionForm.type === "assignment" && (
              <form onSubmit={submitAssignment} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content/Answer</label>
                  <textarea
                    value={submissionForm.content}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your assignment content here..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={submissionForm.notes}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium"
                  >
                    Submit Assignment (+20 points)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionModal(false)
                      resetSubmissionForm()
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {submissionForm.type === "assessment" && selectedAssessment && (
              <form onSubmit={submitAssessment} className="p-6 space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Time Limit: {selectedAssessment.duration} minutes</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedAssessment.questions?.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-medium mb-3">
                        Question {index + 1}: {question.question}
                      </h4>

                      {question.type === "multiple-choice" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={(e) => {
                                  const newAnswers = [...submissionForm.answers]
                                  newAnswers[index] = { answer: e.target.value }
                                  setSubmissionForm({ ...submissionForm, answers: newAnswers })
                                }}
                                className="text-teal-600"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "true-false" && (
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value="true"
                              onChange={(e) => {
                                const newAnswers = [...submissionForm.answers]
                                newAnswers[index] = { answer: e.target.value }
                                setSubmissionForm({ ...submissionForm, answers: newAnswers })
                              }}
                              className="text-teal-600"
                            />
                            <span>True</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value="false"
                              onChange={(e) => {
                                const newAnswers = [...submissionForm.answers]
                                newAnswers[index] = { answer: e.target.value }
                                setSubmissionForm({ ...submissionForm, answers: newAnswers })
                              }}
                              className="text-teal-600"
                            />
                            <span>False</span>
                          </label>
                        </div>
                      )}

                      {(question.type === "short-answer" || question.type === "essay") && (
                        <textarea
                          rows={question.type === "essay" ? 4 : 2}
                          placeholder="Enter your answer..."
                          onChange={(e) => {
                            const newAnswers = [...submissionForm.answers]
                            newAnswers[index] = { answer: e.target.value }
                            setSubmissionForm({ ...submissionForm, answers: newAnswers })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium"
                  >
                    Submit Assessment (+10-20 points)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionModal(false)
                      resetSubmissionForm()
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {submissionForm.type === "project" && (
              <form onSubmit={submitProject} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={submissionForm.title}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter project title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                  <textarea
                    value={submissionForm.description}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe your project..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL (Optional)</label>
                    <input
                      type="url"
                      value={submissionForm.githubUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live URL (Optional)</label>
                    <input
                      type="url"
                      value={submissionForm.liveUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members (Optional)</label>
                  <input
                    type="text"
                    value={submissionForm.teamMembers}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, teamMembers: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="John Doe, Jane Smith (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Project File (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium"
                  >
                    Submit Project (+30 points)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionModal(false)
                      resetSubmissionForm()
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
