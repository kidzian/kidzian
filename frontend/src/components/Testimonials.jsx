import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Random color options
const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

const getInitials = (name) => {
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Kirthi Sharma',
      title: 'Student',
      country: 'United States',
      age: '8',
      quote: 'I love coding and creating games with Kidzian! The interactive lessons make learning fun, and I\'ve already made three games by myself.',
      rating: 5
    },
    {
      id: 2,
      name: 'Daiwik Patel',
      title: 'Student',
      country: 'Canada',
      age: '12',
      quote: 'The teachers at Kidzian make complex coding concepts easy to understand. I\'ve learned Python and now I\'m building my own AI projects!',
      rating: 5
    },
    {
      id: 3,
      name: 'Vihaan Reddy',
      title: 'Student',
      country: 'India',
      age: '9',
      quote: 'Kidzian turned me into a coding wizard! I started with block coding and now I can create amazing games. The projects are super fun!',
      rating: 5
    },
    {
      id: 4,
      name: 'Shreyas Kumar',
      title: 'Student',
      country: 'United Kingdom',
      age: '14',
      quote: 'From basic blocks to Java programming, Kidzian made my coding journey exciting. The mentors are amazing and always help when I\'m stuck.',
      rating: 5
    },
    {
      id: 5,
      name: 'Aryan Malhotra',
      title: 'Student',
      country: 'India',
      age: '16',
      quote: 'Thanks to Kidzian, I\'ve mastered HTML, CSS, and Python. The project-based learning approach helped me build a strong portfolio.',
      rating: 5
    },
    {
      id: 6,
      name: 'Priya Tandon',
      title: 'Parent',
      country: 'India',
      quote: 'Seeing my son\'s progress with Kidzian has been incredible. The curriculum is well-structured and the teachers are highly qualified.',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, testimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + 3).concat(
    testimonials.slice(0, Math.max(0, 3 - (testimonials.length - currentIndex)))
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Inspiring Success Stories</h2>
          <p className="text-lg text-gray-600">
            Discover how Kidzian is transforming young minds into future tech leaders.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {currentTestimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-2xl shadow-lg p-6 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-full text-white font-bold flex items-center justify-center text-lg ${bgColors[i % bgColors.length]}`}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.country}</p>
                      {testimonial.age && (
                        <p className="text-sm text-gray-500">Age: {testimonial.age}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-sm italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <span className="absolute bottom-4 right-4 text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {testimonial.title}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
