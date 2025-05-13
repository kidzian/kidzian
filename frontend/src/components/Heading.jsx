import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import DarkModeToggle from './Darkmode';
import logo11 from "../assets/logo11.png"

const Heading = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState('');

  // Set active path on component mount and when location changes
  useEffect(() => {
    const path = window.location.pathname;
    setActivePath(path);
  }, []);

  // Navigation links configuration
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'LMS', path: '/lms' },
    { name: 'Success-Stories', path: '/success-stories' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 isolate z-[9999]">
      {/* Desktop navbar */}
      <div className="hidden lg:flex w-full h-[12.5vh] bg-[#28826a] dark:bg-gray-900 text-white dark:text-white shadow-xl items-center justify-between px-10 relative">
        {/* Logo with white circle background */}
        <a href="/" className="flex gap-2 items-center relative z-[9999]">
          <div className="rounded-full bg-white/90 p-[2px] shadow-lg"> {/* Adjusted background opacity and added shadow */}
            <img 
              src={logo11} 
              alt="Logo" 
              className="w-[10vh] brightness-125 contrast-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="flex gap-10 tracking-tight items-center relative z-[9999]">
          <ul className="flex gap-8 items-center font-semibold text-[17px]">
            {navItems.map((item) => {
              const isActive = 
                (item.path === '/' && activePath === '/') || 
                (item.path !== '/' && activePath.startsWith(item.path));
                
              return (
                <li key={item.name} className="relative group">
                  <a 
                    href={item.path}
                    className={`relative inline-block transition-colors hover:text-white/90 ${
                      isActive ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-white transform transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a href="/contact-us" className="relative z-[9999]">
            <button className="bg-[#c79d27] text-white w-[10vw] h-[8vh] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#d4a82c] transform-gpu shadow-lg">
              Get started
            </button>
          </a>
          <div className="lg:flex items-center gap-6 relative z-[9999]">
            <DarkModeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex h-[12.5vh] w-full items-center justify-between px-6 bg-[#28826a] dark:bg-gray-900 text-white dark:text-white shadow-xl relative z-[9999]">
        {/* Logo with white circle background */}
        <a href="/" className="flex gap-2 items-center">
          <div className="rounded-full bg-white/90 p-[2px] shadow-lg"> {/* Adjusted background opacity and added shadow */}
            <img 
              src="/logo11.png" 
              alt="Logo" 
              className="w-[10vh] brightness-125 contrast-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
            />
          </div>
        </a>

        <div className="flex items-center gap-4">
          {/* Dark mode toggle on mobile */}
          <DarkModeToggle />

          {/* Hamburger Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none text-white hover:text-white/90 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[12.5vh] left-0 w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-xl flex flex-col items-center py-10 transition-all duration-300 ease-in-out z-[9998] ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        } lg:hidden`}
      >
        <ul className="flex flex-col gap-10 font-semibold text-[18px] text-center">
          {navItems.map((item) => {
            const isActive = 
              (item.path === '/' && activePath === '/') || 
              (item.path !== '/' && activePath.startsWith(item.path));
              
            return (
              <li key={item.name} className="relative group">
                <a
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`relative inline-block transition-colors hover:text-[#28826a] ${
                    isActive ? 'text-[#28826a]' : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#28826a] transform transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </a>
              </li>
            );
          })}

          <li>
            <a href="/contact-us">
              <button className="bg-[#28826a] text-white w-[60vw] h-[6vh] rounded-xl transform-gpu transition-all duration-300 hover:scale-105 hover:bg-[#1f6e59] shadow-lg">
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