"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { ChevronUp, ChevronDown, User, Book, Users, GraduationCap, Mail, Shield, ChevronRight } from "lucide-react"

const AdminDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const admin = location.state?.admin || JSON.parse(localStorage.getItem("admin"))
  const [courses, setCourses] = useState([])
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((response) => {
        setCourses(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 text-white">
              <User size={40} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold capitalize mb-1">Welcome, {admin?.name}!</h2>
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1 sm:mb-0">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{admin?.email}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="capitalize">{admin?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses Section - Takes 2/3 of the grid on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses Toggle Header */}
            <div
              className="flex items-center justify-between cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center gap-3">
                <Book className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Available Courses</h2>
              </div>
              <div className="bg-white/20 rounded-full p-1">
                {isOpen ? (
                  <ChevronUp size={20} className="text-white" />
                ) : (
                  <ChevronDown size={20} className="text-white" />
                )}
              </div>
            </div>

            {/* Slideable Courses Section */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                      onClick={() => navigate(`/admin-dashboard/${course.title.replace(/\s+/g, "-").toLowerCase()}`)}
                    >
                      <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-500 group-hover:to-blue-700 transition-colors duration-300"></div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">
                          {course.description}
                        </p>
                        <div className="mt-4 flex justify-end">
                          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                            View Course
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No courses available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Section - Takes 1/3 of the grid on large screens */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Access
            </h2>

            {/* Students Card */}
            <div
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => navigate("/admin-dashboard/students")}
            >
              <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 group-hover:from-green-500 group-hover:to-green-700 transition-colors duration-300"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    Students
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Manage student records, attendance, and track academic progress.
                </p>
                <div className="flex justify-end">
                  <button className="bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1">
                    View Students
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Teachers Card */}
            <div
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => navigate("/admin-dashboard/teachers")}
            >
              <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 group-hover:from-purple-500 group-hover:to-purple-700 transition-colors duration-300"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-lg">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    Teachers
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Manage teacher profiles, schedules, and courses assigned.
                </p>
                <div className="flex justify-end">
                  <button className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1">
                    View Teachers
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Analytics Card - Added as an extra feature */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:from-amber-500 group-hover:to-amber-700 transition-colors duration-300"></div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bar-chart-2"
                    >
                      <line x1="18" x2="18" y1="20" y2="10"></line>
                      <line x1="12" x2="12" y1="20" y2="4"></line>
                      <line x1="6" x2="6" y1="20" y2="14"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    Analytics
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View performance metrics, attendance reports, and course statistics.
                </p>
                <div className="flex justify-end">
                  <button className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-800/50 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1">
                    View Analytics
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
