import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal1 = ({ lectureId, batchId, onClose }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}/lectures/${lectureId}`)
      .then((res) => {
        console.log("API Response for students:", res.data);
        if (Array.isArray(res.data.students)) {
          setStudents(res.data.students.map((s) => ({ student: s, present: s.attended })));
        } else {
          setStudents([]);
        }
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, [batchId, lectureId]);
  

  const handleAttendance = (studentId, present) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student._id === studentId ? { ...s, present } : s
      )
    );
  };

  const submitAttendance = () => {
    axios.patch(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}/lectures/${lectureId}/attendance`, {
      students: students.map(({ student, present }) => ({ studentId: student._id, present })),
    })
    .then(() => onClose())
    .catch((err) => console.error(err));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Mark Attendance</h3>
        <ul>
          {students.map(({ student, present }) => (
            <li key={student._id}>
              {student.name} - 
              <button onClick={() => handleAttendance(student._id, true)} style={{ backgroundColor: present ? "green" : "gray" }}>Present</button>
              <button onClick={() => handleAttendance(student._id, false)} style={{ backgroundColor: present === false ? "red" : "gray" }}>Absent</button>
              {student.present && <h1>Already Attended</h1>}

            </li>
          ))}
        </ul>
        <button onClick={submitAttendance}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal1;
