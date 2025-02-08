import React from 'react'
import {useState} from 'react'
import {useParams} from 'react-router-dom'
const CreateLecture = ({isLectureModalOpen, setIsLectureModalOpen}) => {

    const {batchId}=useParams();

    const [lectureData, setLectureData] = useState({
        title: "",
        date: "",
      });
    

    const handleLectureChange = (e) => {
        setLectureData({ ...lectureData, [e.target.name]: e.target.value });
      };
    
      const handleLectureSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/batches/${batchId}/add-lecture`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(lectureData),
            }
          );
          if (response.ok) {
            alert("Lecture added successfully!");
            setIsLectureModalOpen(false);
            setLectureData({ title: "", date: "" });
          } else {
            alert("Failed to add lecture.");
          }
        } catch (error) {
          console.error("Error adding lecture:", error);
        }
      };

  return (
    <>
      {isLectureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Lecture</h2>
            <form onSubmit={handleLectureSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Lecture Title"
                value={lectureData.title}
                onChange={handleLectureChange}
                required
                className="mb-2 p-2 w-full border rounded-md"
              />
              <input
                type="date"
                name="date"
                value={lectureData.date}
                onChange={handleLectureChange}
                required
                className="mb-2 p-2 w-full border rounded-md"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Add Lecture
                </button>
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateLecture
