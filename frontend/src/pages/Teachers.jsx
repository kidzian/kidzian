// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';  // Import Link from react-router-dom

// const Teachers = () => {
//   const [open, setOpen] = useState(false);  // Modal open state
//   const [teacherData, setTeacherData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phoneNumber: '',
//   });
//   const [teachers, setTeachers] = useState([]);

//   // Open and close modal
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Fetch teachers from backend
//   const fetchTeachers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/teachers');
//       setTeachers(response.data);
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTeacherData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Send the teacher data to the backend
//       const response = await axios.post('http://localhost:5000/teachers', teacherData);
      
//       if (response.status === 200) {
//         alert('Teacher added successfully');
//         handleClose();
//         fetchTeachers();  // Refresh the teacher list after adding a new one
//       }
//     } catch (error) {
//       console.error('Error adding teacher:', error);
//       alert('Error adding teacher');
//     }
//   };

//   useEffect(() => {
//     fetchTeachers(); // Fetch teachers when the component mounts
//   }, []);

//   return (
//     <div className="container mx-auto p-6">
//       {/* Create Teacher Button */}
//       <button 
//         onClick={handleOpen} 
//         className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg text-lg hover:bg-green-600 focus:outline-none"
//       >
//         Create Teacher
//       </button>

//       {/* Modal */}
//       {open && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-semibold mb-4">Add Teacher</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={teacherData.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={teacherData.email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={teacherData.password}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Phone Number</label>
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   value={teacherData.phoneNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none"
//               >
//                 Submit
//               </button>
//             </form>
//             <button 
//               onClick={handleClose} 
//               className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-lg w-full hover:bg-red-600 focus:outline-none"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Teachers List */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//         {teachers.map((teacher) => (
//           <Link key={teacher._id} to={`/admin-dashboard/teachers/${teacher._id}`} className="cursor-pointer">
//             <div className="bg-white p-4 rounded-lg shadow-lg">
//               <h3 className="text-xl font-semibold">{teacher.name}</h3>
//               <p className="text-gray-700">Email: {teacher.email}</p>
//               <p className="text-gray-700">Phone: {teacher.phoneNumber}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Teachers;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Teachers = () => {
  const [open, setOpen] = useState(false);
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [teachers, setTeachers] = useState([]);

  // Open & Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/teachers`, teacherData);
      if (response.status === 200) {
        alert('Teacher added successfully');
        handleClose();
        fetchTeachers();
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher');
    }
  };

  // Delete Teacher
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/teachers/${id}`);
      alert('Teacher deleted successfully');
      fetchTeachers(); // Refresh list
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Error deleting teacher');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Create Teacher Button */}
      <button 
        onClick={handleOpen} 
        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg text-lg hover:bg-green-600 focus:outline-none"
      >
        Create Teacher
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Add Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={teacherData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={teacherData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={teacherData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={teacherData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Submit
              </button>
            </form>
            <button 
              onClick={handleClose} 
              className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-lg w-full hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Teachers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{teacher.name}</h3>
              <p className="text-gray-700">Email: {teacher.email}</p>
              <p className="text-gray-700">Phone: {teacher.phoneNumber}</p>
            </div>
            <button 
              onClick={() => handleDelete(teacher._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
