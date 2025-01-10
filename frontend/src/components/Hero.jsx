import React from 'react';
import { motion } from 'framer-motion';
import hero2 from '../assets/kid_building_software-removebg-preview.png';
const Hero = () => {
  return (
    <div className='h-[100vh] w-[100%] flex items-center justify-center tracking-tighter  bg-[#FEFDFF]'>
      <div className='w-[45%] h-full flex flex-col items-center justify-center'>
        {/* <span className='bg-[#46d156] h-[6.5vw] w-[6.5vw] rounded-3xl absolute top-[22vh] -left-8 transform rotate-45 z-1'></span> */}
        <motion.span
          className='absolute top-[22vh] -left-8 bg-[#46d156] w-[6.5vw] h-[6.5vw] rounded-3xl'
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10 }}
        />


        <div className='pl-[7vh] z-10'>
          <div className='flex flex-col items-start justify-center text-[50px] tracking-tighter font-bold capitalize leading-tight'>
            <motion.h1
              className='text-transparent bg-clip-text bg-gradient-to-r from-[#b21adf] to-[#f34e3e]'
              initial={{ opacity: 0, y: 20 }}  // Initial state: hidden and slightly below
              animate={{ opacity: 1, y: 0 }}    // Animated state: fully visible and in place
              transition={{ duration: 1 }}      // Transition duration for smooth effect
            >
              Welcome to kidzian
            </motion.h1>
            <motion.h1
              className=''
              initial={{ opacity: 0, y: 20 }}  // Initial state: hidden and slightly below
              animate={{ opacity: 1, y: 0 }}    // Animated state: fully visible and in place
              transition={{ duration: 1 }}      // Transition duration for smooth effect
            >
              your place to
            </motion.h1>
            <motion.h1
              className=''
              initial={{ opacity: 0, y: 20 }}  // Initial state: hidden and slightly below
              animate={{ opacity: 1, y: 0 }}    // Animated state: fully visible and in place
              transition={{ duration: 1 }}      // Transition duration for smooth effect
            >
              learn, play & grow
            </motion.h1>
           
            <span 
  className='absolute bg-[#62bdff] top-[45vh] left-[70vh] w-[2.5vw] h-[2.5vw] rounded-full'
  animate={{
    x: [0, 5, -5, 0],   // Horizontal movement (can tweak the numbers for desired motion)
    y: [0, -5, 5, 0],   // Vertical movement
  }}
  transition={{ 
    repeat: Infinity,   // Continuous motion
    repeatType: "loop", // Looping indefinitely
    duration: 2,        // Time for each complete motion cycle
    ease: "easeInOut"   // Smooth motion effect
  }}
></span>


            <motion.span
          className='absolute top-[25vh] left-[105vh] bg-[#fe6584] w-[2.5vw] h-[2.5vw] rounded-full'
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
          </div>
          <motion.p
            className='w-[100%] text-sm mt-[3vh]'
            initial={{ opacity: 0, x: -100 }}  // Initial state: hidden and off-screen to the left
            animate={{ opacity: 1, x: 0 }}     // Final state: fully visible and in place
            transition={{ duration: 1, delay: 0.5 }} // Transition with delay for smoother sequencing
          >
            For students of age 7 to 17 , Kidzian offers professional online coding courses. Our team of knowledgeable and professional tutors is dedicated to providing you with specialized assistance in learning coding in a gamified and interactive manner. As a result, you will be able to succeed academically.
          </motion.p>
        </div>

        <div className='text-white flex gap-3 mt-[6vh] z-10'>
          <button className='bg-[#AA14F0] w-[10vw] h-[8vh] rounded-xl hover:scale-105 transform transition-transform duration-300'>
            Register
          </button>
          <button className='bg-[#AA14F0] w-[10vw] h-[8vh] rounded-xl hover:scale-105 transform transition-transform duration-300'>
            Log In
          </button>
          
        </div>
      

<motion.span 
  className='absolute top-[75vh] rounded-full left-[60vh] bg-[#71dc7e] w-[10vw] h-[10vw]'
  animate={{
    scale: [1, 0.95, 1]   // Grow from normal size to slightly larger and then shrink back to normal
  }}
  transition={{ 
    repeat: Infinity,     // Continuous animation
    repeatType: "loop",   // Looping indefinitely
    duration: 1.5,         // Duration for each grow-shrink cycle
    ease: "easeInOut"      // Smooth scaling effect
  }}
></motion.span>


      </div>

      <div className='w-[55%] flex items-center justify-center relative'>
      <span className='w-[45vw] h-[45vw] bg-orange-200 rounded-full absolute left-[10vh] '></span>
        <img className='h-[60vh] w-[38vw] z-20 bottom-4' src={hero2} alt="" />
      </div>
    </div>
  );
};

export default Hero;



