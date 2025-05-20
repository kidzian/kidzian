import React from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: "Register for a trial session",
    description: "Request a trial session using the button on the website",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="8" x2="21" y2="8" />
        <circle cx="12" cy="14" r="3" />
        <line x1="12" y1="8" x2="12" y2="8.01" />
        <line x1="7" y1="21" x2="7" y2="21.01" />
        <line x1="12" y1="21" x2="12" y2="21.01" />
        <line x1="17" y1="21" x2="17" y2="21.01" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Experience Real-Time Sessions ",
    description: "Experience our unique learning approach with zero obligations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="8" x2="21" y2="8" />
        <line x1="7" y1="13" x2="17" y2="13" />
        <line x1="7" y1="17" x2="17" y2="17" />
        <circle cx="5.5" cy="13" r="1" fill="currentColor" />
        <circle cx="5.5" cy="17" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Choose Subscription Plan",
    description: "Convenient subscription plans and timings to suit your convenience",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="2" y="6" width="16" height="16" rx="2" transform="translate(2 -2)" />
        <line x1="6" y1="10" x2="10" y2="10" />
        <line x1="6" y1="14" x2="14" y2="14" />
        <line x1="6" y1="18" x2="12" y2="18" />
        <path d="M14 9l1 1 3-3" />
      </svg>
    )
  },
];

const Steps = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/contact-us');
  };

  return (
    <div className="bg-[#2a9c7e] py-16 px-6 md:px-12 lg:px-20 rounded-lg shadow-lg overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-center mb-14">
  <h1 className=" text-white  px-4 py-2 font-semibold text-3xl text-center">
    Begin your Kidzian Journey in 3 simple steps
  </h1>
</div>

        <div className="flex flex-col gap-10  md:flex-row items-center justify-between space-y-16 md:space-y-0">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center mt-6 bg-white rounded-xl p-8 w-full md:w-1/3 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-4xl font-extrabold text-gray-800 mb-4">{step.id}</div>
              <div className="flex items-center justify-center w-24 h-24 border-2 border-black rounded-full mb-5 bg-gray-100 hover:bg-black hover:text-white transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="hidden md:flex absolute w-full justify-between items-center mt-28" style={{ top: '32%', left: '0', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '33%', transform: 'translateX(-50%)' }}>
            <span className="text-6xl font-bold text-black animate-pulse">&gt;</span>
          </div>
          <div style={{ position: 'absolute', right: '33%', transform: 'translateX(50%)' }}>
            <span className="text-6xl font-bold text-black animate-pulse">&gt;</span>
          </div>
        </div>
      </div>

      {/* Start Today Button */}
      <div className="text-center mt-16">
        <button
          onClick={handleClick}
          className="bg-yellow-600 text-black font-bold py-3 px-10 mb-4 rounded-md hover:bg-gray-100 transition-colors duration-300 shadow-lg"
        >
          Start Today
        </button>
      </div>
    </div>
  );
};

export default Steps;
