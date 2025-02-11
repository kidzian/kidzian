import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Feature1 = () => {
  const ref = useRef(null); 
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        controls.start({ opacity: 1, x: 0, y: 0, scale: 1 });
      }
    }, {
      threshold: 0.5 // Trigger when at least 50% of the element is in view
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <div ref={ref} className='w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 p-6 md:p-10 overflow-x-hidden'>
      
      {/* Image first on small screens */}
      <div className='w-full md:w-[40%] flex justify-center'>
        <motion.img 
          src='https://plus.unsplash.com/premium_photo-1664299935896-8b7638a6f105?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt="Feature Image" 
          className='rounded-3xl h-auto md:h-[70vh] w-full max-w-[500px]'
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>

      {/* Text Section */}
      <div className='w-full md:w-[50%] text-center md:text-left'>
        <motion.h1 
          className="capitalize text-[#231639] text-3xl md:text-5xl font-semibold"
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          Safe your future with industry experts
        </motion.h1>

        <motion.p 
          className='mt-4 md:mt-10 text-[#606161] text-sm md:text-base'
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        >
          "At <strong>Kidzian</strong>, our team of seasoned experts from India's most prestigious institutes is committed to nurturing your child's future with years of proven experience and dedication."
        </motion.p>
      </div>
      
    </div>
  );
}

export default Feature1;
