import React, { useState } from 'react';
import Heading from '../components/Heading';
import certificate from '../assets/certificate.svg';
import { Circle, Coins } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Minecraft from '../assets/Minecraft.jpg';
import Roblox from '../assets/Roblox.jpg';
import Webd from '../assets/Webd.jpg';
import { motion } from 'framer-motion';
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

const LMS = () => {
  const [tasks, setTasks] = useState([
    { text: "Attend WebD class", completed: false },
    { text: "Attend AI/ML class", completed: false },
  ]);
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

  const handleCardClick = () => {
    const firstId = "course123"; // Replace with dynamic ID logic
    const secondId = "uiux456";  // Replace with dynamic ID logic
    navigate(`/${firstId}/${secondId}`);
  };

  return (
    <div>
      <Heading />

      <div className="flex flex-col items-center">
        <div className="w-[80vw] p-1">
          {/* Header Section */}
          <div className="h-[15vh] flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hello, Adit 👋</h1>
              <p className="text-black text-sm">Welcome to Kidzian, check your learning stats</p>
            </div>
            <div className="flex gap-4">

              <div className="flex items-center justify-center gap-2 border border-gray-300 rounded-md h-[7vh] w-[12vw] cursor-pointer hover:bg-gray-100">
                <img className="w-6" src={certificate} alt="" />
                <div className="flex flex-col items-center leading-tight justify-center">
                  <h1 className="text-lg font-bold">2</h1>
                  <h1 className="text-gray-700 text-xs">Certificates</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex gap-8">
            <div className="w-[75%]">

              <div className='flex justify-between w-full'>
              <h1 className="font-bold">In progress learning content</h1>
              <a href="" className="underline text-[#5a4ff8] font-semibold text-sm">
                View All
              </a>
              </div>

   <div className='flex flex-col gap-1 mt-5'>

   <div
  className="group flex cursor-pointer w-full h-[16vh] rounded-md p-2 shadow-md justify-around hover:bg-gray-100 text-sm"
  onClick={handleCardClick}
>
  <img
    src="https://kidzian.com/wp-content/uploads/2024/03/children-win-success-593313-1024x682.jpg"
    alt=""
    className="w-[10vw] rounded-md"
  />
  <div className="justify-center flex flex-col">
    <h1 className="text-gray-600">Course</h1>
    <h1 className="font-bold text-sm">Mastering UI/UX Design</h1>
  </div>

  <div className="justify-center flex flex-col">
    <h1 className="text-gray-600">Starting Date</h1>
    <h1 className="font-bold">16 Dec</h1>
  </div>

  <div className="justify-center flex flex-col">
    <h1 className="text-gray-600">Completion</h1>
    <div className="flex gap-2 items-center">
      <span className="w-[1.5vw] h-[1.5vw] border-2 rounded-full border-green-500"></span>
      <h1 className="font-bold">100%</h1>
    </div>
  </div>

  <div className="justify-center flex flex-col">
    <button className="border-2 h-10 w-16 rounded-lg font-bold group-hover:bg-gray-200 transition-colors">
      View
    </button>
  </div>
</div>


    <div
      className="flex group cursor-pointer w-full h-[16vh] rounded-md  p-2 shadow-md justify-around hover:bg-gray-100 text-sm"
      onClick={handleCardClick}
    >
      <img src="https://kidzian.com/wp-content/uploads/2023/11/child-student-video-conference-5976952-300x225.jpg" alt="" className="w-[10vw] rounded-md" />
      <div className="justify-center flex flex-col">
        <h1 className="text-gray-600">Course</h1>
        <h1 className="font-bold">Mastering UI/UX Design</h1>
      </div>

      <div className="justify-center flex flex-col">
        <h1 className="text-gray-600">Starting Date</h1>
        <h1 className="font-bold">16 Dec</h1>
      </div>

      <div className="justify-center flex flex-col">
        <h1 className="text-gray-600">Completion</h1>
        <div className="flex gap-2 items-center">
          <span className="w-[1.5vw] h-[1.5vw] border-2 rounded-full border-green-500"></span>
          <h1 className="font-bold">100%</h1>
        </div>
      </div>

      <div className="justify-center flex flex-col">
        <button className="border-2 h-10 w-16 rounded-lg font-bold group-hover:bg-gray-200">
          View
        </button>
      </div>
    </div>


            
   </div>


   
            </div>

            <div className="w-[27%] h-[39.8vh] shadow-md border p-4 rounded-lg flex flex-col justify-between hide-scrollbar">


  {/* Input and Add Button */}
  <div className="flex gap-1 items-center justify-center ">
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
          index === tasks.length - 1 ? "" : "border-gray-300"
        }`}
      >
        {/* Circle for toggling task */}
        <span
          onClick={() => toggleTask(index)}
          className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${
            task.completed ? "bg-green-500 border-green-500" : "border-gray-300"
          }`}
        >
          {task.completed && (
            <span className="w-3 h-3 bg-white rounded-full"></span>
          )}
        </span>

        {/* Task Text */}
        <span
          className={`flex-1 cursor-pointer ${
            task.completed ? "line-through text-gray-500" : ""
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
  <div className="flex items-center justify-between mt-4">
    <div>
      <ul className="flex gap-2 text-sm">
        <li className="bg-[#dddfe1] p-2 flex items-center justify-center rounded-lg cursor-pointer">Web Development</li>
        <li className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer">App Development</li>
        <li className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer">Artificial Intelligence</li>
        <li className="bg-[#f7f6f7] text-[#767878] p-2 flex items-center justify-center rounded-lg cursor-pointer">Java</li>
      </ul>
    </div>

    <div className="relative">
      <input
        type="text"
        placeholder="Search courses"
        className="w-72 p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none text-sm"
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

  <div className='w-full p-1'>
  <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
          >
          
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4"
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
                  className="bg-white w-[14.5vw] flex flex-col items-center rounded-xl  cursor-pointer"
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
                  <p className=" font-semibold text-[#303030]">
                    {course.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
  </div>

</div>


        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default LMS;
