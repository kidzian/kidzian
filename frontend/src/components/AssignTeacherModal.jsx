"use client"

import { useState } from "react"
import axios from "axios"
import { X, Search, UserCheck } from 'lucide-react'

export default function AssignTeacherModal({ teachers, courses, batches, onClose, onSuccess, apiBaseUrl }) {
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedBatches, setSelectedBatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const handleBatchToggle = (batchId) => {
    setSelectedBatches(prev =>
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    )
  }

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || (selectedCourses.length === 0 && selectedBatches.length === 0)) {
      alert("Please select a teacher and at least one course or batch")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      await axios.post(
        `${apiBaseUrl}/api/admin/assign-teacher`,
        {
          teacherId: selectedTeacher,
          courseIds: selectedCourses,
          batchIds: selectedBatches
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      alert("Teacher assigned successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error assigning teacher:", error)
      alert("Failed to assign teacher. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Assign Teacher to Courses/Batches</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Teacher Search and Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and Select Teacher *
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {filteredTeachers.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredTeachers.map(teacher => (
                    <div
                      key={teacher._id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                        selectedTeacher === teacher._id ? 'bg-indigo-50 border-indigo-200' : ''
                      }`}
                      onClick={() => setSelectedTeacher(teacher._id)}
                    >
                      <input
                        type="radio"
                        checked={selectedTeacher === teacher._id}
                        onChange={() => setSelectedTeacher(teacher._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {teacher.department || 'No department'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No teachers found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Courses ({selectedCourses.length} selected)
              </label>
              <button
                onClick={() => {
                  if (selectedCourses.length === courses.length) {
                    setSelectedCourses([])
                  } else {
                    setSelectedCourses(courses.map(c => c._id))
                  }
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {selectedCourses.length === courses.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {courses.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {courses.map(course => (
                    <div
                      key={course._id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCourseToggle(course._id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course._id)}
                        onChange={() => handleCourseToggle(course._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {course.ageGroup}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No courses available.
                </div>
              )}
            </div>
          </div>

          {/* Batch Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Batches ({selectedBatches.length} selected)
              </label>
              <button
                onClick={() => {
                  if (selectedBatches.length === batches.length) {
                    setSelectedBatches([])
                  } else {
                    setSelectedBatches(batches.map(b => b._id))
                  }
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {selectedBatches.length === batches.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {batches.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {batches.map(batch => (
                    <div
                      key={batch._id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleBatchToggle(batch._id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(batch._id)}
                        onChange={() => handleBatchToggle(batch._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                        <div className="text-sm text-gray-500">{batch.courseName}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {batch.schedule?.time || 'No schedule'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No batches available.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleAssignTeacher}
              disabled={loading || !selectedTeacher || (selectedCourses.length === 0 && selectedBatches.length === 0)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
            >
              {loading ? "Assigning..." : "Assign Teacher"}
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
