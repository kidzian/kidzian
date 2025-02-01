// CourseList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseList = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <div>
      {courses.map((course) => (
        <div
          key={course._id}
          onClick={() => navigate(`/courses/${course._id}/batches`)} // Navigate to the batches page
          className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;