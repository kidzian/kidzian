import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Kirthi Sharma',
      title: 'Student',
      country: 'United States',
      age: '8',
      quote: 'I love coding and creating games with Kidzian! The interactive lessons make learning fun, and I\'ve already made three games by myself.',
      image: 'https://images.pexels.com/photos/3662824/pexels-photo-3662824.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    },
    {
      id: 2,
      name: 'Daiwik Patel',
      title: 'Student',
      country: 'Canada',
      age: '12',
      quote: 'The teachers at Kidzian make complex coding concepts easy to understand. I\'ve learned Python and now I\'m building my own AI projects!',
      image: 'https://images.pexels.com/photos/1462536/pexels-photo-1462536.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    },
    {
      id: 3,
      name: 'Vihaan Reddy',
      title: 'Student',
      country: 'India',
      age: '9',
      quote: 'Kidzian turned me into a coding wizard! I started with block coding and now I can create amazing games. The projects are super fun!',
      image: 'https://images.pexels.com/photos/3771839/pexels-photo-3771839.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    },
    {
      id: 4,
      name: 'Shreyas Kumar',
      title: 'Student',
      country: 'United Kingdom',
      age: '14',
      quote: 'From basic blocks to Java programming, Kidzian made my coding journey exciting. The mentors are amazing and always help when I\'m stuck.',
      image: 'https://images.pexels.com/photos/1595387/pexels-photo-1595387.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    },
    {
      id: 5,
      name: 'Aryan Malhotra',
      title: 'Student',
      country: 'India',
      age: '16',
      quote: 'Thanks to Kidzian, I\'ve mastered HTML, CSS, and Python. The project-based learning approach helped me build a strong portfolio.',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    },
    {
      id: 6,
      name: 'Priya Tandon',
      title: 'Parent',
      country: 'India',
      quote: 'Seeing my son\'s progress with Kidzian has been incredible. The curriculum is well-structured and the teachers are highly qualified.',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[(currentIndex) % testimonials.length],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Inspiring Success Stories
          </h2>
          <p className="text-lg text-gray-600">
            Discover how Kidzian is transforming young minds into future tech leaders
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-800 hover:text-gray-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-800 hover:text-gray-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 px-4"
              initial={{ x: 0 }}
              animate={{ x: `${-currentIndex * 33.33}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {visibleTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="w-full md:w-1/3 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 h-full relative">
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">{testimonial.country}</p>
                        {testimonial.age && (
                          <p className="text-gray-600 text-sm">Age: {testimonial.age}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <blockquote className="text-gray-700 leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="absolute bottom-8 right-8">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {testimonial.title}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
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