
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