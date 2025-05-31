"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  BarChart3,
  GraduationCap,
} from "lucide-react"

const StudentDashboard = () => {
  const [student, setStudent] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [assignments, setAssignments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)

  // Selected items
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)

  // Form states
  const [submissionForm, setSubmissionForm] = useState({
    assignmentId: "",
    content: "",
    file: null,
    notes: "",
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

  // Fetch all student data
  useEffect(() => {
    fetchStudentData()
  }, [])

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
      const [profileRes, enrollmentsRes, assignmentsRes, attendanceRes, submissionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students/profile`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/students/enrollments`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/assignments`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/attendance`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/students/submissions`, { headers }).catch(() => ({ data: [] })),
      ])

      setStudent(profileRes.data)
      setEnrollments(enrollmentsRes.data)
      setAssignments(assignmentsRes.data)
      setAttendance(attendanceRes.data)
      setSubmissions(submissionsRes.data)
      setError("")
    } catch (err) {
      setError("Failed to load student data")
      console.error("Error fetching student data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Submit assignment
  const submitAssignment = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("assignmentId", submissionForm.assignmentId)
      formData.append("content", submissionForm.content)
      formData.append("notes", submissionForm.notes)
      if (submissionForm.file) {
        formData.append("file", submissionForm.file)
      }

      await axios.post(`${API_BASE_URL}/api/students/submit-assignment`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setShowSubmissionModal(false)
      setSubmissionForm({
        assignmentId: "",
        content: "",
        file: null,
        notes: "",
      })
      fetchStudentData() // Refresh data
      alert("Assignment submitted successfully!")
    } catch (err) {
      console.error("Error submitting assignment:", err)
      alert("Failed to submit assignment: " + (err.response?.data?.message || err.message))
    }
  }

  // Calculate attendance percentage
  const calculateAttendancePercentage = (batchId) => {
    const batchAttendance = attendance.filter((record) => record.batch === batchId)
    if (batchAttendance.length === 0) return 0

    const presentCount = batchAttendance.filter((record) => record.status === "present").length
    return Math.round((presentCount / batchAttendance.length) * 100)
  }

  // Get assignment status
  const getAssignmentStatus = (assignmentId) => {
    const submission = submissions.find((sub) => sub.assignment === assignmentId)
    if (!submission) return "Not Submitted"
    if (submission.grade !== undefined) return "Graded"
    return "Submitted"
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={fetchStudentData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {student?.name || "Student"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <div>Grade: {student?.grade || "Not specified"}</div>
                <div>Email: {student?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.length > 0
                    ? Math.round(
                        enrollments.reduce(
                          (acc, enrollment) => acc + calculateAttendancePercentage(enrollment.batch),
                          0,
                        ) / enrollments.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "courses", "assignments", "attendance", "progress"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600"
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Assignments */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Recent Assignments</h4>
                      {assignments.slice(0, 3).map((assignment) => (
                        <div
                          key={assignment._id}
                          className="flex justify-between items-center p-3 bg-white rounded mb-2"
                        >
                          <div>
                            <div className="font-medium">{assignment.title}</div>
                            <div className="text-sm text-gray-500">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              getAssignmentStatus(assignment._id) === "Graded"
                                ? "bg-green-100 text-green-800"
                                : getAssignmentStatus(assignment._id) === "Submitted"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getAssignmentStatus(assignment._id)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Course Progress */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Course Progress</h4>
                      {enrollments.slice(0, 3).map((enrollment) => (
                        <div key={enrollment._id} className="p-3 bg-white rounded mb-2">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{enrollment.courseName}</div>
                            <div className="text-sm text-gray-500">{enrollment.completion || 0}%</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${enrollment.completion || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Courses</h3>
                {enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-gray-900">{enrollment.courseName}</h4>
                            <p className="text-sm text-gray-500">Batch: {enrollment.batchName || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Progress: {enrollment.completion || 0}%</div>
                          <div>Attendance: {calculateAttendancePercentage(enrollment.batch)}%</div>
                          <div>
                            Classes: {enrollment.lecturesAttended || 0}/{enrollment.totalClasses || 0}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${enrollment.completion || 0}%` }}
                            ></div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCourse(enrollment)
                              setShowCourseModal(true)
                            }}
                            className="w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses enrolled yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Assignments</h3>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                      const status = getAssignmentStatus(assignment._id)
                      const submission = submissions.find((sub) => sub.assignment === assignment._id)
                      const isOverdue = new Date(assignment.dueDate) < new Date() && status === "Not Submitted"

                      return (
                        <div
                          key={assignment._id}
                          className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                            isOverdue ? "border-red-200 bg-red-50" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                            </div>
                            <span
                              className={`px-3 py-1 text-sm rounded-full ${
                                status === "Graded"
                                  ? "bg-green-100 text-green-800"
                                  : status === "Submitted"
                                    ? "bg-blue-100 text-blue-800"
                                    : isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
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
                            {submission && submission.grade !== undefined && (
                              <div>
                                <span className="font-medium">Grade:</span> {submission.grade}/{assignment.maxMarks}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment)
                                setShowAssignmentModal(true)
                              }}
                              className="bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 inline mr-2" />
                              View Details
                            </button>
                            {status === "Not Submitted" && !isOverdue && (
                              <button
                                onClick={() => {
                                  setSubmissionForm({ ...submissionForm, assignmentId: assignment._id })
                                  setShowSubmissionModal(true)
                                }}
                                className="bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Submit
                              </button>
                            )}
                            {submission && (
                              <button className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                                <Download className="w-4 h-4 inline mr-2" />
                                View Submission
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No assignments available yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Records</h3>
                {enrollments.length > 0 ? (
                  <div className="space-y-6">
                    {enrollments.map((enrollment) => {
                      const batchAttendance = attendance.filter((record) => record.batch === enrollment.batch)
                      const attendancePercentage = calculateAttendancePercentage(enrollment.batch)

                      return (
                        <div key={enrollment._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{enrollment.courseName}</h4>
                              <p className="text-sm text-gray-500">Batch: {enrollment.batchName || "Unknown"}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{attendancePercentage}%</div>
                              <div className="text-sm text-gray-500">Attendance</div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Present: {batchAttendance.filter((r) => r.status === "present").length}</span>
                              <span>Absent: {batchAttendance.filter((r) => r.status === "absent").length}</span>
                              <span>Total: {batchAttendance.length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  attendancePercentage >= 75
                                    ? "bg-green-600"
                                    : attendancePercentage >= 50
                                      ? "bg-yellow-600"
                                      : "bg-red-600"
                                }`}
                                style={{ width: `${attendancePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBatch(enrollment)
                              setShowAttendanceModal(true)
                            }}
                            className="bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            View Detailed Records
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No attendance records available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === "progress" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Progress</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Progress */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Overall Progress</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Course Completion</span>
                          <span>
                            {enrollments.length > 0
                              ? Math.round(
                                  enrollments.reduce((acc, enrollment) => acc + (enrollment.completion || 0), 0) /
                                    enrollments.length,
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${
                                enrollments.length > 0
                                  ? Math.round(
                                      enrollments.reduce((acc, enrollment) => acc + (enrollment.completion || 0), 0) /
                                        enrollments.length,
                                    )
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Assignment Completion</span>
                          <span>
                            {assignments.length > 0 ? Math.round((submissions.length / assignments.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${
                                assignments.length > 0 ? Math.round((submissions.length / assignments.length) * 100) : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade Summary */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Grade Summary</h4>
                    <div className="space-y-3">
                      {submissions
                        .filter((sub) => sub.grade !== undefined)
                        .slice(0, 5)
                        .map((submission) => {
                          const assignment = assignments.find((a) => a._id === submission.assignment)
                          const percentage = Math.round((submission.grade / assignment?.maxMarks) * 100)
                          return (
                            <div key={submission._id} className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{assignment?.title || "Unknown Assignment"}</div>
                                <div className="text-sm text-gray-500">
                                  {submission.grade}/{assignment?.maxMarks}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  percentage >= 80
                                    ? "bg-green-100 text-green-800"
                                    : percentage >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </div>
                          )
                        })}
                      {submissions.filter((sub) => sub.grade !== undefined).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No graded assignments yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Details Modal */}
      {showAssignmentModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedAssignment.description || "No description provided"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Course:</span>
                    <span className="ml-2 font-medium">{selectedAssignment.course?.title || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Max Marks:</span>
                    <span className="ml-2 font-medium">{selectedAssignment.maxMarks}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="ml-2 font-medium">{getAssignmentStatus(selectedAssignment._id)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Submit Assignment</h2>
            </div>
            <form onSubmit={submitAssignment} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content/Answer</label>
                <textarea
                  value={submissionForm.content}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your assignment content here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setSubmissionForm({ ...submissionForm, file: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={submissionForm.notes}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Any additional notes..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Submit Assignment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmissionModal(false)
                    setSubmissionForm({
                      assignmentId: "",
                      content: "",
                      file: null,
                      notes: "",
                    })
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.courseName}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Course Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Batch:</span>
                      <span className="ml-2 font-medium">{selectedCourse.batchName || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="ml-2 font-medium">{selectedCourse.completion || 0}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Attendance:</span>
                      <span className="ml-2 font-medium">{calculateAttendancePercentage(selectedCourse.batch)}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Classes Attended:</span>
                      <span className="ml-2 font-medium">
                        {selectedCourse.lecturesAttended || 0}/{selectedCourse.totalClasses || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Course Completion</span>
                        <span>{selectedCourse.completion || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${selectedCourse.completion || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Details Modal */}
      {showAttendanceModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Records</h2>
              <p className="text-gray-600">{selectedBatch.courseName}</p>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {attendance
                  .filter((record) => record.batch === selectedBatch.batch)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString("en-US", { weekday: "long" })}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status === "present" ? (
                          <>
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Present
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 inline mr-1" />
                            Absent
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                {attendance.filter((record) => record.batch === selectedBatch.batch).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance records found.</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
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

export default StudentDashboard
