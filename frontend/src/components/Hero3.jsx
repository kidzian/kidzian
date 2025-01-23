import React from 'react';
import { motion } from 'framer-motion';
import i from '../assets/i1.png';
import chinese from '../assets/chinese.png';
import globe from '../assets/globe.png';
const Hero3 = () => {
  return (
    <div className='w-[100vw] h-[90vh] flex items-center justify-center'>
      <div className='w-[50vw] h-[60vh]  flex flex-col items-center justify-center pl-12'>
        
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
        <div className=' flex items-center justify-center gap-7 mt-10 ml-6'>
          <div className='flex flex-col gap-2 items-center justify-center'>
            
          <h1 className=' font-bold text-gray-600 '>Choose your grade</h1>

            <div className='grid grid-cols-4 gap-1'>
              {Array.from({ length: 12 }, (_, i) => (
                <motion.button
                  key={i + 1}
                  className='bg-gradient-to-br from-orange-400 to-red-500 text-white w-[4rem] h-[4rem] rounded-2xl shadow-lg flex items-center justify-center text-lg font-semibold transition-transform transform hover:scale-105'
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>

        
          </div>

          {/* Free Demo Button */}
          <motion.button
            className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md shadow-md  h-12 w-40 mt-10 flex items-center justify-center transform transition-transform hover:scale-105'
          >
            Book A Free Demo
          </motion.button>
        </div>
      </div>

      {/* Placeholder for other content */}
      <div className='w-[50vw] flex items-center justify-center mb-16 h-[60vh]'>
     
     <img src={chinese} className='z-20 absolute right-1vh h-[75vh] bottom-20 w-[52vw]' alt="" />

     {/* <img src={globe} className='z-20 absolute right-[2vh] h-[65vh] bottom-20 w-[52vw]' alt="" /> */}
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

      
    </div>
  );
};

export default Hero3;
