import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Gamified = () => {
  const ref = useRef(null); // Reference to the element we want to observe
  const controls = useAnimation(); // Controls for animation

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
      observer.observe(ref.current); // Start observing the element
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current); // Stop observing when component is unmounted
      }
    };
  }, [controls]);

  return (
    <div ref={ref} className='w-[100vw] h-[100vh] flex gap-10 p-10 items-center justify-center'>
      <div className='w-[40%]'>
        <motion.img 
          src='https://plus.unsplash.com/premium_photo-1664104722112-ecaeb6c00a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2lkcyUyMGxlYXJuaW5nJTIwaW4lMjBoYXBweXxlbnwwfHwwfHx8MA%3D%3D'
          alt="" 
          className='rounded-3xl h-[70vh] w-full' 
          initial={{ opacity: 0, scale: 0.8, x: -100 }} // Starting from the left
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>

      <div className='w-[50%] text-sm'>
        <motion.h1 
          className="capitalize text-[#231639] text-5xl font-semibold"
          initial={{ opacity: 0, x: 100 }} // Starting from the right
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          Learn with a Gamified approach
        </motion.h1>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: 100 }} // Starting from the right
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        >
          Kidzian adopts a gamified approach to learning that makes education not only engaging but also highly <strong>interactive</strong>. They design projects that resemble games, integrating elements such as challenges, rewards, and levels to encourage <strong>active participation</strong> and foster a <strong>deeper understanding of coding concepts</strong>.
        </motion.p>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: 100 }} // Starting from the right
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
        >
          By using gamification, Kidzian transforms traditional learning into a fun, competitive, and <strong>rewarding experience</strong>, where learners can earn points, badges, and progress through different stages. This approach not only keeps students motivated but also enhances <strong>critical thinking, problem-solving skills, and collaboration</strong> as they tackle real-world-like scenarios in a game-like environment.
        </motion.p>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: 100 }} // Starting from the right
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          Through game-based projects, Kidzian <strong>empowers learners to experiment</strong>, fail, iterate, and succeed in a supportive, playful space, ensuring they gain practical coding expertise while having fun. This gamified methodology helps create a dynamic and engaging learning atmosphere, making education more accessible, memorable, and aligned with modern digital learning preferences.
        </motion.p>
      </div>
    </div>
  );
}

export default Gamified;
