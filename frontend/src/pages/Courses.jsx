import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Heading from '../components/Heading';
import Footer from '../components/Footer';
import { FiSearch, FiDownload, FiX, FiChevronRight, FiStar, FiUsers, FiClock, FiAward } from 'react-icons/fi';

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData] = useState([
    {
      id: 1,
      title: "Python for Kids: Game Development",
      category: "beginner",
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      ageGroup: "8-12 years",
      studentsEnrolled: 2547,
      duration: "8 weeks",
      rating: 4.8,
      reviews: 127,
      isBestseller: true,
    
      description: "Learn Python programming through fun game development projects",
      about: [
        "Build 5 exciting games from scratch",
        "Learn fundamental programming concepts",
        "No prior experience needed",
        "Interactive learning with live support"
      ],
      learningOutcomes: [
        "Master Python basics",
        "Understand game development logic",
        "Create custom games independently",
        "Problem-solving skills development"
      ]
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      category: "beginner",
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg",
      ageGroup: "10-14 years",
      studentsEnrolled: 183,
      duration: "10 weeks",
      rating: 4.6,
      reviews: 89,
      isBestseller: false,
   
      description: "Start your journey in web development with HTML, CSS, and JavaScript",
      about: [
        "Create responsive websites",
        "Learn modern web technologies",
        "Build portfolio projects",
        "Industry-standard practices"
      ],
      learningOutcomes: [
        "Build responsive websites",
        "Understand web development basics",
        "Create interactive web applications",
        "Deploy websites live"
      ]
    },
    {
      id: 3,
      title: "Advanced JavaScript & React",
      category: "advanced",
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
      ageGroup: "14-18 years",
      studentsEnrolled: 125,
      duration: "12 weeks",
      rating: 4.9,
      reviews: 76,
      isBestseller: true,
  
      description: "Master modern JavaScript and React development",
      about: [
        "Build complex React applications",
        "State management with Redux",
        "Modern JavaScript features",
        "Real-world projects"
      ],
      learningOutcomes: [
        "Create full-stack applications",
        "Master React ecosystem",
        "Implement advanced JS patterns",
        "Build production-ready apps"
      ]
    },
    {
      id: 4,
      title: "Intermediate Python & Data Science",
      category: "intermediate",
      image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg",
      ageGroup: "12-16 years",
      studentsEnrolled: 157,
      duration: "10 weeks",
      rating: 4.7,
      reviews: 94,
      isBestseller: true,
     
      description: "Explore data science and analytics with Python",
      about: [
        "Data analysis fundamentals",
        "Scientific computing with NumPy",
        "Data visualization",
        "Basic machine learning"
      ],
      learningOutcomes: [
        "Analyze real-world data",
        "Create data visualizations",
        "Build predictive models",
        "Handle large datasets"
      ]
    },
    {
      id: 5,
      title: "Mobile App Development",
      category: "intermediate",
      image: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg",
      ageGroup: "13-17 years",
      studentsEnrolled: 92,
      duration: "12 weeks",
      rating: 4.5,
      reviews: 63,
      isBestseller: false,
      price: "$179",
      description: "Create mobile apps with React Native",
      about: [
        "Cross-platform development",
        "UI/UX design principles",
        "App deployment",
        "State management"
      ],
      learningOutcomes: [
        "Build native mobile apps",
        "Implement responsive designs",
        "Handle user authentication",
        "Deploy to app stores"
      ]
    },
    {
      id: 6,
      title: "AI & Machine Learning Basics",
      category: "advanced",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
      ageGroup: "15-18 years",
      studentsEnrolled: 234,
      duration: "14 weeks",
      rating: 4.8,
      reviews: 42,
      isBestseller: false,
      
      description: "Introduction to AI and machine learning concepts",
      about: [
        "Basic AI concepts",
        "Machine learning fundamentals",
        "Neural networks intro",
        "Practical AI projects"
      ],
      learningOutcomes: [
        "Understand AI basics",
        "Build ML models",
        "Process and analyze data",
        "Create AI applications"
      ]
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = courseData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || course.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCardClick = (course) => {
    setSelectedCourse(course);
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const heroImages = {
    backgroundImage: "url('https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50">
      <Heading />
      <motion.div
        className="w-full min-h-screen pt-[12.5vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] flex items-center justify-center" style={heroImages}>
          <div className="absolute inset-0 bg-[#1E3A8A]/80"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Your Path in Coding
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Expert-led courses designed to transform beginners into confident coders
            </motion.p>
            <motion.div
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </motion.div>
          </div>
        </div>

        {/* Course Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {['all', 'beginner', 'intermediate', 'advanced'].map((filter) => (
              <button
                key={filter}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence>
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCardClick(course)}
                >
                  <div className="relative h-48">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 to-transparent" />
                    {course.isBestseller && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FiAward className="w-4 h-4" />
                        Bestseller
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <FiUsers /> <span>{course.studentsEnrolled.toLocaleString()} students</span>
                        <FiClock className="ml-4" /> <span>{course.duration}</span>
                      </div>
                      <h3 className="text-white font-semibold text-lg line-clamp-2">{course.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${
                              i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'
                            } w-5 h-5`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({course.reviews} reviews)</span>
                      </div>
                      <span className="text-[#1E3A8A] font-bold">{course.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1E3A8A] font-semibold">
                        Age: {course.ageGroup}
                      </span>
                      <button
                        className="flex items-center gap-2 text-white bg-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-[#2B4BA1] transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(course.pdf);
                        }}
                      >
                        <FiDownload /> Curriculum
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Course Details Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-80">
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <button
                    className="absolute top-6 right-6 text-white/90 hover:text-white p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                    onClick={() => setSelectedCourse(null)}
                  >
                    <FiX size={24} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedCourse.isBestseller && (
                        <span className="px-4 py-1.5 bg-yellow-400 text-black rounded-full font-semibold flex items-center gap-2 text-sm">
                          <FiAward className="w-4 h-4" />
                          Bestseller
                        </span>
                      )}
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                        {selectedCourse.category.charAt(0).toUpperCase() + selectedCourse.category.slice(1)}
                      </span>
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                        {selectedCourse.ageGroup}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-2">{selectedCourse.title}</h2>
                    <div className="flex items-center gap-6 text-white/90 text-sm">
                      <div className="flex items-center gap-2">
                        <FiUsers />
                        <span>{selectedCourse.studentsEnrolled.toLocaleString()} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        <span>{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(selectedCourse.rating) ? 'text-yellow-400' : 'text-white/40'}`}
                            />
                          ))}
                        </div>
                        <span>({selectedCourse.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(85vh-20rem)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Course</h3>
                        <p className="text-gray-600 mb-6">{selectedCourse.description}</p>
                        <ul className="space-y-3">
                          {selectedCourse.about.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <FiChevronRight className="mt-1 flex-shrink-0 text-[#1E3A8A] w-5 h-5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Outcomes</h3>
                        <ul className="space-y-3">
                          {selectedCourse.learningOutcomes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <FiChevronRight className="mt-1 flex-shrink-0 text-[#1E3A8A] w-5 h-5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl hover:bg-[#2B4BA1] transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        onClick={() => handleDownload(selectedCourse.pdf)}
                      >
                        <FiDownload className="w-5 h-5" /> Download Curriculum
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
      <Footer />
    </div>
  );
};

export default Courses;