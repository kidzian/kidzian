import React from 'react'
import Heading from '../components/Heading'
import { Clock, Calendar, Check, CalendarClock } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useEffect ,useState} from 'react'
const LMSCOURSE = () => {

  const location=useLocation();
  
  const userInfo = location.state?.userInfo;  // Use optional chaining here
  const {id1,id2}=useParams();
  const batchId=id2;
  const courseName=id1;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[batchData,setBatchData]=useState(null);
  const[data,setData]=useState(null);
  
  console.log("in new page",userInfo); // Ensure userInfo is passed correctly

  useEffect(() => {
    // Fetch course data based on batchId
    const fetchBatchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/batch/${batchId}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        console.log(data)
        setData(data);
        const batchDetails = userInfo.batches.find(batch => batch.batch.toString() === batchId);
        console.log("batch details are",batchDetails)
        setBatchData(batchDetails);
      } catch (err) {
        setError(err.message);      
      }
    };
    fetchBatchDetails();
  }, [batchId]);

  return (
    <div>
      <Heading/>

      <div className="flex flex-col items-center">
        <div className="w-[80vw] p-1 ">
         
         <div className='w-full h-[40vh] flex gap-1 items-center justify-between pl-2 pr-6'>

          <div>
           <div className='flex gap-4 items-center justify-start'>
           <h1 className='text-2xl font-bold capitalize'>{courseName} </h1>
           <h3 className='text-gray-500 text-sm'>( {data?.name} batch )</h3>
           </div>
              <div className='flex gap-3 mt-3'>
                <button className='bg-[#f5f4f6] text-[#b5b6b7] text-sm rounded-lg w-[8.5vw] h-[4vh]'>Fundamental</button>
                <button className='bg-[#f5f4f6] text-[#b5b6b7] text-sm rounded-lg w-[6vw] h-[4vh]'>Design</button>
              </div>

              <div className='flex gap-2 '>

<div className='p-4 pt-[5vh] h-[12vh] flex flex-col gap-1 items-center justify-center'>
                  <h3 className='text-[#b5b6b7]'>Completed Course</h3>
                  <div className='flex flex-col items-center'>
                  <div className='w-[8vw] bg-gray-300 rounded-full h-2'>
                  <div
  className='bg-green-500 h-2 rounded-full'
  style={{ width: `${(batchData?.lecturesCompleted / batchData?.totalClasses) * 100}%` }} // Correct calculation for width
></div>

      </div>
                  <h1 className='text-xl font-bold'>
  {((batchData?.lecturesCompleted / batchData?.totalClasses) * 100).toFixed(1)} %
</h1>

                  </div>
                </div>

                <div className='p-4 h-[12vh] flex flex-col items-center justify-center mt-[0.3vh]'>
                  <h3 className='text-[#b5b6b7]'> Avg Lecture Duration</h3>
                  <div>
           
                  <h1 className='text-xl font-bold'>01:00 hrs</h1>
                  </div>
                </div>
              </div>
          
          
          
          </div>

          <div>

            <img className='w-full h-full' src="data:image/jpeg;base64,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" alt="" />
          </div>
         </div>
         
         <div className='w-[100%] h-auto flex gap-2'>
              <div className='w-[75%] h-[70vh] overflow-y-scroll hide-scrollbar flex flex-col gap-2'>
              
              {batchData?.lectures?.map((lecture, index) => (
        <div
          key={lecture._id}
          className="w-full h-[10vh] bg-gray-200 rounded-md p-4 flex items-center justify-between"
        >
          {/* Left Section: Lecture Name */}
          <div>
            <h1 className="text-md font-semibold text-gray-800">
              Class {index + 1}
            </h1>
            <p className="text-sm text-gray-600">{lecture.name}</p>
          </div>

          {/* Right Section: Attendance Status */}
          {lecture.attendance ? (
            <Check className="text-green-400 font-semibold" />
          ) : (
            <CalendarClock size={20} className="text-red-400 font-semibold" />
          )}
        </div>
      ))}

              </div>

              <div className='w-[25%]'>
              <div className='flex flex-col gap-2 w-full'>
         <div className='w-[18vw] h-[25vh] flex flex-col items-start rounded-3xl border border-gray-200 p-4 gap-4 justify-center'>
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <div className='flex gap-2 text-3xl items-center justify-center'>
              <Clock className='text-blue-500' size={40}/>
              {batchData?.lecturesAttended}/{batchData?.totalClasses}
            </div>
            <h1 className='text-gray-500 text-sm '>Keep attending classes </h1>
          </div>

          <div className='w-[18vw] h-[40vh] rounded-3xl flex flex-col gap-2 border-gray-200 border p-4'>
            <h1 className='text-lg font-semibold'>Progress Statistics</h1>
            <h1 className='text-4xl'>
  {((batchData?.lecturesCompleted / batchData?.totalClasses) * 100).toFixed(1)} %
</h1>


            <div className='flex gap-1'>
              <div className=' w-[7vw] h-[17vh] bg-[#f7f8fa] flex flex-col items-center justify-center rounded-md'>
                <span className='bg-[#7132fe] w-[5vh] h-[5vh] rounded-full text-white flex items-center justify-center'><Clock size={18}/></span>
                  <h1 className='text-xl font-bold'>{batchData?.lecturesCompleted}</h1>
                  <h1 className='text-xs '>Lectures <br/> Completed</h1>
              </div>

              <div className='w-[7vw] h-[17vh] bg-[#f7f8fa] flex flex-col items-center justify-center rounded-md'>
              <span className='bg-[#46c97f] w-[5vh] h-[5vh] rounded-full text-white flex items-center justify-center'><Clock size={18}/></span>
                  <h1 className='text-xl font-bold'> {batchData?.lecturesAttended}</h1>
                  <h1 className='text-xs '>Lectures <br/> Attended</h1>
              </div>

              <div className='w-[7vw] h-[17vh] bg-[#f7f8fa] flex flex-col items-center justify-center rounded-md'>
              <span className='bg-[#fe7e29] w-[5vh] h-[5vh] rounded-full text-white flex items-center justify-center'><Calendar size={18}/></span>
                  <h1 className='text-xl font-bold'>{batchData?.totalClasses-batchData?.lecturesCompleted}</h1>
                  <h1 className='text-xs '>Lectures <br/> Upcoming</h1>
              </div>

              <div>

              </div>

              <div>

              </div>
            </div>
          </div>
         </div>
              </div>
         </div>
        
        </div>
      </div>
    </div>
  )
}

export default LMSCOURSE
