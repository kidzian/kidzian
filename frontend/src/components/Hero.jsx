import React from 'react';
import { motion } from 'framer-motion';
import hero2 from '../assets/kid_building_software-removebg-preview.png';
const Hero = () => {
  return (
    <div className='h-[100vh] w-[100%] flex items-center justify-center tracking-tighter  bg-[#FEFDFF]'>
      <div className='w-[45%] h-full flex flex-col items-center justify-center'>
        <span className='bg-[#46d156] h-[6.5vw] w-[6.5vw] rounded-3xl absolute top-[22vh] -left-8 transform rotate-45 z-1'></span>

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
            <span className='bg-[#62bdff] top-[45vh] left-[70vh] w-[2.5vw] h-[2.5vw] absolute rounded-full'></span>
            <span className='bg-[#fe6584] top-[25vh] left-[105vh] w-[2.5vw] h-[2.5vw] absolute rounded-full'></span>
          </div>
          <motion.p
            className='w-[100%] text-sm mt-[3vh]'
            initial={{ opacity: 0, x: -100 }}  // Initial state: hidden and off-screen to the left
            animate={{ opacity: 1, x: 0 }}     // Final state: fully visible and in place
            transition={{ duration: 1, delay: 0.5 }} // Transition with delay for smoother sequencing
          >
            For students in the USA, UK, Canada, and UAE, Megaminds offers professional online tutoring services. Our team of knowledgeable online tutors is dedicated to providing you with specialized assistance. As a result, you will be able to succeed academically.
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
        <span className='absolute top-[75vh] rounded-full left-[60vh] bg-[#71dc7e] w-[10vw] h-[10vw]'></span>
      </div>

      <div className='w-[55%] flex items-center justify-center relative'>
      <span className='w-[45vw] h-[45vw] bg-orange-200 rounded-full absolute left-[10vh] '></span>
      <motion.button
      className="absolute text-base bg-[#26D365] w-[13.5vw] rounded-xl h-[9vh] p-2 z-40 top-[57vh] right-12 text-white flex items-center justify-center gap-2 cursor-pointer font-semibold"
      initial={{ x: "70%" }} // Start off-screen to the right
      animate={{ x: 0 }} // Animate to its final position
      transition={{
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 1,
      }} // Smooth animation with spring physics
    >
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="30" viewBox="0 0 50 50">
  <path fill="#ffffff" d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 ..."/>
</svg>
      Chat on Whatsapp
    </motion.button>
        <img className='h-[60vh] w-[38vw] z-20 bottom-4' src={hero2} alt="" />
      </div>
    </div>
  );
};

export default Hero;
