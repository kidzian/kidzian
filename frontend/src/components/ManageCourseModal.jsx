"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, Users, UserCheck, Trash2 } from 'lucide-react'

export default function ManageCourseModal({ course, students, teachers, onClose, onSuccess, apiBaseUrl }) {
  const [assignedStudents, setAssignedStudents] = useState([])
  const [assignedTeachers, setAssignedTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseAssignments()
  }, [course._id])

  const fetchCourseAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${apiBaseUrl}/api/admin/courses/${course._id}/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setAssignedStudents(response.data.students || [])
      setAssignedTeachers(response.data.teachers || [])
    } catch (error) {
      console.error("Error fetching course assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!confirm("Are you sure you want to remove this student from the course?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${apiBaseUrl}/api/admin/courses/${course._id}/students/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setAssignedStudents(prev => prev.filter(s => s._id !== studentId))
      onSuccess()
    } catch (error) {
      console.error("Error removing student:", error)
      alert("Failed to remove student. Please try again.")
    }
  }

  const handleRemoveTeacher = async (teacherId) => {
    if (!confirm("Are you sure you want to remove this teacher from the course?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${apiBaseUrl}/api/admin/courses/${course._id}/teachers/${teacherId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setAssignedTeachers(prev => prev.filter(t => t._id !== teacherId))
      onSuccess()
    } catch (error) {
      console.error("Error removing teacher:", error)
      alert("Failed to remove teacher. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Course: {course.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Course Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Age Group: {course.ageGroup}</span>
              <span>Duration: {course.duration}</span>
              <span>Price: ${course.price}</span>
            </div>
          </div>

          {/* Assigned Teachers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                Assigned Teachers ({assignedTeachers.length})
              </h3>
            </div>
            
            {assignedTeachers.length > 0 ? (
              <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {assignedTeachers.map(teacher => (
                  <div key={teacher._id} className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                        <div className="text-xs text-gray-400">{teacher.department}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveTeacher(teacher._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove teacher"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
                No teachers assigned to this course yet.
              </div>
            )}
          </div>

          {/* Assigned Students */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Assigned Students ({assignedStudents.length})
              </h3>
            </div>
            
            {assignedStudents.length > 0 ? (
              <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {assignedStudents.map(student => (
                  <div key={student._id} className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                        <div className="text-xs text-gray-400">Grade {student.grade}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove student"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
                No students assigned to this course yet.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
