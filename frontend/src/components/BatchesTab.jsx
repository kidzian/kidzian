"use client"

const BatchesTab = ({ batches, setShowAttendanceModal }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Batches</h3>
      {batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                  <p className="text-sm text-gray-500">{batch.courseName}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  Students: {batch.currentStudents || 0}/{batch.maxStudents || 0}
                </div>
                <div>
                  Schedule: {batch.schedule?.days?.join(", ") || "Not set"} at {batch.schedule?.time || "Not set"}
                </div>
                <div>
                  Duration: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "Not set"} -{" "}
                  {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "Not set"}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                  View Details
                </button>
                <button
                  onClick={() => setShowAttendanceModal(true)}
                  className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No batches assigned yet.</p>
        </div>
      )}
    </div>
  )
}

export default BatchesTab
