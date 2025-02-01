import { useEffect, useState } from "react";

const BatchDetails = () => {
  const batchId = "679e1e60b5c14f00ed9917e1"; // Your batch ID
  const [batch, setBatch] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
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


<h2 className="text-xl font-bold mt-4">Lectures</h2>
          {batch.lectures && batch.lectures.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {batch.lectures.map((lecture) => (
                <li key={lecture._id}>
                  {lecture.name} on {new Date(lecture.date).toDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No lectures scheduled yet.</p>
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
