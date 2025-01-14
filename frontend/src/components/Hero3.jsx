import React from 'react'
import i from '../assets/i.png';
import chinese from '../assets/chinese.png';
import { LogIn } from 'lucide-react';
const Hero3 = () => {
  return (
    <div className='w-[100vw] h-[90vh] flex items-center justify-center'>
      <div className=' w-[50vw] h-[60vh] flex items-center justify-center flex-col gap-10 pl-12 '>
           <div className='text-5xl font-extrabold'>
           <h1>
    Welcome to <span className="text-[#4b40de]">Kidzian</span>
  </h1>
            <h1>Your Place To</h1>
            <h1>Learn, <span  className="text-[#4b40de]">Play and Grow</span> </h1></div>

            <p className='text-sm ml-5'> For students of age 7 to 17, Kidzian offers professional online coding <br/> courses. Learn coding in a gamified and interactive way with our team of expert <br/> tutors and achieve academic excellence.</p>

            <div className='flex gap-2'>
           

            <button className='bg-[#443ee3] text-white w-[10vw] h-[7.5vh] rounded-md cursor-pointer hover:scale-105 transition-transform duration-150 ease-out flex items-center justify-center gap-1 '>
              <LogIn size={22}/>
  Login
</button>


            <button className='bg-[#eeeef2]   w-[10vw] h-[7.5vh] rounded-md cursor-pointer hover:bg-gray-500 hover:text-white transition-transform'>
                Register
            </button>
            </div>
      </div>

      <div className=' w-[50vw]  flex items-center justify-center mb-16 h-[60vh] '>
  
      </div>


<span
  className="absolute w-[31vw] h-[31vw] rounded-full z-10 left-[58vw]"
  style={{
    background: "linear-gradient(to right, #4540e1 50%, #f0f0fc 50%)",
    transform: "rotate(300deg)",
  }}
></span>

<span className='absolute rounded-full w-[31vw] h-[31vw] border border-[#4540e1] z-20 left-[55.4vw] top-[20vh]'></span>


<span className='w-[2vw] h-[2vw] bg-[#4540e1] top-[30vh] rounded-full absolute left-[83vw] z-10'></span>

<span className='w-[3vw] h-[3vw] bg-[#4540e1] rounded-full absolute top-[70vh] left-[55vw] z-10'></span>

<span className='w-[1vw] h-[1vw] bg-[#4540e1] rounded-full absolute top-[92.5vh] left-[75vw] z-10'></span>


<span className='w-[6vw] h-[6vw] bg-[#9f99dd] rounded-full absolute top-[45.5vh] left-[82vw] z-10'></span>




<span className='w-[6vw] h-[6vw] bg-[#6965e4] rounded-full absolute top-[80.5vh] left-[78vw] '></span>

    </div>
  )
}

export default Hero3
