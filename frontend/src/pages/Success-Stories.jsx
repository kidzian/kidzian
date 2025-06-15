
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Download, Star, Trophy, ExternalLink, Code, Rocket, ArrowRight, Users, Sparkles, ChevronLeft, ChevronRight, BookOpen, Target, Zap } from 'lucide-react'

// Import images (you'll need to add these to your assets folder)
import manaswin from "../assets/ManaswinL .jpg"
import rashmi from "../assets/Rashmi Raju.jpg"
import sunaina from "../assets/Sunaina suresh.jpg"
import jaipeet from "../assets/Jaipreet.jpg"
import dhyan from "../assets/Dhyan .jpg"
import dhaiwik from "../assets/Daiwik.jpg"
import brish from "../assets/Brisha.jpg"

const SuccessStories = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentSlide, setCurrentSlide] = useState(0)

  // Student data
  const students = [
    {
      name: "Daiwik",
      age: 12,
      category: "coding",
      title: "Coding Enthusiast",
      description:
        "Exceptional academic performance with top grades in Coding Languages and problem-solving. Daiwik's dedication to learning has made him stand out among his peers.",
      achievement: "Top performer in Python fundamentals",
      joinedYear: 2023,
      image: dhaiwik,
      skills: ["Python", "Problem Solving", "Algorithms"],
    },
    {
      name: "Sunaina Suresh",
      age: 14,
      category: "coding",
      title: "Python Programming Champion",
      description:
        "Sunaina secured first place in a CodeBlaze Python coding competition, showcasing her exceptional programming skills and innovative thinking.",
      achievement: "1st Place - CodeBlaze Python Competition",
      joinedYear: 2022,
      image: sunaina,
      skills: ["Python", "Competitive Programming", "Data Structures"],
    },
    {
      name: "Dhyan",
      age: 13,
      category: "coding",
      title: "Competitive Programmer",
      description:
        "Won multiple coding competitions at national level. Dhyan's algorithmic thinking and problem-solving skills have earned him top positions.",
      achievement: "National Level Coding Competition Winner",
      joinedYear: 2023,
      image: dhyan,
      skills: ["Algorithms", "Data Structures", "Competitive Programming"],
    },
   
  ]

  // Filter students based on category
  const filteredStudents = students.filter((student) => activeCategory === "all" || student.category === activeCategory)

  // Auto-advance carousel (update the useEffect)
  useEffect(() => {
    const maxSlides = Math.ceil(filteredStudents.length / 3)
    if (maxSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === maxSlides - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [filteredStudents.length])

  const nextSlide = () => {
    const maxSlides = Math.ceil(filteredStudents.length / 3)
    setCurrentSlide((prev) => (prev === maxSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    const maxSlides = Math.ceil(filteredStudents.length / 3)
    setCurrentSlide((prev) => (prev === 0 ? maxSlides - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 dark:from-teal-800 dark:via-teal-900 dark:to-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10 dark:opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Inspiring Success Stories</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Celebrating Our
              <span className="block text-yellow-300 dark:text-yellow-400">Champions</span>
            </h1>
            <p className="text-xl text-teal-100 dark:text-teal-200 max-w-2xl mx-auto">
              Discover how our students and founders are shaping the future through innovation, dedication, and
              excellence in technology and education.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full px-4 py-2 mb-4">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-medium">Founder's Achievement</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Visionary Leadership</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the inspiring founder who is revolutionizing education and empowering the next generation of
              innovators.
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-800 dark:to-teal-700 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="text-white space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Rashmi Raju</h3>
                  <p className="text-teal-100 dark:text-teal-200 text-lg">Founder & CEO, Kidzian</p>
                </div>

                <div className="bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-5 backdrop-blur-lg rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-8 h-8 text-yellow-300 dark:text-yellow-400 mr-3" />
                    <div>
                      <h4 className="text-xl font-bold">Most Inspiring Young Woman Educationist</h4>
                      <p className="text-teal-100 dark:text-teal-200">Femmetimes Award 2025</p>
                    </div>
                  </div>
                  <p className="text-white text-opacity-90">
                    Recognized for revolutionary contributions to tech education and empowering young minds through
                    innovative learning methodologies.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-5 rounded-xl p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-yellow-300 dark:text-yellow-400" />
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-teal-100 dark:text-teal-200 text-sm">Students Mentored</div>
                  </div>
                  <div className="bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-5 rounded-xl p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2 text-yellow-300 dark:text-yellow-400" />
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-teal-100 dark:text-teal-200 text-sm">Awards Received</div>
                  </div>
                </div>

                <p className="text-white text-opacity-90 leading-relaxed">
                  "Education is not just about teaching; it's about inspiring young minds to dream big and providing
                  them with the tools to turn those dreams into reality. Every child has the potential to be
                  extraordinary."
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20 blur-xl transform rotate-3"></div>
                <div className="relative">
                  <img
                    src={rashmi || "/placeholder.svg"}
                    alt="Rashmi Raju"
                    className="w-full h-96 object-cover object-center rounded-2xl shadow-xl border-4 border-white border-opacity-20"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm font-medium">Femmetimes Award Ceremony 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manaswin L Featured Story */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-4 py-2 mb-4">
              <Rocket className="w-5 h-5 mr-2" />
              <span className="font-medium">Featured Success Story</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Rising Star Developer</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover how a young innovator turned passion into success with groundbreaking app development.
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border dark:border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10"></div>
                <img
                  src={manaswin || "/placeholder.svg"}
                  alt="Manaswin L"
                  className="w-full h-96 object-contain object-center p-4 transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-xl p-4 shadow-lg border dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Manaswin L</h3>
                    <p className="text-gray-600 dark:text-gray-300">Age 15 • App Developer</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rising Tech Star</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">App Development Prodigy</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    At just 15 years old, Manaswin has already made his mark in the tech world with his innovative
                    "Guess the Number" game, achieving remarkable success on the Google Play Store.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
                    <Download className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">1,000+</div>
                    <div className="text-green-600 dark:text-green-400 text-sm">Downloads</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 text-center border border-yellow-200 dark:border-yellow-700">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">4.8/5</div>
                    <div className="text-yellow-600 dark:text-yellow-400 text-sm">Rating</div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3">Key Achievements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <Code className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                      Published app on Google Play Store
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <Target className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                      1000+ active users within first month
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <Zap className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                      Featured in local tech community
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-teal-700 dark:bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Play Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border-2 border-teal-700 dark:border-teal-600 text-teal-700 dark:text-teal-400 px-6 py-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download App
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full px-4 py-2 mb-4">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-medium">Student Achievements</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Our Amazing Students</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the brilliant minds who are excelling in coding, science, and design, setting new standards of
              excellence.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex border dark:border-gray-700">
              {["all", "coding", "science", "design"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeCategory === category
                      ? "bg-teal-700 dark:bg-teal-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Students Carousel - 3 Cards at a Time */}
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(filteredStudents.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                      {filteredStudents.slice(slideIndex * 3, slideIndex * 3 + 3).map((student, index) => (
                        <motion.div
                          key={student.name}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border dark:border-gray-700"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="grid md:grid-cols-1 gap-6">
                            <div className="relative">
                              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4">
                                <img
                                  src={student.image || "/placeholder.svg"}
                                  alt={student.name}
                                  className="w-full h-80 object-contain object-center rounded-lg transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                              <div className="absolute top-6 right-6 bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md border dark:border-gray-700">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Age {student.age}</span>
                              </div>
                            </div>

                            <div className="p-6 space-y-6">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{student.name}</h3>
                                <p className="text-teal-700 dark:text-teal-400 font-medium text-lg">{student.title}</p>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{student.description}</p>

                              <div className="bg-teal-50 dark:bg-teal-900/30 rounded-xl p-4 border border-teal-200 dark:border-teal-700">
                                <div className="flex items-center mb-2">
                                  <Trophy className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                                  <span className="font-medium text-teal-800 dark:text-teal-300">Key Achievement</span>
                                </div>
                                <p className="text-teal-700 dark:text-teal-400">{student.achievement}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Skills & Expertise</h4>
                                <div className="flex flex-wrap gap-2">
                                  {student.skills.map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Joined {student.joinedYear}</span>
                                <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                                  <Star className="w-4 h-4 mr-1 fill-current" />
                                  <span className="text-sm font-medium">Top Performer</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation for 3-card carousel */}
            {filteredStudents.length > 3 && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={prevSlide}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 border dark:border-gray-700"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: Math.ceil(filteredStudents.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlide === index ? "bg-teal-700 dark:bg-teal-400" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 border dark:border-gray-700"
                  disabled={currentSlide >= Math.ceil(filteredStudents.length / 3) - 1}
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-800 dark:to-teal-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-3xl mx-auto text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-teal-100 dark:text-teal-200 mb-8">
              Join our community of young innovators and start your journey towards becoming the next tech leader. Our
              expert mentors and cutting-edge curriculum will help you unlock your full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center bg-white text-teal-700 dark:text-teal-800 px-8 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors font-medium text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/courses"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-teal-700 dark:hover:text-teal-800 transition-colors font-medium text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Courses
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SuccessStories
