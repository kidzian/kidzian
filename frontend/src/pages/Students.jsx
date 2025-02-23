import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    grade: "",
    certificates: 0,
  });
  const navigate = useNavigate();

  // Fetch students data from the backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/users`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Handle student deletion
  const handleDelete = async (studentId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/student/${studentId}`);
      
      if (response.status === 200) {
        alert("Student deleted successfully");
        // Remove the deleted student from the UI
        setStudents((prevStudents) => prevStudents.filter(student => student._id !== studentId));
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student");
    }
  };

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/create-user`, formData);
      if (response.status === 201) {
        alert("Student created successfully");
        setIsModalOpen(false);
        setStudents([...students, response.data]);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Error creating student");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
      >
        Create New Student
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/students/${student._id}`)} // Navigate to Student Details Page
          >
            <h3 className="text-lg font-semibold">{student.name}</h3>
            <p className="text-gray-600">Email: {student.email}</p>
            <p className="text-gray-600">Grade: {student.grade}</p>
            <p className="text-gray-600">Certificates: {student.certificates}</p>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation on delete button click
                handleDelete(student._id); // Trigger the delete function
              }}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Create New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                name="certificates"
                placeholder="Certificates"
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;