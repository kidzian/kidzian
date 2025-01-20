

import React from 'react';
import { ChevronDown } from 'lucide-react';
import logo11 from '../assets/logo11.png';
const Heading = () => {
  return (
    <div className='h-[12.5vh] w-full flex items-center justify-between p-10 overflow-hidden sticky top-0 z-40 bg-[#ffffff]'>
      <div className='flex gap-2 items-center justify-center bg-[#ffffff]'>
        <h1 className='text-[23px] text-[#AA14F0] text-3xl tracking-tighter leading-[32px] font-bold'>
          
          <a href="/">
          <img src={logo11} alt="" className='w-[10vh]'/>
          </a>
        </h1>
      </div>

      <div className='flex gap-10 text-[#303030] tracking-tighter'>
        <ul className='flex gap-8 items-center justify-center font-semibold text-[17px]'>
          <li className='cursor-pointer hover:text-[#443ee3]'>
            <a href="/">Home</a>
          </li>
          <li className='hover:text-[#443ee3] flex gap-1 items-center justify-center cursor-pointer'>
            <a href="/courses">
              Courses
              {/* <ChevronDown size={20} /> */}
            </a>
          </li>
          
         
          <li className='cursor-pointer hover:text-[#443ee3]'>
            <a href="/lms">LMS</a>
          </li>
          <li className='cursor-pointer hover:text-[#443ee3]'>
            <a href="/">Blog</a>
          </li>
          <li className='cursor-pointer hover:text-[#443ee3]'>
            <a href="/">Events</a>
          </li>
          <li className='cursor-pointer hover:text-[#443ee3]'>
            <a href="/about-us">About</a>
          </li>
        </ul>
        

        <button className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-[10vw] h-[8vh] rounded-xl flex items-center justify-center transform transition-transform duration-300'>
        <a href="/contact-us">Contact Us</a>
        </button>
      </div>
    </div>
  );
};

export default Heading;
