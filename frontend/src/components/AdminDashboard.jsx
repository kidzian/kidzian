"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Plus, GraduationCap, LayoutDashboard, UserPlus, Search, Edit, Eye } from "lucide-react"

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeBatches: 0,
  })
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [showEnrollStudentModal, setShowEnrollStudentModal] = useState(false)

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    age: "",
    phoneNumber: "",
    grade: "",
  })

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  })

  const [courseForm, setCourseForm] = useState({
    title: "",
    image: "",
    pdf: "",
    ageGroup: "",
    about: "",
    learningOutcomes: "",
  })

  const [batchForm, setBatchForm] = useState({
    name: "",
    courseId: "",
    teacherId: "",
    startDate: "",
    endDate: "",
    maxStudents: "",
    schedule: {
      days: [],
      time: "",
    },
  })

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: "",
    batchId: "",
  })

  const [searchTerm, setSearchTerm] = useState("")

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const headers = getAuthHeaders()

      // Fetch all data in parallel
      const [profileRes, statsRes, coursesRes, batchesRes, teachersRes, studentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/profile`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/admin/stats`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/admin/courses`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/admin/batches`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/admin/teachers`, { headers }).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/admin/recent-students`, { headers }).catch(() => ({ ok: false })),
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setAdmin(profileData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData)
      }

      if (batchesRes.ok) {
        const batchesData = await batchesRes.json()
        setBatches(batchesData)
      }

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setRecentStudents(studentsData)
        setStudents(studentsData)
      }
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/add-student`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(studentForm),
      })

      if (response.ok) {
        alert("Student added successfully!")
        setShowAddStudentModal(false)
        setStudentForm({
          name: "",
          email: "",
          password: "",
          address: "",
          age: "",
          phoneNumber: "",
          grade: "",
        })
        fetchAdminData() // Refresh data
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to add student")
      }
    } catch (err) {
      console.error("Error adding student:", err)
      alert("Failed to add student")
    }
  }

  const handleAddTeacher = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/add-teacher`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(teacherForm),
      })

      if (response.ok) {
        alert("Teacher added successfully!")
        setShowAddTeacherModal(false)
        setTeacherForm({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
        })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to add teacher")
      }
    } catch (err) {
      console.error("Error adding teacher:", err)
      alert("Failed to add teacher")
    }
  }

  const handleAddCourse = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/add-course`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(courseForm),
      })

      if (response.ok) {
        alert("Course added successfully!")
        setShowAddCourseModal(false)
        setCourseForm({
          title: "",
          image: "",
          pdf: "",
          ageGroup: "",
          about: "",
          learningOutcomes: "",
        })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to add course")
      }
    } catch (err) {
      console.error("Error adding course:", err)
      alert("Failed to add course")
    }
  }

  const handleAddBatch = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/add-batch`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(batchForm),
      })

      if (response.ok) {
        alert("Batch created successfully!")
        setShowAddBatchModal(false)
        setBatchForm({
          name: "",
          courseId: "",
          teacherId: "",
          startDate: "",
          endDate: "",
          maxStudents: "",
          schedule: {
            days: [],
            time: "",
          },
        })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create batch")
      }
    } catch (err) {
      console.error("Error creating batch:", err)
      alert("Failed to create batch")
    }
  }

  const handleEnrollStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/enroll-student`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(enrollmentForm),
      })

      if (response.ok) {
        alert("Student enrolled successfully!")
        setShowEnrollStudentModal(false)
        setEnrollmentForm({
          studentId: "",
          batchId: "",
        })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to enroll student")
      }
    } catch (err) {
      console.error("Error enrolling student:", err)
      alert("Failed to enroll student")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-600">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{admin?.name}</span>
            <button onClick={handleLogout} className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalStudents}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalTeachers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalCourses}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <LayoutDashboard className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Batches</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.activeBatches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {["overview", "students", "teachers", "courses", "batches"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
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
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Student
                    </button>
                    <button
                      onClick={() => setShowAddTeacherModal(true)}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Teacher
                    </button>
                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Course
                    </button>
                    <button
                      onClick={() => setShowAddBatchModal(true)}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Batch
                    </button>
                    <button
                      onClick={() => setShowEnrollStudentModal(true)}
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      Enroll Student
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Courses Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Courses</h3>
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {courses.slice(0, 3).map((course, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.batches?.length || 0} batches</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Students */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Students</h3>
                      <button
                        onClick={() => setActiveTab("students")}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {recentStudents.slice(0, 3).map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Students Management</h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </button>
                    <button
                      onClick={() => setShowEnrollStudentModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Enroll Student
                    </button>
                  </div>
                </div>

                {filteredStudents.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <li key={student._id}>
                          <div className="px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {student.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                                <div className="text-sm text-gray-500">
                                  Grade: {student.grade} | Phone: {student.phoneNumber}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {student.batches?.length || 0} batches
                              </span>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No students found. Add your first student to get started.</p>
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add Student
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Teachers Tab */}
            {activeTab === "teachers" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Teachers Management</h3>
                  <button
                    onClick={() => setShowAddTeacherModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </button>
                </div>

                {teachers.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <li key={teacher._id}>
                          <div className="px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-green-700">
                                  {teacher.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                <div className="text-sm text-gray-500">{teacher.email}</div>
                                <div className="text-sm text-gray-500">Phone: {teacher.phoneNumber}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No teachers found. Add your first teacher to get started.</p>
                    <button
                      onClick={() => setShowAddTeacherModal(true)}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add Teacher
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Courses Management</h3>
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </button>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-500">{course.ageGroup}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>Batches: {course.batches?.length || 0}</div>
                          <div className="text-xs text-gray-500 line-clamp-2">{course.about}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses found. Add your first course to get started.</p>
                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add Course
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Batches Tab */}
            {activeTab === "batches" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Batches Management</h3>
                  <button
                    onClick={() => setShowAddBatchModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Batch
                  </button>
                </div>

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
                            <p className="text-sm text-gray-500">{batch.courseName}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            Students: {batch.currentStudents}/{batch.maxStudents}
                          </div>
                          <div>Start: {new Date(batch.startDate).toLocaleDateString()}</div>
                          <div>End: {new Date(batch.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 bg-yellow-50 text-yellow-600 py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors">
                            View Details
                          </button>
                          <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No batches found. Create your first batch to get started.</p>
                    <button
                      onClick={() => setShowAddBatchModal(true)}
                      className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                    >
                      Create Batch
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <input
                  type="text"
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={studentForm.age}
                  onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Teacher</h2>
            </div>
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={teacherForm.password}
                  onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={teacherForm.phoneNumber}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <input
                  type="text"
                  value={courseForm.ageGroup}
                  onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 8-12 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea
                  value={courseForm.about}
                  onChange={(e) => setCourseForm({ ...courseForm, about: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                <textarea
                  value={courseForm.learningOutcomes}
                  onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={courseForm.image}
                  onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF URL</label>
                <input
                  type="url"
                  value={courseForm.pdf}
                  onChange={(e) => setCourseForm({ ...courseForm, pdf: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Create New Batch</h2>
            </div>
            <form onSubmit={handleAddBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={batchForm.name}
                  onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select
                  required
                  value={batchForm.courseId}
                  onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teacher *</label>
                <select
                  required
                  value={batchForm.teacherId}
                  onChange={(e) => setBatchForm({ ...batchForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={batchForm.startDate}
                  onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  required
                  value={batchForm.endDate}
                  onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Students *</label>
                <input
                  type="number"
                  required
                  value={batchForm.maxStudents}
                  onChange={(e) => setBatchForm({ ...batchForm, maxStudents: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Create Batch
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Enroll Student in Batch</h2>
            </div>
            <form onSubmit={handleEnrollStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student *</label>
                <select
                  required
                  value={enrollmentForm.studentId}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} - {student.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                <select
                  required
                  value={enrollmentForm.batchId}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, batchId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name} - {batch.courseName} ({batch.currentStudents}/{batch.maxStudents} students)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Enroll Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnrollStudentModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
