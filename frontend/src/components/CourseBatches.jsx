import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseBatches = () => {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const fetchCourseAndBatches = async () => {
      try {
        const courseResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`);
        setCourse(courseResponse.data);

        const batchesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/batches?courseId=${courseId}`);
        setBatches(batchesResponse.data);
      } catch (error) {
        console.error('Error fetching course or batches:', error);
      }
    };

    fetchCourseAndBatches();
  }, [courseId]);

  const handleCreateBatch = async () => {
    if (!newBatchName || !startDate) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/batches`, {
        name: newBatchName,
        startingDate: startDate,
        courseId: courseId,
      });
      setBatches([...batches, response.data]);
      setNewBatchName('');
      setStartDate('');
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`);
      setBatches(batches.filter((batch) => batch._id !== batchId));
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Batches for {course?.title}</h1>

      <div className="mb-6">
        <input
          type="text"
          value={newBatchName}
          onChange={(e) => setNewBatchName(e.target.value)}
          placeholder="Enter batch name"
          className="px-4 py-2 border rounded-lg mr-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded-lg mr-2"
        />
        <button
          onClick={handleCreateBatch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Batch
        </button>
      </div>

      <div>
        {batches.map((batch) => (
          <div
            key={batch._id}
            onClick={() => navigate(`/courses/${courseId}/batches/${batch._id}`)}
            className="p-4 border rounded-lg mb-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
          >
            <span>{batch.name} - {new Date(batch.startingDate).toLocaleDateString()}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBatch(batch._id);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseBatches;
