import React, { useState } from 'react';
import Heading from '../components/Heading';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react'; // Import SVG
import Footer from '../components/Footer';
import events from '../assets/events.jpg';

// Mock hackathon data
const hackathons = [
  {
    id: 1,
    title: 'TechHack 2025',
    description: 'A 48-hour hackathon focusing on AI and Machine Learning.',
    date: '2025-03-15',
    location: 'Online',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/178/151/datas/medium_square.png',
  },
  {
    id: 2,
    title: 'CodeFest 2025',
    description: 'Join this hackathon for Web Development and UX/UI design.',
    date: '2025-04-10',
    location: 'San Francisco, CA',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/082/744/datas/medium_square.jpg',
  },
  {
    id: 3,
    title: 'Innovate Hack 2025',
    description: 'A global hackathon with participants from various countries.',
    date: '2025-05-20',
    location: 'London, UK',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/193/397/datas/medium_square.png',
  },
  {
    id: 4,
    title: 'DevConnect 2025',
    description: 'Focus on full-stack development and cloud technologies.',
    date: '2025-06-12',
    location: 'Berlin, Germany',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/191/317/datas/medium_square.png',
  },
  {
    id: 5,
    title: 'SmartDev Hack 2025',
    description: 'A hackathon focusing on IoT and smart devices.',
    date: '2025-07-18',
    location: 'Tokyo, Japan',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/194/177/datas/medium_square.png',
  },
  {
    id: 6,
    title: 'CodeMash 2025',
    description: 'An event for both coding enthusiasts and hobbyists.',
    date: '2025-08-25',
    location: 'Austin, TX',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/127/009/datas/medium_square.jpeg',
  },
  {
    id: 7,
    title: 'HackFuture 2025',
    description: 'Hackathon focusing on blockchain and decentralized applications.',
    date: '2025-09-30',
    location: 'Dubai, UAE',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/217/776/datas/medium_square.png',
  },
  {
    id: 8,
    title: 'CodeWorld 2025',
    description: 'A global hackathon with a focus on cross-platform development.',
    date: '2025-10-15',
    location: 'New York, NY',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/198/357/datas/medium_square.jpg',
  },
  {
    id: 9,
    title: 'HackX 2025',
    description: 'A challenge to solve real-world problems using technology.',
    date: '2025-11-05',
    location: 'Sydney, Australia',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/061/634/datas/medium_square.jpg',
  },
  {
    id: 10,
    title: 'AI-Power Hack 2025',
    description: 'Explore AI and machine learning solutions.',
    date: '2025-12-12',
    location: 'Singapore',
    imageUrl: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/158/234/datas/medium_square.png',
  },
];

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHackathons, setFilteredHackathons] = useState(hackathons);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = hackathons.filter((hackathon) =>
      hackathon.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredHackathons(filtered);
  };

  return (
    <div>
      <Heading />
      <div className="flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="w-[90vw] md:w-[80vw] flex flex-col md:flex-row gap-6 md:gap-2 mt-6 md:mt-0">
          {/* Image Section */}
          <motion.div
            className="w-full md:w-[50%] flex items-center justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <img
              className="rounded-xl w-full md:w-[92%] h-auto md:h-[95%]"
              src={events}
              alt="Hackathon Illustration"
            />
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="w-full md:w-[50%] flex flex-col gap-4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <motion.h1
              className="text-3xl font-extrabold text-[#303030] capitalize text-center md:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              What is a hackathon?
            </motion.h1>

            <motion.p
              className="text-sm text-[#606060] font-bold"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              A hackathon is an event where individuals, teams, or groups come together for an extended period (usually 24 hours to several days) to collaborate intensively on projects, often related to technology, coding, and problem-solving. The goal of a hackathon is to build something innovative, prototype a product, solve a particular challenge, or work on software development in a time-bound, collaborative environment.
            </motion.p>

            <motion.p
              className="font-bold text-lg text-[#303030]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              Key Features of a Hackathon:
            </motion.p>

            <motion.ul
              className="text-sm list-disc list-inside text-[#606060] font-semibold flex flex-col gap-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <li><strong>Collaboration:</strong> Hackathons foster teamwork, allowing participants to work with others, exchange ideas, and build solutions together.</li>
              <li><strong>Creativity:</strong> Participants are encouraged to think outside the box and come up with unique solutions to problems.</li>
              <li><strong>Coding & Development:</strong> Many hackathons focus heavily on software development, but some may also include hardware, design, or business development.</li>
              <li><strong>Networking:</strong> It's a great opportunity to meet other developers, designers, entrepreneurs, and industry experts.</li>
              <li><strong>Time-Constraint:</strong> Most hackathons have strict time limits, typically 24-48 hours, to create something tangible and presentable.</li>
              <li><strong>Prizes:</strong> Many hackathons offer prizes for the best ideas, prototypes, or solutions, such as cash, mentorship, job opportunities, or networking perks.</li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mt-6 w-[90vw] md:w-[80vw]">
          <div className="flex items-center bg-white rounded-lg border w-full">
            <Search className="w-6 h-6 ml-2" />
            <input
              type="text"
              placeholder="Search hackathons..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-2 pr-4 py-2 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-10 w-[90vw] md:w-[80vw]">
          <h2 className="text-2xl font-bold text-[#303030]">Upcoming Hackathons:</h2>
          <div className="mt-5">
            {filteredHackathons.map((hackathon) => (
              <motion.div
                key={hackathon.id}
                className="bg-[#f9f9f9] p-4 rounded-lg mb-4 w-full flex flex-col md:flex-row items-center justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div className="flex gap-2">
                  <div>
                    <img src={hackathon.imageUrl} alt={hackathon.title} className="h-20 w-20 rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#303030]">{hackathon.title}</h3>
                    <p className="text-sm text-[#606060]">{hackathon.description}</p>
                    <p className="text-sm text-[#606060]">Date: {hackathon.date} | Location: {hackathon.location}</p>
                  </div>
                </div>
                <div>
                  <button className="mt-2 bg-[#047857] text-white px-4 py-2 rounded">Register</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;