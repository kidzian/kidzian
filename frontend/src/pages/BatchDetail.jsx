
// import { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";

// const BatchDetail = () => {

//     const [attendanceData, setAttendanceData] = useState({});
//    const[students,setStudents]=useState([]);
//    const[studentDetails,setStudentsDetail]=useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [studentData, setStudentData] = useState({
//     name: "",
//     address: "",
//     email: "",
//     password: "",
//     age: "",
//     phoneNumber: "",
//     grade: "",
//   });

//   const { courseName, batchName } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const batchId = queryParams.get("batchId");

//   const [batch, setBatch] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showLectureModal, setShowLectureModal] = useState(false);
//   const [lectureData, setLectureData] = useState({
//     name: "",
//     date: "",
//     completed: false,
//   });

// //   useEffect(() => {
// //     const fetchBatchDetails = async () => {
// //       try {
// //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}`);
// //         setBatch(response.data);
        
// //         setStudents(response.data.students);
        
// //       } catch (err) {
// //         setError("Failed to load batch details.");
// //       } finally {
// //         setLoading(false);
        
// //       }
// //     };

// //     const fetchStudentDetails =async(students)=>{
// //         try{
// //             console.log(students)
// //             const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/students/details`, { students });
// //             console.log(response.data);
// //             setStudentsDetail(response.data)
// //         }
// //         catch(err){
// //             setError("Failed to fetch");
// //         }
// //     }

// //     if (batchId) fetchBatchDetails(); fetchStudentDetails();
// //   }, [batchId]);

// useEffect(() => {
//     const fetchBatchDetails = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}`);
//         setBatch(response.data);
//         setStudents(response.data.students);
//       } catch (err) {
//         setError("Failed to load batch details.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (batchId) fetchBatchDetails();
//   }, [batchId]);
  
//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       if (students.length === 0) return; // Prevent unnecessary API calls
//       try {
//         console.log("Fetching student details for:", students);
//         const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/students/details`, { students });
//         console.log("Student details received:", response.data);
//         setStudentsDetail(response.data);
//       } catch (err) {
//         setError("Failed to fetch student details.");
//       }
//     };
  
//     fetchStudentDetails();
//   }, [students]); // Runs when students state changes


//   const handleLectureInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setLectureData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleLectureSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}/add-lecture`, lectureData);
//       setBatch(response.data); // Update batch state with new lecture
//       setShowLectureModal(false);
//     } catch (err) {
//       console.error("Error adding lecture:", err);
//       alert("Failed to add lecture.");
//     }
//   };

  
//   const handleInputChange = (e) => {
//     setStudentData({ ...studentData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}/add-student`, studentData);
//       setBatch(response.data);
//       setShowModal(false);
//     } catch (err) {
//       console.error("Error adding student:", err);
//       alert("Failed to add student.");
//     }
//   };

//    // Handle Attendance Toggle
//    const handleAttendanceChange = (lectureId, studentId, status) => {
//     setAttendanceData((prev) => ({
//       ...prev,
//       [lectureId]: {
//         ...(prev[lectureId] || {}),
//         [studentId]: status,
//       },
//     }));
//   };

//   // Handle Submit Attendance
//   const handleSubmitAttendance = async (lectureId) => {
//     const updatedAttendance = batch.lectures.find(l => l._id === lectureId).attendance.map(att => ({
//       studentId: att.studentId,
//       attended: attendanceData[lectureId]?.[att.studentId] ?? att.attended,  // Default to existing status
//     }));

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateAttendance`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ lectureId,batchId, updatedAttendance }),
//       });

//       if (response.ok) {
//         alert("Attendance updated successfully!");
//       } else {
//         alert("Failed to update attendance.");
//       }
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;
//   if (!batch) return <p>No batch details found.</p>;

//   return (
//     <div>
//       <h1>Batch: {batch.name}</h1>
//       <p>Course: {batch.course?.title || "No course linked"}</p>

//       <p>Batch ID: {batchId}</p>
//       <p>Start Date: {new Date(batch.startingDate).toLocaleDateString()}</p>
//       <p>Total Classes: {batch.totalClasses}</p>
   
      

//            {/* Add Student Button */}
//       <button onClick={() => setShowModal(true)}>Add Student</button>

//        {/* Student Modal */}
//        {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Add Student</h2>
//             <form onSubmit={handleSubmit}>
//               <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
//               <input type="text" name="address" placeholder="Address" onChange={handleInputChange} required />
//               <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
//               <input type="password" name="password" placeholder="Password" onChange={handleInputChange} required />
//               <input type="number" name="age" placeholder="Age" onChange={handleInputChange} required />
//               <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required />
//               <input type="text" name="grade" placeholder="Grade" onChange={handleInputChange} required />
//               <button type="submit">Submit</button>
//               <button type="button" onClick={() => setShowModal(false)}>Close</button>
//             </form>
//           </div>
//         </div>
//       )}


//       {/* Add Lecture Button */}
//       <button className="block" onClick={() => setShowLectureModal(true)}>➕ Add Lecture</button>

//       {/* Add Lecture Modal */}
//       {showLectureModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Add Lecture</h2>
//             <form onSubmit={handleLectureSubmit}>
//               <input type="text" name="name" placeholder="Lecture Name" onChange={handleLectureInputChange} required />
//               <input type="date" name="date" onChange={handleLectureInputChange} required />
//               <label>
//                 <input type="checkbox" name="completed" onChange={handleLectureInputChange} />
//                 Completed
//               </label>
//               <button type="submit">Submit</button>
//               <button type="button" onClick={() => setShowLectureModal(false)}>Close</button>
//             </form>
//           </div>
//         </div>
//       )}

//       <h2>Lectures</h2>
//       {batch.lectures.length > 0 ? (
//         <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>Lecture Name</th>
//               <th>Date</th>
//               <th>Completed</th>
//             </tr>
//           </thead>
//           <tbody>
//             {batch.lectures.map((lecture) => (
//               <tr key={lecture._id}>
//                 <td>{lecture.name}</td>
//                 <td>{new Date(lecture.date).toLocaleDateString()}</td>
//                 <td>{lecture.completed ? "✅ Yes" : "❌ No"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No lectures available</p>
//       )}



      
      

//        <p><strong>Total Students</strong>{studentDetails.length}</p>
//        <ul>
//         {studentDetails.map((student, index) => (
//             <li key={index}>{student.name}</li>
            
//         ))}
//        </ul>
       

// <h2><strong>Attendance</strong></h2>
// {batch.lectures.map((lecture) => (
//   <div key={lecture._id}>
//     <h3>{lecture.name} - {new Date(lecture.date).toLocaleDateString()}</h3>
//     <ul>
//       {lecture.attendance.map((att) => {
//         const student = studentDetails.find((s) => s._id === att.studentId);
//         const currentStatus = attendanceData[lecture._id]?.[att.studentId] ?? att.attended;

//         return (
//           <li key={att._id}>
//             {student ? student.name : "Unknown Student"} {" "}
//             ({currentStatus ? "Already Attended" : "Absent"})
//             <button onClick={() => handleAttendanceChange(lecture._id, att.studentId, true)} style={{ marginLeft: "10px" }}>
//               ✅Mark Present
//             </button>
//             <button onClick={() => handleAttendanceChange(lecture._id, att.studentId, false)} style={{ marginLeft: "10px" }}>
//               ❌Mark Absent
//             </button>
//           </li>
//         );
//       })}
//     </ul>
//     <button onClick={() => handleSubmitAttendance(lecture._id)} style={{ marginTop: "10px", background: "blue", color: "white" }}>
//       Submit Attendance
//     </button>
//   </div>
// ))}


//     </div>
//   );
// };

// export default BatchDetail;




import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const BatchDetail = () => {

  const [allUsers, setAllUsers] = useState([]);

  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentsDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    grade: "",
  });

  const { courseName, batchName } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const batchId = queryParams.get("batchId");

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [lectureData, setLectureData] = useState({
    name: "",
    date: "",
    completed: false,
  });


  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setAllUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };
  
  const handleOpenModal = () => {
    fetchAllUsers();
    setShowModal(true);
  };
  
  const handleAddStudent = async (studentId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/batches/${batchId}/add-student`, {
        studentId,
      });
      setBatch(response.data);
      alert("Student added successfully!");
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student.");
    }
  };
  

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}`);
        setBatch(response.data);
        setStudents(response.data.students);
      } catch (err) {
        setError("Failed to load batch details.");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchBatchDetails();
  }, [batchId]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (students.length === 0) return;
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/students/details`, { students });
        setStudentsDetail(response.data);
      } catch (err) {
        setError("Failed to fetch student details.");
      }
    };

    fetchStudentDetails();
  }, [students]);

  const handleLectureInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLectureData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}/add-lecture`, lectureData);
      setBatch(response.data);
      setShowLectureModal(false);
    } catch (err) {
      console.error("Error adding lecture:", err);
      alert("Failed to add lecture.");
    }
  };

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/batches/${batchId}/add-student`, studentData);
      setBatch(response.data);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student.");
    }
  };

  const handleAttendanceChange = (lectureId, studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [lectureId]: {
        ...(prev[lectureId] || {}),
        [studentId]: status,
      },
    }));
  };

  const handleSubmitAttendance = async (lectureId) => {
    const updatedAttendance = batch?.lectures?.find(l => l._id === lectureId).attendance.map(att => ({
      studentId: att.studentId,
      attended: attendanceData[lectureId]?.[att.studentId] ?? att.attended,
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/updateAttendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lectureId, batchId, updatedAttendance }),
      });

      if (response.ok) {
        alert("Attendance updated successfully!");
      } else {
        alert("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;
  if (!batch) return <p className="text-center text-lg text-gray-700">No batch details found.</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Batch: {batch?.name}</h1>
      <p className="text-lg text-gray-700 mb-2">Course: {batch?.course?.title || "No course linked"}</p>
      <p className="text-lg text-gray-700 mb-2">Batch ID: {batchId}</p>
      <p className="text-lg text-gray-700 mb-2">Start Date: {new Date(batch?.startingDate).toLocaleDateString()}</p>
      <p className="text-lg text-gray-700 mb-4">Total Classes: {batch?.totalClasses}</p>

      <button
        // onClick={() => setShowModal(true)}
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-4 mr-4"
      >
        Add Student
      </button>

      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Student</h2>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}


{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>
      <ul className="max-h-60 overflow-y-auto">
        {allUsers.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-2 border-b">
            <span>{user.name} ({user.email})</span>
            <button
              onClick={() => handleAddStudent(user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



      <button
        onClick={() => setShowLectureModal(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 mb-4"
      >
        ➕ Add Lecture
      </button>

      {showLectureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Lecture</h2>
            <form onSubmit={handleLectureSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Lecture Name"
                onChange={handleLectureInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                name="date"
                onChange={handleLectureInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="completed"
                  onChange={handleLectureInputChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>Completed</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowLectureModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lectures</h2>
      {batch?.lectures?.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Lecture Name</th>
              <th className="p-3">Date</th>
              <th className="p-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            {batch?.lectures?.map((lecture) => (
              <tr key={lecture._id} className="border-b">
                <td className="p-3">{lecture.name}</td>
                <td className="p-3">{new Date(lecture.date).toLocaleDateString()}</td>
                <td className="p-3">{lecture.completed ? "✅ Yes" : "❌ No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-700">No lectures available</p>
      )}

      <p className="text-lg text-gray-700 mt-8"><strong>Total Students:</strong> {studentDetails.length}</p>
      <ul className="list-disc pl-5 mt-4">
        {studentDetails.map((student, index) => (
          <li key={index} className="text-lg text-gray-700">{student.name}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Attendance</h2>
      {batch?.lectures?.map((lecture) => (
        <div key={lecture._id} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{lecture.name} - {new Date(lecture.date).toLocaleDateString()}</h3>
          <ul className="mt-2">
            {lecture.attendance.map((att) => {
              const student = studentDetails.find((s) => s._id === att.studentId);
              const currentStatus = attendanceData[lecture._id]?.[att.studentId] ?? att.attended;

              return (
                <li key={att._id} className="flex items-center justify-between p-2 border-b">
                  <span className="text-lg text-gray-700">
                    {student ? student.name : "Unknown Student"} {" "}
                    ({currentStatus ? "Already Attended" : "Absent"})
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAttendanceChange(lecture._id, att.studentId, true)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      ✅ Mark Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(lecture._id, att.studentId, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      ❌ Mark Absent
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => handleSubmitAttendance(lecture._id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
          >
            Submit Attendance
          </button>
        </div>
      ))}
    </div>
  );
};

export default BatchDetail;