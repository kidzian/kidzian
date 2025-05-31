"use client"
import { CalendarIcon, UserGroupIcon, ClockIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline"

const BatchCard = ({ batch, onView, onDelete }) => {
  const getStatusInfo = () => {
    const now = new Date()
    const startDate = new Date(batch.startDate)
    const endDate = new Date(batch.endDate)

    if (startDate > now) {
      return { status: "upcoming", color: "bg-yellow-100 text-yellow-800", text: "Upcoming" }
    } else if (startDate <= now && endDate >= now) {
      return { status: "ongoing", color: "bg-green-100 text-green-800", text: "Ongoing" }
    } else {
      return { status: "completed", color: "bg-gray-100 text-gray-800", text: "Completed" }
    }
  }

  const statusInfo = getStatusInfo()
  const occupancyPercentage = (batch.currentStudents / batch.maxStudents) * 100

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatSchedule = () => {
    if (batch.schedule && batch.schedule.days && batch.schedule.time) {
      const days = Array.isArray(batch.schedule.days) ? batch.schedule.days.join(", ") : batch.schedule.days
      return `${days} at ${batch.schedule.time}`
    }
    return "Schedule not set"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{batch.name}</h3>
            <p className="text-sm text-gray-600">{batch.courseName}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>
              {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{formatSchedule()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-2" />
            <span>
              {batch.currentStudents} / {batch.maxStudents} students
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Capacity</span>
            <span>{Math.round(occupancyPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyPercentage >= 90 ? "bg-red-500" : occupancyPercentage >= 70 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          >
            <EyeIcon className="h-4 w-4" />
            View Details
          </button>
          <button
            onClick={onDelete}
            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BatchCard
