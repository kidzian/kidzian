// import React, { useRef, useEffect } from 'react';
// import { motion, useAnimation } from 'framer-motion';

// const Feature1 = () => {
//   const ref = useRef(null);
//   const controls = useAnimation();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollY = window.scrollY;  // Get the current scroll position
      
//       if (scrollY >= 1000) {
//         controls.start({ opacity: 1, x: 0, y: 0, scale: 1 });
//       } else {
//         controls.start({ opacity: 0, x: 100, y: -50, scale: 0.8 });
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [controls]);

//   return (
//     <div ref={ref} className='w-[100vw] h-[100vh] flex gap-10 p-10 items-center justify-center'>
//       <div className='w-[50%] text-sm'>
//         <motion.h1 
//           className="capitalize text-[#231639] text-5xl font-semibold"
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           transition={{ duration: 1, ease: 'easeInOut' }}
//         >
//           Safe your future with industry experts
//         </motion.h1>

//         <motion.p 
//           className='mt-10 text-[#606161]'
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
//         >
//           At <strong>Kidzian</strong>, we are dedicated to helping you secure your future by providing industry-expert-led <strong>coding courses</strong> designed to <strong>shape your skills</strong> and open doors to <strong>exciting career opportunities</strong>. Our experienced instructors come from the tech industry and bring <strong>real-world knowledge</strong>, ensuring that you gain practical coding expertise that is in high demand.
//         </motion.p>

//         <motion.p 
//           className='mt-10 text-[#606161]'
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
//         >
//           From learning the <strong>basics of programming to mastering advanced web development</strong>, our courses cover everything you need to build a <strong>strong foundation</strong> in coding. Whether you’re interested in <strong>frontend development, backend development, or full-stack development</strong>, our tailored lessons will guide you through <strong>hands-on projects</strong> that mirror real-world challenges.
//         </motion.p>

//         <motion.p 
//           className='mt-10 text-[#606161]'
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
//         >
//           Our industry experts will mentor you through each step, helping you develop <strong>problem-solving </strong>abilities, coding best practices, and proficiency in <strong>modern frameworks and technologies</strong>. With Kidzian, you’ll not only learn to code, but also gain the confidence to apply your skills in real-world projects, preparing you to excel in the ever-evolving tech landscape.
//         </motion.p>
//       </div>

//       <div className='w-[40%]'>
//         <motion.img 
//           src='https://plus.unsplash.com/premium_photo-1664299935896-8b7638a6f105?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//           alt="" 
//           className='rounded-3xl h-[70vh]' 
//           initial={{ opacity: 0, scale: 0.8, x: 100 }}
//           animate={controls}
//           transition={{ duration: 1, ease: 'easeInOut' }}
//         />
//       </div>
//     </div>
//   );
// }

// export default Feature1;




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
          At <strong>Kidzian</strong>, we are dedicated to helping you secure your future by providing industry-expert-led <strong>coding courses</strong> designed to <strong>shape your skills</strong> and open doors to <strong>exciting career opportunities</strong>. Our experienced instructors come from the tech industry and bring <strong>real-world knowledge</strong>, ensuring that you gain practical coding expertise that is in high demand.
        </motion.p>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
        >
          From learning the <strong>basics of programming to mastering advanced web development</strong>, our courses cover everything you need to build a <strong>strong foundation</strong> in coding. Whether you’re interested in <strong>frontend development, backend development, or full-stack development</strong>, our tailored lessons will guide you through <strong>hands-on projects</strong> that mirror real-world challenges.
        </motion.p>

        <motion.p 
          className='mt-10 text-[#606161]'
          initial={{ opacity: 0, x: -100 }}
          animate={controls}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
        >
          Our industry experts will mentor you through each step, helping you develop <strong>problem-solving </strong>abilities, coding best practices, and proficiency in <strong>modern frameworks and technologies</strong>. With Kidzian, you’ll not only learn to code, but also gain the confidence to apply your skills in real-world projects, preparing you to excel in the ever-evolving tech landscape.
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
