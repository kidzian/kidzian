// import React from 'react';
// import { motion } from 'framer-motion';
// import { Award, Star, Download, ExternalLink, BookOpen, Code, Brain, Trophy, Rocket, Globe, Heart, Laptop, Target, Users } from 'lucide-react';
// // import Header from '../components/Heading';
// // import Footer from '../components/Footer';
// // import award from "../assets/Rashmi Raju.jpg"
// // import Manaswin from "../assets/ManaswinL .jpg"
// // import Daiwik from "../assets/Daiwik.jpg"
// // import Suresh from "../assets/Sunaina suresh.jpg"
// // import Dhyan from "../assets/Dhyan .jpg"
// // import jaipreet from "../assets/Jaipreet.jpg"
// // import Brisha from "../assets/Brisha.jpg"

// const SuccessStories = () => {
  // const fadeInUp = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.6 }
  // };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Hero Section with Animated Background */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-blue-600 text-white">
//         <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10"></div>
//         <div className="container mx-auto px-4 py-20 relative z-10">
//           <motion.div 
//             className="text-center max-w-4xl mx-auto"
//             {...fadeInUp}
//           >
//             <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
//               Inspiring Success Stories
//             </h1>
//             <p className="text-xl text-teal-100 mb-8">
//               Discover how our students are revolutionizing the tech world and achieving their dreams through innovation and dedication.
//             </p>
//             <div className="flex justify-center gap-4 flex-wrap">
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
//                 <Users className="w-6 h-6 text-teal-300" />
//                 <span className="text-lg">500+ Success Stories</span>
//               </div>
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
//                 <Globe className="w-6 h-6 text-teal-300" />
//                 <span className="text-lg">Global Impact</span>
//               </div>
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex items-center gap-3">
//                 <Target className="w-6 h-6 text-teal-300" />
//                 <span className="text-lg">100% Achievement Rate</span>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <main className="container mx-auto px-4 py-12">
        // {/* Founder's Achievement Section */}
        // <motion.section 
        //   className="mb-20"
        //   {...fadeInUp}
        // >
        //   <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-teal-100">
        //     <div className="grid md:grid-cols-2 gap-8 p-12">
        //       <div className="space-y-8">
        //         <div className="flex items-center gap-4">
        //           <div className="bg-teal-100 p-3 rounded-full">
        //             <Award className="w-8 h-8 text-teal-600" />
        //           </div>
        //           <h2 className="text-3xl font-bold text-gray-800">Founder's Achievement</h2>
        //         </div>
        //         <div className="relative group">
        //           <img 
        //             src={award}
        //             alt="Rashmi Raju - Femmetimes Award" 
        //             className="rounded-2xl shadow-lg w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        //           />
        //           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        //         </div>
        //       </div>
              
        //       <div className="space-y-8">
        //         <div>
        //           <h3 className="text-2xl font-bold text-teal-700 mb-4">Rashmi Raju</h3>
        //           <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
        //             <p className="text-xl font-semibold text-teal-800 mb-2">
        //               Most Inspiring Young Woman Educationist - 2025
        //             </p>
        //             <p className="text-teal-600">Awarded by Femmetimes</p>
        //           </div>
        //         </div>
                
        //         <p className="text-gray-600 text-lg leading-relaxed">
        //           As the visionary founder of Kidzian, Rashmi Raju has revolutionized tech education for young minds. 
        //           Her innovative approach combines cutting-edge technology with engaging learning methods, creating a 
        //           new generation of tech-savvy innovators.
        //         </p>

        //         <div className="grid grid-cols-2 gap-4">
        //           <div className="bg-white p-4 rounded-xl shadow-md border border-teal-100">
        //             <Star className="w-6 h-6 text-yellow-500 mb-2" />
        //             <h4 className="font-semibold text-gray-800 mb-1">Impact</h4>
        //             <p className="text-gray-600">10,000+ Students Mentored</p>
        //           </div>
        //           <div className="bg-white p-4 rounded-xl shadow-md border border-teal-100">
        //             <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
        //             <h4 className="font-semibold text-gray-800 mb-1">Recognition</h4>
        //             <p className="text-gray-600">15+ International Awards</p>
        //           </div>
        //         </div>

        //         <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
        //           <BookOpen className="w-5 h-5" />
        //           Read Full Story
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </motion.section>

//         {/* Featured Success Story */}
//         <motion.section 
//           className="mb-20"
//           {...fadeInUp}
//         >
//           <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl shadow-xl overflow-hidden text-white">
//             <div className="grid md:grid-cols-2 gap-8 p-12">
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 mb-8">
//                   <Rocket className="w-8 h-8" />
//                   <h2 className="text-3xl font-bold">Featured Success</h2>
//                 </div>
//                 <img 
//                   src={Manaswin}
//                   alt="Manaswin L" 
//                   className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
//                 />
//               </div>
              
//               <div className="space-y-6">
//                 <h3 className="text-3xl font-bold">Manaswin L</h3>
//                 <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <Code className="w-6 h-6" />
//                     <span className="text-xl font-semibold">App Development Prodigy</span>
//                   </div>
//                   <p className="text-lg leading-relaxed">
//                     At just 15, Manaswin has already made his mark in the tech world with his innovative 
//                     "Guess the Number" game, achieving remarkable success on the Google Play Store.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
//                     <Download className="w-6 h-6 mb-2" />
//                     <h4 className="font-semibold mb-1">Downloads</h4>
//                     <p className="text-2xl font-bold">1,000+</p>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
//                     <Star className="w-6 h-6 mb-2" />
//                     <h4 className="font-semibold mb-1">Rating</h4>
//                     <p className="text-2xl font-bold">4.8/5</p>
//                   </div>
//                 </div>

//                 <a 
//                   href="https://play.google.com/store/apps/details?id=com.manaswin.guessthenumber"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
//                 >
//                   <ExternalLink className="w-5 h-5" />
//                   View on Play Store
//                 </a>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Success Stories Grid */}
//         <motion.section 
//           className="space-y-12"
//           {...fadeInUp}
//         >
//           <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">More Success Stories</h2>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {/* Brisha */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
//               <div className="relative">
//                 <img 
//                   src={Brisha}
//                   alt="Brisha" 
//                   className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm">
//                   Age 8
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">Brisha</h3>
//                 <div className="flex items-center gap-2 mb-4">
//                   <Brain className="w-5 h-5 text-teal-600" />
//                   <span className="text-teal-600 font-semibold">Junior Coding Champion</span>
//                 </div>
//                 <p className="text-gray-600 mb-6">
//                   Our youngest coding prodigy, mastering complex programming concepts and inspiring 
//                   peers with her exceptional problem-solving abilities.
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Joined 2024</span>
//                   <button className="text-teal-600 hover:text-teal-700">Read More →</button>
//                 </div>
//               </div>
//             </div>

//             {/* Daiwik */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
//               <div className="relative">
//                 <img 
//                   src={Daiwik}
//                   alt="Daiwik" 
//                   className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
//                   Age 12
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">Daiwik</h3>
//                 <div className="flex items-center gap-2 mb-4">
//                   <Laptop className="w-5 h-5 text-blue-600" />
//                   <span className="text-blue-600 font-semibold">Web Development Expert</span>
//                 </div>
//                 <p className="text-gray-600 mb-6">
//                   Created an award-winning educational website that helps students learn mathematics 
//                   through interactive games and visualizations.
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Joined 2023</span>
//                   <button className="text-blue-600 hover:text-blue-700">Read More →</button>
//                 </div>
//               </div>
//             </div>

//             {/* Sunaina */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
//               <div className="relative">
//                 <img 
//                   src={Suresh}
//                   alt="Sunaina" 
//                   className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
//                   Age 14
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">Sunaina</h3>
//                 <div className="flex items-center gap-2 mb-4">
//                   <Heart className="w-5 h-5 text-purple-600" />
//                   <span className="text-purple-600 font-semibold">AI Enthusiast</span>
//                 </div>
//                 <p className="text-gray-600 mb-6">
//                   Developed an AI-powered health monitoring system that won first place at the 
//                   National Young Innovators Challenge.
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Joined 2024</span>
//                   <button className="text-purple-600 hover:text-purple-700">Read More →</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Call to Action */}
//         <motion.section 
//           className="mt-20"
//           {...fadeInUp}
//         >
//           <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 text-white text-center">
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Success Story Today</h2>
//             <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
//               Join our community of young innovators and begin your journey towards becoming the next tech leader.
//             </p>
//             <div className="flex justify-center gap-4 flex-wrap">
//               <button className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors">
//                 Enroll Now
//               </button>
//               <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </motion.section>
//       </main>
//     </div>
//   );
// };

// export default SuccessStories;
"use client"

"use client"

import { useState, useRef, useEffect } from "react"

import manaswin from "../assets/ManaswinL .jpg"
import rashmi from "../assets/Rashmi Raju.jpg"
import Sunaina from "../assets/Sunaina suresh.jpg"
import Jaipeet from "../assets/Jaipreet.jpg"
import Dhyan from "../assets/Dhyan .jpg"
import Dhaiwik from "../assets/Daiwik.jpg"
import Brish from "../assets/Brisha.jpg"
import {
  Award,
  Download,
  Star,
  Trophy,
  ChevronRight,
  ExternalLink,
  Code,
  Brain,
  Rocket,
  Heart,
  ArrowRight,
  Users,
  Sparkles,
  Lightbulb,
  ChevronLeft,
  X,
} from "lucide-react"

const SuccessStories = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [showAllStories, setShowAllStories] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [topCurrentSlide, setTopCurrentSlide] = useState(0)
  const carouselRef = useRef(null)
  const topCarouselRef = useRef(null)

  // Animation classes
  const fadeIn = "animate-[fadeIn_1s_ease-in-out]"
  const slideUp = "animate-[slideUp_0.5s_ease-out]"
  const slideRight = "animate-[slideRight_0.5s_ease-out]"
  const pulse = "animate-[pulse_2s_infinite]"

  // Student data
  const students = [
    {
      name: "Daiwik",
      age: 12,
      category: "coding",
      icon: <Code className="text-emerald-600 mr-2" size={16} />,
      title: "Coding Enthusiast",
      description:
        "Exceptional academic performance with top grades in Coding Languages and problem-solving. Daiwik's dedication to learning has made him stand out among his peers.",
      joinedYear: 2023,
      image: Dhaiwik,
    },
    {
      name: "Sunaina Suresh",
      age: 14,
      category: "coding",
      icon: <Brain className="text-emerald-600 mr-2" size={16} />,
      title: "Python Programming",
      description:
        "Sunaina secured first place in a CodeBlaze Python coding competition, showcasing her exceptional programming skills.",
      joinedYear: 2022,
      image: Sunaina,
    },
    {
      name: "Dhyan",
      age: 13,
      category: "coding",
      icon: <Rocket className="text-emerald-600 mr-2" size={16} />,
      title: "Competitive Programmer",
      description:
        "Won multiple coding competitions at national level. Dhyan's algorithmic thinking and problem-solving skills have earned him top positions in several prestigious competitions.",
      joinedYear: 2023,
      image: Dhyan,
    },
    {
      name: "Jaipreet",
      age: 15,
      category: "science",
      icon: <Lightbulb className="text-emerald-600 mr-2" size={16} />,
      title: "Science Enthusiast",
      description:
        "Developed an innovative science project that won state-level recognition. Jaipreet's passion for science and innovation led to the creation of a project that addresses real-world problems.",
      joinedYear: 2022,
      image: Jaipeet,
    },
    {
      name: "Brisha",
      age: 14,
      category: "science",
      icon: <Heart className="text-emerald-600 mr-2" size={16} />,
      title: "Creative Designer",
      description:
        "Brisha has shown exceptional talent in creative design, combining artistic skills with technical knowledge to create stunning digital art and UI designs.",
      joinedYear: 2023,
      image: Brish,
    },
  ]

  // Filter students based on active tab
  const filteredStudents = students.filter((student) => activeTab === "all" || student.category === activeTab)

  // Top 3 students to display prominently
  const topStudents = filteredStudents.slice(0, 3)

  // Remaining students for carousel
  const remainingStudents = filteredStudents.slice(3)

  // Handle carousel navigation for top students
  const nextTopSlide = () => {
    if (topStudents.length <= 1) return
    setTopCurrentSlide((prev) => (prev === topStudents.length - 1 ? 0 : prev + 1))
  }

  const prevTopSlide = () => {
    if (topStudents.length <= 1) return
    setTopCurrentSlide((prev) => (prev === 0 ? topStudents.length - 1 : prev - 1))
  }

  // Handle carousel navigation for remaining students
  const nextSlide = () => {
    if (remainingStudents.length <= 2) return
    setCurrentSlide((prev) => (prev === remainingStudents.length - 2 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (remainingStudents.length <= 2) return
    setCurrentSlide((prev) => (prev === 0 ? remainingStudents.length - 2 : prev - 1))
  }

  // Auto-advance carousel for top students
  useEffect(() => {
    const interval = setInterval(() => {
      if (topStudents.length > 1) {
        nextTopSlide()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [topStudents.length])

  // Auto-advance carousel for remaining students
  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingStudents.length > 2) {
        nextSlide()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [remainingStudents.length])

  // Render student card
  const renderStudentCard = (student, index, isCarousel = false) => {
    const animationDelay = `delay-[${index * 150}ms]`

    return (
      <div
        key={student.name}
        className={`${!isCarousel ? slideUp : ""} ${animationDelay} ${
          activeTab !== "all" && activeTab !== student.category ? "hidden" : ""
        }`}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-emerald-200 border border-slate-100 group">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img
              src={student.image || "/placeholder.svg"}
              alt={student.name}
              className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Age {student.age}
              </span>
            </div>
            <div className="flex items-center mt-1 mb-3">
              {student.icon}
              <p className="text-emerald-600 font-medium">{student.title}</p>
            </div>
            <p className="text-slate-600 mb-4">{student.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-slate-500 text-sm">Joined {student.joinedYear}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section with Backdrop */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(20,132,121,0.12),transparent)]" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className={`inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ${fadeIn}`}
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>Inspiring the next generation</span>
            </div>
            {/* Title with backdrop */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-emerald-300/30 via-teal-300/30 to-emerald-300/30 rounded-full transform scale-150"></div>
              <h1
                className={`text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 ${slideUp} relative z-10`}
              >
                Success Stories
              </h1>
            </div>
            <p className={`max-w-[700px] text-slate-600 md:text-xl/relaxed ${slideUp}`}>
              Celebrating the extraordinary achievements of our students who are shaping the future through technology
              and innovation.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        {/* Founder's Achievement Section */}
        <section className={`mb-24 ${fadeIn}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className={`bg-emerald-100 p-2.5 rounded-full ${pulse}`}>
              <Award className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Founder's Achievement</h2>
            <div className="flex-grow hidden md:block">
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="space-y-8 order-2 md:order-1">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-700 mb-4">Rashmi Raju</h3>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 transform transition-transform duration-500 hover:scale-[1.02]">
                    <p className="text-xl font-semibold text-emerald-800 mb-2">
                      Most Inspiring Young Woman Educationist - 2025
                    </p>
                    <p className="text-emerald-600">Awarded by Femmetimes</p>
                  </div>
                </div>

                <p className="text-slate-600 text-lg leading-relaxed">
                  As the visionary founder of Kidzian, Rashmi Raju has revolutionized tech education for young minds.
                  Her innovative approach combines cutting-edge technology with engaging learning methods, creating a
                  new generation of tech-savvy innovators.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 hover:border-emerald-200 transition-colors hover:shadow-lg">
                    <Star className="w-6 h-6 text-amber-500 mb-2" />
                    <h4 className="font-semibold text-slate-800 mb-1">Impact</h4>
                    <p className="text-slate-600">10,000+ Students Mentored</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 hover:border-emerald-200 transition-colors hover:shadow-lg">
                    <Trophy className="w-6 h-6 text-amber-500 mb-2" />
                    <h4 className="font-semibold text-slate-800 mb-1">Recognition</h4>
                    <p className="text-slate-600">15+ International Awards</p>
                  </div>
                </div>
              </div>

              <div className="relative group order-1 md:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl opacity-20 blur-xl transform -translate-y-4 translate-x-4"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-lg border-4 border-white">
                  <img
                    src={rashmi || "/placeholder.svg"}
                    alt="Rashmi Raju - Femmetimes Award"
                    className="w-full h-[500px] object-contain object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Success - Manaswin L */}
        <section className={`mb-24 ${fadeIn}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className={`bg-emerald-100 p-2.5 rounded-full ${pulse}`}>
              <Rocket className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Featured Success</h2>
            <div className="flex-grow hidden md:block">
              <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 to-teal-600 rounded-3xl shadow-xl overflow-hidden text-white transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Manaswin L</h3>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="w-6 h-6" />
                    <span className="text-xl font-semibold">App Development Prodigy</span>
                  </div>
                  <p className="text-lg leading-relaxed">
                    At just 15, Manaswin has already made his mark in the tech world with his innovative "Guess the
                    Number" game, achieving remarkable success on the Google Play Store.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/15 transition-colors duration-300">
                    <Download className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">Downloads</h4>
                    <p className="text-2xl font-bold">1,000+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/15 transition-colors duration-300">
                    <Star className="w-6 h-6 mb-2" />
                    <h4 className="font-semibold mb-1">Rating</h4>
                    <p className="text-2xl font-bold">4.8/5</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors font-medium group"
                  >
                    <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    View on Play Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium group"
                  >
                    <Download /> Dowanload App
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl transform translate-y-4 -translate-x-4"></div>
                <div className="relative overflow-hidden rounded-2xl border-4 border-white/20">
                  <img
                    src={manaswin || "/placeholder.svg"}
                    alt="Manaswin L"
                    className="w-full h-[500px] object-contain object-center transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-900/80 to-transparent p-6">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                      App Developer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Success Stories */}
        <section className={`mb-24 ${fadeIn}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className={`bg-emerald-100 p-2.5 rounded-full ${pulse}`}>
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Student Success Stories</h2>
            </div>
            <div className="w-full md:w-auto">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-700">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
                    activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
                    activeTab === "coding" ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveTab("coding")}
                >
                  Coding
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${
                    activeTab === "science"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  onClick={() => setActiveTab("science")}
                >
                  Science
                </button>
              </div>
            </div>
          </div>

          {/* Top Students Single Card Carousel */}
          <div className="relative mb-12">
            <div className="max-w-md mx-auto">
              {/* Single card container with fixed width to maintain card size */}
              <div className="overflow-hidden">
                <div
                  ref={topCarouselRef}
                  className="transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${topCurrentSlide * 100}%)` }}
                >
                  <div className="flex">
                    {topStudents.map((student, index) => (
                      <div key={student.name} className="w-full flex-shrink-0">
                        {renderStudentCard(student, index)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              {topStudents.length > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={prevTopSlide}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="flex gap-2 items-center">
                    {topStudents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setTopCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          topCurrentSlide === index ? "bg-emerald-600" : "bg-emerald-200"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTopSlide}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Carousel for Remaining Students */}
          {remainingStudents.length > 0 && (
            <div className="relative mt-12 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <Star className="text-emerald-600 mr-2" size={18} />
                More Success Stories
              </h3>

              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / remainingStudents.length)}%)` }}
              >
                {remainingStudents.map((student, index) => (
                  <div key={student.name} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                    {renderStudentCard(student, index, true)}
                  </div>
                ))}
              </div>

              {remainingStudents.length > 2 && (
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-2 items-center">
                    {remainingStudents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          currentSlide === index ? "bg-emerald-600" : "bg-emerald-200"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View All / Show Less Toggle */}
          {filteredStudents.length > 3 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllStories(!showAllStories)}
                className={`inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 group ${slideRight}`}
              >
                {showAllStories ? (
                  <>
                    Show Less
                    <X className="ml-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                  </>
                ) : (
                  <>
                    View All Success Stories
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* All Stories (Shown when View All is clicked) */}
          {showAllStories && (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 ${fadeIn}`}>
              {filteredStudents.map((student, index) => renderStudentCard(student, index))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className={fadeIn}>
          <div className="relative overflow-hidden rounded-3xl transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] mix-blend-overlay opacity-20"></div>
            <div className="relative px-6 py-16 md:py-24 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Success Story Today</h2>
              <p className="mb-8 max-w-2xl mx-auto text-white/90 text-lg">
                Join our community of young innovators and begin your journey towards becoming the next tech leader. Our
                expert mentors and cutting-edge curriculum will help you unlock your full potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-emerald-700 shadow-sm hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center rounded-md border-2 border-white bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
                >
                  Explore Courses
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SuccessStories
