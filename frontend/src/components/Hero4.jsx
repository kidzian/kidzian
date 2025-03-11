

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import hero4 from '../assets/hero4.png';
import axios from 'axios';
import chinese from '../assets/chinese.png';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import Service from './Service';
import { useNavigate } from "react-router-dom";
const Hero4 = () => {

    const navigate = useNavigate();

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    email:'',
  });

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    // Include grade in the data being sent to the backend
    const dataToSend = { ...formData, grade: selectedGrade };
    console.log(dataToSend);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-form`,
        dataToSend,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success('Demo booked successfully!');
        setShowModal(false);
        setFormData({ name: '', phone: '', course: '',email:'' });
        setSelectedGrade(null);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to book a demo. Please try again.');
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className='w-[100vw] min-h-[110vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-cyan-200 via-red-100 to-cyan-200'>

      <div className='sm:w-full  md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw] gap-8 md:pt-32 lg:pt-32 xl:pt-32 2xl:pt-32 sm:pt-0 flex flex-col items-center justify-center md:pl-12 lg:pl-12 xl:pl-12 2xl:pl-12  '>
        
        {/* Heading Section */}
       
        <motion.div
         initial={{ x: '-100vw' }} 
         animate={{ x: 0 }} 
         transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
        className='text-4xl md:text-5xl lg:text-5xl xl:text-[47px] 2xl:text-5xl font-extrabold mt-10 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 ml-8'>
          <h1>
            Empowering <span className="text-[#3a84f6] twxt-sm">Young Minds</span>
          </h1>
          
          <h1 className='mt-1'>
           <span className="text-[#3a84f6]">With</span> Future-Ready <span className="text-[#3a84f6]">Skills</span>
          </h1>
        </motion.div>

        {/* Grade Selection Buttons and CTA */}
        <div className=' flex flex-col items-center justify-center gap-10 md:pr-8 lg:pr-8 xl:pr-8 2xl:pr-8 '>
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
         <div className='flex gap-10'>
         <motion.button
            onClick={() => setShowModal(true)}
            className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md shadow-md h-12 w-40 flex items-center justify-center transform transition-transform hover:scale-105'
          >
            Book A Free Demo
          </motion.button>

          <motion.button
            onClick={() => navigate("/courses")}
            className='bg-gray-500 text-white rounded-md shadow-md h-12 w-40 flex items-center justify-center transform transition-transform hover:scale-105'
          >
            View all courses
          </motion.button>
         </div>

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
                    <label className='block text-sm font-medium mb-1'>Email</label>
                    <input
                     type='email'
                      name='email'
                      value={formData.email}
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
  <select
    name="grade"
    value={selectedGrade || ''}
    onChange={(e) => setSelectedGrade(e.target.value)}
    className="w-full border cursor-pointer rounded-md p-2"
    required
  >
    <option value="" disabled>Select a grade</option>
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ))}
  </select>
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
  type="submit"
  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
  disabled={loading} // Disable button when loading
>
  {loading ? (
    <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
  ) : (
    "Book"
  )}
</button>

                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for other content */}
      

<motion.div className='sm:w-full md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw] flex items-center justify-center md:h-auto lg:h-auto xl:h-auto 2xl:h-auto sm:h-[80vh] xl:pb-16 md:pb-16 lg:pb-16 2xl:pb-16 sm:pb-0 sm:pt-10 md:pt-0 lg:pt-0 xl:pt-0 2xl:pt-0 sm:mt-10 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 order-first md:order-last b'
initial={{ x: '100vw' }} 
animate={{ x: 0 }} 
transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
>
  <img src={hero4} className='' alt="" />
 
</motion.div>

      {/* ToastContainer for Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      
    </div>
  );
};

export default Hero4;


