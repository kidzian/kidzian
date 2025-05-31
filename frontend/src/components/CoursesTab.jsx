const CoursesTab = ({ courses }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Courses</h3>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-gray-900">{course.title || course.name}</h4>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Students: {course.students?.length || 0}</div>
                <div>Batches: {course.batches?.length || 0}</div>
                <div>Duration: {course.duration || "Not specified"}</div>
              </div>
              <button className="mt-4 w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                Manage Course
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No courses assigned yet.</p>
        </div>
      )}
    </div>
  )
}

export default CoursesTab
