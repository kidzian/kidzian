"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const BatchManagement = () => {
  const [batches, setBatches] = useState([])
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBatch, setEditingBatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  // Fetch all data when component mounts
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No token found")
        setLoading(false)
        return
      }

      const headers = { Authorization: `Bearer ${token}` }

      // Fetch batches, courses, and teachers in parallel
      const [batchesRes, coursesRes, teachersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/batches`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/courses`, { headers }).catch((err) => {
          console.error("Error fetching courses:", err)
          return { data: [] }
        }),
        axios.get(`${API_BASE_URL}/api/admin/teachers`, { headers }).catch((err) => {
          console.error("Error fetching teachers:", err)
          return { data: [] }
        }),
      ])

      setBatches(batchesRes.data)
      setCourses(coursesRes.data)
      setTeachers(teachersRes.data)

      console.log("Courses loaded:", coursesRes.data)
      console.log("Teachers loaded:", teachersRes.data)

      setLoading(false)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data")
      setLoading(false)
    }
  }

  const handleAddBatch = async (batchData) => {
    try {
      const token = localStorage.getItem("token")

      // Match the backend field names exactly as expected by the route
      const payload = {
        name: batchData.name,
        courseId: batchData.course, // Backend route expects 'courseId'
        teacherId: batchData.teacher, // Backend route expects 'teacherId'
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        maxStudents: Number.parseInt(batchData.maxStudents),
        schedule: {
          days: batchData.scheduleDays,
          time: batchData.scheduleTime,
        },
      }

      console.log("Sending payload:", payload)

      // Use the correct endpoint from your backend
      const response = await axios.post(`${API_BASE_URL}/api/admin/add-batch`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Batch created:", response.data)

      // Refresh the batches list
      fetchAllData()
      setShowAddForm(false)
      alert("Batch created successfully!")
    } catch (err) {
      console.error("Error creating batch:", err)
      console.error("Error response:", err.response?.data)

      // Show specific error message
      const errorMessage = err.response?.data?.message || "Failed to create batch. Please try again."
      alert(errorMessage)
    }
  }

  const handleEditBatch = async (batchData) => {
    try {
      console.log("Editing batch ID:", editingBatch._id);

      const token = localStorage.getItem("token")

      const payload = {
  name: batchData.name,
  course: batchData.course, // ObjectId
  courseName: batchData.courseName, // Add this line
  teacher: batchData.teacher, // ObjectId
  startDate: batchData.startDate,
  endDate: batchData.endDate,
  maxStudents: Number.parseInt(batchData.maxStudents),
  schedule: {
    days: batchData.scheduleDays,
    time: batchData.scheduleTime,
  },
};

      // You'll need to create an update endpoint in your backend
      await axios.put(`${API_BASE_URL}/api/admin/batches/${editingBatch._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Refresh the batches list
      fetchAllData()
      setEditingBatch(null)
      alert("Batch updated successfully!")
    } catch (err) {
      console.error("Error updating batch:", err)
      const errorMessage = err.response?.data?.message || "Failed to update batch. Please try again."
      alert(errorMessage)
    }
  }

  const handleDeleteBatch = async (batchId) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        const token = localStorage.getItem("token")

        // You'll need to create a delete endpoint in your backend
        await axios.delete(`${API_BASE_URL}/api/admin/batches/${batchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setBatches(batches.filter((batch) => batch._id !== batchId))
        alert("Batch deleted successfully!")
      } catch (err) {
        console.error("Error deleting batch:", err)
        const errorMessage = err.response?.data?.message || "Failed to delete batch. Please try again."
        alert(errorMessage)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
          <button onClick={fetchAllData} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
            <p className="text-gray-600 mt-2">Manage course batches and schedules</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Batch
          </button>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Debug: Courses loaded: {courses.length}, Teachers loaded: {teachers.length}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Batches</p>
                <p className="text-3xl font-bold text-gray-900">{batches.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {batches.reduce((total, batch) => total + (batch.currentStudents || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-3xl font-bold text-gray-900">
                  {batches.filter((batch) => new Date(batch.endDate) > new Date()).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Capacity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {batches.length > 0
                    ? Math.round(
                        batches.reduce(
                          (total, batch) => total + ((batch.currentStudents || 0) / (batch.maxStudents || 1)) * 100,
                          0,
                        ) / batches.length,
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{batch.name}</h3>
                    <p className="text-sm text-gray-600">{batch.courseName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      new Date(batch.endDate) > new Date() ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {new Date(batch.endDate) > new Date() ? "Active" : "Completed"}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>
                      Teacher:{" "}
                      {
                        // Find teacher name from teachers array since schema doesn't store teacherName
                        teachers.find((t) => t._id === batch.teacher)?.name || "Not assigned"
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {batch?.schedule?.days?.join(", ")} | {batch.schedule?.time}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Students Enrolled</span>
                    <span>
                      {batch.currentStudents || 0}/{batch.maxStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((batch.currentStudents || 0) / (batch.maxStudents || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Lectures: {(batch.lectures || []).filter((l) => l.completed).length}/{(batch.lectures || []).length}{" "}
                    completed
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width:
                          (batch.lectures || []).length > 0
                            ? `${((batch.lectures || []).filter((l) => l.completed).length / (batch.lectures || []).length) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBatch(batch)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Batch Modal */}
        {showAddForm && (
          <BatchForm
            courses={courses}
            teachers={teachers}
            onSubmit={handleAddBatch}
            onCancel={() => setShowAddForm(false)}
            title="Add New Batch"
          />
        )}

        {/* Edit Batch Modal */}
        {editingBatch && (
          <BatchForm
            batch={editingBatch}
            courses={courses}
            teachers={teachers}
            onSubmit={handleEditBatch}
            onCancel={() => setEditingBatch(null)}
            title="Edit Batch"
          />
        )}
      </div>
    </div>
  )
}

const BatchForm = ({ batch, courses, teachers, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: batch?.name || "",
    course: batch?.course || "",
    teacher: batch?.teacher || "",
    startDate: batch?.startDate ? batch.startDate.split("T")[0] : "",
    endDate: batch?.endDate ? batch.endDate.split("T")[0] : "",
    scheduleDays: batch?.schedule?.days || [],
    scheduleTime: batch?.schedule?.time || "",
    maxStudents: batch?.maxStudents || "",
  })

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(day)
        ? prev.scheduleDays.filter((d) => d !== day)
        : [...prev.scheduleDays, day],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.scheduleDays.length === 0) {
      alert("Please select at least one day for the schedule.")
      return
    }

    if (!formData.course) {
      alert("Please select a course.")
      return
    }

    if (!formData.teacher) {
      alert("Please select a teacher.")
      return
    }

    const batchData = {
      ...formData,
      maxStudents: Number.parseInt(formData.maxStudents),
    }

    console.log("Form data being submitted:", batchData)
    onSubmit(batchData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="Enter batch name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course * ({courses.length} available)
            </label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title || course.name}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="text-sm text-red-600 mt-1">No courses available. Please add courses first.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher * ({teachers.length} available)
            </label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {teachers.length === 0 && (
              <p className="text-sm text-red-600 mt-1">No teachers available. Please add teachers first.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Days *</label>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    formData.scheduleDays.includes(day)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select at least one day</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time *</label>
            <input
              type="text"
              value={formData.scheduleTime}
              onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
              placeholder="e.g., 10:00 AM - 12:00 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students *</label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="Enter maximum number of students"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={courses.length === 0 || teachers.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {batch ? "Update Batch" : "Add Batch"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BatchManagement
