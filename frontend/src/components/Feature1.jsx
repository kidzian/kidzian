import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Feature1 = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col lg:flex-row-reverse gap-10 p-6 md:p-10 items-center justify-center">
      {/* Image Section */}
      <motion.div 
        className="w-full lg:w-2/5 flex justify-center"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 100 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-1 bg-[#1E3A8A]/20 rounded-3xl blur-lg"></div>
          <img
            src="https://images.pexels.com/photos/3769981/pexels-photo-3769981.jpeg"
            alt="Expert mentoring"
            className="relative rounded-3xl w-full h-[45vh] lg:h-[70vh] object-cover shadow-xl"
          />
        </div>
      </motion.div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[#1E3A8A] text-3xl md:text-5xl 2xl:text-6xl font-bold mb-6">
            Secure Your Future with Industry Experts
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Our expert mentors—graduates from India's top institutes—are dedicated to empowering young minds with future-ready skills through immersive, hands-on learning experiences.
          </p>
          
          <motion.div 
            className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="text-[#1E3A8A] font-bold text-3xl">500+</div>
              <div className="text-gray-600">Expert Mentors</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="text-[#1E3A8A] font-bold text-3xl">10k+</div>
              <div className="text-gray-600">Students Taught</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <div className="text-[#1E3A8A] font-bold text-3xl">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feature1;