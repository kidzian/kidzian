import React, { useState } from 'react'
import { X } from 'lucide-react'

const AttendanceModal = ({ onClose, onSubmit, courses, students }) => {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const attendanceData = Object.entries(attendance).map(([studentId, isPresent]) => ({
        studentId,
        isPresent,
        date: selectedDate,
        courseId: selectedCourse,
      }))

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teacher/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          date: selectedDate,
          attendance: attendanceData,
        }),
      })

      if (response.ok) {
        onSubmit()
        onClose()
      } else {
        console.error('Failed to submit attendance')
      }
    } catch (error) {
      console.error('Error submitting attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
            <p className="text-sm text-gray-500">Select course and mark student attendance</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {selectedCourse && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Students</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      id={student._id}
                      checked={attendance[student._id] || false}
                      onChange={() => toggleAttendance(student._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={student._id} className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">Grade {student.grade}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCourse || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceModal
