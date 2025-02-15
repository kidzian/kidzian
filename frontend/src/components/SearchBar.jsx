import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch search results when searchTerm changes (debounced)
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/search?term=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          
          setSearchResults(data);
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }, 500); // Wait 500ms before making the API call

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout if user types again
  }, [searchTerm]);

  // Fetch student details when clicked
  const handleStudentClick = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("yes");
        console.log(data)
        setSelectedStudent(data);
        setIsModalOpen(true);
      } else {
        console.error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // Handle updating student info
  const handleUpdateStudent = async () => {
    try {
      const updatedData = { ...selectedStudent };
      const response = await fetch(`http://localhost:5000/api/student/${selectedStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setSelectedStudent(updatedStudent);
        alert('Student information updated');
      } else {
        console.error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search student to edit any information about him/her"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-[98vw] mt-2 mb-2 mr-3 ml-3"
      />

      {/* Search Results */}
      <ul className='ml-5 z-10'>
        {searchResults.map((student) => (
          <li key={student._id} onClick={() => handleStudentClick(student._id)} className="cursor-pointer">
            {student.name}
          </li>
        ))}
      </ul>

      {/* Modal to View/Edit Student Details */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 pt-56 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Edit {selectedStudent.name}</h2>

            {/* Form to Edit Student Info */}
            <div className="mb-2">
              <label>Name</label>
              <input
                type="text"
                value={selectedStudent.name}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Address</label>
              <input
                type="text"
                value={selectedStudent.address}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Email</label>
              <input
                type="email"
                value={selectedStudent.email}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Phone Number</label>
              <input
                type="tel"
                value={selectedStudent.phoneNumber}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, phoneNumber: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Age</label>
              <input
                type="number"
                value={selectedStudent.age}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, age: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Grade</label>
              <input
                type="number"
                value={selectedStudent.grade}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, grade: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-2">
              <label>Certificates</label>
              <input
                type="number"
                value={selectedStudent.certificates}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, certificates: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label>Password</label>
              <input
                type="password"
                value={selectedStudent.password}
                onChange={(e) => setSelectedStudent({ ...selectedStudent, password: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Attendance Field for each Batch */}
            <div className="mb-4">
              <label >Attendance</label>
              {selectedStudent.batches.map((batch, index) => (
                <div key={batch.batch._id} className="mb-4 mt-4">
                  <h3><strong>Course Name:</strong> {batch.courseName}</h3>
                  <h3>Batch: {batch.batch.name} </h3>
                  {batch.lectures.map((lecture, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <span>{lecture.name}</span>
                      <label className="ml-2">Attended</label>
                      <input
                        type="checkbox"
                        checked={lecture.attendance}
                        onChange={() => {
                          const updatedBatches = [...selectedStudent.batches];
                          updatedBatches[index].lectures[i].attendance = !lecture.attendance;
                          setSelectedStudent({ ...selectedStudent, batches: updatedBatches });
                        }}
                        className="ml-2"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>




            {/* Buttons */}
            <button onClick={handleUpdateStudent} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
              Update Student
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
