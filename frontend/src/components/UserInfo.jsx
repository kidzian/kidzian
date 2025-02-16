import React, { useState } from 'react';
import Heading from '../components/Heading';
import certificate from '../assets/certificate.svg';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserInfo = ({ userInfo }) => {
  const [tasks, setTasks] = useState([
    { text: "Attend WebD class", completed: false },
    { text: "Attend AI/ML class", completed: false },
  ]);

  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    age: '',
    phoneNumber: '',
    grade: '',
  });

  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { text: taskInput, completed: false }]);
      setTaskInput("");
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const navigate = useNavigate();

  const handleCardClick = (course) => {
    setSelectedCourse(course);
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState([]); // State to hold courses data
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
  };

  // Filter courses based on the search query
  const filteredCourses = courseData.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      // Fetch courses data from the backend API
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        console.log(response.data);
        setCourseData(response.data); // Set the courses data
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []);

  return (
    <>
      <div className="w-full p-1 sm:w-[80vw]">
        {/* Header Section */}
        <div className="h-[15vh] flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold capitalize">Hello, {userInfo?.name} 👋</h1>
            <p className="text-black text-sm">Welcome to Kidzian, check your learning stats</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center gap-2 border border-gray-300 rounded-md h-[7vh] w-[12vw] min-w-[120px] cursor-pointer hover:bg-gray-100">
              <img className="w-6" src={certificate} alt="" />
              <div className="flex flex-col items-center leading-tight justify-center">
                <h1 className="text-lg font-bold">{userInfo?.certificates}</h1>
                <h1 className="text-gray-700 text-xs">Certificates</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-[75%]">
            <div className="flex justify-between w-full">
              <h1 className="font-bold">In progress learning content</h1>
              <a href="" className="underline text-[#5a4ff8] font-semibold text-sm">
                View All
              </a>
            </div>

            <div className="flex flex-col gap-1 mt-5">
              {userInfo?.batches.map((batch) => {
                const startDate = new Date(batch.startingDate);
                const formattedStartDate = startDate.toLocaleDateString();

                const handleCardClicks = () => {
                  navigate(`/${batch.courseName}/${batch.batch}`, { state: { userInfo } });
                };

                return (
                  <div
                    key={batch._id}
                    className="group flex flex-col sm:flex-row cursor-pointer w-full h-auto sm:h-[16vh] rounded-md p-2 shadow-md justify-around hover:bg-gray-100 text-sm gap-3"
                    onClick={handleCardClicks}
                  >
                    <img
                      src="https://kidzian.com/wp-content/uploads/2024/03/children-win-success-593313-1024x682.jpg"
                      alt="course"
                      className="w-full sm:w-[10vw] h-[200px] sm:h-auto rounded-md"
                    />
                    <div className="justify-center flex flex-col">
                      <h1 className="text-gray-600">Course</h1>
                      <h1 className="font-bold text-sm">{batch.courseName}</h1>
                    </div>

                    <div className="justify-center flex flex-col">
                      <h1 className="text-gray-600">Starting Date</h1>
                      <h1 className="font-bold">{formattedStartDate}</h1>
                    </div>

                    <div className="justify-center flex flex-col">
                      <h1 className="text-gray-600">Completion</h1>
                      <div className="flex gap-2 items-center">
                        <span className="w-[1.5vw] h-[1.5vw] border-2 rounded-full border-green-500"></span>
                        <h1 className="font-bold">{(batch.lecturesCompleted / batch.totalClasses) * 100}%</h1>
                      </div>
                    </div>

                    <div className="justify-center flex flex-col">
                      <button className="border-2 h-10 w-16 rounded-lg font-bold group-hover:bg-gray-200 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full sm:w-[27%] h-auto sm:h-[39.8vh] shadow-md border p-4 rounded-lg flex flex-col justify-between hide-scrollbar">
            {/* Input and Add Button */}
            <div className="flex gap-1 items-center justify-center">
              <Plus onClick={addTask} className="cursor-pointer text-[#5d55ae]" />
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task to do..."
                className="rounded-md px-2 py-1 w-full focus:outline-none text-sm"
              />
            </div>

            {/* Scrollable Task List */}
            <div className="overflow-y-scroll flex-grow pr-2 mt-2 hide-scrollbar">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`flex text-sm items-center gap-4 p-2 rounded-md border-b ${
                    index === tasks.length - 1 ? '' : 'border-gray-300'
                  }`}
                >
                  {/* Circle for toggling task */}
                  <span
                    onClick={() => toggleTask(index)}
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${
                      task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {task.completed && (
                      <span className="w-3 h-3 bg-white rounded-full"></span>
                    )}
                  </span>

                  {/* Task Text */}
                  <span
                    className={`flex-1 cursor-pointer ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}
                    onClick={() => toggleTask(index)}
                  >
                    {task.text}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTask(index)}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full mt-5 rounded-md">
          <h1 className="font-bold">Browse other courses</h1>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
            <div>
              <ul className="flex flex-wrap gap-2 text-sm">
                <li
                  className="bg-[#dddfe1] p-2 flex items-center justify-center rounded-lg cursor-pointer"
                  onClick={() => setSearchQuery('')}
                >
                  All
                </li>
                <li
                  className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer"
                  onClick={() => setSearchQuery('Web')}
                >
                  Web Development
                </li>
                <li
                  onClick={() => setSearchQuery('App')}
                  className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer"
                >
                  App Development
                </li>
                <li
                  onClick={() => setSearchQuery('Artificial')}
                  className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer"
                >
                  Artificial Intelligence
                </li>
                <li
                  onClick={() => setSearchQuery('Java')}
                  className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer"
                >
                  Java
                </li>
              </ul>
            </div>

            <div className="relative mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full sm:w-72 p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none text-sm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 111.5-1.5m-1.5 1.5L15 15"
                />
              </svg>
            </div>
          </div>

          <div className="w-full p-1">
            {/* Courses Section */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
            >
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2"
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
                    className="bg-white w-full sm:w-[15vw] h-[300px] flex flex-col items-center rounded-xl cursor-pointer"
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
                    <div className="flex-grow"></div>{' '}
                    {/* This takes up remaining space */}
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
                <div className="bg-white h-[95vh] rounded-lg w-[90vw] sm:w-[60vw] lg:w-[50vw] p-8 flex flex-col lg:flex-row gap-6 relative overflow-scroll hide-scrollbar pb-8">
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
        </div>
      </div>
    </>
  );
};

export default UserInfo;