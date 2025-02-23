import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TeacherDetails = () => {
  const { teacherId } = useParams();  // Get teacherId from URL
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/teachers/${teacherId}`);
        setTeacher(response.data);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold">{teacher.name}</h2>
      <h2 className="text-lg text-gray-700 mt-2">{teacher.role}</h2>
      <p className="text-lg text-gray-700 mt-2">Email: {teacher.email}</p>
      <p className="text-lg text-gray-700 mt-2">Phone: {teacher.phoneNumber}</p>
      <p className="text-lg text-gray-700 mt-2">Teacher ID: {teacher._id}</p>
      {/* You can add more detailed fields here */}
    </div>
  );
};

export default TeacherDetails;
