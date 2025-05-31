"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState("")
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
    course: "",
    batch: "",
    maxMarks: 100,
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
      const [profileRes, coursesRes, studentsRes, batchesRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/teachers/profile`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/teachers/courses`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/teachers/students`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/teachers/batches`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/teachers/assignments`, { headers }).catch(() => ({ data: [] })),
      ])

      setTeacher(profileRes.data)
      setCourses(coursesRes.data)
      setStudents(studentsRes.data)
      setBatches(batchesRes.data)
      setAssignments(assignmentsRes.data)
      setError("")
    } catch (err) {
      setError("Failed to load teacher data")
      console.error("Error fetching teacher data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get students for selected batch - FIXED VERSION
  const getStudentsForBatch = () => {
    if (!selectedBatch) return []

    console.log("Selected batch:", selectedBatch)
    console.log("All students:", students)

    const filteredStudents = students.filter((student) => {
      if (!student.batches || !Array.isArray(student.batches)) {
        return false
      }

      return student.batches.some((enrollment) => {
        // Convert both IDs to strings for comparison
        const enrollmentBatchId = enrollment.batch?.toString() || enrollment.batch
        const selectedBatchId = selectedBatch.toString()

        console.log("Comparing:", enrollmentBatchId, "with", selectedBatchId)
        return enrollmentBatchId === selectedBatchId
      })
    })

    console.log("Filtered students:", filteredStudents)
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
            onClick={fetchTeacherData}
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
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {teacher?.name || "Teacher"}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Mark Attendance
              </button>
              <button
                onClick={() => setShowAssignmentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Assignment
              </button>
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
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "courses", "students", "batches", "assignments"].map((tab) => (
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowAttendanceModal(true)}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="text-green-600 font-medium">Mark Attendance</div>
                      <div className="text-green-500 text-sm">Record student attendance</div>
                    </button>
                    <button
                      onClick={() => setShowAssignmentModal(true)}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="text-blue-600 font-medium">Create Assignment</div>
                      <div className="text-blue-500 text-sm">Add new assignment</div>
                    </button>
                    <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="text-purple-600 font-medium">View Reports</div>
                      <div className="text-purple-500 text-sm">Student progress reports</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {assignments.length > 0 ? (
                      <div className="space-y-2">
                        {assignments.slice(0, 3).map((assignment) => (
                          <div key={assignment._id} className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">{assignment.title}</span>
                            <span className="text-sm text-gray-500">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No assignments created yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Courses</h3>
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg
                              className="w-6 h-6 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-gray-900">{course.title || course.name}</h4>
                            <p className="text-sm text-gray-500">{course.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Batches: {course.batches?.length || 0}</div>
                          <div>Duration: {course.duration || "Not specified"}</div>
                          <div>Upcoming Classes: {course.upcomingClasses || 0}</div>
                        </div>
                        <button className="mt-4 w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                          Manage Course
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No courses assigned yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Your Students</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batches
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
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
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No students assigned yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === "batches" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Batches</h3>
                {batches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batches.map((batch) => (
                      <div
                        key={batch._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                            <p className="text-sm text-gray-500">{batch.course?.title}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            Students: {batch.students?.length || 0}/{batch.maxStudents || "N/A"}
                          </div>
                          <div>Start Date: {new Date(batch.startDate).toLocaleDateString()}</div>
                          <div>End Date: {new Date(batch.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch._id)
                              setShowAttendanceModal(true)
                            }}
                            className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Mark Attendance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No batches assigned yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Your Assignments</h3>
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create New Assignment
                  </button>
                </div>

                {assignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Course: {assignment.course?.title || "N/A"}</div>
                          <div>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                          <div>Max Marks: {assignment.maxMarks}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                            View Submissions
                          </button>
                          <button className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No assignments created yet.</p>
                    <button
                      onClick={() => setShowAssignmentModal(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Your First Assignment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value)
                    setAttendanceData({}) // Reset attendance data when batch changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAttendanceData({ ...attendanceData, [student._id]: "present" })}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                attendanceData[student._id] === "present"
                                  ? "bg-green-600 text-white"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendanceData({ ...attendanceData, [student._id]: "absent" })}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
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
                      <p className="text-sm mt-2">Please check if students are enrolled in the selected batch.</p>
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
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
                >
                  Submit Attendance
                </button>
                <button
                  onClick={() => {
                    setShowAttendanceModal(false)
                    setAttendanceData({})
                    setSelectedBatch("")
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Create Assignment</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  value={assignmentData.title}
                  onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={assignmentData.description}
                  onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter assignment description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    value={assignmentData.course}
                    onChange={(e) => setAssignmentData({ ...assignmentData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createAssignment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
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
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
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
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
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
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
                  View Assignments
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
                  View Attendance
                </button>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
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
