
"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  User,
  Plus,
  GraduationCap,
  LayoutDashboard,
  UserPlus,
  Search,
  Edit,
  Eye,
  Trash2,
  X,
  Upload,
  FileText,
  ImageIcon,
} from "lucide-react"

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
  const [showEditStudentModal, setShowEditStudentModal] = useState(false)
  const [showViewStudentModal, setShowViewStudentModal] = useState(false)
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false)

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false)
  const [showViewTeacherModal, setShowViewTeacherModal] = useState(false)
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false)

  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [showEditCourseModal, setShowEditCourseModal] = useState(false)
  const [showViewCourseModal, setShowViewCourseModal] = useState(false)
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false)

  const [showAddBatchModal, setShowAddBatchModal] = useState(false)
  const [showEditBatchModal, setShowEditBatchModal] = useState(false)
  const [showViewBatchModal, setShowViewBatchModal] = useState(false)
  const [showDeleteBatchModal, setShowDeleteBatchModal] = useState(false)

  const [showEnrollStudentModal, setShowEnrollStudentModal] = useState(false)

  // Selected items for edit/view/delete
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)

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

  // Updated course form to handle files
  const [courseForm, setCourseForm] = useState({
    title: "",
    imageFile: null,
    pdfFile: null,
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

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  })

  // New header function for FormData requests (no Content-Type)
  const getFormDataHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  })

  useEffect(() => {
    fetchAdminData()
  }, [])

  // Fixed: Separate function to fetch all students for enrollment
  const fetchAllStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const studentsData = await response.json()
        setStudents(studentsData)
        return studentsData
      } else {
        console.error("Failed to fetch students")
        return []
      }
    } catch (err) {
      console.error("Error fetching students:", err)
      return []
    }
  }

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
        // Fixed: Also fetch all students for enrollment
        await fetchAllStudents()
      } else {
        // If recent students fails, still try to fetch all students
        await fetchAllStudents()
      }
    } catch (err) {
      console.error("Error fetching admin data:", err)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fixed: Function to refresh students when enrollment modal opens
  const handleOpenEnrollmentModal = async () => {
    setShowEnrollStudentModal(true)
    // Refresh students list when opening enrollment modal
    await fetchAllStudents()
  }

  // File handling functions
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      setCourseForm((prev) => ({
        ...prev,
        [fileType]: file,
      }))
    }
  }

  // CRUD Operations for Students
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
        resetStudentForm()
        fetchAdminData()
        // Refresh students list for enrollment
        await fetchAllStudents()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to add student")
      }
    } catch (err) {
      console.error("Error adding student:", err)
      alert("Failed to add student")
    }
  }

  const handleEditStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/students/${selectedStudent._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(studentForm),
      })

      if (response.ok) {
        alert("Student updated successfully!")
        setShowEditStudentModal(false)
        resetStudentForm()
        setSelectedStudent(null)
        fetchAdminData()
        // Refresh students list for enrollment
        await fetchAllStudents()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update student")
      }
    } catch (err) {
      console.error("Error updating student:", err)
      alert("Failed to update student")
    }
  }

  const handleDeleteStudent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/students/${selectedStudent._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        alert("Student deleted successfully!")
        setShowDeleteStudentModal(false)
        setSelectedStudent(null)
        fetchAdminData()
        // Refresh students list for enrollment
        await fetchAllStudents()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete student")
      }
    } catch (err) {
      console.error("Error deleting student:", err)
      alert("Failed to delete student")
    }
  }

  // CRUD Operations for Teachers
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
        resetTeacherForm()
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

  const handleEditTeacher = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${selectedTeacher._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(teacherForm),
      })

      if (response.ok) {
        alert("Teacher updated successfully!")
        setShowEditTeacherModal(false)
        resetTeacherForm()
        setSelectedTeacher(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update teacher")
      }
    } catch (err) {
      console.error("Error updating teacher:", err)
      alert("Failed to update teacher")
    }
  }

  const handleDeleteTeacher = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${selectedTeacher._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        alert("Teacher deleted successfully!")
        setShowDeleteTeacherModal(false)
        setSelectedTeacher(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete teacher")
      }
    } catch (err) {
      console.error("Error deleting teacher:", err)
      alert("Failed to delete teacher")
    }
  }

  // Updated CRUD Operations for Courses with file upload
  const handleAddCourse = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", courseForm.title)
      formData.append("ageGroup", courseForm.ageGroup)
      formData.append("about", courseForm.about)
      formData.append("learningOutcomes", courseForm.learningOutcomes)

      if (courseForm.imageFile) {
        formData.append("image", courseForm.imageFile)
      }
      if (courseForm.pdfFile) {
        formData.append("pdf", courseForm.pdfFile)
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/add-course`, {
        method: "POST",
        headers: getFormDataHeaders(),
        body: formData,
      })

      if (response.ok) {
        alert("Course added successfully!")
        setShowAddCourseModal(false)
        resetCourseForm()
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

  const handleEditCourse = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", courseForm.title)
      formData.append("ageGroup", courseForm.ageGroup)
      formData.append("about", courseForm.about)
      formData.append("learningOutcomes", courseForm.learningOutcomes)

      if (courseForm.imageFile) {
        formData.append("image", courseForm.imageFile)
      }
      if (courseForm.pdfFile) {
        formData.append("pdf", courseForm.pdfFile)
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: getFormDataHeaders(),
        body: formData,
      })

      if (response.ok) {
        alert("Course updated successfully!")
        setShowEditCourseModal(false)
        resetCourseForm()
        setSelectedCourse(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update course")
      }
    } catch (err) {
      console.error("Error updating course:", err)
      alert("Failed to update course")
    }
  }

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/courses/${selectedCourse._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        alert("Course deleted successfully!")
        setShowDeleteCourseModal(false)
        setSelectedCourse(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete course")
      }
    } catch (err) {
      console.error("Error deleting course:", err)
      alert("Failed to delete course")
    }
  }

  // CRUD Operations for Batches
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
        resetBatchForm()
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

  const handleEditBatch = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/batches/${selectedBatch._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(batchForm),
      })

      if (response.ok) {
        alert("Batch updated successfully!")
        setShowEditBatchModal(false)
        resetBatchForm()
        setSelectedBatch(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update batch")
      }
    } catch (err) {
      console.error("Error updating batch:", err)
      alert("Failed to update batch")
    }
  }

  const handleDeleteBatch = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/batches/${selectedBatch._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        alert("Batch deleted successfully!")
        setShowDeleteBatchModal(false)
        setSelectedBatch(null)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete batch")
      }
    } catch (err) {
      console.error("Error deleting batch:", err)
      alert("Failed to delete batch")
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

  // Helper functions to reset forms
  const resetStudentForm = () => {
    setStudentForm({
      name: "",
      email: "",
      password: "",
      address: "",
      age: "",
      phoneNumber: "",
      grade: "",
    })
  }

  const resetTeacherForm = () => {
    setTeacherForm({
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    })
  }

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      imageFile: null,
      pdfFile: null,
      ageGroup: "",
      about: "",
      learningOutcomes: "",
    })
  }

  const resetBatchForm = () => {
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
  }

  // Helper functions to open edit modals
  const openEditStudentModal = (student) => {
    setSelectedStudent(student)
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      password: "", // Don't populate password for security
      address: student.address || "",
      age: student.age || "",
      phoneNumber: student.phoneNumber || "",
      grade: student.grade || "",
    })
    setShowEditStudentModal(true)
  }

  const openEditTeacherModal = (teacher) => {
    setSelectedTeacher(teacher)
    setTeacherForm({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "", // Don't populate password for security
      phoneNumber: teacher.phoneNumber || "",
    })
    setShowEditTeacherModal(true)
  }

  const openEditCourseModal = (course) => {
    setSelectedCourse(course)
    setCourseForm({
      title: course.title || "",
      imageFile: null,
      pdfFile: null,
      ageGroup: course.ageGroup || "",
      about: course.about || "",
      learningOutcomes: course.learningOutcomes || "",
    })
    setShowEditCourseModal(true)
  }

  const openEditBatchModal = (batch) => {
    setSelectedBatch(batch)
    setBatchForm({
      name: batch.name || "",
      courseId: batch.course || "",
      teacherId: batch.teacher || "",
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
      maxStudents: batch.maxStudents || "",
      schedule: batch.schedule || { days: [], time: "" },
    })
    setShowEditBatchModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/lms"
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-4">{error}</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow border-b-4 border-teal-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">

           <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
    <img
    src={admin?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}

      alt="Profile"
      className="w-12 h-12 rounded-full object-cover"
    />
    
  </div>
  <h1 className="text-3xl font-bold text-teal-700">Admin Dashboard</h1>
  <div></div>
          </div>
          
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
          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-teal-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                  <GraduationCap className="h-6 w-6 text-teal-700" />
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

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
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

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-teal-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-teal-700" />
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

          <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
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
                      ? "border-teal-700 text-teal-700"
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
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
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
                      className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
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
                      onClick={handleOpenEnrollmentModal}
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
                        className="text-teal-700 hover:text-teal-600 text-sm font-medium"
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
                          <div className="flex-shrink-0 h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-teal-700" />
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
                        className="text-teal-700 hover:text-teal-600 text-sm font-medium"
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
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </button>
                    <button
                      onClick={handleOpenEnrollmentModal}
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
                              <button
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowViewStudentModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditStudentModal(student)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student)
                                  setShowDeleteStudentModal(true)
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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
                      className="mt-4 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg"
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
                              <button
                                onClick={() => {
                                  setSelectedTeacher(teacher)
                                  setShowViewTeacherModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditTeacherModal(teacher)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTeacher(teacher)
                                  setShowDeleteTeacherModal(true)
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
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
                    className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg flex items-center"
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
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-teal-700" />
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
                          <button
                            onClick={() => {
                              setSelectedCourse(course)
                              setShowViewCourseModal(true)
                            }}
                            className="flex-1 bg-teal-50 text-teal-700 py-2 px-4 rounded-lg hover:bg-teal-100 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openEditCourseModal(course)}
                            className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourse(course)
                              setShowDeleteCourseModal(true)
                            }}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
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
                      className="mt-4 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg"
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
                          <button
                            onClick={() => {
                              setSelectedBatch(batch)
                              setShowViewBatchModal(true)
                            }}
                            className="flex-1 bg-yellow-50 text-yellow-600 py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openEditBatchModal(batch)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch)
                              setShowDeleteBatchModal(true)
                            }}
                            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
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
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <input
                  type="text"
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={studentForm.age}
                  onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudentModal(false)
                    resetStudentForm()
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

      {/* Updated Add Course Modal with File Upload */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b bg-teal-600 text-white rounded-t-xl">
              <h2 className="text-2xl font-bold">Add New Course</h2>
              <p className="text-teal-100">Create a new course for your platform</p>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <input
                  type="text"
                  value={courseForm.ageGroup}
                  onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="e.g., 8-12 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Course</label>
                <textarea
                  value={courseForm.about}
                  onChange={(e) => setCourseForm({ ...courseForm, about: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Describe the course..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                <textarea
                  value={courseForm.learningOutcomes}
                  onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="What will students learn..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "imageFile")}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-teal-700" />
                        <p className="mb-2 text-sm text-teal-700">
                          <span className="font-semibold">Click to upload</span> course image
                        </p>
                        <p className="text-xs text-teal-600">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                    </label>
                    {courseForm.imageFile && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-1" />
                        {courseForm.imageFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course PDF</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "pdfFile")}
                      className="hidden"
                      id="pdfUpload"
                    />
                    <label
                      htmlFor="pdfUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-purple-500" />
                        <p className="mb-2 text-sm text-purple-600">
                          <span className="font-semibold">Click to upload</span> course PDF
                        </p>
                        <p className="text-xs text-purple-500">PDF files only (MAX. 10MB)</p>
                      </div>
                    </label>
                    {courseForm.pdfFile && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-1" />
                        {courseForm.pdfFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCourseModal(false)
                    resetCourseForm()
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

      {/* Updated Edit Course Modal with File Upload */}
      {showEditCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b bg-teal-600 text-white rounded-t-xl">
              <h2 className="text-2xl font-bold">Edit Course</h2>
              <p className="text-teal-100">Update course information</p>
            </div>
            <form onSubmit={handleEditCourse} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <input
                  type="text"
                  value={courseForm.ageGroup}
                  onChange={(e) => setCourseForm({ ...courseForm, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="e.g., 8-12 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Course</label>
                <textarea
                  value={courseForm.about}
                  onChange={(e) => setCourseForm({ ...courseForm, about: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="Describe the course..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                <textarea
                  value={courseForm.learningOutcomes}
                  onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                  placeholder="What will students learn..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                  {selectedCourse.image && (
                    <div className="mb-2 text-sm text-gray-600">
                      Current:{" "}
                      <a
                        href={selectedCourse.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:underline"
                      >
                        View current image
                      </a>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "imageFile")}
                      className="hidden"
                      id="editImageUpload"
                    />
                    <label
                      htmlFor="editImageUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-teal-700" />
                        <p className="mb-2 text-sm text-teal-700">
                          <span className="font-semibold">Click to upload</span> new image
                        </p>
                        <p className="text-xs text-teal-600">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                    </label>
                    {courseForm.imageFile && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-1" />
                        {courseForm.imageFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course PDF</label>
                  {selectedCourse.pdf && (
                    <div className="mb-2 text-sm text-gray-600">
                      Current:{" "}
                      <a
                        href={selectedCourse.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        View current PDF
                      </a>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "pdfFile")}
                      className="hidden"
                      id="editPdfUpload"
                    />
                    <label
                      htmlFor="editPdfUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText className="w-8 h-8 mb-2 text-purple-500" />
                        <p className="mb-2 text-sm text-purple-600">
                          <span className="font-semibold">Click to upload</span> new PDF
                        </p>
                        <p className="text-xs text-purple-500">PDF files only (MAX. 10MB)</p>
                      </div>
                    </label>
                    {courseForm.pdfFile && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-1" />
                        {courseForm.pdfFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Update Course
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCourseModal(false)
                    setSelectedCourse(null)
                    resetCourseForm()
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

      {/* Edit Student Modal */}
      {showEditStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Edit Student</h2>
            </div>
            <form onSubmit={handleEditStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={studentForm.phoneNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <input
                  type="text"
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={studentForm.age}
                  onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Update Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStudentModal(false)
                    setSelectedStudent(null)
                    resetStudentForm()
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

      {/* View Student Modal */}
      {showViewStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
              <button onClick={() => setShowViewStudentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
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
                      <span className="ml-2 font-medium">{selectedStudent.phoneNumber || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Grade:</span>
                      <span className="ml-2 font-medium">{selectedStudent.grade || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Age:</span>
                      <span className="ml-2 font-medium">{selectedStudent.age || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="ml-2 font-medium">{selectedStudent.address || "Not provided"}</span>
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
                  {selectedStudent.batches && selectedStudent.batches.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Enrolled Batches</h4>
                      <div className="space-y-2">
                        {selectedStudent.batches.map((enrollment, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="font-medium">{enrollment.courseName || "Unknown Course"}</div>
                            <div className="text-sm text-gray-600">Progress: {enrollment.completion || 0}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {showDeleteStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Delete Student</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{selectedStudent.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteStudent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Delete Student
                </button>
                <button
                  onClick={() => {
                    setShowDeleteStudentModal(false)
                    setSelectedStudent(null)
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

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
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
                  onClick={() => {
                    setShowAddTeacherModal(false)
                    resetTeacherForm()
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

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Edit Teacher</h2>
            </div>
            <form onSubmit={handleEditTeacher} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
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
                  Update Teacher
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTeacherModal(false)
                    setSelectedTeacher(null)
                    resetTeacherForm()
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

      {/* View Teacher Modal */}
      {showViewTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Teacher Details</h2>
              <button onClick={() => setShowViewTeacherModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedTeacher.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{selectedTeacher.email}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{selectedTeacher.phoneNumber || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Joined:</span>
                      <span className="ml-2 font-medium">
                        {selectedTeacher.createdAt ? new Date(selectedTeacher.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Active Batches:</span>
                      <span className="ml-2 font-medium">
                        {batches.filter((batch) => batch.teacher === selectedTeacher._id).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Students:</span>
                      <span className="ml-2 font-medium">
                        {batches
                          .filter((batch) => batch.teacher === selectedTeacher._id)
                          .reduce((total, batch) => total + (batch.currentStudents || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Teacher Modal */}
      {showDeleteTeacherModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Delete Teacher</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{selectedTeacher.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteTeacher}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Delete Teacher
                </button>
                <button
                  onClick={() => {
                    setShowDeleteTeacherModal(false)
                    setSelectedTeacher(null)
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

      {/* View Course Modal */}
      {showViewCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
              <button onClick={() => setShowViewCourseModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Course Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Title:</span>
                      <span className="ml-2 font-medium">{selectedCourse.title}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Age Group:</span>
                      <span className="ml-2 font-medium">{selectedCourse.ageGroup || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Batches:</span>
                      <span className="ml-2 font-medium">{selectedCourse.batches?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">About:</span>
                      <p className="mt-1 text-gray-700">{selectedCourse.about || "No description provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Learning Outcomes:</span>
                      <p className="mt-1 text-gray-700">
                        {selectedCourse.learningOutcomes || "No learning outcomes specified"}
                      </p>
                    </div>
                    {selectedCourse.image && (
                      <div>
                        <span className="text-sm text-gray-600">Image:</span>
                        <a
                          href={selectedCourse.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-teal-700 hover:text-teal-600"
                        >
                          View Image
                        </a>
                      </div>
                    )}
                    {selectedCourse.pdf && (
                      <div>
                        <span className="text-sm text-gray-600">PDF:</span>
                        <a
                          href={selectedCourse.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-teal-700 hover:text-teal-600"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeleteCourseModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Delete Course</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{selectedCourse.title}</strong>? This action cannot be undone
                and will affect all associated batches.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCourse}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Delete Course
                </button>
                <button
                  onClick={() => {
                    setShowDeleteCourseModal(false)
                    setSelectedCourse(null)
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

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
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
                  onClick={() => {
                    setShowAddBatchModal(false)
                    resetBatchForm()
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

      {/* Edit Batch Modal */}
      {showEditBatchModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Edit Batch</h2>
            </div>
            <form onSubmit={handleEditBatch} className="p-6 space-y-4">
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
                  Update Batch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditBatchModal(false)
                    setSelectedBatch(null)
                    resetBatchForm()
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

      {/* View Batch Modal */}
      {showViewBatchModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Batch Details</h2>
              <button onClick={() => setShowViewBatchModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedBatch.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Course:</span>
                      <span className="ml-2 font-medium">{selectedBatch.courseName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Teacher:</span>
                      <span className="ml-2 font-medium">
                        {teachers.find((t) => t._id === selectedBatch.teacher)?.name || "Not assigned"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedBatch.startDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedBatch.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Current Students:</span>
                      <span className="ml-2 font-medium">{selectedBatch.currentStudents}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Max Students:</span>
                      <span className="ml-2 font-medium">{selectedBatch.maxStudents}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Available Spots:</span>
                      <span className="ml-2 font-medium">
                        {selectedBatch.maxStudents - selectedBatch.currentStudents}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          new Date(selectedBatch.endDate) > new Date()
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {new Date(selectedBatch.endDate) > new Date() ? "Active" : "Completed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Batch Modal */}
      {showDeleteBatchModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Delete Batch</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{selectedBatch.name}</strong>? This action cannot be undone and
                will affect all enrolled students.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteBatch}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Delete Batch
                </button>
                <button
                  onClick={() => {
                    setShowDeleteBatchModal(false)
                    setSelectedBatch(null)
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

      {/* Enroll Student Modal - Fixed with better student loading */}
      {showEnrollStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Enroll Student in Batch</h2>
              <p className="text-sm text-gray-600 mt-1">
                Available Students: {students.length} | Available Batches: {batches.length}
              </p>
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
                {students.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">No students available. Please add students first.</p>
                )}
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
                {batches.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">No batches available. Please create batches first.</p>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={students.length === 0 || batches.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors"
                >
                  Enroll Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEnrollStudentModal(false)
                    setEnrollmentForm({ studentId: "", batchId: "" })
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
    </div>
  )
}

export default AdminDashboard
