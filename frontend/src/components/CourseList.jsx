
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseList = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <div className='grid grid-cols-3 '>
      {courses.map((course) => (
        <div
          key={course._id}
          onClick={() => navigate(`/courses/${course._id}/batches`)} // Navigate to the batches page
          className="cursor-pointer h-[20vh] flex items-center justify-center p-4 border rounded-lg hover:bg-gray-100 "
        >
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Search, Filter, BookOpen, Users, Clock, Calendar } from 'lucide-react'

// const CourseList = ({ courses }) => {
//   const navigate = useNavigate()
//   const [searchTerm, setSearchTerm] = useState("")

//   const filteredCourses = courses.filter((course) =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Courses</h1>
//         <div className="relative w-full sm:w-64">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-4 w-4 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//             placeholder="Search courses..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {filteredCourses.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course) => (
//             <div
//               key={course._id}
//               onClick={() => navigate(`/courses/${course._id}/batches`)}
//               className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
//             >
//               <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-500 group-hover:to-blue-700 transition-colors duration-300"></div>
//               <div className="p-5">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
//                     <BookOpen className="h-5 w-5" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
//                     {course.title}
//                   </h3>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                
//                 <div className="grid grid-cols-2 gap-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                     <Users className="h-4 w-4 mr-1" />
//                     <span>{course.students?.length || 0} Students</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                     <Calendar className="h-4 w-4 mr-1" />
//                     <span>{course.batches?.length || 0} Batches</span>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-end">
//                   <button className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-1">
//                     View Batches
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="lucide lucide-chevron-right"
//                     >
//                       <path d="m9 18 6-6-6-6" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
//           <p className="text-gray-500 dark:text-gray-400">No courses found matching your search.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CourseList
