import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseName } = useParams();
  const formattedCourseName = courseName.replace(/-/g, " ");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [batchData, setBatchData] = useState({
    name: "",
    startingDate: "",
    totalClasses: "",
  });

  const handleDeleteBatch = async (batchId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/batch/${batchId}`);
      if (response.status === 200) {
        alert('Batch deleted successfully');
        // Remove the deleted batch from the UI
        setCourse((prevCourse) => ({
          ...prevCourse,
          batches: prevCourse.batches.filter(batch => batch._id !== batchId),
        }));
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Error deleting batch');
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/${formattedCourseName}`);
        setCourse(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [formattedCourseName]);

  const handleInputChange = (e) => {
    setBatchData({ ...batchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/batches`, {
        ...batchData,
        course: course._id,
      });

      const updatedCourse = await axios.put(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}/addBatch`, {
        batchId: response.data._id,
      });

      setCourse(updatedCourse.data);
      setShowModal(false);
      setBatchData({ name: "", startingDate: "", totalClasses: "" });
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  if (loading) return <p className="text-center text-lg text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;
  if (!course) return <p className="text-center text-lg text-gray-700">No course details available.</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Course Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex items-center justify-around">
       
        <img
          src={course.image}
          alt={course.title}
          className="w-full max-w-xs h-auto rounded-lg mb-4"
        />

<div>
<h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

<p className="text-lg text-gray-700">
  <strong>Age Group:</strong> {course.ageGroup}
</p>
</div>
      </div>

      {/* Create Batch Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-8"
      >
        Create Batch
      </button>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create a New Batch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={batchData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Starting Date</label>
                <input
                  type="date"
                  name="startingDate"
                  value={batchData.startingDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Classes</label>
                <input
                  type="number"
                  name="totalClasses"
                  value={batchData.totalClasses}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Create Batch
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batches Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Batches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.batches.map((batch) => (
          <div
            key={batch._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/teacher-dashboard/${course.title}/batch/${batch.name}?batchId=${batch._id}`)}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{batch.name}</h3>
            <p className="text-lg text-gray-700">
              <strong>Start Date:</strong> {new Date(batch.startingDate).toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Total Classes:</strong> {batch.totalClasses}
            </p>

            <button
              onClick={() => handleDeleteBatch(batch._id)}
              className="delete-button bg-red-400 w-[10vw] h-[5vh] rounded-md"
            >
              Delete Batch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;