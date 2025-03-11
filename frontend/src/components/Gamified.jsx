import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Gamified = () => {
  const ref = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        controls.start({ opacity: 1, x: 0, y: 0, scale: 1 });
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [controls]);

  return (
    <div ref={ref} className="w-full min-h-screen flex flex-col lg:flex-row gap-10 p-10 items-center justify-center">
      {/* Image Section (Maintains left appearance on desktop) */}
      <div className="w-full lg:w-2/5 flex justify-center">
        <motion.img
          src="https://plus.unsplash.com/premium_photo-1664104722112-ecaeb6c00a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2lkcyUyMGxlYXJuaW5nJTIwaW4lMjBoYXBweXxlbnwwfHwwfHx8MA%3D%3D"
          alt=""
          className="rounded-3xl w-full max-w-lg h-auto lg:h-[70vh]"
          initial={{ opacity: 0, scale: 0.8, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <motion.h1
          className="capitalize text-[#231639] text-3xl lg:text-5xl font-semibold"
          initial={{ opacity: 0, x: 100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          Learning Made Fun: A Gamified Approach
        </motion.h1>

        <motion.p
          className="mt-5 lg:mt-10 text-[#606161] text-lg md:text-sm"
          initial={{ opacity: 0, x: 100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        >
          At <strong>Kidzian</strong>, we turn learning into an adventure! Our gamified approach keeps kids engaged, excited, and eager to master new skills through interactive challenges and hands-on activities.
        </motion.p>
      </div>
    </div>
  );
};

export default Gamified;
