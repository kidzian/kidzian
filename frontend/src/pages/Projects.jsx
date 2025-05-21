"use client"
import GuessNumber from"../assets/GuessNumber.jpg"
import Japs from "../assets/Jaip.jpg"
import vihan from "../assets/Vihan.jpg"
import shreya from "../assets/shreya.jpg"
import emial from "../assets/emailsender.jpg"
import Anaya from "../assets/Anaya.jpg"
import Codin from "../assets/codi.jpg"
import Quiz from "../assets/QuizAkshat.jpg"
 

import { Link } from "react-router-dom";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Guess the Number",
      student: "Manaswin L",
      description: "A fun and educational game where players guess a number within a limited number of attempts.",
      category: "Games",
      downloads: "1000+",
      image: GuessNumber,
      icon: "GN",
      iconBg: "bg-blue-500",
      featured: true,
    },
    {
      id: 2,
      title: "Chameleon",
      student: "Vihan ",
      description: "I built this app Chameleon that Changes colors like a Chameleon.",
      category: "Fun",
      downloads: "500+",
      image: vihan,
      icon: "MQ",
      iconBg: "bg-purple-500",
    },
    {
      id: 3,
      title: "Rock Paper",
      student: "Aanya",
      description: "Built Rock Paper Scissor game by learning from Kidzians.",
      category: "Fun Games",
      downloads: "750+",
      image: Anaya,
      icon: "WP",
      iconBg: "bg-green-500",
    },
    {
      id: 4,
      title: "Quizr",
      student: "Akshat",
      description: "Evaluate your Knowledge by Quiz.",
      category: "Education",
      downloads: "300+",
      image: Quiz,
      icon: "SE",
      iconBg: "bg-red-500",
    },
    {
      id: 5,
      title: "Coding Basics",
      student: "Rohan M",
      description: "Learn programming fundamentals through interactive puzzles and challenges.",
      category: "Education",
      downloads: "450+",
      image: Codin,
      icon: "CB",
      iconBg: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Email Sender",
      student: "Shourya",
      description: "In this App you can fill the email address whom you want to send email, you also fill the subject and message. This app will open the default email app with the prefilled email details..",
      category: "Games",
      downloads: "600+",
      image: emial,
      icon: "MM",
      iconBg: "bg-pink-500",
    },
    {
      id: 7,
      title: "Volume Calculator",
      student: "Jaipreet",
      description: "This app can calculate volume Sphere, Cone, Cube and Cuboid. This can be very valuable for Maths Students.",
      category: "Education",
      downloads: "250+",
      image: Japs,
      icon: "GQ",
      iconBg: "bg-indigo-500",
    },
    
    {
      id: 9,
      title: "Simple Calculator",
      student: "Shreya",
      description: "Simple Calculator App which performs all basic arithmetic calculations.",
      category: "Games",
      downloads: "400+",
      image: shreya,
      icon: "PA",
      iconBg: "bg-orange-500",
    },
  ];

  const featuredProjects = projects.filter((project) => project.featured);
  const categories = [...new Set(projects.map((project) => project.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Kidzian Student Projects
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing apps created by young developers at Kidzian. Our students learn coding and bring their creative ideas to life.
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Projects</h2>
              <div className="grid grid-cols-1 gap-8">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg m-6">
                          <img
                            src={project.image}
                            alt={project.title}    
                            className="w-full h-auto object-cover rounded-2xl" 
                          />
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-full px-4 py-2 font-bold shadow-lg">
                          {project.downloads} Downloads
                        </div>
                      </div>

                      <div className="md:w-3/5 p-6 md:p-8">
                        <div className="flex items-center mb-4">
                          <div className={`w-16 h-16 ${project.iconBg} rounded-xl flex items-center justify-center mr-4 shadow-md`}>
                            <span className="text-white text-2xl font-bold">{project.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                            <p className="text-gray-600">by {project.student}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-gray-600">4.8 (120 reviews)</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {project.category}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              Featured
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Kids</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6">{project.description}</p>

                        <div className="flex flex-wrap gap-4">
                          <a
                            href="https://play.google.com/store/apps/developer?id=Kidzians"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md -mt-3 hover:bg-blue-700 transition duration-200"
                          >
                            Download App
                          </a>
                          <Link to={`/project/${project.id}`}>
                            <span className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-200 cursor-pointer">
                              View Details
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{category} Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter((project) => project.category === category && !project.featured)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                      <div className="relative">
                        <div className="h-48 bg-gray-200">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700 shadow-md">
                          {project.downloads}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 ${project.iconBg} rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                            <span className="text-white text-sm font-bold">{project.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                            <p className="text-gray-600 text-sm">by {project.student}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{project.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
       <div className="bg-teal-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Are You a Kidzian Student?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Learn coding and create your own apps like these amazing projects. Join Kidzian today and start your
              journey as a young developer!
            </p>
            <a
              href="/contact-us"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
            >
              Join Kidzian Program
            </a>
          </div>
    </div>
  );
}