import { useState } from 'react';
import axios from 'axios';

export default function AddCourseForm() {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    pdf: '',
    ageGroup: '',
    about: '',
    learningOutcomes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLearningOutcomes = (e) => {
    const outcomes = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      learningOutcomes: outcomes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        setError('You are not logged in. Please log in first.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Course added successfully!');
      setFormData({
        title: '',
        image: '',
        pdf: '',
        ageGroup: '',
        about: '',
        learningOutcomes: ''
      });
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.response?.data?.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Course</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-1">PDF URL</label>
          <input
            type="text"
            id="pdf"
            name="pdf"
            value={formData.pdf}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
          <input
            type="text"
            id="ageGroup"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 8-12 years"
          />
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About Course</label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="learningOutcomes" className="block text-sm font-medium text-gray-700 mb-1">
            Learning Outcomes (comma-separated)
          </label>
          <textarea
            id="learningOutcomes"
            name="learningOutcomes"
            onChange={handleLearningOutcomes}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Basic programming concepts, Problem-solving skills, Logical thinking"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? 'Adding Course...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
}
