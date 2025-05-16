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
import { Link } from "react-router-dom"
import { Award, Download, Star, Trophy, ChevronRight, ExternalLink, Code, Brain, Rocket, Heart , BookOpen } from "lucide-react"


import { motion } from 'framer-motion';


// Importing the images
import award from "../assets/Rashmi Raju.jpg"
import Manaswin from "../assets/ManaswinL .jpg"
import Daiwik from "../assets/Daiwik.jpg"
import Suresh from "../assets/Sunaina suresh.jpg"
import Dhyan from "../assets/Dhyan .jpg"
import jaipreet from "../assets/Jaipreet.jpg"
import Brisha from "../assets/Brisha.jpg"

const SuccessStories = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">Success Stories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrating the achievements of our outstanding students who are making a difference through technology and
            innovation.
          </p>
        </div>

        {/* Founder Section */}
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

               
              </div>
            </div>
          </div>
        </motion.section>
        

         {/* Featured Success */}
         <motion.section 
          className="mb-20"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="bg-[#28826a] rounded-3xl shadow-xl overflow-hidden text-white">
            <div className="grid md:grid-cols-2 gap-8 p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <Rocket className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">Featured Success</h2>
                </div>
                <img 
                  src="/src/assets/ManaswinL .jpg"
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

                <div className="flex gap-4">
                  <a 
                    href="https://play.google.com/store/apps/developer?id=Kidzians"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-[#28826a] px-6 py-3 rounded-lg hover:bg-[#28826a]/10 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View on Play Store
                  </a>
                  <button
                  
                    className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Other Success Stories - Improved for Large Screens */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Star className="text-teal-700 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-teal-700">More Success Stories</h2>
            </div>
            <Link to="/all-stories" className="text-teal-700 hover:text-teal-800 flex items-center">
              View all stories
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daiwik */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-2/5 p-4">
                <div className="rounded-lg overflow-hidden h-full shadow-sm">
                  <img
                    src={Daiwik || "/placeholder.svg"}
                    alt="Daiwik"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Daiwik</h3>
                    <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Age 12</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Code className="text-teal-700 mr-2" size={16} />
                    <p className="text-teal-700 font-medium">Coding Enthusiast </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Exceptional academic performance with top grades in Coding Languages and problem-solving. Daiwik's
                    dedication to learning has made him stand out among his peers.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Joined 2023</span>
                  <button className="text-teal-700 hover:text-teal-800 flex items-center text-sm font-medium">
                    Read more <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sunaina Suresh */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-2/5 p-4">
                <div className="rounded-lg overflow-hidden h-full shadow-sm">
                  <img
                    src={Suresh || "/placeholder.svg"}
                    alt="Sunaina Suresh"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Sunaina Suresh</h3>
                    <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Age 14</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Brain className="text-teal-700 mr-2" size={16} />
                    <p className="text-teal-700 font-medium">Python Programming</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sunaina secured first place in a CodeBlaze Python coding competition, showcasing her exceptional programming skills.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Joined 2022</span>
                  <button className="text-teal-700 hover:text-teal-800 flex items-center text-sm font-medium">
                    Read more <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dhyan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-2/5 p-4">
                <div className="rounded-lg overflow-hidden h-full shadow-sm">
                  <img
                    src={Dhyan || "/placeholder.svg"}
                    alt="Dhyan"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Dhyan</h3>
                    <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Age 13</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Rocket className="text-teal-700 mr-2" size={16} />
                    <p className="text-teal-700 font-medium">Competitive Programmer</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Won multiple coding competitions at national level. Dhyan's algorithmic thinking and problem-solving
                    skills have earned him top positions in several prestigious competitions.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Joined 2023</span>
                  <button className="text-teal-700 hover:text-teal-800 flex items-center text-sm font-medium">
                    Read more <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Jaipreet */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-2/5 p-4">
                <div className="rounded-lg overflow-hidden h-full shadow-sm">
                  <img
                    src={jaipreet || "/placeholder.svg"}
                    alt="Jaipreet"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Jaipreet</h3>
                    <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Age 15</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <ExternalLink className="text-teal-700 mr-2" size={16} />
                    <p className="text-teal-700 font-medium">Science Enthusiast</p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Developed an innovative science project that won state-level recognition. Jaipreet's passion for
                    science and innovation led to the creation of a project that addresses real-world problems.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Joined 2022</span>
                  <button className="text-teal-700 hover:text-teal-800 flex items-center text-sm font-medium">
                    Read more <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Success Stories - Horizontal Layout */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4">More Inspiring Students</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Brisha */}
              <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={Brisha || "/placeholder.svg"}
                    alt="Brisha"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Brisha</h4>
                  <div className="flex items-center">
                    <Heart className="text-teal-700 mr-1" size={12} />
                    <p className="text-sm text-teal-700">Creative Designer</p>
                  </div>
                </div>
              </div>

              {/* Additional placeholder students */}
              <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img src={Manaswin} alt="Student" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Manswin L</h4>
                  <div className="flex items-center">
                    <Code className="text-teal-700 mr-1" size={12} />
                    <p className="text-sm text-teal-700">App Developer</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img src={jaipreet} alt="Student" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">JaiPreet</h4>
                  <div className="flex items-center">
                    <Brain className="text-teal-700 mr-1" size={12} />
                    <p className="text-sm text-teal-700">Science Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/about"
                className="inline-flex items-center text-teal-700 hover:text-teal-800 font-medium"
              >
                View all students
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Success Story Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join our community of young innovators and begin your journey towards becoming the next tech leader.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-white text-teal-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessStories
