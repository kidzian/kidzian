import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Download, ExternalLink, BookOpen, Code, Brain, Trophy, Rocket, Globe, Heart, Laptop, Target, Users } from 'lucide-react';
import Header from '../components/Heading';
import Footer from '../components/Footer';
import award from "../assets/Rashmi Raju.jpg"
import Manaswin from "../assets/ManaswinL .jpg"
import Daiwik from "../assets/Daiwik.jpg"
import Suresh from "../assets/Sunaina suresh.jpg"
import Dhyan from "../assets/Dhyan .jpg"
import jaipreet from "../assets/Jaipreet.jpg"
import Brisha from "../assets/Brisha.jpg"

const SuccessStories = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            {...fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
              Inspiring Success Stories
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Discover how our students are revolutionizing the tech world and achieving their dreams through innovation and dedication.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-teal-300" />
                <span className="text-lg">500+ Success Stories</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-teal-300" />
                <span className="text-lg">Global Impact</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-teal-300" />
                <span className="text-lg">100% Achievement Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Founder's Achievement Section */}
        <motion.section 
          className="mb-20"
          {...fadeInUp}
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <Award className="w-8 h-8 text-teal-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Founder's Achievement</h2>
                </div>
                <div className="relative group">
                  <img 
                    src={award}
                    alt="Rashmi Raju - Femmetimes Award" 
                    className="rounded-2xl shadow-lg w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-teal-700 mb-4">Rashmi Raju</h3>
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
                    <p className="text-xl font-semibold text-teal-800 mb-2">
                      Most Inspiring Young Woman Educationist - 2025
                    </p>
                    <p className="text-teal-600">Awarded by Femmetimes</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  As the visionary founder of Kidzian, Rashmi Raju has revolutionized tech education for young minds. 
                  Her innovative approach combines cutting-edge technology with engaging learning methods, creating a 
                  new generation of tech-savvy innovators.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-teal-100">
                    <Star className="w-6 h-6 text-yellow-500 mb-2" />
                    <h4 className="font-semibold text-gray-800 mb-1">Impact</h4>
                    <p className="text-gray-600">10,000+ Students Mentored</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-teal-100">
                    <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
                    <h4 className="font-semibold text-gray-800 mb-1">Recognition</h4>
                    <p className="text-gray-600">15+ International Awards</p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                  <BookOpen className="w-5 h-5" />
                  Read Full Story
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Success Story */}
        <motion.section 
          className="mb-20"
          {...fadeInUp}
        >
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-xl overflow-hidden text-white">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <Rocket className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">Featured Success</h2>
                </div>
                <img 
                  src={Manaswin}
                  alt="Manaswin L" 
                  className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Manaswin L</h3>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="w-6 h-6" />
                    <span className="text-xl font-semibold">App Development Prodigy</span>
                  </div>
                  <p className="text-lg leading-relaxed">
                    At just 15, Manaswin has already made his mark in the tech world with his innovative 
                    "Guess the Number" game, achieving remarkable success on the Google Play Store.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                    <Download className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">Downloads</h4>
                    <p className="text-2xl font-bold">1,000+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                    <Star className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">Rating</h4>
                    <p className="text-2xl font-bold">4.8/5</p>
                  </div>
                </div>

                <a 
                  href="https://play.google.com/store/apps/details?id=com.manaswin.guessthenumber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  View on Play Store
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Success Stories Grid */}
        <motion.section 
          className="space-y-12"
          {...fadeInUp}
        >
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">More Success Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brisha */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={Brisha}
                  alt="Brisha" 
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm">
                  Age 8
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Brisha</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-teal-600" />
                  <span className="text-teal-600 font-semibold">Junior Coding Champion</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Our youngest coding prodigy, mastering complex programming concepts and inspiring 
                  peers with her exceptional problem-solving abilities.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Joined 2024</span>
                  <button className="text-teal-600 hover:text-teal-700">Read More →</button>
                </div>
              </div>
            </div>

            {/* Daiwik */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={Daiwik}
                  alt="Daiwik" 
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Age 12
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Daiwik</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Laptop className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-semibold">Web Development Expert</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Created an award-winning educational website that helps students learn mathematics 
                  through interactive games and visualizations.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Joined 2023</span>
                  <button className="text-blue-600 hover:text-blue-700">Read More →</button>
                </div>
              </div>
            </div>

            {/* Sunaina */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={Suresh}
                  alt="Sunaina" 
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                  Age 14
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sunaina</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-600 font-semibold">AI Enthusiast</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Developed an AI-powered health monitoring system that won first place at the 
                  National Young Innovators Challenge.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Joined 2024</span>
                  <button className="text-purple-600 hover:text-purple-700">Read More →</button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="mt-20"
          {...fadeInUp}
        >
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Success Story Today</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join our community of young innovators and begin your journey towards becoming the next tech leader.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors">
                Enroll Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default SuccessStories;