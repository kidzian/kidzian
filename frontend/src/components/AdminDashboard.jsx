import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import CourseList from './CourseList';
import BatchList from './BatchList';
import LectureList from './LectureList';
import SearchBar from './SearchBar';
const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Fetch all courses using axios
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((response) => {
        setCourses(response.data); // Axios wraps the response in a `data` object
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  return (
    <div>
      <SearchBar />
      <div className="">
        <CourseList
          courses={courses}
          onSelectCourse={(course) => setSelectedCourse(course)}
        />
        {selectedCourse && (
          <BatchList
            courseId={selectedCourse._id}
            onSelectBatch={(batch) => setSelectedBatch(batch)}
          />
        )}
        {selectedBatch && <LectureList batchId={selectedBatch._id} />}
      </div>
    </div>
  );
};

export default AdminDashboard;