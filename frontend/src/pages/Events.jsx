"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, MapPin, ExternalLink, Users, Trophy, Star } from 'lucide-react'
import { useNavigate } from "react-router-dom"

// Mock data for upcoming hackathons
const UPCOMING_HACKATHONS = [
  {
    id: 1,
    title: "TechHack 2025",
    description: "A 48-hour hackathon focusing on AI and Machine Learning solutions for real-world problems.",
    date: "2025-03-15",
    endDate: "2025-03-17",
    location: "Online",
    registrationUrl: "https://hackathons.hackclub.com/",
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    organizer: "HackClub",
    category: "AI & ML",
    participants: "500+",
    prizes: "₹1,10,000"
  },
  {
    id: 2,
    title: "CodeFest 2025",
    description: "Join this hackathon for Web Development and UX/UI design challenges.",
    date: "2025-04-10",
    endDate: "2025-04-12",
    location: "Bangalore, India",
    registrationUrl: "https://codefest2025.web.app/",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    organizer: "HackerEarth",
    category: "Web Development",
    participants: "300+",
    prizes: "₹90,000"
  },
  {
    id: 3,
    title: "EduHack 2025",
    description: "Developing innovative solutions for education technology and student engagement.",
    date: "2025-04-25",
    endDate: "2025-04-27",
    location: "Mumbai, India",
    registrationUrl: "https://www.eduhack.org/",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    organizer: "Unstop",
    category: "Education",
    participants: "400+",
    prizes: "₹1,00,000"
  },
  {
    id: 4,
    title: "HealthTech Hack 2025",
    description: "Creating solutions for healthcare challenges using cutting-edge technology.",
    date: "2025-05-15",
    endDate: "2025-05-17",
    location: "Delhi, India",
    registrationUrl: "https://devfolio.co/healthtechhack2025",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzM2FdtbommrhU74qZsgSEn15uDYbntmsEkw&s",
    organizer: "Devfolio",
    category: "Healthcare",
    participants: "350+",
    prizes: "₹25,000"
  },
  {
    id: 5,
    title: "SmartCity Hack 2025",
    description: "Building smart solutions for urban challenges and sustainable development.",
    date: "2025-06-20",
    endDate: "2025-06-22",
    location: "Hyderabad, India",
    registrationUrl: "https://mlh.io/events/smartcityhack2025",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    organizer: "Major League Hacking",
    category: "Smart Cities",
    participants: "600+",
    prizes: "₹10,000"
  },
  {
    id: 6,
    title: "FinTech Innovation 2025",
    description: "Revolutionizing financial services through innovative technology solutions.",
    date: "2025-07-10",
    endDate: "2025-07-12",
    location: "Pune, India",
    registrationUrl: "https://hackathon.io/events/fintechinnovation2025",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    organizer: "Hackathon.io",
    category: "FinTech",
    participants: "450+",
    prizes: "₹50,000"
  }
]

// Mock data for past successful events
const PAST_EVENTS = [
  {
    id: 1,
    title: "CodeStorm 2024",
    description: "Successfully concluded with 800+ participants from across India",
    date: "2024-11-15",
    location: "Chennai, India",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    participants: "800+",
    projects: "150+",
    winner: "Team InnovateTech"
  },
  {
    id: 2,
    title: "AI Challenge 2024",
    description: "Amazing AI solutions developed by talented students nationwide",
    date: "2024-10-20",
    location: "Bangalore, India",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    participants: "650+",
    projects: "120+",
    winner: "Team AI Pioneers"
  },
  {
    id: 3,
    title: "WebDev Fest 2024",
    description: "Outstanding web applications created in just 48 hours",
    date: "2024-09-25",
    location: "Mumbai, India",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    participants: "500+",
    projects: "95+",
    winner: "Team WebWizards"
  }
]

const CATEGORIES = ["All", "AI & ML", "Web Development", "Education", "Healthcare", "Smart Cities", "FinTech"]

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHackathons, setFilteredHackathons] = useState(UPCOMING_HACKATHONS)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("upcoming")
const navigate = useNavigate();
  // Filter hackathons based on search term and category
  useEffect(() => {
    let filtered = [...UPCOMING_HACKATHONS]

    if (searchTerm) {
      filtered = filtered.filter(
        (hackathon) =>
          hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hackathon.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((hackathon) => hackathon.category === selectedCategory)
    }

    setFilteredHackathons(filtered)
  }, [searchTerm, selectedCategory])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRegister = (registrationUrl) => {
    window.open(registrationUrl, "_blank", "noopener,noreferrer")
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Amazing <span className="text-teal-700">Hackathons</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join exciting coding competitions, build innovative solutions, and connect with talented developers from across India
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-teal-500">
            <div className="text-3xl font-bold text-teal-700 mb-2">20+</div>
            <div className="text-gray-600">Active Events</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-700 mb-2">2K+</div>
            <div className="text-gray-600">Participants</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-700 mb-2">₹5L+</div>
            <div className="text-gray-600">Total Prizes</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-700 mb-2">50+</div>
            <div className="text-gray-600">Success Stories</div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-lg shadow-md">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "upcoming"
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-600 hover:text-teal-700"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === "past"
                  ? "bg-teal-700 text-white shadow-md"
                  : "text-gray-600 hover:text-teal-700"
              }`}
            >
              Successful Events
            </button>
          </div>
        </div>

        {activeTab === "upcoming" && (
          <>
            {/* Search and Filter Section */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search hackathons by name, description, or category..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-teal-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Hackathons Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {filteredHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hackathon.imageUrl || "/placeholder.svg"}
                      alt={hackathon.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {hackathon.category}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      {hackathon.prizes}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{hackathon.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hackathon.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(hackathon.date)} - {formatDate(hackathon.endDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{hackathon.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{hackathon.participants} Expected</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {hackathon.organizer}</span>
                      <button
                        onClick={() => handleRegister(hackathon.registrationUrl)}
                        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                      >
                        Register
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredHackathons.length === 0 && (
              <motion.div
                className="bg-white rounded-xl p-12 text-center shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hackathons found</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </motion.div>
            )}
          </>
        )}

        {activeTab === "past" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Success Stories</h2>
              <p className="text-lg text-gray-600">
                Celebrating the amazing achievements of our hackathon community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAST_EVENTS.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.participants} Participants</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Projects Submitted:</span>
                        <span className="font-semibold text-teal-700">{event.projects}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Winner:</span>
                        <span className="font-semibold text-gray-800 flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {event.winner}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-xl p-8 mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students and developers who have already participated in our hackathons. 
            Build amazing projects, learn new skills, and win exciting prizes!
          </p>
          <button className="bg-white text-teal-700 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg"     onClick={() => navigate("/contact-us")}>
          JOIN US
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Events
