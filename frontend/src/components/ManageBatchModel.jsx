"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, Users, UserCheck, Trash2, Calendar, Clock } from 'lucide-react'

export default function ManageBatchModal({ batch, students, teachers, onClose, onSuccess, apiBaseUrl }) {
  const [assignedStudents, setAssignedStudents] = useState([])
  const [assignedTeacher, setAssignedTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBatchAssignments()
  }, [batch._id])

  const fetchBatchAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${apiBaseUrl}/api/admin/batches/${batch._id}/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setAssignedStudents(response.data.students || [])
      setAssignedTeacher(response.data.teacher || null)
    } catch (error) {
      console.error("Error fetching batch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!confirm("Are you sure you want to remove this student from the batch?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${apiBaseUrl}/api/admin/batches/${batch._id}/students/${studentId}`,
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

  const handleRemoveTeacher = async () => {
    if (!confirm("Are you sure you want to remove the teacher from this batch?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${apiBaseUrl}/api/admin/batches/${batch._id}/teacher`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setAssignedTeacher(null)
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
          <h2 className="text-2xl font-bold text-gray-900">Manage Batch: {batch.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Batch Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{batch.name}</h3>
            <p className="text-gray-600 mb-2">Course: {batch.courseName}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Start: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'Not set'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                End: {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'Not set'}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Time: {batch.schedule?.time || 'Not set'}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Capacity: {batch.currentStudents || 0}/{batch.maxStudents || 0}
              </div>
            </div>
            {batch.schedule?.days && (
              <div className="mt-2 text-sm text-gray-500">
                Days: {batch.schedule.days.join(', ')}
              </div>
            )}
          </div>

          {/* Assigned Teacher */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                Assigned Teacher
              </h3>
            </div>
            
            {assignedTeacher ? (
              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-medium text-gray-900">{assignedTeacher.name}</div>
                      <div className="text-sm text-gray-500">{assignedTeacher.email}</div>
                      <div className="text-xs text-gray-400">{assignedTeacher.department}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveTeacher}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Remove teacher"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-md">
                No teacher assigned to this batch yet.
              </div>
            )}
          </div>

          {/* Assigned Students */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Assigned Students ({assignedStudents.length}/{batch.maxStudents || 0})
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
                No students assigned to this batch yet.
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
