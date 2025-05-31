"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Users } from "lucide-react"
import axios from "axios"
const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API calls
  // const coursesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/courses`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         })
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token") // get token here
        if (!token) {
          console.error("No token found")
          setLoading(false)
          return
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourses(res.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])
  console.log("courses",courses);

  const handleAddCourse = (courseData) => {
    const newCourse = {
      _id: Date.now().toString(),
      ...courseData,
      batches: [],
    }
    setCourses([...courses, newCourse])
    setShowAddForm(false)
  }

  const handleEditCourse = (courseData) => {
    setCourses(courses.map((course) => (course._id === editingCourse._id ? { ...course, ...courseData } : course)))
    setEditingCourse(null)
  }

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course._id !== courseId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600 mt-2">Manage your courses and track their progress</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Batches</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((total, course) => total + course.batches.length, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Age Group: {course.ageGroup}</p>
                <p className="text-sm text-gray-600 mb-4">{course.about[0]}...</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{course.batches.length} Batches</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Course Modal */}
        {showAddForm && (
          <CourseForm onSubmit={handleAddCourse} onCancel={() => setShowAddForm(false)} title="Add New Course" />
        )}

        {/* Edit Course Modal */}
        {editingCourse && (
          <CourseForm
            course={editingCourse}
            onSubmit={handleEditCourse}
            onCancel={() => setEditingCourse(null)}
            title="Edit Course"
          />
        )}
      </div>
    </div>
  )
}

const CourseForm = ({ course, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    image: course?.image || "",
    pdf: course?.pdf || "",
    ageGroup: course?.ageGroup || "",
    about: course?.about?.join("\n") || "",
    learningOutcomes: course?.learningOutcomes?.join("\n") || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const courseData = {
      ...formData,
      about: formData.about.split("\n").filter((item) => item.trim()),
      learningOutcomes: formData.learningOutcomes.split("\n").filter((item) => item.trim()),
    }
    onSubmit(courseData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File Name</label>
            <input
              type="text"
              value={formData.pdf}
              onChange={(e) => setFormData({ ...formData, pdf: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <input
              type="text"
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 18-25"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About (one item per line)</label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Outcomes (one item per line)
            </label>
            <textarea
              value={formData.learningOutcomes}
              onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {course ? "Update Course" : "Add Course"}
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

export default CourseManagement
