import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ParentFeedBack = [
  {
    id: 1,
    name: "Radhika Acharya",
    date: "2024-05-06",
    rating: 5,
    comment: "StemMonsters is a great, fun way for kids to understand and apply STEM concepts. It's meant to kindle the joy of learning in children. My daughter absolutely loves the classes!",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    id: 2,
    name: "Veena Madhavi",
    date: "2024-04-25",
    rating: 5,
    comment: "My son absolutely loved STEM classes. Thank you Sonali and her teachers for making science and maths so much fun and interesting for kids. Highly recommended!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    id: 3,
    name: "Vinodhini Venkatesh",
    date: "2024-04-23",
    rating: 5,
    comment: "The camp was super exciting and my child loved it and definitely learnt a lot. The teachers are very patient and encouraging. Looking forward to more such camps!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
  }
];

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Parents' Feedback</h2>
          <p className="text-xl text-gray-600">
            You don't have to take our word. See why children love us, and parents admire us.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-0 left-0 w-full text-center mb-8">
            <div className="inline-flex items-center">
              <span className="text-3xl font-bold mr-4">EXCELLENT</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-2">Based on 35 reviews</p>
          </div>

          <div className="pt-24">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                }
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(testimonial.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 line-clamp-4">{testimonial.comment}</p>
                    <div className="mt-4">
                      <img
                        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                        alt="Google Review"
                        className="h-6"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="absolute bottom-0 right-0 mt-4">
            <img
              src="https://cdn.trustindex.io/assets/platform/Google/logo.svg"
              alt="Verified by Trustindex"
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentFeedBack;