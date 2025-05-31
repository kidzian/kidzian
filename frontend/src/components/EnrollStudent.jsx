"use client"

import { useState, useEffect } from "react"
import axios from "axios"

export default function EnrollStudentForm() {
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    studentId: "",
    batchId: "",
  })

  // Fetch students and batches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you have endpoints to fetch students and batches
        const [studentsRes, batchesRes] = await Promise.all([axios.get("/api/students"), axios.get("/api/batches")])
        setStudents(studentsRes.data)
        setBatches(batchesRes.data)
      } catch (err) {
        setError("Failed to load data")
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post("/api/enroll-student", formData)
      setSuccess("Student enrolled successfully!")
      setFormData({
        studentId: "",
        batchId: "",
      })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enroll Student in Batch</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-1">
            Select Batch
          </label>
          <select
            id="batchId"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name} - {batch.courseName} ({batch.currentStudents}/{batch.maxStudents} students)
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? "Enrolling Student..." : "Enroll Student"}
        </button>
      </form>
    </div>
  )
}
