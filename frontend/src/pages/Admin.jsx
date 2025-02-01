import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

const Admin = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({ name: '', course: '', startingDate: '' });

  // Fetch batches from the backend
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/batches`);
        console.log('API Response:', response.data); // Debugging
        if (Array.isArray(response.data)) {
          setBatches(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setBatches([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]); // Fallback to empty array
      }
    };
    fetchBatches();
  }, []);

  // Handle navigation to students or batches page
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle creating a new batch
  const handleCreateBatch = async () => {
    if (newBatch.name && newBatch.course && newBatch.startingDate) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/batches`, newBatch);
        setBatches([...batches, response.data]);
        setNewBatch({ name: '', course: '', startingDate: '' }); // Reset form
      } catch (error) {
        console.error('Error creating batch:', error);
        alert('Failed to create batch');
      }
    } else {
      alert('Please fill all fields');
    }
  };

  // Handle clicking on a batch
  const handleBatchClick = (batchId) => {
    navigate(`/admin/batch/${batchId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleNavigation('/students')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Students
        </button>
        <button
          onClick={() => handleNavigation('/batches')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          View Batches
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Create New Batch Form */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create New Batch</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Batch Name"
            value={newBatch.name}
            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Course"
            value={newBatch.course}
            onChange={(e) => setNewBatch({ ...newBatch, course: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={newBatch.startingDate}
            onChange={(e) => setNewBatch({ ...newBatch, startingDate: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreateBatch}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Create Batch
          </button>
        </div>
      </div>

      {/* List of Batches */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Batches</h2>
        <div className="space-y-4">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="p-4 bg-white rounded shadow cursor-pointer"
              onClick={() => handleBatchClick(batch._id)}
            >
              <h3 className="font-bold">{batch.name}</h3>
              <p>Course: {batch.course}</p>
              <p>Starting Date: {new Date(batch.startingDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;