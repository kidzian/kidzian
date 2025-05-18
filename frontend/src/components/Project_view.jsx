import React from "react";
import { useNavigate } from "react-router-dom";
import GuessNumber from "../assets/GuessNumber.jpg"
import Akshath from "../assets/QuizAkshat.jpg"
import shreya from "../assets/shreya.jpg"
import anaya from "../assets/Anaya.jpg"

export default function ProjectView() {
  const navigate = useNavigate();
  
  const handleViewMoreProjects = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
       <div className="font-semibold flex items-center text-teal-700 mb-3 -mt-6 text-3xl justify-center"> Featured Projects by Kidzian's </div>
        <div className="max-w-6xl mx-auto">
          {/* Featured Project Card */}
          <div className="bg-teal-700 rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="md:flex items-start">
              {/* App Screenshots */}
              <div className="md:w-2/5 p-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={GuessNumber}
                    alt="Guess the Number App" 
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full px-4 py-2 text-sm font-bold shadow-lg">
                    1000+ Downloads
                  </div>
                </div>
              </div>
              
              {/* App Details */}
              <div className="md:w-3/5 p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <span className="text-white text-2xl font-bold">GN</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Guess the Number</h1>
                    <p className="text-white text-lg">by Manaswin L</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-3 text-white font-medium">4.8 (120 reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Games</span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Educational</span>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Kids</span>
                  </div>
                </div>
                
                <p className="text-white text-lg leading-relaxed mb-8">
                  A fun and educational game developed by Kidzian student Manaswin L. Challenge yourself to guess the correct number within a limited number of attempts. Perfect for improving logical thinking and number skills.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://play.google.com/store/apps/developer?id=Kidzians" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-300 transform hover:scale-105"
                  >
                    Download App
                  </a>
                  <button 
                    onClick={handleViewMoreProjects}
                    className="px-8 py-3 bg-white border-2 border-green-700 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300 transform hover:scale-105"
                  >
                    View More Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Student Achievements */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Student Achievement Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">1000+ Downloads</h3>
                <p className="text-gray-600 leading-relaxed">Manaswin's app reached an impressive milestone with over 1000 downloads on Google Play Store.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Featured App</h3>
                <p className="text-gray-600 leading-relaxed">Selected as a featured educational app in the "Made by Students" category.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Coding Excellence</h3>
                <p className="text-gray-600 leading-relaxed">Demonstrates exceptional coding skills and problem-solving abilities for a student developer.</p>
              </div>
            </div>
          </div>
          
          {/* More Projects Preview */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">More Kidzian Projects</h2>
              <button 
                onClick={handleViewMoreProjects}
                className="text-teal-700 font-semibold hover:underline text-lg"
              >
                View All Projects
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {/* Project Preview Cards */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <img src={Akshath}/>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2"> Quiz Challenge</h3>
                  <p className="text-gray-600 text-sm mb-3">by Akshat</p>
                  <p className="text-gray-700 mb-4">A fun math quiz app with multiple difficulty levels and topics.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">500+ Downloads</span>
                    <button 
                      onClick={handleViewMoreProjects}
                      className="text-teal-700 font-medium hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <img src={shreya}/>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Simple Calculator</h3>
                  <p className="text-gray-600 text-sm mb-3">by Shreya</p>
                  <p className="text-gray-700 mb-4">Ease your Calculations by this app.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">750+ Downloads</span>
                    <button 
                      onClick={handleViewMoreProjects}
                      className="text-teal-700 font-medium hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <img src={anaya}/>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Rock Paper</h3>
                  <p className="text-gray-600 text-sm mb-3">by Aanya </p>
                  <p className="text-gray-700 mb-4">Rock Paper is a Fun Game .</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">300+ Downloads</span>
                    <button 
                      onClick={handleViewMoreProjects}
                      className="text-teal-700 font-medium hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}