



"use client"

import { useState, useEffect } from "react"
import { Gamepad2, Laptop, Code, Award, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { toast } from "react-toastify"

const Service = () => {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const cardData = [
    {
      title: "Learn from Industry Experts",
      paragraph: "Gain knowledge from industry experts with real-world experience.",
      image: <Award className="h-16 w-16 text-orange-500" />,
      buttonText: "Book a Free Demo",
      color: "from-orange-400 to-orange-600",
      hoverColor: "group-hover:from-orange-500 group-hover:to-orange-700",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Learn at Your Own Speed And Pace",
      paragraph: "Learn at your own pace with our flexible self-paced programs.",
      image: <Laptop className="h-16 w-16 text-blue-500" />,
      buttonText: "View Courses",
      redirectLink: "/courses",
      color: "from-blue-400 to-blue-600",
      hoverColor: "group-hover:from-blue-500 group-hover:to-blue-700",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Learn the Latest Technology",
      paragraph: "Stay updated by learning the latest technology trends and tools.",
      image: <Code className="h-16 w-16 text-green-500" />,
      buttonText: "Explore Now",
      redirectLink: "/courses",
      color: "from-green-400 to-green-600",
      hoverColor: "group-hover:from-green-500 group-hover:to-green-700",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Learn with a Gamified Approach",
      paragraph:
        "Experience interactive and project-based learning that keeps kids engaged and excited about technology!",
      image: <Gamepad2 className="h-16 w-16 text-purple-500" />,
      buttonText: "Enroll Now",
      color: "from-purple-400 to-purple-600",
      hoverColor: "group-hover:from-purple-500 group-hover:to-purple-700",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      setHasScrolled(scrollPosition > windowHeight / 1.4)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleModalOpen = () => setShowModal(true)
  const handleModalClose = () => setShowModal(false)

  const handleCardClick = (buttonText) => {
    if (buttonText === "Enroll Now" || buttonText === "Book a Free Demo") {
      handleModalOpen()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const dataToSend = { ...formData, grade: selectedGrade }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/submit-form`, dataToSend, {
        withCredentials: true,
      })
      if (response.status === 200) {
        toast.success("Demo booked successfully!")
        setShowModal(false)
        setFormData({ name: "", phone: "", course: "", email: "" })
        setSelectedGrade(null)
      }
    } catch (error) {
      toast.error("Failed to book a demo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center gap-16 p-6 md:p-16 pt-[16vh] pb-[16vh] transition-colors duration-300">
      {/* Section Title */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
        <motion.h1
          className="text-3xl md:text-5xl font-bold bg-clip-text text-teal-600 dark:text-teal-400 transition-colors duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Kidzian?
        </motion.h1>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-base md:text-xl leading-relaxed transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Empowering kids aged 7–17 through fun, gamified coding experiences.
        </motion.p>
      </div>

      {/* Service Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl"
        initial={{ opacity: 0, y: 50 }}
        animate={hasScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, type: "spring", staggerChildren: 0.1 }}
      >
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            className="group bg-white dark:bg-gray-800 h-auto rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer border border-gray-100 dark:border-gray-700"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
          >
            <div className={`${card.iconBg} p-4 rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300`}>
              {card.image}
            </div>
            <h2 className="text-gray-800 dark:text-white text-xl font-bold mb-3 transition-colors duration-300">
              {card.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow transition-colors duration-300">
              {card.paragraph}
            </p>
            <a href={card.redirectLink} onClick={() => handleCardClick(card.buttonText)} className="mt-auto w-full">
              <button
                className={`w-full bg-gradient-to-r ${card.color} ${card.hoverColor} text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
              >
                {card.buttonText}
              </button>
            </a>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[90vw] mt-2 max-w-md overflow-hidden border dark:border-gray-700 transition-colors duration-300"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-teal-700 dark:bg-teal-600 p-6 flex justify-between items-center transition-colors duration-300">
                <h2 className="text-2xl font-bold mt-3 text-white">Book a Free Demo</h2>
                <button
                  onClick={handleModalClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-300"
                >
                  <X className="mt-3" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {["name", "phone", "email"].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize transition-colors duration-300">
                      {field
                        .replace("email", "Email Address")
                        .replace("name", "Full Name")
                        .replace("phone", "Phone Number")}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300"
                      placeholder={`Enter your ${field}`}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Course
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 bg-white transition-colors duration-300"
                    required
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {[
                      "Little Innovators",
                      "Junior Innovators",
                      "Senior Innovators",
                      "Artificial Intelligence",
                      "Web Development Course",
                      "App Development Course (Junior)",
                      "App Development Course (Senior)",
                      "Java Course",
                    ].map((course, idx) => (
                      <option key={idx} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Grade
                  </label>
                  <select
                    value={selectedGrade || ""}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 bg-white transition-colors duration-300"
                    required
                  >
                    <option value="" disabled>
                      Select a grade
                    </option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-700 dark:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? "Booking..." : "Book Demo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Service
