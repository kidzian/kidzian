// import React, { useState, useEffect } from 'react';

// const StudentDashboard = () => {
//   const [attendance, setAttendance] = useState([]);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/students/123/attendance`) // Replace 123 with the student's ID
//       .then((res) => res.json())
//       .then((data) => setAttendance(data));
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Your Attendance</h2>
//       <ul>
//         {attendance.map((record) => (
//           <li key={record._id} className="p-2 rounded">
//             {record.lectureName} - {record.attended ? 'Present' : 'Absent'}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, Trophy, Calendar, FileText } from 'lucide-react'

const StudentDashboard = () => {
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      // Fetch student profile
      const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/student/profile`, { headers })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setStudent(profileData)
      }

      // Fetch courses
      const coursesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/student/courses`, { headers })
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)
      }

      // Fetch assignments
      const assignmentsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/student/assignments`, { headers })
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json()
        setAssignments(assignmentsData)
      }

      // Fetch attendance
      const attendanceResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/student/attendance`, { headers })
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json()
        setAttendance(attendanceData)
      }
    } catch (err) {
      console.error('Error fetching student data:', err)
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

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0
    const presentCount = attendance.filter(a => a.status === 'present').length
    return Math.round((presentCount / attendance.length) * 100)
  }

  const getPendingAssignments = () => {
    return assignments.filter(a => a.status === 'pending')
  }

  const getAverageGrade = () => {
    const gradedAssignments = assignments.filter(a => a.grade !== undefined)
    if (gradedAssignments.length === 0) return 0
    const total = gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0)
    return Math.round(total / gradedAssignments.length)
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
            <h1 className="text-3xl font-bold text-blue-600">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {student?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Grade {student?.grade}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Enrolled Courses</dt>
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
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Attendance</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{calculateAttendancePercentage()}%</div>
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
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{getPendingAssignments().length}</div>
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
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Grade</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{getAverageGrade()}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* My Courses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">My Courses</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your enrolled courses and progress.</p>
            </div>
            <div className="border-t border-gray-200">
              {courses.length > 0 ? (
                <div className="px-4 py-5 space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {course.progress}% Complete
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Teacher: {course.teacher}</span>
                        {course.nextClass && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Next: {new Date(course.nextClass).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-gray-500">No courses enrolled yet.</div>
              )}
            </div>
          </div>

          {/* Pending Assignments */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Assignments</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Assignments due soon.</p>
            </div>
            <div className="border-t border-gray-200">
              {getPendingAssignments().length > 0 ? (
                <div className="px-4 py-5 space-y-4">
                  {getPendingAssignments().slice(0, 5).map((assignment) => (
                    <div key={assignment._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          new Date(assignment.dueDate) < new Date() 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Course: {assignment.course}</span>
                        <button
                          onClick={() => navigate(`/student/assignments/${assignment._id}`)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-gray-500">No pending assignments.</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent attendance and submissions.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 space-y-4">
              {attendance.slice(0, 10).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      record.status === 'present' ? 'bg-green-100' :
                      record.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <CheckCircle className={`h-4 w-4 ${
                        record.status === 'present' ? 'text-green-600' :
                        record.status === 'late' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{record.course}</p>
                      <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
