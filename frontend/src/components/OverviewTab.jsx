import React from 'react';

const OverviewTab = ({ setShowAttendanceModal, setShowAssignmentModal, assignments }) => {
  const recentAssignments = assignments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div key={assignment._id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Assignment
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent activity to display.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <div className="text-green-600 font-medium">Mark Attendance</div>
            <div className="text-green-500 text-sm">Record student attendance</div>
          </button>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <div className="text-blue-600 font-medium">Create Assignment</div>
            <div className="text-blue-500 text-sm">Add new assignment</div>
          </button>
          <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
            <div className="text-purple-600 font-medium">View Reports</div>
            <div className="text-purple-500 text-sm">Student progress reports</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
