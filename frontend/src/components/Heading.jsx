import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo11 from '../assets/logo11.png';

const Heading = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='h-[5vh] w-full flex items-center justify-between p-6 lg:p-10 sticky top-0 z-40 bg-white'>
      <div className='flex gap-2 items-center'>
        <a href='/'>
          <img src={logo11} alt='Logo' className='w-[10vh]' />
        </a>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden lg:flex gap-10 text-[#303030] tracking-tighter'>
        <ul className='flex gap-8 items-center font-semibold text-[17px]'>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/'>Home</a></li>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/courses'>Courses</a></li>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/lms'>LMS</a></li>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/blogs'>Blog</a></li>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/events'>Events</a></li>
          <li className='cursor-pointer hover:text-[#443ee3]'><a href='/about-us'>About</a></li>
        </ul>
        <a href='/contact-us'>
          <button className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-[10vw] h-[8vh] rounded-xl flex items-center justify-center transition-transform duration-300'>
            Contact Us
          </button>
        </a>
      </div>

      {/* Mobile Navigation */}
      <div className='lg:hidden'>
        <button onClick={() => setIsOpen(!isOpen)} className='focus:outline-none'>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className='absolute top-[12.5vh] left-0 w-full bg-white shadow-md flex flex-col items-center py-10 h-[87.5vh] lg:hidden'>
          <ul className='flex flex-col gap-10 font-semibold text-[17px] text-center'>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/'>Home</a></li>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/courses'>Courses</a></li>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/lms'>LMS</a></li>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/blogs'>Blog</a></li>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/events'>Events</a></li>
            <li className='cursor-pointer hover:text-[#443ee3]'><a href='/about-us'>About</a></li>
            <li>
              <a href='/contact-us'>
                <button className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-[60vw] h-[6vh] rounded-xl'>
                  Contact Us
                </button>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Heading;