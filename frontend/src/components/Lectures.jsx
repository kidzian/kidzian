import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal1 from "./Modal1"; // Import modal component

const Lectures = () => {
  const { batchId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}/lectures`)
      .then((res) => {
        console.log("API Response:", res.data);
        setLectures(Array.isArray(res.data) ? res.data : []); // Ensure it's an array
      })
      .catch((err) => {
        console.error("Error fetching lectures:", err);
        setLectures([]); // Set to an empty array in case of an error
      });
  }, [batchId]);
  

  return (
    <div>
      <h2>Lectures</h2>
      <ul>
        {lectures.map((lecture) => (
          <li key={lecture._id}>
            <button onClick={() => setSelectedLecture(lecture._id)}>
              {lecture.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedLecture && <Modal1 lectureId={selectedLecture} batchId={batchId} onClose={() => setSelectedLecture(null)} />}
    </div>
  );
};

export default Lectures;
