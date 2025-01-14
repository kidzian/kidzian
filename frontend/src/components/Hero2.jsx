
// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
// import hero2 from '../assets/openart-369a0aee-fe0a-4e5c-a7de-5a65e8ff9042.jpeg';
// import girls from '../assets/2girls-removebg-preview.png';
// import girl from '../assets/girl-removebg-preview.png';
// import i from '../assets/i.png';
// import html from '../assets/html.png';
// import react from '../assets/react.png';
// import mongo from '../assets/mongo.png';
// import node from '../assets/node.png';
// import globe from '../assets/globe.png';
// const Hero2 = () => {
//   return (
//     <div className="w-full h-[87.5vh] flex items-center justify-center tracking-tighter  relative overflow-hidden ">
      

//       {/* Main Content */}
//       <div className="flex items-center justify-between w-[90%] max-w-[1200px] relative z-10 gap-6 text-black">
//         {/* Image Section */}
//         <div className="w-[50%] flex items-center justify-center z-10">
//           <img
//             className="h-[60vh] rounded-full   object-cover"
//             src={i}
           
//           />
//           <img
//             className="h-[60vh] rounded-full   object-cover"
//             src={globe}
           
//           />
//         </div>

      

// <img className='absolute w-[10vw] top-0 z-10' src={html} alt="" />
// <img className='absolute w-[6vw] z-10 left-[8vw] -bottom-16 -rotate-45' src={mongo} alt="" />
// <img className='absolute w-[6vw] z-10 left-[30vw] -top-16' src={react} alt="" />
// <img className='absolute w-[6vw] z-10 left-[30vw] -bottom-[12vh]' src={node} alt="" />

// <div className='bg-purple-400 absolute w-[40vw] h-[40vw] left-6 rounded-full'></div>


//         {/* Text Section */}
//         <div className="w-[50%] flex flex-col items-start justify-center text-black space-y-6">
//           <motion.div
//             className="text-[48px] font-bold leading-tight capitalize"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1 }}
//           >
//             <h1>Welcome to Kidzian</h1>
//             <h2>Your place to</h2>
//             <h2>Learn, Play & Grow</h2>
//           </motion.div>

//           <motion.p
//             className="text-base"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, delay: 0.3 }}
//           >
//             For students of age 7 to 17, Kidzian offers professional online coding courses. Learn coding in a gamified and interactive way with our team of expert tutors and achieve academic excellence.
//           </motion.p>

//           {/* Buttons */}
//           <motion.div
//             className="flex gap-4"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, delay: 0.5 }}
//           >
//             <button className="flex items-center justify-center gap-2 bg-[#AA14F0] px-6 py-3 text-lg rounded-lg shadow-lg hover:bg-[#8C0DD8] transform hover:scale-105 transition-transform duration-300 text-white">
//               <FaUserPlus />
//               Register
//             </button>
//             <button className="flex items-center justify-center gap-2 bg-[#AA14F0] px-6 py-3 text-lg rounded-lg shadow-lg hover:bg-[#8C0DD8] transform hover:scale-105 transition-transform duration-300 text-white">
//               <FaSignInAlt />
//               Log In
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero2;






import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import i from '../assets/i.png';
import globe from '../assets/globe.png';
import html from '../assets/html.png';
import react from '../assets/react.png';
import mongo from '../assets/mongo.png';
import node from '../assets/node.png';

const Hero2 = () => {
  // State to manage the active image
  const [activeImage, setActiveImage] = useState(0);

  // Array of images to switch between
  const images = [i, globe];

  useEffect(() => {
    // Set interval to change images every 3 seconds
    const interval = setInterval(() => {
      setActiveImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[87.5vh] flex items-center justify-center tracking-tighter relative overflow-hidden bg-[#fce6d1]">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-indigo-400 rounded-full blur-[100px] opacity-50 z-0"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-300 rounded-full blur-[150px] opacity-50 z-0"></div>



      {/* Main Content */}
      <div className="flex items-center justify-between w-[90%] max-w-[1200px] relative z-10 gap-6 text-white">
        {/* Image Section */}
        <div className="w-[50%] flex items-center justify-center z-10 relative">
          <div className=" relative">
            <motion.img
              className="h-[60vh] rounded-full object-cover absolute"
              src={images[activeImage]}
              alt="Slideshow Image"
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </div>
          <motion.img
            className="absolute w-[10vw] bottom-[20vh] z-10 opacity-80 animate-pulse left-[15vw]"
            src={html}
            alt="HTML"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.img
            className="absolute w-[6vw] z-10 left-[1vw] -bottom-16 -rotate-45 opacity-80 animate-pulse"
            src={mongo}
            alt="Mongo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <motion.img
            className="absolute w-[6vw] z-10 left-[30vw] -top-[3vh] opacity-80 animate-pulse"
            src={react}
            alt="React"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          <motion.img
            className="absolute w-[6vw] z-10 left-[15vw] -bottom-[40vh] opacity-80 animate-pulse"
            src={node}
            alt="Node.js"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          />
        </div>

        {/* Text Section */}
        <div className="w-[50%] flex flex-col items-start justify-center text-black space-y-6">
          <motion.div
            className="text-[48px] font-extrabold leading-tight capitalize"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Welcome to Kidzian</h1>
            <h2>Your place to</h2>
            <h2>Learn, Play & Grow</h2>
          </motion.div>

          <motion.p
            className="text-base font-light"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            For students of age 7 to 17, Kidzian offers professional online coding courses. Learn coding in a gamified and interactive way with our team of expert tutors and achieve academic excellence.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <button className="flex items-center justify-center gap-2 bg-[#AA14F0] px-6 py-3 text-lg rounded-lg shadow-xl hover:bg-[#8C0DD8] transform hover:scale-105 transition-transform duration-300 text-white">
              <FaUserPlus />
              Register
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#AA14F0] px-6 py-3 text-lg rounded-lg shadow-xl hover:bg-[#8C0DD8] transform hover:scale-105 transition-transform duration-300 text-white">
              <FaSignInAlt />
              Log In
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;
