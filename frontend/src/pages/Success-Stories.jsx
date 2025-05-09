import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, ArrowRight, GraduationCap, Code, Brain, Medal, Award, Users, Clock, Target } from 'lucide-react';

const SuccessStories = () => {
  const navigate = useNavigate();

  const achievements = [
    {
      title: "National Coding Olympiad Winner",
      student: "Aditya Sharma",
      age: 12,
      description: "Created an AI-powered educational game that adapts to student learning patterns",
      image: "https://images.pexels.com/photos/5427654/pexels-photo-5427654.jpeg",
      achievement: "Gold Medal",
      category: "Competition"
    },
    {
      title: "Innovation Challenge Winner",
      student: "Riya Patel",
      age: 15,
      description: "Developed a mobile app for environmental conservation tracking",
      image: "https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg",
      achievement: "First Prize",
      category: "Innovation"
    },
    {
      title: "Tech for Good Award",
      student: "Kabir Singh",
      age: 13,
      description: "Created a platform connecting students with learning disabilities to specialized tutors",
      image: "https://images.pexels.com/photos/8363104/pexels-photo-8363104.jpeg",
      achievement: "Winner",
      category: "Social Impact"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "25,000+",
      label: "Active Students",
      description: "Learning and growing with us"
    },
    {
      icon: Trophy,
      value: "1,000+",
      label: "Competition Wins",
      description: "National & international awards"
    },
    {
      icon: Target,
      value: "150+",
      label: "Success Stories",
      description: "Students achieving their dreams"
    },
    {
      icon: Clock,
      value: "98%",
      label: "Completion Rate",
      description: "Students finishing their courses"
    }
  ];

  const testimonials = [
    {
      name: "Zara Khan",
      age: 14,
      image: "https://images.pexels.com/photos/3755642/pexels-photo-3755642.jpeg",
      quote: "The mentorship and guidance I received helped me win the National Science Fair",
      role: "AI Enthusiast"
    },
    {
      name: "Dev Mehta",
      age: 16,
      image: "https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg",
      quote: "From knowing nothing about coding to developing my own apps - this journey has been incredible",
      role: "App Developer"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#1E40AF]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Success Stories
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover how our students are transforming their passion for technology into remarkable achievements
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-white border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-4xl font-bold text-blue-900 mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</p>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative h-48">
                  <img 
                    src={achievement.image} 
                    alt={achievement.student} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">{achievement.achievement}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {achievement.category}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Age {achievement.age}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{achievement.description}</p>
                  <p className="text-blue-600 font-semibold">{achievement.student}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Student Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-blue-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">
            Ready to Start Your Success Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of young innovators and begin your journey to excellence
          </p>
          <motion.button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Courses <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;