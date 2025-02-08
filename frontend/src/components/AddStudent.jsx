import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const AddStudent = ({ isStudentModalOpen, setIsStudentModalOpen }) => {
    const { batchId } = useParams();
  const [students, setStudents] = useState([]); // List of all students
  const [selectedStudents, setSelectedStudents] = useState([]); // Selected existing students
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    age: "",
    grade: "",
    password: "",
    courseName: "",
  });

  // Fetch existing students
  useEffect(() => {
    if (isStudentModalOpen) {
      fetch(`${import.meta.env.VITE_API_URL}/api/students`)
        .then((response) => response.json())
        .then((data) => setStudents(data))
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [isStudentModalOpen]);

  // Handle checkbox selection for existing students
  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  // Handle form input change
  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  // Add students (both existing and new)
  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add existing students to batch
      console.log("adding student")
      if (selectedStudents.length > 0) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/batches/${batchId}/add-existing-students`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students: selectedStudents }),
          }
        );
      }

      // Add new student if form is filled
      if (studentData.name && studentData.email) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/batches/${batchId}/add-student`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
          }
        );
      }

      alert("Students added successfully!");
      setIsStudentModalOpen(false);
      setSelectedStudents([]);
      setStudentData({
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
        age: "",
        grade: "",
        password: "",
        courseName: "",
      });
    } catch (error) {
      console.error("Error adding students:", error);
    }
  };

  

  return (
    <>
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Students</h2>

            {/* Existing Students List */}
            <div className="mb-4 max-h-40 overflow-y-auto border p-2 rounded">
              <h3 className="font-semibold">Select Existing Students</h3>
              {students.length > 0 ? (
                students.map((student) => (
                  <label key={student._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleCheckboxChange(student._id)}
                      className="mr-2"
                    />
                    {student.name} ({student.email})
                  </label>
                ))
              ) : (
                <p>No students found.</p>
              )}
            </div>

            {/* New Student Form */}
            <form onSubmit={handleStudentSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={studentData.name}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={studentData.email}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={studentData.address}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={studentData.phoneNumber}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={studentData.age}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={studentData.grade}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={studentData.password}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={studentData.courseName}
                onChange={handleStudentChange}
                className="mb-2 p-2 w-full border rounded-md"
              />

              {/* Submit & Close Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add Students
                </button>
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddStudent;
