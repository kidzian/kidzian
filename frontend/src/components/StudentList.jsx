"use client"

import { useState } from "react"
import { Search, User, Mail, Phone, MapPin, Lock, BookOpen, CheckCircle, X } from "lucide-react"

const StudentList = ({ batch }) => {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStudentClick = async (student) => {
    try {
      setIsLoading(true)
      console.log("Fetching student with ID:", student._id)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/${student._id}`)

      if (response.ok) {
        const data = await response.json()
        setSelectedStudent(data)
        console.log(data)
        setIsModalOpen(true)
      } else {
        console.error("Failed to fetch student data:", response.statusText)
      }
    } catch (err) {
      console.error("Error fetching student data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = batch.students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Students</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {batch.students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Student ID: {student._id.substring(0, 8)}...
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-1 py-1.5 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No students enrolled.</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-full">
                    <User className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{selectedStudent.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{selectedStudent.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{selectedStudent.address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Lock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">{selectedStudent.password}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Grade</div>
                  <div className="text-lg font-semibold">{selectedStudent.grade}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Age</div>
                  <div className="text-lg font-semibold">{selectedStudent.age}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Attended Lectures</h3>
                </div>

                {selectedStudent.batches?.[0]?.lectures?.filter((lec) => lec.attendance).length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.batches[0].lectures
                      .filter((lecture) => lecture.attendance)
                      .map((lecture) => (
                        <div
                          key={lecture.name}
                          className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{lecture.name}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No attended lectures.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentList
