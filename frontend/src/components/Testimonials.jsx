import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    { id: 1, name: 'Kirthi', title: 'Student', country: 'United States', age: '8', quote: 'I love coding and creating games and I love Kidzian!' },
    { id: 2, name: 'Daiwik', title: 'Student', country: 'Canada', age: '12', quote: 'Coding is very interesting. The concepts are made clear by the teachers and we are encouraged to code independently' },
    { id: 3, name: 'Vihaan', title: 'Student', country: 'India', age: '9', quote: `Kidzian is like my supertech gaming playground, I'm 9 and now I can make my own games. Coding is like magic and Kidzian taught me to be  a wizard` },
    { id: 4, name: 'Shreyas', title: 'Student', country: 'United Kingdom', age: '14', quote: `I'm 14 and now i started with blocks at Kidzian. Now I'm a Java Explorer. The journey was like playing my favourite game levels` },
    { id: 5, name: 'Aryan', title: 'Student', country: 'India', age: '16', quote: 'At 16 fueled my dream of becoming a tech wizard, from Html to Python ,every lesson felt like a magic spell' },
    { id: 6, name: 'Aryamanan Tandon', title: 'Parent', country: 'India', age: '15', quote: 'Kidzian is revolutionizing how we approach education. It’s a game changer.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Start from the first testimonial
  const totalTestimonials = testimonials.length;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalTestimonials);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Automatic sliding every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // To get a seamless loop, we display 3 testimonials cyclically
  const visibleTestimonials = [
    testimonials[(currentIndex) % totalTestimonials],
    testimonials[(currentIndex + 1) % totalTestimonials],
    testimonials[(currentIndex + 2) % totalTestimonials],
    testimonials[(currentIndex + 3) % totalTestimonials],
    testimonials[(currentIndex + 4) % totalTestimonials],
    testimonials[(currentIndex + 5) % totalTestimonials],
    testimonials[(currentIndex + 6) % totalTestimonials],
  ];

  return (
    <div className="w-full h-auto py-12 flex flex-col items-center justify-start bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Kidzian Success Stories</h1>
      <div className="relative w-full max-w-6xl overflow-hidden">
        {/* Carousel Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-800 bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-colors duration-200 z-10"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-800 bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-colors duration-200 z-10"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Testimonials */}
        <motion.div
          className="flex gap-6 mt-4"
          initial={{ x: 0 }}
          animate={{ x: -((100 / 3) * (currentIndex % totalTestimonials)) + '%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {visibleTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300 w-80 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
              <p className="text-sm text-gray-500">Country: {testimonial.country}</p>
              <p className="text-sm text-gray-500">Age: {testimonial.age}</p>
              <p className="text-gray-700 italic mt-4">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
