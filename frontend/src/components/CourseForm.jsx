"use client"

import { useState } from "react"
import { Upload, X, FileText, ImageIcon, Plus, Save, Eye } from "lucide-react"

const CourseForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, isVisible, courses = [], onView }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    ageGroup: initialData.ageGroup || "",
    about: initialData.about || "",
    learningOutcomes: initialData.learningOutcomes || "",
    image: null,
    pdf: null,
    ...initialData,
  })

  const [previews, setPreviews] = useState({
    image: initialData.image || null,
    pdf: initialData.pdf || null,
  })

  const [dragActive, setDragActive] = useState({
    image: false,
    pdf: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }))

      // Create preview for images
      if (type === "image" && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews((prev) => ({
            ...prev,
            image: e.target.result,
          }))
        }
        reader.readAsDataURL(file)
      } else if (type === "pdf") {
        setPreviews((prev) => ({
          ...prev,
          pdf: file.name,
        }))
      }
    }
  }

  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }))
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive((prev) => ({ ...prev, [type]: false }))

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]

      // Validate file type
      if (type === "image" && !file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }
      if (type === "pdf" && file.type !== "application/pdf") {
        alert("Please upload a PDF file")
        return
      }

      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }))

      // Create preview
      if (type === "image") {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviews((prev) => ({
            ...prev,
            image: e.target.result,
          }))
        }
        reader.readAsDataURL(file)
      } else {
        setPreviews((prev) => ({
          ...prev,
          pdf: file.name,
        }))
      }
    }
  }

  const removeFile = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }))
    setPreviews((prev) => ({
      ...prev,
      [type]: null,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create FormData for file upload
    const submitData = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key])
      }
    })

    onSubmit(submitData)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              {isEdit ? <Save className="mr-3 h-6 w-6" /> : <Plus className="mr-3 h-6 w-6" />}
              {isEdit ? "Edit Course" : "Create New Course"}
            </h2>
            <button onClick={onCancel} className="text-white hover:text-teal-200 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Course Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                    <input
                      type="text"
                      name="ageGroup"
                      value={formData.ageGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 8-12 years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Course</label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Describe the course..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                    <textarea
                      name="learningOutcomes"
                      value={formData.learningOutcomes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="What will students learn..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - File Uploads */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-purple-600" />
                  Course Image
                </h3>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                    dragActive.image ? "border-purple-500 bg-purple-100" : "border-gray-300 hover:border-purple-400"
                  }`}
                  onDragEnter={(e) => handleDrag(e, "image")}
                  onDragLeave={(e) => handleDrag(e, "image")}
                  onDragOver={(e) => handleDrag(e, "image")}
                  onDrop={(e) => handleDrop(e, "image")}
                >
                  {previews.image ? (
                    <div className="relative">
                      <img
                        src={previews.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("image")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Drop image here or click to browse</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* PDF Upload */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  Course Material (PDF)
                </h3>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                    dragActive.pdf ? "border-green-500 bg-green-100" : "border-gray-300 hover:border-green-400"
                  }`}
                  onDragEnter={(e) => handleDrag(e, "pdf")}
                  onDragLeave={(e) => handleDrag(e, "pdf")}
                  onDragOver={(e) => handleDrag(e, "pdf")}
                  onDrop={(e) => handleDrop(e, "pdf")}
                >
                  {previews.pdf ? (
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-red-500 mr-3" />
                        <span className="text-gray-700 font-medium">{previews.pdf}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("pdf")}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Drop PDF here or click to browse</p>
                      <p className="text-sm text-gray-500">PDF files up to 50MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "pdf")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {isEdit ? <Save className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
              {isEdit ? "Update Course" : "Create Course"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Course List Component
const CourseList = ({ courses, onEdit, onDelete, onView, onAdd }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Courses Management</h3>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white px-6 py-3 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
            >
              {/* Course Image */}
              {course.image && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="flex items-start mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h4>
                  <p className="text-sm text-gray-500">{course.ageGroup}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <span className="font-medium">Batches:</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {course.batches?.length || 0}
                  </span>
                </div>
                {course.about && <p className="text-xs text-gray-500 line-clamp-2">{course.about}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onView(course)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => onEdit(course)}
                  className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(course)}
                  className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No courses found</p>
          <p className="text-sm mb-6">Add your first course to get started.</p>
          <button
            onClick={onAdd}
            className="bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 text-white px-6 py-3 rounded-lg"
          >
            Add Course
          </button>
        </div>
      )}
    </div>
  )
}

export { CourseForm, CourseList }
