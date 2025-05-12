import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo11 from '../assets/logo11.png';
import DarkModeToggle from './Darkmode';

const Heading = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 isolate z-[9999]">
      {/* Desktop navbar */}
      <div className="hidden lg:flex w-full h-[12.5vh] bg-[#28826a] dark:bg-gray-900 text-white dark:text-white shadow-xl items-center justify-between px-10 relative">
        {/* Logo */}
        <a href="/" className="flex gap-2 items-center relative z-[9999]">
          <img src={logo11} alt="Logo" className="w-[10vh]" />
        </a>

        {/* Desktop Navigation */}
        <nav className="flex gap-10 tracking-tight items-center relative z-[9999]">
          <ul className="flex gap-8 items-center font-semibold text-[17px]">
          {['Home', 'Courses', 'LMS', 'Success-Stories', 'Events', 'About'].map((item) => (
  <li key={item} className="relative group">
    <a 
      href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
      className="relative inline-block transition-colors hover:text-[#443ee3]"
    >
      {item}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#443ee3] transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
    </a>
  </li>
))}

          </ul>
          <a href="/contact-us" className="relative z-[9999]">
            <button className="bg-gradient-to-r bg-[#c79d27] text-white w-[10vw] h-[8vh] rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105 transform-gpu">
              Get started
            </button>
          </a>
          <div className="lg:flex items-center gap-6 relative z-[9999]">
            <DarkModeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex h-[12.5vh] w-full items-center justify-between px-6 bg-[#1E3A8A] dark:bg-gray-900 text-white dark:text-white shadow-xl relative z-[9999]">
        {/* Logo */}
        <a href="/" className="flex gap-2 items-center">
          <img src={logo11} alt="Logo" className="w-[10vh]" />
        </a>

        <div className="flex items-center gap-4">
          {/* Dark mode toggle on mobile */}
          <DarkModeToggle />

          {/* Hamburger Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none text-white"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[12.5vh] left-0 w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl flex flex-col items-center py-10 transition-all duration-300 ease-in-out z-[9998] ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        } lg:hidden`}
      >
        <ul className="flex flex-col gap-10 font-semibold text-[18px] text-center">
          {['Home', 'Courses', 'LMS', 'Success-Stories', 'Events', 'About'].map((item) => (
            <li key={item} className="relative group">
              <a
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsOpen(false)}
                className="relative inline-block transition-colors hover:text-[#443ee3]"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#443ee3] transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
              </a>
            </li>
          ))}

          <li>
            <a href="/contact-us">
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white w-[60vw] h-[6vh] rounded-xl transform-gpu transition-transform duration-300 hover:scale-105">
                Contact Us
              </button>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Heading;