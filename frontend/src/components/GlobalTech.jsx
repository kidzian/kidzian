import React, { useState, useEffect } from 'react'
import reactsvg from '../assets/react.svg';

const GlobalTech = () => {
  return (
    <div className='w-full h-[87.5vh] bg-[#ffffff] flex flex-col items-center justify-center'>
      <img 
        src={reactsvg} 
        alt="React Logo" 
        className='w-[10vh] h-[10vh] absolute mt-[72vh] mr-[195vh] animate-spin' 
      />

<img 
        src={reactsvg} 
        alt="React Logo" 
        className='w-[10vh] h-[10vh] absolute mt-[72vh] mr-[195vh] animate-spin' 
      />

<img 
        src={reactsvg} 
        alt="React Logo" 
        className='w-[10vh] h-[10vh] absolute mt-[72vh] ml-[195vh] animate-spin' 
      />
      <img 
        src={reactsvg} 
        alt="React Logo" 
        className='w-[10vh] h-[10vh] absolute mt-[72vh] ml-[195vh] animate-spin' 
      />

      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e6cf8] to-[#bc6bea] text-center mb-10">
        Global Tech School for Children
      </h1>

      <div className='w-full flex flex-wrap items-center justify-center gap-10'>
        {/* Reviews Section */}
        <div className='bg-[#ff6666] h-[40vh] w-[18vw] rounded-2xl flex items-center justify-center text-white'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              {/* Count up from 1 to 4.9+ */}
              <CountUp start={0} end={4.9} />
            </h2>
          </div>
        </div>

        {/* Enrolled Students Section */}
        <div className='bg-[#70c86a] h-[40vh] w-[18vw] rounded-2xl flex items-center justify-center text-white'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              <CountUp start={0} end={1114} />
            </h2>
          </div>
        </div>

        {/* IT Expert Mentors Section */}
        <div className='bg-[#fa65a8] h-[40vh] w-[18vw] rounded-2xl flex items-center justify-center text-white'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              <CountUp start={0} end={102} />
            </h2>
          </div>
        </div>

        {/* Completed Sessions Section */}
        <div className='bg-[#40d0bd] h-[40vh] w-[18vw] rounded-2xl flex items-center justify-center text-white'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>
              <CountUp start={0} end={3120} />
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

const CountUp = ({ start, end }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < end ? prev + 1 : end));
    }, 10); // Adjust the interval as needed (lower for faster, higher for slower)

    return () => clearInterval(interval);
  }, [end]);

  return (
    <span>{count}+ {/* Optionally, you can add a "K", "M", etc. for thousands and millions */}</span>
  );
}

export default GlobalTech
