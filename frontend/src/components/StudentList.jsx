import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/students`)
      .then((response) => {
        console.log('API Response:', response.data); // Debugging
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setStudents([]); // Fallback to empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setStudents([]); // Fallback to empty array
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id} className="p-2 border rounded mb-2">
            {student.name} - {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;