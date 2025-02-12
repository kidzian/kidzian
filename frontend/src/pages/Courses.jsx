import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Heading from '../components/Heading';
import hero2 from '../assets/Leonardo_Phoenix_09_a_curious_young_boy_with_bright_brown_eyes.jpg';
import Footer from '../components/Footer';
import axios from 'axios';

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState([]); // State to hold courses data
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search input

  useEffect(() => {
    // Fetch courses data from the backend API
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`); // Assuming your backend is running on localhost:5000
        setCourseData(response.data); // Set the courses data
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };

    fetchCourses(); // Call the fetch function when the component mounts
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter courses based on the search query
  const filteredCourses = courseData.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (course) => {
    setSelectedCourse(course);
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="w-full bg-[#FEFDFF]">
      <Heading />
      <motion.div
        className="w-full min-h-[100vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="w-[90vw] sm:w-[80vw] md:w-[75vw]">
          {/* Hero Section */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center mb-12 h-[auto] sm:h-[64vh]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
          >
            <motion.img
              src={hero2}
              alt="Curious young boy"
              className="w-full sm:w-[38vw] md:w-[35vw] h-[auto] sm:h-[60vh] rounded-2xl object-cover shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            />
            <div className="flex flex-col items-start w-full sm:w-[45vw]">
              <motion.h1
                className="text-2xl sm:text-3xl font-extrabold text-[#303030] mb-4 capitalize"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
              >
                Coding Courses For Kids and Teens
              </motion.h1>
              <motion.p
                className=" text-[#606060] font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.3 }}
              >
                Learn to code, build projects, and have fun!
              </motion.p>
              <motion.p
                className=" text-[#606060] font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.4 }}
              >
                Choose Python, JavaScript, HTML/CSS, and more.
              </motion.p>
              <motion.input
                type="text"
                placeholder="Search courses..."
                className="w-full sm:w-[35vw] md:w-[35vw] p-3 rounded-lg border border-gray-300 shadow-sm bg-[#F0F2F5] focus:outline-none focus:ring-2 focus:ring-[#AA14F0] transition text-sm"
                value={searchQuery}
                onChange={handleSearchChange} // Handle change in search input
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
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={index}
                  className="bg-white w-full sm:w-[48%] md:w-[15vw] h-[300px] flex flex-col items-center rounded-xl cursor-pointer"
                  onClick={() => handleCardClick(course)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 170 }}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-[200px] w-full rounded-lg object-cover mb-2"
                  />
                  <p className="font-semibold text-[#303030] text-center">{course.title}</p>
                  <p className="text-sm text-[#606060]">Age Group: {course.ageGroup}</p>

                  {/* Flexbox to ensure button stays at the bottom */}
                  <div className="flex-grow"></div> {/* This takes up remaining space */}
                  <button
                    className="mt-2 bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-4 py-2 rounded-lg hover:opacity-90 self-end" 
                    onClick={() => handleDownload(course.pdf)}
                  >
                    Download Curriculum
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Course Details Modal */}
          {selectedCourse && (
            <div className="fixed z-40 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white h-[95vh] rounded-lg w-[70vw] sm:w-[60vw] lg:w-[50vw] p-8 flex flex-col lg:flex-row gap-6 relative overflow-scroll hide-scrollbar pb-8">
                <div className="w-full lg:w-[300px] flex flex-col items-center justify-center gap-5">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <button
                    className="bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-6 py-3 rounded-lg shadow-lg"
                    onClick={() => handleDownload(selectedCourse.pdf)}
                  >
                    Download Curriculum
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#303030] mb-4">{selectedCourse.title}</h2>
                  <p className="mb-2">
                    <strong className="text-[#f34e3e]">Age Group:</strong> {selectedCourse.ageGroup}
                  </p>
                  <div className="mb-4">
                    <strong>About:</strong>
                    <ul className="list-disc ml-5 text-sm text-[#606060]">
                      {selectedCourse.about.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 pb-4">
                    <strong>Learning Outcomes:</strong>
                    <ul className="list-disc ml-5 text-sm text-[#606060]">
                      {selectedCourse.learningOutcomes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="absolute top-2 right-4 cursor-pointer">
                  <button
                    className="text-red-500 text-2xl"
                    onClick={() => setSelectedCourse(null)}
                  >
                    ✖
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Courses;
