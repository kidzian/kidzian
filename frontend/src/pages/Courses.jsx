"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Heading from "../components/Heading"
import Footer from "../components/Footer"
import { FiSearch, FiX, FiChevronRight, FiStar, FiUsers, FiClock, FiAward, FiLock } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  // Helper function to safely process array or string data
  const processArrayOrString = (data, fallback = []) => {
    if (!data) return fallback
    if (Array.isArray(data)) return data.filter((item) => item && item.trim())
    if (typeof data === "string") {
      return data
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }
    return fallback
  }

  // Function to transform backend course data to match frontend structure
  const transformBackendCourse = (backendCourse) => {
    // Helper function to construct full image URL
    const getImageUrl = (imagePath) => {
      if (!imagePath) return "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
      
      // If it's already a full URL (starts with http), return as is
      if (imagePath.startsWith("http")) return imagePath
      
      // If it's a relative path, construct full URL
      // Remove leading slash if present to avoid double slashes
      const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
      return `${API_BASE_URL}/${cleanPath}`
    }

    return {
      id: backendCourse._id,
      title: backendCourse.title || "Untitled Course",
      category: "beginner", // You can modify this based on your backend data
      image: getImageUrl(backendCourse.image),
      ageGroup: backendCourse.ageGroup || "8-16 years",
      studentsEnrolled: Math.floor(Math.random() * 1000) + 50,
      duration: "8-12 weeks",
      rating: 4.5 + Math.random() * 0.5,
      reviews: Math.floor(Math.random() * 100) + 20,
      isBestseller: Math.random() > 0.7,
      description: backendCourse.about 
        ? (Array.isArray(backendCourse.about) ? backendCourse.about[0] : backendCourse.about)
        : "Learn coding with this amazing course",
      about: processArrayOrString(backendCourse.about, [
        "Interactive learning experience", 
        "Expert instruction", 
        "Hands-on projects"
      ]),
      learningOutcomes: processArrayOrString(backendCourse.learningOutcomes, [
        "Master programming concepts", 
        "Build real projects", 
        "Problem-solving skills"
      ]),
      overviewPoints: ["Fundamentals", "Practical Projects", "Problem Solving", "Code Review", "Final Project"],
      isStatic: false,
    }
  }

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const backendCourses = await response.json()
        console.log("Backend courses:", backendCourses) // Debug log
        
        // Transform backend courses to match frontend structure
        const transformedCourses = backendCourses.map(transformBackendCourse)
        setCourses(transformedCourses)
      } else {
        console.error("Failed to fetch courses, status:", response.status)
        setError("Failed to load courses. Please try again later.")
        setCourses([])
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to connect to server. Please check your connection.")
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || course.category === activeFilter
    return matchesSearch && matchesFilter
  })

  const handleCardClick = (course) => {
    setSelectedCourse(course)
  }

  const heroImages = {
    backgroundImage: "url('https://images.pexels.com/photos/3769981/pexels-photo-3769981.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Heading />
        <div className="min-h-screen flex items-center justify-center pt-[12.5vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
            <p className="text-teal-700 dark:text-teal-300 font-medium">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Heading />
      <motion.div
        className="w-full min-h-screen pt-[12.5vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] flex items-center justify-center" style={heroImages}>
          <div className="absolute inset-0 bg-[#0F766E]/90 dark:bg-[#0F766E]/95"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Your Path in Coding
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Expert-led courses designed to transform beginners into confident coders
            </motion.p>
            <motion.div
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </motion.div>
            {/* Error message */}
            {error && (
              <motion.div
                className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {error}
                <button 
                  onClick={fetchCourses}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Course Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {["all", "beginner", "intermediate", "advanced"].map((filter) => (
              <button
                key={filter}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-teal-700 dark:bg-teal-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Course Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
              {activeFilter !== "all" && ` in ${activeFilter}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Courses Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
            <AnimatePresence>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border dark:border-gray-700 relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCardClick(course)}
                >
                  <div className="relative h-48">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Image failed to load:", course.image)
                        e.target.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", course.image)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-800/90 to-transparent" />
                    {course.isBestseller && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FiAward className="w-4 h-4" />
                        Bestseller
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <FiUsers /> <span>{course.studentsEnrolled.toLocaleString()} students</span>
                        <FiClock className="ml-4" /> <span>{course.duration}</span>
                      </div>
                      <h3 className="text-white font-semibold text-lg line-clamp-2">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} w-5 h-5`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({course.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-700 dark:text-teal-400 font-semibold">Age: {course.ageGroup}</span>
                      <button
                        className="flex items-center gap-2 text-white bg-teal-700 dark:bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCardClick(course)
                        }}
                      >
                        Curriculum
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No courses found */}
          {filteredCourses.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 dark:text-gray-600 mb-4">
                <FiSearch className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No courses found</h3>
              <p className="text-gray-500 dark:text-gray-500">
                {error ? "Unable to load courses from server." : "Try adjusting your search or filter criteria"}
              </p>
              {error ? (
                <button
                  onClick={fetchCourses}
                  className="mt-4 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors duration-300"
                >
                  Retry Loading
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveFilter("all")
                  }}
                  className="mt-4 px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Course Details Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl border dark:border-gray-700"
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Compact Header */}
                <div className="relative h-48 bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700">
                  <div className="absolute inset-0 bg-black/20 dark:bg-black/30" />
                  <button
                    className="absolute top-4 right-4 text-white/90 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setSelectedCourse(null)}
                  >
                    <FiX size={20} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedCourse.isBestseller && (
                        <span className="px-3 py-1 bg-yellow-400 text-black rounded-full font-semibold text-xs flex items-center gap-1">
                          <FiAward className="w-3 h-3" />
                          Bestseller
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        {selectedCourse.category.charAt(0).toUpperCase() + selectedCourse.category.slice(1)}
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        {selectedCourse.ageGroup}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                    <div className="flex items-center gap-4 text-white/90 text-xs">
                      <div className="flex items-center gap-1">
                        <FiUsers className="w-3 h-3" />
                        <span>{selectedCourse.studentsEnrolled.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        <span>{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(selectedCourse.rating) ? "text-yellow-400" : "text-white/40"}`}
                            />
                          ))}
                        </div>
                        <span>({selectedCourse.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-12rem)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Course Overview */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Overview</h3>
                      <div className="relative w-48 h-48 mb-4">
                        {/* Center circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-500 dark:to-teal-700 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xs text-center leading-tight">
                              {selectedCourse.category.charAt(0).toUpperCase() + selectedCourse.category.slice(1)}
                            </span>
                          </div>
                        </div>
                        {/* Circular points */}
                        {selectedCourse.overviewPoints.map((point, index) => {
                          const angle = (index * 360) / selectedCourse.overviewPoints.length
                          const radius = 75
                          const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
                          const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius
                          return (
                            <motion.div
                              key={index}
                              className="absolute w-12 h-12 bg-white dark:bg-gray-700 border-2 border-teal-500 dark:border-teal-400 rounded-full flex items-center justify-center shadow-md"
                              style={{
                                left: `calc(50% + ${x}px - 1.5rem)`,
                                top: `calc(50% + ${y}px - 1.5rem)`,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <span className="text-teal-700 dark:text-teal-300 font-semibold text-[10px] text-center leading-tight px-1">
                                {point}
                              </span>
                            </motion.div>
                          )
                        })}
                      </div>
                      {/* Compact Enrollment CTA */}
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl p-4 border border-teal-200 dark:border-teal-700 w-full">
                        <div className="text-center">
                          <FiLock className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">Want Full Syllabus?</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                            Get detailed curriculum, assignments, and project details by joining the course.
                          </p>
                          <button
                            onClick={() => navigate("/contact-us")}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 text-white py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 transition-all duration-300 font-semibold text-sm"
                          >
                            Join Course
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Course Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About the Course</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{selectedCourse.description}</p>
                        <ul className="space-y-2">
                          {selectedCourse.about.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                              <FiChevronRight className="mt-0.5 flex-shrink-0 text-teal-700 dark:text-teal-400 w-4 h-4" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Learning Outcomes</h3>
                        <ul className="space-y-2">
                          {selectedCourse.learningOutcomes.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                              <FiChevronRight className="mt-0.5 flex-shrink-0 text-teal-700 dark:text-teal-400 w-4 h-4" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  )
}

export default Courses