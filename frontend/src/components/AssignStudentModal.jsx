"use client"

import { useState } from "react"
import axios from "axios"
import { X, Search, UserCheck } from 'lucide-react'

export default function AssignStudentModal({ students, courses, batches, onClose, onSuccess, apiBaseUrl }) {
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBatches = selectedCourse 
    ? batches.filter(batch => batch.courseId === selectedCourse)
    : batches

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleAssignStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      alert("Please select a course and at least one student")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      await axios.post(
        `${apiBaseUrl}/api/admin/assign-students`,
        {
          studentIds: selectedStudents,
          courseId: selectedCourse,
          batchId: selectedBatch || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      alert("Students assigned successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error assigning students:", error)
      alert("Failed to assign students. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Assign Students to Course/Batch</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Course and Batch Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value)
                  setSelectedBatch("") // Reset batch when course changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch (Optional)
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!selectedCourse}
              >
                <option value="">Choose a batch (optional)</option>
                {filteredBatches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Students List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Students ({selectedStudents.length} selected)
              </label>
              <button
                onClick={() => {
                  if (selectedStudents.length === filteredStudents.length) {
                    setSelectedStudents([])
                  } else {
                    setSelectedStudents(filteredStudents.map(s => s._id))
                  }
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <div
                      key={student._id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStudentToggle(student._id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentToggle(student._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Grade {student.grade}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No students found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleAssignStudents}
              disabled={loading || !selectedCourse || selectedStudents.length === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {loading ? "Assigning..." : `Assign ${selectedStudents.length} Student(s)`}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
