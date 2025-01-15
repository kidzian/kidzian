
import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Feature1 = () => {
  const ref = useRef(null); 
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Trigger the animation when the element comes into the viewport
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
    <div ref={ref} className='w-[100vw] h-[100vh] flex gap-10 p-10 items-center justify-center'>
      <div className='w-[50%] text-sm'>
        <motion.h1 
          className="capitalize text-[#231639] text-5xl font-semibold"
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          Safe your future with industry experts
        </motion.h1>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        >
         "At <strong>Kidzian</strong>, our team of seasoned experts from India's most prestigious institutes is committed to nurturing your child's future with years of proven experience and dedication."
        </motion.p>

      </div>

      <div className='w-[40%]'>
        <motion.img 
          src='https://plus.unsplash.com/premium_photo-1664299935896-8b7638a6f105?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt="" 
          className='rounded-3xl h-[70vh]' 
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

export default Feature1;
