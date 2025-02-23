import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/users/${id}`)
      .then((response) => setStudent(response.data))
      .catch((error) => console.error("Error fetching student details:", error));
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{student.name}</h2>
      <p className="text-gray-600">Email: {student.email}</p>
      <p className="text-gray-600">Address: {student.address}</p>
      <p className="text-gray-600">Phone: {student.phoneNumber}</p>
      <p className="text-gray-600">Grade: {student.grade}</p>
      <h3 className="text-xl font-semibold mt-4">Batches</h3>
      <ul>
        {student.batches.map((batch, index) => (
          <li key={index} className="text-gray-600">
            {batch.courseName} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDetails;
