import React, { useEffect } from 'react';
import Heading from "../components/Heading";
import { DumbbellIcon as BicepsFlexed, Cpu, Earth, Gamepad2, Heart, MailCheck, Users, BookOpen, Award, Code, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';
import { FaRocket } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import about from "../assets/about-us.jpg";
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate =useNavigate();
  const handleClick=()=>{
    navigate('/courses');
  }
  const missionData = [
    {
      icon: <Gamepad2 className="h-16 w-16 text-[#28826a]" />,
      title: "Make Learning Fun And Accessible",
      description:
        "Our gamified learning approach and personalized learning paths ensure that every child can enjoy and succeed in their tech education journey.",
    },
    {
      icon: <Cpu className="h-16 w-16 text-[#28826a]" />,
      title: "Inspire Creativity Through Technology",
      description:
        "We foster creativity through interactive learning that encourages experimentation and innovation in coding, robotics, and digital design.",
    },
    {
      icon: <Earth className="h-16 w-16 text-[#28826a]" />,
      title: "Promote Diversity and Inclusion in Tech",
      description:
        "Our mission is to provide equal opportunities for all children to explore and excel in technology education, regardless of background or gender.",
    },
    {
      icon: <BicepsFlexed className="h-16 w-16 text-[#28826a]" />,
      title: "Empower Future Innovators",
      description:
        "We aim to equip children with the skills and confidence needed to thrive in a technology-driven world, preparing them to solve real-world problems.",
    },
  ];

  const statsData = [
    { number: "1114+", label: "Students Taught", icon: <Users className="h-8 w-8 text-[#28826a]" /> },
    { number: "25+", label: "Tech Courses", icon: <BookOpen className="h-8 w-8 text-[#28826a]" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Award className="h-8 w-8 text-[#28826a]" /> },
    { number: "100K+", label: "Lines of Code Written", icon: <Code className="h-8 w-8 text-[#28826a]" /> },
  ];

  const ageGroups = [
    {
      age: "7-9 years",
      title: "Tech Explorers",
      description:
        "Introduction to coding through visual programming, basic robotics, and interactive games that make learning a playful adventure.",
      color: "bg-[#28826a]",
    },
    {
      age: "10-13 years",
      title: "Digital Creators",
      description:
        "Advancing to block-based coding, web design fundamentals, game development, and collaborative tech projects.",
      color: "bg-[#28826a]",
    },
    {
      age: "14-17 years",
      title: "Future Innovators",
      description:
        "Mastering text-based programming languages, app development, advanced robotics, AI basics, and industry-relevant projects.",
      color: "bg-[#28826a]",
    },
  ];

  const courses = [
    {
      title: "Scratch Programming",
      description: "A visual programming language perfect for beginners to create animations and games",
      age: "7-10 years",
      icon: <Gamepad2 className="h-10 w-10 text-[#28826a]" />,
    },
    {
      title: "Python Fundamentals",
      description: "Learn the basics of Python programming with fun, interactive projects",
      age: "10-14 years",
      icon: <Code className="h-10 w-10 text-[#28826a]" />,
    },
    {
      title: "Web Development",
      description: "Create your own websites using HTML, CSS, and JavaScript",
      age: "12-17 years",
      icon: <Earth className="h-10 w-10 text-[#28826a]" />,
    },
    {
      title: "App Development",
      description: "Design and build mobile applications for Android and iOS",
      age: "14-17 years",
      icon: <Sparkles className="h-10 w-10 text-[#28826a]" />,
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      <Heading />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[50vh] md:h-[60vh] bg-gradient-to-r from-[#28826a] to-[#1f6e59] dark:from-[#1f6e59] dark:to-[#0f4c3a] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-50 dark:opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Inspiring Young Tech Minds
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-3xl mb-12"
          >
            Where children aged 7-17 discover the joy of coding, robotics, and digital creation
          </motion.p>
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="mt-8 px-8 py-3 bg-[#c79d27] dark:bg-[#d4a82c] text-white rounded-full font-bold text-lg flex items-center hover:bg-[#d4a82c] dark:hover:bg-[#e6b933] transition-colors shadow-lg"
          >
            Explore Our Courses <ChevronRight className="ml-2" />
          </motion.button>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="fill-white dark:fill-gray-900"
            ></path>
          </svg>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.number}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col lg:flex-row w-full min-h-screen items-center justify-center px-6 lg:px-16 py-12 gap-8 bg-gray-50 dark:bg-gray-800"
      >
        {/* Image Section */}
        <motion.div variants={fadeIn} className="w-full lg:w-1/2 flex justify-center">
          <img src={about || "/placeholder.svg"} alt="About Us" className="w-full max-w-[500px] rounded-xl shadow-lg" />
        </motion.div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <motion.h1 variants={fadeIn} className="text-3xl font-bold text-center lg:text-left text-gray-900 dark:text-white">
            Our Story
          </motion.h1>

          <motion.div variants={fadeIn} className="flex gap-4">
            <FaRocket size={80} className="text-[#28826a] flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              Kidzian was founded in 2023 by Rashmi Raju, a passionate software engineer and educator with an M.Tech in
              Computer Science. Having worked in top-tier software companies, Rashmi gained invaluable experience and
              insights into the tech world. Despite her successful career, she felt a strong desire to inspire the next
              generation through education.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-4">
            <FaLightbulb size={60} className="text-[#c79d27] flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              The idea for Kidzian was sparked by a neighborhood coding workshop she organized, where the children's
              enthusiasm and excitement were contagious. Rashmi realized the potential of a more engaging approach to
              tech education and decided to create Kidzian to make learning technology fun, interactive, and impactful.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-4">
            <FaStar size={80} className="text-[#28826a] flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              Starting with a small center and a handful of students, Kidzian has grown into a leading tech school for
              children aged 7 to 17, offering courses in block-based coding, Python, Java, JavaScript, HTML, CSS, and
              more. Our gamified, interactive learning platform provides personalized paths and collaborative projects
              to foster creativity and problem-solving skills.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-4">
            <Heart className="h-12 w-12 text-[#c79d27] flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              We are committed to continuous innovation, ensuring our students stay ahead in the ever-evolving world of
              technology. Join us at Kidzian, where learning technology is an exciting adventure!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Age-specific Programs */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Age-Specific Learning Paths</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our curriculum is carefully designed to match each age group's developmental needs, ensuring an engaging
              and effective learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border dark:border-gray-700"
              >
                <div className={`${group.color} h-2`}></div>
                <div className="p-6">
                  <div className="inline-block rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm font-medium mb-4 text-gray-800 dark:text-gray-200">
                    {group.age}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{group.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{group.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Courses */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Featured Courses</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our most popular tech courses designed specifically for young minds
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full border dark:border-gray-700"
              >
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {course.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{course.description}</p>
                <div className="flex items-center mt-auto">
                  <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{course.age}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeIn} className="mt-10 text-center">
            <button onClick={handleClick} className="px-8 py-3 bg-[#28826a] dark:bg-[#1f6e59] text-white rounded-full font-bold text-lg hover:bg-[#1f6e59] dark:hover:bg-[#0f4c3a] transition-colors flex items-center mx-auto shadow-lg">
              View All Courses <ChevronRight className="ml-2" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Our Mission Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-white dark:bg-gray-900"
      >
        <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">
          Our Mission
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {missionData.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 h-auto rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer border dark:border-gray-700"
            >
              <div className="flex flex-col items-center gap-4 w-full">
                {item.icon}
                <h3 className="text-black dark:text-white text-lg font-semibold">{item.title}</h3>
                <p className="leading-tight text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Teaching Methodology */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 bg-gradient-to-r from-[#28826a] to-[#1f6e59] dark:from-[#1f6e59] dark:to-[#0f4c3a] text-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Teaching Methodology</h2>
            <p className="max-w-3xl mx-auto opacity-90">
              At Kidzian, we believe in learning by doing. Our methodology combines structured learning with creative
              exploration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeIn}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center border border-white/20"
            >
              <div className="bg-white/20 dark:bg-white/10 p-4 rounded-full">
                <Gamepad2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Learn Through Play</h3>
                <p className="opacity-90">
                  Our gamified approach makes learning coding concepts fun and engaging, with interactive challenges and
                  rewards.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center border border-white/20"
            >
              <div className="bg-white/20 dark:bg-white/10 p-4 rounded-full">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Collaborative Learning</h3>
                <p className="opacity-90">
                  Students work together on projects, developing teamwork skills while learning from each other.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center border border-white/20"
            >
              <div className="bg-white/20 dark:bg-white/10 p-4 rounded-full">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Project-Based Learning</h3>
                <p className="opacity-90">
                  Students apply their skills to real-world projects, building portfolios and practical experience.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center border border-white/20"
            >
              <div className="bg-white/20 dark:bg-white/10 p-4 rounded-full">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalized Learning Paths</h3>
                <p className="opacity-90">
                  Our adaptive platform adjusts to each student's pace and learning style for optimal progress.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Backed By Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full py-16 bg-white dark:bg-gray-900"
      >
        <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-16 text-center text-gray-900 dark:text-white">
          Kidzian is Backed By
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-36 h-36 rounded-full flex items-center justify-center mb-4 border dark:border-gray-700">
              <div className="w-24 h-24 bg-[#28826a]/10 dark:bg-[#28826a]/20 rounded-lg flex items-center justify-center text-[#28826a] font-bold">
                WSS
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Women Startup Stories</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Kidzian is featured in WSS</p>
          </motion.div>

          <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-36 h-36 rounded-full flex items-center justify-center mb-4 border dark:border-gray-700">
              <div className="w-24 h-24 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="80" height="80">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Google For Startups</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Part of Levelup program at Google</p>
          </motion.div>

          <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-36 h-36 rounded-full flex items-center justify-center mb-4 border dark:border-gray-700">
              <div className="w-24 h-24 bg-[#28826a]/10 dark:bg-[#28826a]/20 rounded-lg flex items-center justify-center text-[#28826a] font-bold">
                CBFW
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Cherie Blair Foundation For Women</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Kidzian is selected for mentor program</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Subscribe to our Newsletter
          </motion.h2>
          <motion.p variants={fadeIn} className="text-gray-600 dark:text-gray-300 mb-8">
            Stay updated with the latest in tech education, coding tips, and fun activities from Kidzian by subscribing
            to our monthly newsletter. Don't miss out on exclusive content and resources designed to enhance your
            child's learning journey—subscribe today!
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#28826a] flex-grow max-w-md"
            />
            <button
              type="submit"
              className="bg-[#28826a] hover:bg-[#1f6e59] dark:bg-[#1f6e59] dark:hover:bg-[#0f4c3a] text-white px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center shadow-lg"
            >
              Subscribe
              <MailCheck size={18} className="ml-2" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default About;
