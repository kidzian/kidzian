import { useEffect, useState } from "react";

const BatchDetails = () => {
  const batchId = "67a22c8836c28ba50deebadc"; // Your batch ID
  const [batch, setBatch] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStudentClick = async (student) => {
    try {
      console.log('Fetching student with ID:', student._id);
      
      // Send request to backend to fetch the student data
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/${student._id}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Save the fetched student data to state
        setSelectedStudent(data);
        console.log(data);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch student data:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  const openAttendanceModal = (lecture) => {
    setSelectedLecture(lecture);
    setAttendance(batch.students.map((student) => ({ studentId: student._id, present: false })));
    setIsAttendanceModalOpen(true);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(attendance.map(a => a.studentId === studentId ? { ...a, present: !a.present } : a));
  };

  const markAttendance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureId: selectedLecture._id,
          batchId,
          attendance,
        }),
      });
      if (response.ok) {
        alert("Attendance marked successfully!");
        setIsAttendanceModalOpen(false);
      } else {
        alert("Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    age: "",
    grade: "",
    password:"",
  });
  const [lectureData, setLectureData] = useState({
    title: "",
    date: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/batches/${batchId}`)
      .then((res) => res.json())
      .then((data) => setBatch(data))
      .catch((err) => console.error("Error fetching batch:", err));
  }, []);

  const handleStudentChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleLectureChange = (e) => {
    setLectureData({ ...lectureData, [e.target.name]: e.target.value });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/batches/${batchId}/add-student`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...studentData, batchId }),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        alert("Student added successfully!");
        setIsStudentModalOpen(false);
        setStudentData({
          name: "",
          email: "",
          address: "",
          phoneNumber: "",
          age: "",
          grade: "",
          password: "", // Reset password field
        });
      } else {
        alert(data.message || "Failed to add student.");
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };
  

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/batches/${batchId}/add-lecture`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lectureData),
        }
      );
      if (response.ok) {
        alert("Lecture added successfully!");
        setIsLectureModalOpen(false);
        setLectureData({ title: "", date: "" });
      } else {
        alert("Failed to add lecture.");
      }
    } catch (error) {
      console.error("Error adding lecture:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {batch ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold">{batch.name}</h1>
          <p className="text-gray-600">Course ID: {batch.course}</p>
          <p className="text-gray-600">Starting Date: {new Date(batch.startingDate).toDateString()}</p>

          <h2 className="text-xl font-bold mt-4">Students Enrolled</h2>
          {batch.students && batch.students.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {batch.students.map((student) => (
                <li key={student._id}>{student.name} ({student.email})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students enrolled yet.</p>
          )}

<h2 className="text-xl font-bold mt-4 mb-2">Students</h2>
      <div className="border border-gray-300 rounded-lg p-4">
        {batch.students.length > 0 ? (
          <ul>
            {batch.students.map((student) => (
              <li key={student.id} className="mb-2">
                <button className="text-blue-600 underline" onClick={() => handleStudentClick(student)}>{student.name}</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No students enrolled.</p>
        )}
      </div>

  
{isModalOpen && selectedStudent && (
  
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-2">{selectedStudent.name}</h2>
      <p className="text-gray-600">Grade: {selectedStudent.grade}</p>
      <p className="text-gray-600">Age: {selectedStudent.age}</p>
      <p className="text-gray-600">Email: {selectedStudent.email}</p>
      <p className="text-gray-600">Phone: {selectedStudent.phoneNumber}</p> {/* Correcting the phone number display */}
      <p className="text-gray-600">Address: {selectedStudent.address}</p>
      <p className="text-gray-600">Password: {selectedStudent.password}</p>

      <h3 className="text-lg font-semibold mt-4">Attended Lectures</h3>
      <div className="border-b border-gray-300 my-2"></div>

      {selectedStudent.batches?.[0]?.lectures?.filter(lec => lec.attendance).length > 0 ? (
        <ul>
          {selectedStudent.batches[0].lectures
            .filter(lecture => lecture.attendance)  // Ensuring you check attendance
            .map((lecture) => (
              <li key={lecture.name}>{lecture.name}</li> 
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No attended lectures.</p>
      )}
      
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setIsModalOpen(false)}>Close</button>
    </div>
  </div>
)}



<h2 className="text-xl font-bold mt-4">Lectures</h2>
          {batch.lectures && batch.lectures.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {batch.lectures.map((lecture) => (
                <li key={lecture._id} onClick={() => openAttendanceModal(lecture)} className="cursor-pointer text-blue-600">
                  {lecture.name} on {new Date(lecture.date).toDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No lectures scheduled yet.</p>
          )}

          {isAttendanceModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Mark Attendance for {selectedLecture.title}</h2>
                <ul>
                  {batch.students.map((student) => (
                    <li key={student._id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={attendance.find(a => a.studentId === student._id)?.present || false}
                        onChange={() => toggleAttendance(student._id)}
                      />
                      <span className="ml-2">{student.name}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={markAttendance} className="bg-green-500 text-white p-2 rounded mt-4 mr-2">Submit</button>
                <button onClick={() => setIsAttendanceModalOpen(false)} className="mt-2 text-red-500">Cancel</button>
              </div>
            </div>
          )}
        


          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setIsStudentModalOpen(true)} 
              className="bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
            >
              +
            </button>
            <button 
              onClick={() => setIsLectureModalOpen(true)} 
              className="bg-green-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
            >
              📖
            </button>
          </div>

          {isStudentModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Add Student</h2>
      <form onSubmit={handleStudentSubmit} className="flex flex-col">
        {["name", "email", "address", "phoneNumber", "age", "grade", "password"].map((field) => (
          <input
            key={field}
            type={field === "age" || field === "phoneNumber" || field === "grade" ? "number" : field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={studentData[field] || ""}
            onChange={handleStudentChange}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
        ))}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
        <button 
          type="button" 
          onClick={() => setIsStudentModalOpen(false)} 
          className="mt-2 text-red-500"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}


          {isLectureModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Lecture</h2>
                <form onSubmit={handleLectureSubmit} className="flex flex-col">
                  <input
                    type="text"
                    name="title"
                    placeholder="Lecture Title"
                    value={lectureData.title}
                    onChange={handleLectureChange}
                    className="p-2 border border-gray-300 rounded mb-2"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={lectureData.date}
                    onChange={handleLectureChange}
                    className="p-2 border border-gray-300 rounded mb-2"
                    required
                  />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
                  <button 
                    type="button" 
                    onClick={() => setIsLectureModalOpen(false)} 
                    className="mt-2 text-red-500"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BatchDetails;
