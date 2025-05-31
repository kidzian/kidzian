import React, { useState } from "react";

const ParentsFeedback = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedComments, setExpandedComments] = useState({});
  
  const googleReviewUrl = "https://www.google.com/search?q=kidzian&rlz=1C1GCEU_en&oq=kidzian&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg8MgYIARBFGDsyDAgCEAAYChixAxiABDIJCAMQABgKGIAEMhIIBBAuGAoYrwEYxwEYsQMYgAQyBggFEEUYPTIGCAYQRRg8MgYIBxBFGDzSAQkxMDY2MWowajSoAgewAgHxBSi2-DrMeI6n&sourceid=chrome&ie=UTF-8#lrd=0x3bae0f89479856cd:0x96ea16cfc43a695,1,,,,";

  const testimonials = [
    {
      id: 1,
      name: "Sujata Munirangappa", // Female
      reviewInfo: "2 reviews",
      date: "a month ago",
      avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face&auto=format", // Indian female
      rating: 5,
      shortComment: "Kidzian has been a fantastic learning platform for my son! He has developed a strong interest in coding and enjoys every session...",
      fullComment: "Kidzian has been a fantastic learning platform for my son! He has developed a strong interest in coding and enjoys every session. The interactive approach keeps him engaged, and his problem-solving skills have improved significantly. I'm truly grateful for the positive impact on his learning journey!",
      isGoogle: true,
    },
    {
      id: 2,
      name: "Dr.S.Pramila", // Female (Doctor)
      reviewInfo: "3 reviews · 1 photo",
      date: "a year ago",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format", // Indian female doctor
      rating: 5,
      shortComment: "She is a very excellent teacher and explains the concept very well. My son is always exited to attend her classes...",
      fullComment: "She is a very excellent teacher and explains the concept very well. My son is always exited to attend her classes. She always maintains students in a participative learning environment. I have also received very good feedback from other parents also.",
      isGoogle: true,
    },
    {
      id: 3,
      name: "Kalpana Thulasiraman", // Female
      reviewInfo: "3 reviews",
      date: "a year ago",
      avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=150&fit=crop&crop=face&auto=format", // Indian female
      rating: 5,
      shortComment: "It's been many months since mam is teaching my daughter.and I have seen a vast improvement in my daughter...",
      fullComment: "It's been many months since mam is teaching my daughter.and I have seen a vast improvement in my daughter.my daughter also enjoys her teaching methods",
      isGoogle: true,
    },
    {
      id: 4,
      name: "Dr.Mraju SB", // Male (Doctor)
      reviewInfo: "6 reviews · 10 photos",
      date: "a year ago",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format", // Indian male doctor
      rating: 5,
      shortComment: "Kidzian is one of the best institute to learn coding and other related subjects from the founder Ms. Rashmi who has vast experience...",
      fullComment: "Kidzian is one of the best institute to learn coding and other related subjects from the founder Ms. Rashmi who has vast experience in software programing and development and teaching the children with hands on experience so that children can learn wit dedication please admit your children too and encourage neighbors and friends to admit their wards too",
      isGoogle: true,
    },
    {
      id: 5,
      name: "Priya Sharma", // Female
      reviewInfo: "5 reviews · 2 photos",
      date: "2 months ago",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format", // Indian female
      rating: 5,
      shortComment: "Amazing experience with Kidzian! My daughter has learned so much about programming and logical thinking...",
      fullComment: "Amazing experience with Kidzian! My daughter has learned so much about programming and logical thinking. The teachers are very patient and explain concepts in a way that children can easily understand. Highly recommended for parents looking for quality coding education.",
      isGoogle: true,
    },
    {
      id: 6,
      name: "Rajesh Kumar", // Male
      reviewInfo: "4 reviews",
      date: "3 months ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format", // Indian male
      rating: 5,
      shortComment: "Excellent teaching methodology and very supportive staff. My son enjoys every class and has shown remarkable improvement...",
      fullComment: "Excellent teaching methodology and very supportive staff. My son enjoys every class and has shown remarkable improvement in his problem-solving abilities. The curriculum is well-structured and age-appropriate. Thank you Kidzian team!",
      isGoogle: true,
    },
    {
      id: 7,
      name: "Anita Desai", // Female
      reviewInfo: "2 reviews",
      date: "4 months ago",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format", // Indian female
      rating: 5,
      shortComment: "My daughter absolutely loves her coding classes at Kidzian. The teachers are very patient and encouraging...",
      fullComment: "My daughter absolutely loves her coding classes at Kidzian. The teachers are very patient and encouraging. She has gained so much confidence in problem-solving and logical thinking. The online platform is user-friendly and engaging for kids.",
      isGoogle: true,
    },
    {
      id: 8,
      name: "Vikram Singh", // Male
      reviewInfo: "7 reviews · 3 photos",
      date: "5 months ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format", // Indian male
      rating: 5,
      shortComment: "Outstanding coding program for kids! My son has developed excellent programming skills and logical reasoning...",
      fullComment: "Outstanding coding program for kids! My son has developed excellent programming skills and logical reasoning. The curriculum is well-designed and the instructors are highly qualified. I would definitely recommend Kidzian to other parents.",
      isGoogle: true,
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const toggleComment = (id, e) => {
    e.stopPropagation(); // Prevent card click when clicking Read more
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-teal-700 mb-4">
            Parents' Feedback
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            You don't have to take our word. See why children love us, and
            parents admire us.
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-gray-800">EXCELLENT</div>
            <div className="flex space-x-1 my-2">
              {renderStars(5)}
            </div>
            <div className="flex gap-1 ">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="40"
                  viewBox="0 0 272 92"
                  className="w-32"
                >
                  <path
                    fill="#EA4335"
                    d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
                  />
                  <path
                    fill="#4285F4"
                    d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
                  />
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
                  <path
                    fill="#EA4335"
                    d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
                  />
                  <path
                    fill="#4285F4"
                    d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
                  />
                </svg>
              </div>
              <div className="text-sm text-gray-600 mt-2">Based on 48 reviews</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="absolute left-0 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-12">
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                  onClick={() => window.open(googleReviewUrl, '_blank')}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={`${testimonial.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm hidden"
                        style={{ display: 'none' }}
                      >
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {testimonial.reviewInfo} · {testimonial.date}
                      </p>
                    </div>
                    {testimonial.isGoogle && (
                      <div className="ml-2 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex mb-2">
                    {renderStars(testimonial.rating)}
                    <svg
                      className="w-5 h-5 text-blue-500 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-2">
                    {expandedComments[testimonial.id] 
                      ? testimonial.fullComment 
                      : testimonial.shortComment}
                  </p>
                  <button 
                    className="text-blue-400 text-sm hover:underline focus:outline-none"
                    onClick={(e) => toggleComment(testimonial.id, e)}
                  >
                    {expandedComments[testimonial.id] ? "Read less" : "Read more"}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <div className="bg-teal-600 text-white text-xs px-3 py-1 rounded flex items-center">
            <span>Verified by Trustindex</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsFeedback;