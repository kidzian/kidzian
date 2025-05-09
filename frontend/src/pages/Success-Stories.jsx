import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Star, ArrowRight, GraduationCap, Code, Brain, Medal, Award } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';

const SuccessStories = () => {
  const navigate =useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleClick = () => {
    navigate("/courses");
  };
  const achievements = [
    {
      title: "Junior Coding Championship",
      student: "Aditya Sharma",
      age: 12,
      description: "Created an educational game teaching environmental awareness using Scratch and Python",
      image: "https://images.pexels.com/photos/5427654/pexels-photo-5427654.jpeg",
      achievement: "Gold Medal",
      category: "Competition"
    },
    {
      title: "Young App Developer Award",
      student: "Riya Patel",
      age: 15,
      description: "Developed a mobile app helping students track and reduce their screen time",
      image: "https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg",
      achievement: "First Prize",
      category: "Innovation"
    },
    {
      title: "Code for Change Challenge",
      student: "Kabir Singh",
      age: 13,
      description: "Built a website helping local food banks connect with donors",
      image: "https://images.pexels.com/photos/8363104/pexels-photo-8363104.jpeg",
      achievement: "Winner",
      category: "Social Impact"
    }
  ];

  const featuredStories = [
    {
      name: "Zara Khan",
      age: 9,
      journey: "From Beginner to Game Developer",
      image: "https://images.pexels.com/photos/3755642/pexels-photo-3755642.jpeg",
      story: "Started with no coding experience and now creates educational games that her whole school plays!",
      achievements: [
        "Created 3 Educational Games",
        "School Coding Club Leader",
        "Featured in Kids Tech Magazine"
      ]
    },
    {
      name: "Dev Mehta",
      age: 11,
      journey: "Robotics & Coding Enthusiast",
      image: "https://images.pexels.com/photos/8364026/pexels-photo-8364026.jpeg",
      story: "Combines his love for robotics and coding to create smart solutions for his community",
      achievements: [
        "Built a Smart Recycling Bot",
        "District Science Fair Winner",
        "Youngest Robotics Club Mentor"
      ]
    }
  ];

  const stats = [
    { icon: Trophy, value: "1000+", label: "Competition Winners" },
    { icon: GraduationCap, value: "25,000+", label: "Student Graduates" },
    { icon: Code, value: "150,000+", label: "Projects Created" },
    { icon: Brain, value: "100+", label: "Student Innovations" }
  ];

  const learningPaths = [
    {
      title: "Game Development",
      description: "Create your own games using Scratch and Python",
      icon: "🎮",
      age: "8-12 years"
    },
    {
      title: "Web Development",
      description: "Build websites with HTML, CSS & JavaScript",
      icon: "🌐",
      age: "10-14 years"
    },
    {
      title: "App Development",
      description: "Design mobile apps that solve real problems",
      icon: "📱",
      age: "12-17 years"
    },
    {
      title: "AI & Robotics",
      description: "Explore artificial intelligence and robotics",
      icon: "🤖",
      age: "13-17 years"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Young Innovators Gallery
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Celebrating the amazing achievements of our young tech wizards
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Learning Paths to Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPaths.map((path, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{path.icon}</div>
                <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {path.age}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative">
                  <img 
                    src={achievement.image} 
                    alt={achievement.student} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {achievement.achievement}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {achievement.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      {achievement.student}, {achievement.age} years
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredStories.map((story, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{story.name}</h3>
                      <span className="text-gray-500">({story.age} years)</span>
                    </div>
                    <p className="text-blue-600 font-medium mb-4">{story.journey}</p>
                    <p className="text-gray-600 mb-4">{story.story}</p>
                    <ul className="space-y-2">
                      {story.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <Medal className="w-5 h-5 text-yellow-500 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Coding Adventure Today!
          </h2>
          <p className="text-xl mb-8">
            Join our community of young innovators and begin your journey to becoming a tech wizard
          </p>
          <motion.button
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto hover:bg-blue-50 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
          >
            Begin Your Journey <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;