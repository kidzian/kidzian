"use client"

const StudentModal = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{student.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{student.email}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Course:</span>
                  <span className="ml-2 font-medium">{student.courseName || "Not assigned"}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Batch:</span>
                  <span className="ml-2 font-medium">{student.batchName || "Not assigned"}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Student ID:</span>
                  <span className="ml-2 font-medium">{student.studentId || student._id}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Progress</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Attendance:</span>
                  <span className="ml-2 font-medium">{student.attendance || 0}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${student.attendance || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Course Progress:</span>
                  <span className="ml-2 font-medium">{student.completion || 0}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${student.completion || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Grade:</span>
                  <span className="ml-2 font-medium">{student.grade || "Not assigned"}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Assignments Completed:</span>
                  <span className="ml-2 font-medium">{student.assignmentsCompleted || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">No recent activity to display.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
              Edit Profile
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
              View Assignments
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
              Send Message
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentModal
