import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      title: 'Parent',
      country: 'United States',
      age: '40',
      quote: 'Kidzian has transformed my child’s learning experience. The platform is engaging, and the progress is remarkable!',
    },
    {
      id: 2,
      name: 'Jane Smith',
      title: 'Teacher',
      country: 'Canada',
      age: '35',
      quote: 'The tools and resources provided by Kidzian have made teaching so much more effective and fun.',
    },
    {
      id: 3,
      name: 'Kirthi',
      title: 'Student',
      country: 'India',
      age: '12',
      quote: 'Learning has never been this exciting. I love the interactive lessons and games!',
    },
    {
      id: 4,
      name: 'Emily Clark',
      title: 'Parent',
      country: 'United Kingdom',
      age: '38',
      quote: 'My child is excited every day to learn something new with Kidzian!',
    },
    {
      id: 5,
      name: 'Rajesh Kumar',
      title: 'Teacher',
      country: 'India',
      age: '45',
      quote: 'Kidzian is revolutionizing how we approach education. It’s a game changer.',
    },
    {
        id: 6,
        name: 'Sam',
        title: 'Student',
        country: 'India',
        age: '15',
        quote: 'Kidzian is revolutionizing how we approach education. It’s a game changer.',
      },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % testimonials.length);
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <div className="w-full h-auto py-12 flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        Kidzian Success Stories
      </h1>
      <div className="relative w-full max-w-6xl">
        {/* Carousel Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-gray-800 bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-colors duration-200"
        >
          <FaChevronLeft size={24} className=''/>
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-gray-800 bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-colors duration-200"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Testimonials */}
        <div className="flex overflow-hidden gap-6 mt-4">
          {visibleTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white shadow-lg p-6 h-[35vh] rounded-lg flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300 w-[30%] flex-shrink-0"
            >
              <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
              <p className="text-sm text-gray-500">Country: {testimonial.country}</p>
              <p className="text-sm text-gray-500">Age: {testimonial.age}</p>
              <p className="text-gray-700 italic mt-4">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
