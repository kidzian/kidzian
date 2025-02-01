import React, { useState, useEffect } from 'react';

const LectureList = ({ batchId }) => {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}/lectures`)
      .then((res) => res.json())
      .then((data) => setLectures(data));
  }, [batchId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Lectures</h2>
      <ul>
        {lectures.map((lecture) => (
          <li key={lecture._id} className="p-2 rounded">
            {lecture.name} - {new Date(lecture.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LectureList;