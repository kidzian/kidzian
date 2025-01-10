import React from 'react';
import { motion } from 'framer-motion';
import Heading from '../components/Heading';
import hero2 from '../assets/Leonardo_Phoenix_09_a_curious_young_boy_with_bright_brown_eyes.jpg';
import Minecraft from '../assets/Minecraft.jpg';
import Roblox from '../assets/Roblox.jpg';
import Webd from '../assets/Webd.jpg';

import Footer from '../components/Footer';


const courseData = [
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft } // Replace with another image if needed
  // Add more courses here
];

const Courses = () => {
  return (
    <div className="w-full bg-[#FEFDFF]">
      <Heading />
      <motion.div
        className="w-full min-h-[100vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="w-[75vw]">
          {/* Hero Section */}
          <motion.div
            className="flex gap-10 items-center justify-center mb-12 h-[64vh]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
          >
            <motion.img
              src={hero2}
              alt="Curious young boy"
              className="h-[60vh] w-[38vw] rounded-2xl object-cover shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            />
            <div className="flex flex-col items-start w-[45vw]">
              <motion.h1
                className="text-4xl font-extrabold text-[#303030] mb-4 capitalize"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
              >
                Coding Courses For Kids and Teens
              </motion.h1>
              <motion.p
                className="text-lg text-[#606060] font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.3 }}
              >
                Learn to code, build projects, and have fun!
              </motion.p>
              <motion.p
                className="text-lg text-[#606060] font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.4 }}
              >
                Choose Python, JavaScript, HTML/CSS, and more.
              </motion.p>
              <motion.input
                type="text"
                placeholder="Search courses..."
                className="w-[35vw] p-3 rounded-lg border border-gray-300 shadow-sm bg-[#F0F2F5] focus:outline-none focus:ring-2 focus:ring-[#AA14F0] transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Courses Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-[#303030] mb-6">Courses</h1>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {courseData.map((course, index) => (
                <motion.div
                  key={index}
                  className="bg-white w-[15vw] flex flex-col items-center rounded-xl  cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 170}}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-[200px] w-full rounded-lg object-cover mb-2"
                  />
                  <p className="text-lg font-semibold text-[#303030]">
                    {course.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>




      </motion.div>

   <Footer/>
    </div>
  );
};

export default Courses;
