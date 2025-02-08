import React from 'react'
import { useState } from 'react';
const StudentList = ({batch}) => {

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

     const handleStudentClick = async (student) => {
        try {
          console.log('Fetching student with ID:', student._id);
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/${student._id}`);
          
          if (response.ok) {
            const data = await response.json();
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

  return (
    <>
      <h2 className="text-xl font-bold mt-4 mb-2">Students</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            {batch.students.length > 0 ? (
              <ul>
                {batch.students.map((student) => (
                  <li key={student._id} className="mb-2">
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
                <p className="text-gray-600">Phone: {selectedStudent.phoneNumber}</p>
                <p className="text-gray-600">Address: {selectedStudent.address}</p>
                <p className="text-gray-600">Password: {selectedStudent.password}</p>

                <h3 className="text-lg font-semibold mt-4">Attended Lectures</h3>
                <div className="border-b border-gray-300 my-2"></div>
                {selectedStudent.batches?.[0]?.lectures?.filter(lec => lec.attendance).length > 0 ? (
                  <ul>
                    {selectedStudent.batches[0].lectures
                      .filter(lecture => lecture.attendance)
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
         
    </>
  )
}

export default StudentList
