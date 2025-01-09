import React from 'react';
import { ChevronDown } from 'lucide-react';

const Heading = () => {
  return (
    <div className='h-[12.5vh] w-full flex items-center justify-between p-10 overflow-hidden sticky top-0 z-40 bg-[#ffffff]'>
      <div className='flex gap-2 items-center justify-center bg-[#ffffff]'>
        {/* Uncomment if you want to display the image */}
        {/* <img className='w-[12vw] h-[9vh] object-contain' src={girlImage} alt="" /> */}
        <h1 className='text-[23px] text-[#AA14F0] text-3xl tracking-tighter leading-[32px] font-bold'>
          Kidzian
        </h1>
      </div>

      <div className='flex gap-10 text-[#303030] tracking-tighter'>
        <ul className='flex gap-8 items-center justify-center font-semibold text-[17px]'>
          <li className='cursor-pointer hover:text-[#AA14F0]'>Home</li>
          <li className='cursor-pointer hover:text-[#AA14F0]'>About</li>
          <li className='hover:text-[#AA14F0] flex gap-1 items-center justify-center cursor-pointer'>
            Services
            <ChevronDown size={20} />
          </li>
          <li className='cursor-pointer hover:text-[#AA14F0]'>Careers</li>
          <li className='cursor-pointer hover:text-[#AA14F0]'>Blog</li>
        </ul>

        <button className='bg-[#AA14F0] text-white w-[10vw] h-[8vh] rounded-xl flex items-center justify-center hover:scale-105 transform transition-transform duration-300'>
          Contact us
        </button>
      </div>
    </div>
  );
};

export default Heading;
