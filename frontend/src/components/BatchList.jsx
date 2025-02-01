import React, { useState, useEffect } from 'react';

const BatchList = ({ courseId, onSelectBatch }) => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/batches/${courseId}`)
      .then((res) => res.json())
      .then((data) => setBatches(data));
  }, [courseId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Batches</h2>
      <ul>
        {batches.map((batch) => (
          <li
            key={batch._id}
            onClick={() => onSelectBatch(batch)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            {batch.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BatchList;