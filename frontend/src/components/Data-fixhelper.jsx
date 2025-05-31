"use client"

import { useState } from "react"
import axios from "axios"

const DataFixHelper = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const getAuthToken = () => localStorage.getItem("token")
  const getHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  })

  const diagnoseDataIssues = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      const headers = getHeaders()

      // Get teacher profile
      const teacherRes = await axios.get(`${API_BASE_URL}/api/teachers/profile`, { headers })
      const teacher = teacherRes.data

      // Get all batches for this teacher
      const batchesRes = await axios.get(`${API_BASE_URL}/api/teachers/batches`, { headers })
      const batches = batchesRes.data

      // Get all students
      let allStudents = []
      try {
        const studentsRes = await axios.get(`${API_BASE_URL}/api/teachers/students`, { headers })
        allStudents = studentsRes.data
      } catch (err) {
        try {
          const adminStudentsRes = await axios.get(`${API_BASE_URL}/api/admin/students`, { headers })
          allStudents = adminStudentsRes.data
        } catch (adminErr) {
          console.log("Could not fetch students from either endpoint")
        }
      }

      // Analyze the data
      const analysis = {
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
        },
        batches: batches.map((batch) => ({
          id: batch._id,
          name: batch.name,
          teacherId: batch.teacher,
          teacherMatches: batch.teacher === teacher._id,
          studentsInBatch: batch.students?.length || 0,
          currentStudents: batch.currentStudents || 0,
          course: batch.course?.title || batch.courseName,
        })),
        students: allStudents.map((student) => ({
          id: student._id,
          name: student.name,
          email: student.email,
          batchesCount: student.batches?.length || 0,
          batches:
            student.batches?.map((b) => ({
              batchId: typeof b === "string" ? b : b.batch,
              enrollmentData: b,
            })) || [],
        })),
        issues: [],
      }

      // Identify issues
      const teacherIdMismatches = analysis.batches.filter((b) => !b.teacherMatches)
      if (teacherIdMismatches.length > 0) {
        analysis.issues.push({
          type: "TEACHER_ID_MISMATCH",
          description: "Some batches have different teacher IDs",
          details: teacherIdMismatches,
          solution: "Update batch.teacher field to match the correct teacher ID",
        })
      }

      const emptyBatches = analysis.batches.filter((b) => b.studentsInBatch === 0)
      if (emptyBatches.length > 0) {
        analysis.issues.push({
          type: "EMPTY_BATCHES",
          description: "Some batches have no students enrolled",
          details: emptyBatches,
          solution: "Enroll students in batches or check enrollment process",
        })
      }

      const orphanedStudents = analysis.students.filter(
        (s) => s.batchesCount > 0 && !s.batches.some((sb) => analysis.batches.some((b) => b.id === sb.batchId)),
      )
      if (orphanedStudents.length > 0) {
        analysis.issues.push({
          type: "ORPHANED_STUDENTS",
          description: "Students enrolled in batches that don't belong to this teacher",
          details: orphanedStudents,
          solution: "Check student enrollment data or batch assignments",
        })
      }

      setResults(analysis)
    } catch (err) {
      setError(`Error diagnosing data: ${err.message}`)
      console.error("Diagnosis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fixTeacherIdMismatch = async (batchId, correctTeacherId) => {
    try {
      const headers = getHeaders()
      await axios.put(
        `${API_BASE_URL}/api/admin/batches/${batchId}`,
        {
          teacher: correctTeacherId,
        },
        { headers },
      )

      alert("Batch teacher ID updated successfully!")
      diagnoseDataIssues() // Refresh the analysis
    } catch (err) {
      alert(`Error updating batch: ${err.message}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Diagnosis Tool</h1>
        <p className="text-gray-600">
          This tool helps identify and fix data inconsistencies in your teacher dashboard.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={diagnoseDataIssues}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Diagnose Data Issues"}
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
          {/* Teacher Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Teacher Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">ID:</span>
                <span className="ml-2 font-mono text-sm">{results.teacher.id}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <span className="ml-2">{results.teacher.name}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <span className="ml-2">{results.teacher.email}</span>
              </div>
            </div>
          </div>

          {/* Issues */}
          {results.issues.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-4">Issues Found ({results.issues.length})</h2>
              <div className="space-y-4">
                {results.issues.map((issue, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-red-800">{issue.type.replace(/_/g, " ")}</h3>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {issue.details.length} affected
                      </span>
                    </div>
                    <p className="text-red-700 mb-3">{issue.description}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Solution:</strong> {issue.solution}
                    </p>

                    {issue.type === "TEACHER_ID_MISMATCH" && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Affected Batches:</h4>
                        {issue.details.map((batch) => (
                          <div key={batch.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div>
                              <span className="font-medium">{batch.name}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                (Current teacher ID: {batch.teacherId})
                              </span>
                            </div>
                            <button
                              onClick={() => fixTeacherIdMismatch(batch.id, results.teacher.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Fix
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">No Issues Found!</h2>
              <p className="text-green-700">Your data looks good. All relationships are properly configured.</p>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teacher Match</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.batches.map((batch) => (
                    <tr key={batch.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{batch.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{batch.course}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            batch.teacherMatches ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {batch.teacherMatches ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {batch.studentsInBatch} / {batch.currentStudents}
                      </td>
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
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batches</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch IDs</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{student.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{student.batchesCount}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 font-mono">
                        {student.batches.map((b) => b.batchId).join(", ") || "None"}
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

export default DataFixHelper
