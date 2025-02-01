import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [newLecture, setNewLecture] = useState({ name: '', date: '' });
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    grade: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [selectedLecture, setSelectedLecture] = useState(null); // Track selected lecture
  const [attendance, setAttendance] = useState({}); // Track attendance for the selected lecture

  // Fetch batch details from the backend
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`);
        setBatch(response.data);
      } catch (error) {
        console.error('Error fetching batch:', error);
      }
    };
    fetchBatch();
  }, [batchId]);

  // Handle adding a lecture to the batch
  const handleAddLecture = async () => {
    if (newLecture.name && newLecture.date) {
      try {
        const updatedBatch = {
          ...batch,
          lectures: [...batch.lectures, { ...newLecture, attendance: [] }], // Initialize attendance array
        };
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`, updatedBatch);
        setBatch(response.data);
        setNewLecture({ name: '', date: '' }); // Reset form
      } catch (error) {
        console.error('Error adding lecture:', error);
        alert('Failed to add lecture');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  // Handle adding a new student to the batch
  const handleAddStudent = async () => {
    if (
      newStudent.name &&
      newStudent.age &&
      newStudent.grade &&
      newStudent.address &&
      newStudent.email &&
      newStudent.password &&
      newStudent.phoneNumber
    ) {
      try {
        // Create the student
        const studentResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/students`, newStudent);
        const student = studentResponse.data;

        // Add the student to the batch
        const updatedBatch = {
          ...batch,
          students: [...batch.students, student._id],
        };
        const batchResponse = await axios.put(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`, updatedBatch);
        setBatch(batchResponse.data);

        // Reset the form
        setNewStudent({
          name: '',
          age: '',
          grade: '',
          address: '',
          email: '',
          password: '',
          phoneNumber: '',
        });
      } catch (error) {
        console.error('Error adding student:', error);
        alert('Failed to add student');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  // Handle selecting a lecture
  const handleSelectLecture = (lectureIndex) => {
    setSelectedLecture(lectureIndex);
    const lecture = batch.lectures[lectureIndex];
    const initialAttendance = {};
    batch.students.forEach((studentId) => {
      const attendanceRecord = lecture.attendance.find((a) => a.studentId.toString() === studentId.toString());
      initialAttendance[studentId] = attendanceRecord ? attendanceRecord.attended : false;
    });
    setAttendance(initialAttendance);
  };

  // Handle marking attendance for a student
  const handleToggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // Handle submitting attendance for the selected lecture
  const handleSubmitAttendance = async () => {
    try {
      const updatedLectures = [...batch.lectures];
      updatedLectures[selectedLecture].attendance = Object.keys(attendance).map((studentId) => ({
        studentId,
        attended: attendance[studentId],
      }));

      const updatedBatch = { ...batch, lectures: updatedLectures };
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`, updatedBatch);
      setBatch(response.data);
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    }
  };

  if (!batch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Batch: {batch.name}</h1>
      <p>Course: {batch.course}</p>
      <p>Starting Date: {new Date(batch.startingDate).toLocaleDateString()}</p>

      {/* Add Lecture Form */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add Lecture</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Lecture Name"
            value={newLecture.name}
            onChange={(e) => setNewLecture({ ...newLecture, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={newLecture.date}
            onChange={(e) => setNewLecture({ ...newLecture, date: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddLecture}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            Add Lecture
          </button>
        </div>
      </div>

      {/* List of Lectures */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Lectures</h2>
        <div className="space-y-4">
          {batch.lectures.map((lecture, lectureIndex) => (
            <div
              key={lectureIndex}
              className="p-4 bg-white rounded shadow cursor-pointer"
              onClick={() => handleSelectLecture(lectureIndex)}
            >
              <h3 className="font-bold">{lecture.name}</h3>
              <p>Date: {new Date(lecture.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Student Form */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Age"
            value={newStudent.age}
            onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Grade"
            value={newStudent.grade}
            onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={newStudent.address}
            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newStudent.password}
            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newStudent.phoneNumber}
            onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddStudent}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* List of Students */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        <div className="space-y-4">
          {batch.students.map((studentId, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              <h3 className="font-bold">Student ID: {studentId}</h3>
              {/* Fetch and display student details here if needed */}
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Section for Selected Lecture */}
      {selectedLecture !== null && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">Mark Attendance for Lecture: {batch.lectures[selectedLecture].name}</h2>
          <div className="space-y-4">
            {batch.students.map((studentId) => (
              <div key={studentId} className="flex items-center space-x-2">
                <span>Student ID: {studentId}</span>
                <button
                  onClick={() => handleToggleAttendance(studentId)}
                  className={`px-2 py-1 rounded ${attendance[studentId] ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {attendance[studentId] ? 'Present' : 'Absent'}
                </button>
              </div>
            ))}
            <button
              onClick={handleSubmitAttendance}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetails;