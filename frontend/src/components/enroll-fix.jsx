"use client"

import { useState } from "react"
import axios from "axios"

const EnrollmentFixTool = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const getAuthToken = () => localStorage.getItem("token")
  const getHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  })

  const diagnoseEnrollment = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      const headers = getHeaders()

      // Get all students
      const studentsRes = await axios.get(`${API_BASE_URL}/api/admin/students`, { headers })
      const students = studentsRes.data

      // Get all batches
      const batchesRes = await axios.get(`${API_BASE_URL}/api/admin/batches`, { headers })
      const batches = batchesRes.data

      const analysis = {
        students: students.map((student) => ({
          id: student._id,
          name: student.name,
          email: student.email,
          batchEnrollments: student.batches || [],
          enrolledBatchIds: (student.batches || []).map((b) => (typeof b === "string" ? b : b.batch)),
        })),
        batches: batches.map((batch) => ({
          id: batch._id,
          name: batch.name,
          courseName: batch.courseName,
          teacher: batch.teacher,
          studentsInArray: batch.students || [],
          currentStudents: batch.currentStudents || 0,
          maxStudents: batch.maxStudents,
        })),
        issues: [],
      }

      // Find enrollment mismatches
      analysis.batches.forEach((batch) => {
        const studentsInBatch = batch.studentsInArray.length
        const currentStudentsCount = batch.currentStudents

        if (studentsInBatch !== currentStudentsCount) {
          analysis.issues.push({
            type: "COUNT_MISMATCH",
            batchId: batch.id,
            batchName: batch.name,
            studentsInArray: studentsInBatch,
            currentStudentsCount: currentStudentsCount,
            description: `Batch ${batch.name} has ${studentsInBatch} students in array but currentStudents is ${currentStudentsCount}`,
          })
        }

        // Check if students in batch.students array actually have this batch in their batches array
        batch.studentsInArray.forEach((studentId) => {
          const student = analysis.students.find((s) => s.id === studentId)
          if (student && !student.enrolledBatchIds.includes(batch.id)) {
            analysis.issues.push({
              type: "MISSING_STUDENT_ENROLLMENT",
              batchId: batch.id,
              batchName: batch.name,
              studentId: student.id,
              studentName: student.name,
              description: `Student ${student.name} is in batch ${batch.name} students array but doesn't have this batch in their enrollment`,
            })
          }
        })
      })

      // Check for orphaned student enrollments
      analysis.students.forEach((student) => {
        student.enrolledBatchIds.forEach((batchId) => {
          const batch = analysis.batches.find((b) => b.id === batchId)
          if (batch && !batch.studentsInArray.includes(student.id)) {
            analysis.issues.push({
              type: "MISSING_BATCH_STUDENT",
              batchId: batch.id,
              batchName: batch.name,
              studentId: student.id,
              studentName: student.name,
              description: `Student ${student.name} has batch ${batch.name} in their enrollment but is not in batch students array`,
            })
          }
        })
      })

      setResults(analysis)
    } catch (err) {
      setError(`Error diagnosing enrollment: ${err.message}`)
      console.error("Diagnosis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fixEnrollmentIssue = async (issue) => {
    try {
      const headers = getHeaders()

      if (issue.type === "MISSING_BATCH_STUDENT") {
        // Add student to batch students array
        await axios.put(
          `${API_BASE_URL}/api/admin/batches/${issue.batchId}`,
          {
            $push: { students: issue.studentId },
            $inc: { currentStudents: 1 },
          },
          { headers },
        )

        alert(`Added ${issue.studentName} to ${issue.batchName} students array`)
      } else if (issue.type === "MISSING_STUDENT_ENROLLMENT") {
        // This is more complex - we'd need to add the enrollment to the student
        alert("This fix requires manual intervention - contact developer")
      } else if (issue.type === "COUNT_MISMATCH") {
        // Fix the currentStudents count
        await axios.put(
          `${API_BASE_URL}/api/admin/batches/${issue.batchId}`,
          {
            currentStudents: issue.studentsInArray,
          },
          { headers },
        )

        alert(`Fixed student count for ${issue.batchName}`)
      }

      // Refresh the analysis
      diagnoseEnrollment()
    } catch (err) {
      alert(`Error fixing issue: ${err.message}`)
    }
  }

  const manualEnrollStudent = async (studentId, batchId) => {
    try {
      const headers = getHeaders()

      await axios.post(
        `${API_BASE_URL}/api/admin/enroll-student`,
        {
          studentId,
          batchId,
        },
        { headers },
      )

      alert("Student enrolled successfully!")
      diagnoseEnrollment()
    } catch (err) {
      alert(`Error enrolling student: ${err.response?.data?.message || err.message}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrollment Diagnosis Tool</h1>
        <p className="text-gray-600">
          This tool helps identify and fix enrollment issues between students and batches.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={diagnoseEnrollment}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Diagnose Enrollment Issues"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Issues */}
          {results.issues.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-4">Issues Found ({results.issues.length})</h2>
              <div className="space-y-4">
                {results.issues.map((issue, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-red-800">{issue.type.replace(/_/g, " ")}</h3>
                      <button
                        onClick={() => fixEnrollmentIssue(issue)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Fix
                      </button>
                    </div>
                    <p className="text-red-700 mb-3">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">No Issues Found!</h2>
              <p className="text-green-700">All enrollments look good.</p>
            </div>
          )}

          {/* Batches */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Batches ({results.batches.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Students in Array
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Count</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.batches.map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{batch.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{batch.courseName}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{batch.studentsInArray.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{batch.currentStudents}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{batch.maxStudents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Students */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Students ({results.students.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Enrollments</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{student.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{student.batchEnrollments.length}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              manualEnrollStudent(student.id, e.target.value)
                              e.target.value = ""
                            }
                          }}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="">Enroll in batch...</option>
                          {results.batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrollmentFixTool
