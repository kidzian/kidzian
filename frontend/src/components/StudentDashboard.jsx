import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/students/123/attendance`) // Replace 123 with the student's ID
      .then((res) => res.json())
      .then((data) => setAttendance(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Attendance</h2>
      <ul>
        {attendance.map((record) => (
          <li key={record._id} className="p-2 rounded">
            {record.lectureName} - {record.attended ? 'Present' : 'Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;