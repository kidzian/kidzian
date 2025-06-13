"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CheckCircle, X } from "lucide-react"

export default function Hero4() {
  const [showModal, setShowModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
  })
  const [errors, setErrors] = useState({})

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // For phone number, only allow digits and limit to 10
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: numericValue }))

      // Clear phone error when user starts typing
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: "" }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear specific field error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    }

    // Real-time email validation
    if (name === "email" && value) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }))
      } else {
        setErrors((prev) => ({ ...prev, email: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) return

  setLoading(true)

  try {
    const response = await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        course: formData.course,
        grade: selectedGrade,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong")
    }

    alert("Trial session booked successfully!")
    setShowModal(false)
    setFormData({ name: "", phone: "", email: "", course: "" })
    setSelectedGrade(null)
    setErrors({})
  } catch (error) {
    console.error(error)
    alert("Failed to book trial session. Please try again.")
  } finally {
    setLoading(false)
  }
}


  return (
    <section className="w-full min-h-[90vh] py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-8 md:pr-8 md:ml-20 ">
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              className="space-y-2"
            >
              <h2 className="text-lg font-medium text-gray-700">
                After-school program for young coders and innovators.
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-teal-600">
                Unlock your child's potential, <br />
                With Power Of Coding
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-700 space-y-6"
            >
              <p className="text-lg">
                At Kidzian, through our engaging, world-class curriculum built on the latest technology and innovation,
                we empower young minds to think, create, and lead. Prepare them for the future with cutting-edge courses
                that build real-world tech skills from an early age.
              </p>

              <div className="space-y-1">
                <p className="font-medium -mt-2 ">Founded by Senior Researcher from IIT Delhi</p>
                <p className="font-medium">For ages 7–17 years</p>
              </div>

              <div className="space-y-3 ">
                {[
                  "Expert-led interactive classes",
                  "Project-based learning approach",
                  "Personalized learning paths for every child",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2 -mt-2"
                  >
                    <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                    <p>{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#f4a024] hover:bg-[#e6951f] -mt-2 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300 animate-blink"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Request a Trial Session
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
            className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center relative"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <img
                src="https://img.freepik.com/free-photo/content-teacher-checking-task-standing-pupil_74855-9761.jpg?t=st=1747046864~exp=1747050464~hmac=d8810c8a3d4ac7d74b9704240fd954ea77c862223c430c24fafee92d94f6ab94&w=740"
                alt="Child learning STEM"
                className="rounded-lg object-cover w-full h-full shadow-xl"
              />

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -top-4 -left-4 w-16 h-16 bg-cyan-500 rounded-full opacity-20"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-5 -right-5 w-24 h-24 bg-teal-600 rounded-full opacity-20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-[425px] p-6 relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-teal-600 mb-6 mt-9 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Book Your Free Trial Class
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${
                    errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  required
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                {formData.phone && formData.phone.length < 10 && !errors.phone && (
                  <p className="text-gray-500 text-xs mt-1">{formData.phone.length}/10 digits</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                >
                  <option value="">Select a course</option>
                  <option value="little-innovators">Little Innovators</option>
                  <option value="junior-innovators">Junior Innovators</option>
                  <option value="senior-innovators">Senior Innovators</option>
                  <option value="ai">Artificial Intelligence</option>
                  <option value="web-dev">Web Development</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <select
                  name="grade"
                  value={selectedGrade || ""}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                >
                  <option value="">Select a grade</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Grade {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Booking Your Trial...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Book My Free Trial Now
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">No credit card required. Cancel anytime.</p>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  )
}
