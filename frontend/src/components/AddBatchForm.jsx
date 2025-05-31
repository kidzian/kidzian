import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddBatchForm() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    teacherId: '',
    startDate: '',
    endDate: '',
    schedule: {
      days: [],
      time: ''
    },
    maxStudents: 20
  });

  // Fetch courses and teachers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you have endpoints to fetch courses and teachers
        const [coursesRes, teachersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/courses`),
          axios.get(`${import.meta.env.VITE_API_URL}/teachers`)
        ]);
        setCourses(coursesRes.data);
        setTeachers(teachersRes.data);
        
      console.log("Courses response:", coursesRes.data);
      console.log("Teachers response:", teachersRes.data);
      } catch (err) {
        setError('Failed to load data');
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day) => {
    const updatedDays = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter(d => d !== day)
      : [...formData.schedule.days, day];
    
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: updatedDays
      }
    }));
  };

  const handleTimeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        time: e.target.value
      }
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/add-batch`, formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setSuccess('Batch created successfully!');
      setFormData({
        name: '',
        courseId: '',
        teacherId: '',
        startDate: '',
        endDate: '',
        schedule: {
          days: [],
          time: ''
        },
        maxStudents: 20
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Batch</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Summer 2023 Batch"
          />
        </div>
        
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
          <select
            id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayChange(day)}
                className={`px-3 py-1 rounded-md text-sm ${
                  formData.schedule.days.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Class Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.schedule.time}
            onChange={handleTimeChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-1">Maximum Students</label>
          <input
            type="number"
            id="maxStudents"
            name="maxStudents"
            value={formData.maxStudents}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? 'Creating Batch...' : 'Create Batch'}
        </button>
      </form>
    </div>
  );
}
