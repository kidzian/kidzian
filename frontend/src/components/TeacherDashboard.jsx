import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, User, ClipboardList, TrendingUp, Plus } from 'lucide-react'
import AttendanceModal from './modals/AttendanceModal'
import AssignmentModal from './modals/AssignmentModal'

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      // Fetch teacher profile
      const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/profile`, { headers })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setTeacher(profileData)
      }

      // Fetch courses
      const coursesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/courses`, { headers })
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)
      }

      // Fetch students
      const studentsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/students`, { headers })
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json()
        setStudents(studentsData)
      }

      // Fetch assignments
      const assignmentsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/assignments`, { headers })
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json()
        setAssignments(assignmentsData)
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err)
      setError('Failed to load dashboard data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const calculateAverageAttendance = () => {
    if (students.length === 0) return 0
    const totalAttendance = students.reduce((sum, student) => sum + (student.attendance || 0), 0)
    return Math.round(totalAttendance / students.length)
  }

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
            onClick={() => navigate('/login')}
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
          <div>
            <h1 className="text-3xl font-bold text-green-600">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {teacher?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
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
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{courses.length}</div>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{students.length}</div>
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
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Assignments</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{assignments.length}</div>
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
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Attendance</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{calculateAverageAttendance()}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['overview', 'courses', 'students', 'assignments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAttendanceModal(true)}
                      className="w-full flex items-center justify-start px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </button>
                    <button
                      onClick={() => setShowAssignmentModal(true)}
                      className="w-full flex items-center justify-start px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </button>
                    <button
                      onClick={() => navigate('/teacher/analytics')}
                      className="w-full flex items-center justify-start px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h3>
                  <div className="space-y-3">
                    {assignments.slice(0, 5).map((assignment) => (
                      <div
                        key={assignment._id}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {assignment.submissions}/{assignment.totalStudents}
                          </p>
                          <p className="text-xs text-gray-500">submitted</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">{course.students} students</p>
                      <p className="text-sm text-gray-600">{course.batches?.length || 0} batches</p>
                    </div>
                    <button
                      onClick={() => navigate(`/teacher/courses/${course._id}`)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Manage Course
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">
                          Grade {student.grade} • {student.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{student.attendance}% attendance</p>
                        <button
                          onClick={() => navigate(`/teacher/students/${student._id}`)}
                          className="mt-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">All Assignments</h3>
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </button>
                </div>
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Course: {assignment.course} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {assignment.submissions}/{assignment.totalStudents}
                        </p>
                        <p className="text-xs text-gray-500">submissions</p>
                        <button
                          onClick={() => navigate(`/teacher/assignments/${assignment._id}`)}
                          className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAttendanceModal && (
        <AttendanceModal
          onClose={() => setShowAttendanceModal(false)}
          onSubmit={fetchTeacherData}
          courses={courses}
          students={students}
        />
      )}

      {showAssignmentModal && (
        <AssignmentModal
          onClose={() => setShowAssignmentModal(false)}
          onSubmit={fetchTeacherData}
          courses={courses}
        />
      )}
    </div>
  )
}

export default TeacherDashboard
