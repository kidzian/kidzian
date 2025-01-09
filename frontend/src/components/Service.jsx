// import React from 'react';
// import { Gamepad2, Laptop, Code, Award } from 'lucide-react'; // Example React components for icons
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Service = () => {
//   const navigate = useNavigate(); // For programmatic navigation

//   // Array of card data
//   const cardData = [
//     {
//       title: 'Learn from Industry Experts',
//       paragraph: 'Gain knowledge from industry experts with real-world experience.',
//       image: <Award className="h-16 w-16 text-orange-500" />, // React component
//       buttonText: 'Book a Free Demo',
//       redirectLink: '/experts',
//     },
//     {
//       title: 'Learn at Your Own Pace',
//       paragraph: 'Learn at your own pace with our flexible self-paced programs.',
//       image: <Laptop className="h-16 w-16 text-blue-500" />, // React component
//       buttonText: 'View Courses',
//       redirectLink: '/self-paced',
//     },
//     {
//       title: 'Learn the Latest Technology',
//       paragraph: 'Stay updated by learning the latest technology trends and tools.',
//       image: <Code className="h-16 w-16 text-green-500" />, // React component
//       buttonText: 'Get Started',
//       redirectLink: '/technology',
//     },
//     {
//       title: 'Learn with a Gamified Approach',
//       paragraph: 'Enjoy learning with our fun and engaging methods that make education exciting.',
//       image: <Gamepad2 className="h-16 w-16 text-purple-500" />, // React component
//       buttonText: 'Enroll Now',
//       redirectLink: '/gamified-learning',
//     },
//   ];

//   return (
//     <div className="w-[100vw] min-h-[100vh] bg-[#FFFFFF] flex flex-col items-center justify-start gap-16 p-24">
//       {/* Section Title and Description */}
//       <div className="flex items-center justify-center flex-col w-[60vw] leading-tight gap-4 ">
//         <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-center ">
//           Why Kidzian is for you?
//         </h1>
//         <p className="text-center text-gray-600 text-lg">
//           If you are planning for a year, sow rice. If you are planning for a decade, plant trees. If you are planning for a lifetime, educate people.
//         </p>
//       </div>

//       {/* Cards Section */}
//       <div className="flex flex-wrap justify-center gap-8 w-full px-10">
//         {cardData.map((card, index) => (
//           <motion.div
//             key={index}
//             className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center hover:scale-105 transition-transform duration-100 cursor-pointer"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }} // Optional: Slide out when leaving
//             transition={{ duration: 0.3, type: 'spring' }} // Smooth animation on enter
//             whileHover={{ scale: 1.05 }} // Scale on hover
//           >
//             <div className="flex flex-col items-center gap-4"> {/* Ensures uniform internal spacing */}
//               {card.image}
//               <h1 className="text-black text-lg font-semibold"> {card.title}</h1>
//               <p className="leading-tight text-sm text-left text-gray-500 h-10">{card.paragraph}</p>
//             </div>
//             <button
//               className="mt-auto bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-4 py-2 rounded-lg hover:opacity-90"
//               onClick={() => navigate(card.redirectLink)}
//             >
//               {card.buttonText}
//             </button>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Service;



import React, { useState, useEffect } from 'react';
import { Gamepad2, Laptop, Code, Award } from 'lucide-react'; // Example React components for icons
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Service = () => {
  const navigate = useNavigate(); // For programmatic navigation
  const [hasScrolled, setHasScrolled] = useState(false); // State to track scroll position

  // Array of card data
  const cardData = [
    {
      title: 'Learn from Industry Experts',
      paragraph: 'Gain knowledge from industry experts with real-world experience.',
      image: <Award className="h-16 w-16 text-orange-500" />,
      buttonText: 'Book a Free Demo',
      redirectLink: '/experts',
    },
    {
      title: 'Learn at Your Own Pace',
      paragraph: 'Learn at your own pace with our flexible self-paced programs.',
      image: <Laptop className="h-16 w-16 text-blue-500" />,
      buttonText: 'View Courses',
      redirectLink: '/self-paced',
    },
    {
      title: 'Learn the Latest Technology',
      paragraph: 'Stay updated by learning the latest technology trends and tools.',
      image: <Code className="h-16 w-16 text-green-500" />,
      buttonText: 'Get Started',
      redirectLink: '/technology',
    },
    {
      title: 'Learn with a Gamified Approach',
      paragraph: 'Enjoy learning with our fun and engaging methods that make education exciting.',
      image: <Gamepad2 className="h-16 w-16 text-purple-500" />,
      buttonText: 'Enroll Now',
      redirectLink: '/gamified-learning',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scrollPosition > windowHeight/1.4) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-[100vw] min-h-[100vh] bg-[#FFFFFF] flex flex-col items-center justify-start gap-16 p-24">
      {/* Section Title and Description */}
      <div className="flex items-center justify-center flex-col w-[60vw] leading-tight gap-4 ">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-center ">
          Why Kidzian is for you?
        </h1>
        <p className="text-center text-gray-600 text-lg">
          If you are planning for a year, sow rice. If you are planning for a decade, plant trees. If you are planning for a lifetime, educate people.
        </p>
      </div>

      {/* Cards Section */}
      <motion.div
        className="flex flex-wrap justify-center gap-8 w-full px-10"
        initial={{ opacity: 0, y: 50 }} // Start off-screen
        animate={hasScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // Animate when scrolled
        transition={{ duration: 0.5, type: 'spring' }} // Smooth spring transition
      >
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer"
            whileHover={{ scale: 1.1, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' }} // Interaction on hover
          >
            <div className="flex flex-col items-center gap-4"> {/* Ensures uniform internal spacing */}
              {card.image}
              <h1 className="text-black text-lg font-semibold">{card.title}</h1>
              <p className="leading-tight text-sm text-left text-gray-500 h-10">{card.paragraph}</p>
            </div>
            <button
              className="mt-auto bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-4 py-2 rounded-lg hover:opacity-90"
              onClick={() => navigate(card.redirectLink)}
            >
              {card.buttonText}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Service;
