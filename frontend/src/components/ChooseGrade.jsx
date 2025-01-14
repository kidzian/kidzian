
import React from 'react';
import { motion, useInView } from 'framer-motion';

const ChooseGrade = () => {
  const ref = React.useRef(null);  // Ref to observe when the component comes into view
  const scrollThreshold = 100;  // Scroll threshold in characters
  const isInView = useInView(ref, {
    once: true,
    margin: '-500px',  // To allow capturing when scrolled 100 characters into the landing page
    triggerOnce: false,
    onChange: (inView, entry) => {
      // onChange fires every time the component scrolls past the threshold
      if (entry.boundingClientRect.top <= scrollThreshold) {
        return true;
      }
    }
  });

  return (
    <div
      ref={ref}  // Attach the ref to this div
      className='w-[100vw] h-[75vh] flex items-center justify-center relative'
    >
      {/* First Span */}
      <motion.span
        className='absolute top-[60vh] -left-16 bg-[#a855f7] w-[8vw] h-[8vw] rounded-3xl shadow-lg'
        animate={{ scale: [1, 1.05, 1], rotate: 120 }}
        transition={{ duration: 0.8 }}
      />

      {/* Second Span */}
      <motion.span
        className='absolute top-[60vh] -right-12 bg-[#a855f7] w-[8vw] h-[8vw] rounded-3xl shadow-lg'
        animate={{ scale: [1, 1.05, 1], rotate: 45 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        className='w-[45%] flex flex-col items-center'
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className='flex flex-col items-center mt-[6vh] z-10'>
          <motion.h2
            className='text-4xl font-bold text-gray-800 mb-8'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Choose Your Grade
          </motion.h2>
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 12 }, (_, i) => (
              <motion.button
                key={i + 1}
                className='bg-gradient-to-br from-orange-400 to-red-500 text-white w-[4.5rem] h-[4.5rem] rounded-2xl shadow-lg flex items-center justify-center flex-col font-semibold'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.1, boxShadow: '0px 8px 20px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className='w-[45%] flex flex-col items-center justify-center mt-20'
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        <p className='text-md text-gray-700 text-center w-[80%] mb-6'>
          Experience personalized learning and explore our interactive courses. Join us for a free demo session today!
        </p>
        <motion.button
          className='bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold px-10 py-4 rounded-md shadow-md text-lg'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.1, boxShadow: '0px 8px 20px rgba(0,0,0,0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Book A Free Demo
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChooseGrade;
