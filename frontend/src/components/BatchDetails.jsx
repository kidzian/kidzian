import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { useParams } from "react-router-dom";
import StudentList from "./StudentList";
import AddStudent from "./AddStudent";
import CreateLecture from "./CreateLecture";
import Lectures from "./Lectures";
const BatchDetails = () => {
s
  const{batchId}=useParams();
  const [batch, setBatch] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/batches/${batchId}`)
      .then((res) => res.json())
      .then((data) => setBatch(data))
      .catch((err) => console.error("Error fetching batch:", err));
  }, []);

  return (
    <div className="">
      <SearchBar/>
      {batch ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold">{batch.name}</h1>
          <p className="text-gray-600">Starting Date: {new Date(batch.startingDate).toDateString()}</p>

          <StudentList batch={batch} />

          <div className="flex space-x-4 mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setIsStudentModalOpen(true)}
            >
              Add Student
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              onClick={() => setIsLectureModalOpen(true)}
            >
              Add Lecture
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

     
<AddStudent isStudentModalOpen={isStudentModalOpen} setIsStudentModalOpen={setIsStudentModalOpen} />

<Lectures/>

<CreateLecture isLectureModalOpen={isLectureModalOpen} setIsLectureModalOpen={setIsLectureModalOpen}/>

      
    </div>
  );
};

export default BatchDetails;
