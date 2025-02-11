

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import hero3 from '../assets/hero3.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import Service from './Service';

const Hero3 = () => {
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
    <div className='w-[100vw] min-h-[90vh] xl:flex lg:flex md:flex 2xl:flex sm:block items-center justify-center'>
      <div className='sm:w-full md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw] gap-8 md:pt-32 lg:pt-32 xl:pt-32 2xl:pt-32 sm:pt-0 flex flex-col items-center justify-center pl-12 '>
        
        {/* Heading Section */}
        <div className='md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl sm:text-5xl font-extrabold '>
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
      <div className='sm:w-full md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw]  bg-yellow-300 flex items-center justify-center h-[90vh]'>
        <img src={hero3} className='' alt="" />
      </div>

      {/* ToastContainer for Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      
    </div>
  );
};

export default Hero3;


