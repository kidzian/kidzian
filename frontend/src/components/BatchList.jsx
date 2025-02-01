import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BatchList = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/batches`)
      .then((response) => {
        const data = response.data;
        setBatches(Array.isArray(data) ? data : []); // Ensure batches is always an array
      })
      .catch((error) => {
        console.error('Error fetching batches:', error);
        setBatches([]); // Set batches to an empty array on error
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Batches</h2>
      <ul>
        {batches.map((batch) => (
          <li key={batch._id} className="p-2 border rounded mb-2">
            {batch.name} - {batch.course}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BatchList;