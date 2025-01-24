// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import chinese from '../assets/chinese.png';

// const Hero3 = () => {
//   const [selectedGrade, setSelectedGrade] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     course: '',
//   });

//   const handleGradeSelect = (grade) => {
//     setSelectedGrade(grade);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const dataToSend = { ...formData, grade: selectedGrade };
//     console.log(dataToSend);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/submit-form`,
//         dataToSend,
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         toast.success('Demo booked successfully!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         setShowModal(false);
//         setFormData({ name: '', phone: '', course: '' });
//         setSelectedGrade(null);
//       }
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//       toast.error('Failed to book a demo. Please try again.', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <div className="w-[100vw] h-[90vh] flex items-center justify-center">
//       <ToastContainer />
//       <div className="w-[50vw] gap-8 mt-32 flex flex-col items-center justify-center pl-12">
//         <div className="text-5xl font-extrabold">
//           <h1>
//             Welcome to <span className="text-[#4b40de]">Kidzian</span>
//           </h1>
//           <h1>Your Place To</h1>
//           <h1>
//             Learn, <span className="text-[#4b40de]">Play and Grow</span>
//           </h1>
//         </div>

//         <div className="flex flex-col items-center justify-center gap-10 pr-8">
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <h1 className="font-bold text-gray-600">Choose your grade</h1>
//             <div className="grid grid-cols-4 gap-1">
//               {Array.from({ length: 12 }, (_, i) => (
//                 <motion.button
//                   key={i + 1}
//                   onClick={() => handleGradeSelect(i + 1)}
//                   whileHover={{
//                     scale: 1.1,
//                     transition: { duration: 0.2, ease: 'easeInOut' },
//                   }}
//                   className={`${
//                     selectedGrade === i + 1
//                       ? 'bg-blue-500'
//                       : 'bg-gradient-to-br from-orange-400 to-red-500'
//                   } text-white w-[4rem] h-[4rem] rounded-2xl shadow-lg flex items-center justify-center text-lg font-semibold`}
//                 >
//                   {i + 1}
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           <motion.button
//             onClick={() => setShowModal(true)}
//             className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md shadow-md h-12 w-40 flex items-center justify-center transform transition-transform hover:scale-105"
//           >
//             Book A Free Demo
//           </motion.button>

//           {showModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-8 rounded-lg shadow-lg w-[90vw] max-w-md">
//                 <h2 className="text-2xl font-bold mb-4">Book a Free Demo</h2>
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full border rounded-md p-2"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">
//                       Phone
//                     </label>
//                     <input
//                       type="text"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className="w-full border rounded-md p-2"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">
//                       Course
//                     </label>
//                     <select
//                       name="course"
//                       value={formData.course}
//                       onChange={handleInputChange}
//                       className="w-full border cursor-pointer rounded-md p-2"
//                       required
//                     >
//                       <option value="" disabled>
//                         Select a course
//                       </option>
//                       <option value="Little Innovators">Little Innovators</option>
//                       <option value="Junior Innovators">
//                         Junior Innovators
//                       </option>
//                       <option value="Senior Innovators">
//                         Senior Innovators
//                       </option>
//                       <option value="Artificial Intelligence">
//                         Artificial Intelligence
//                       </option>
//                       <option value="Web Development Course">
//                         Web Development Course
//                       </option>
//                       <option value="App Development Course (Junior)">
//                         App Development Course (Junior)
//                       </option>
//                       <option value="App Development Course (Senior)">
//                         App Development Course (Senior)
//                       </option>
//                       <option value="Java Course">Java Course</option>
//                     </select>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">
//                       Grade
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedGrade || ''}
//                       className="w-full border rounded-md p-2 bg-gray-100"
//                       readOnly
//                     />
//                   </div>
//                   <div className="flex items-center justify-end gap-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowModal(false)}
//                       className="bg-gray-400 text-white px-4 py-2 rounded-md"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                     >
//                       Book
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-[50vw] flex items-center justify-center mb-16 h-[60vh]">
//         <img
//           src={chinese}
//           className="z-20 absolute right-1vh h-[75vh] bottom-20 w-[52vw]"
//           alt=""
//         />
//       </div>

//       {/* Decorative Elements */}
//       <span
//         className="absolute w-[31vw] h-[31vw] rounded-full z-10 left-[58vw]"
//         style={{
//           background: 'linear-gradient(to right, #4540e1 50%, #f0f0fc 50%)',
//           transform: 'rotate(300deg)',
//         }}
//       ></span>
//       <span className="absolute rounded-full w-[31vw] h-[31vw] border border-[#4540e1] z-20 left-[55.4vw] top-[20vh]"></span>
//       <span className="w-[2vw] h-[2vw] bg-[#4540e1] top-[30vh] rounded-full absolute left-[83vw] z-10"></span>
//       <span className="w-[3vw] h-[3vw] bg-[#4540e1] rounded-full absolute top-[70vh] left-[55vw] z-10"></span>
//       <span className="w-[1vw] h-[1vw] bg-[#4540e1] rounded-full absolute top-[92.5vh] left-[75vw] z-10"></span>
//       <span className="w-[6vw] h-[6vw] bg-[#9f99dd] rounded-full absolute top-[45.5vh] left-[82vw] z-10"></span>
//       <span className="w-[6vw] h-[6vw] bg-[#6965e4] rounded-full absolute top-[80.5vh] left-[78vw]"></span>
//     </div>
//   );
// };

// export default Hero3;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import chinese from '../assets/chinese.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const Hero3 = () => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
  });

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include grade in the data being sent to the backend
    const dataToSend = { ...formData, grade: selectedGrade };
    console.log(dataToSend);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-form`,
        dataToSend,
        {
          withCredentials: true, // Ensures cookies are sent
        }
      );

      // Check response status
      if (response.status === 200) {
        toast.success('Demo booked successfully!'); // Show success toast
        setShowModal(false);
        setFormData({ name: '', phone: '', course: '' });
        setSelectedGrade(null);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to book a demo. Please try again.'); // Show error toast
    }
  };

  return (
    <div className='w-[100vw] h-[90vh] flex items-center justify-center'>
      <div className='w-[50vw] gap-8 mt-32  flex flex-col items-center justify-center pl-12 '>
        
        {/* Heading Section */}
        <div className='text-5xl font-extrabold '>
          <h1>
            Welcome to <span className="text-[#4b40de]">Kidzian</span>
          </h1>
          <h1>Your Place To</h1>
          <h1>
            Learn, <span className="text-[#4b40de]">Play and Grow</span>
          </h1>
        </div>

        {/* Grade Selection Buttons and CTA */}
        <div className=' flex flex-col items-center justify-center gap-10 pr-8'>
          <div className='flex flex-col gap-2 items-center justify-center'>
            <h1 className=' font-bold text-gray-600 '>Choose your grade</h1>
            <div className='grid grid-cols-4 gap-1'>
              {Array.from({ length: 12 }, (_, i) => (
                <motion.button
                  key={i + 1}
                  onClick={() => handleGradeSelect(i + 1)}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2, ease: 'easeInOut' },
                  }}
                  className={`${
                    selectedGrade === i + 1
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-br from-orange-400 to-red-500'
                  } text-white w-[4rem] h-[4rem] rounded-2xl shadow-lg flex items-center justify-center text-lg font-semibold`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Free Demo Button */}
          <motion.button
            onClick={() => setShowModal(true)}
            className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md shadow-md h-12 w-40 flex items-center justify-center transform transition-transform hover:scale-105'
          >
            Book A Free Demo
          </motion.button>

          {showModal && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white p-8 rounded-lg shadow-lg w-[90vw] max-w-md'>
                <h2 className='text-2xl font-bold mb-4'>Book a Free Demo</h2>
                <form onSubmit={handleSubmit}>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>Name</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      className='w-full border rounded-md p-2'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>Phone</label>
                    <input
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      className='w-full border rounded-md p-2'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>Course</label>
                    <select 
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full border cursor-pointer rounded-md p-2"
                      required
                    >
                      <option value="" disabled>Select a course</option>
                      <option value="Little Innovators">Little Innovators</option>
                      <option value="Junior Innovators">Junior Innovators</option>
                      <option value="Senior Innovators">Senior Innovators</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Web Development Course">Web Development Course</option>
                      <option value="App Development Course (Junior)">App Development Course (Junior)</option>
                      <option value="App Development Course (Senior)">App Development Course (Senior)</option>
                      <option value="Java Course">Java Course</option>
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium mb-1'>Grade</label>
                    <input
                      type='text'
                      value={selectedGrade || ''}
                      className='w-full border rounded-md p-2 bg-gray-100'
                      readOnly
                    />
                  </div>
                  <div className='flex items-center justify-end gap-4'>
                    <button
                      type='button'
                      onClick={() => setShowModal(false)}
                      className='bg-gray-400 text-white px-4 py-2 rounded-md'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='bg-blue-500 text-white px-4 py-2 rounded-md'
                    >
                      Book
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for other content */}
      <div className='w-[50vw] flex items-center justify-center mb-16 h-[60vh]'>
        <img src={chinese} className='z-20 absolute right-1vh h-[75vh] bottom-20 w-[52vw]' alt="" />
      </div>

      {/* Decorative Elements */}
      <span
        className="absolute w-[31vw] h-[31vw] rounded-full z-10 left-[58vw]"
        style={{
          background: "linear-gradient(to right, #4540e1 50%, #f0f0fc 50%)",
          transform: "rotate(300deg)",
        }}
      ></span>

      <span className='absolute rounded-full w-[31vw] h-[31vw] border border-[#4540e1] z-20 left-[55.4vw] top-[20vh]'></span>
      <span className='w-[2vw] h-[2vw] bg-[#4540e1] top-[30vh] rounded-full absolute left-[83vw] z-10'></span>
      <span className='w-[3vw] h-[3vw] bg-[#4540e1] rounded-full absolute top-[70vh] left-[55vw] z-10'></span>
      <span className='w-[1vw] h-[1vw] bg-[#4540e1] rounded-full absolute top-[92.5vh] left-[75vw] z-10'></span>
      <span className='w-[6vw] h-[6vw] bg-[#9f99dd] rounded-full absolute top-[45.5vh] left-[82vw] z-10'></span>
      <span className='w-[6vw] h-[6vw] bg-[#6965e4] rounded-full absolute top-[80.5vh] left-[78vw] '></span>

      {/* ToastContainer for Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Hero3;


