"use client"

import { useState } from "react"
import Heading from "../components/Heading"
import { LinkedinIcon, Send, Phone, MapPin, Clock, Mail, CheckCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import Footer from "../components/Footer"

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // For phone number, only allow digits and limit to 10
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prevData) => ({ ...prevData, [name]: numericValue }))

      // Clear phone error when user starts typing
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: "" }))
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }))

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors below!")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Message sent successfully!")
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" })
        setErrors({})
      } else {
        toast.error("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      content: "+91-9599-860-105",
      description: "Mon-Fri from 8am to 5pm",
      link: "tel:+919599860105",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@kidzians.com",
      description: "We'll respond within 24 hours",
      link: "mailto:info@kidzians.com",
    },
    {
      icon: LinkedinIcon,
      title: "LinkedIn",
      content: "Message us on LinkedIn",
      description: "Connect with our team",
      link: "https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Bangalore, India",
      description: "Come say hello at our office",
      link: "#map",
    },
  ]

  const features = [
    "Expert-led interactive classes",
    "Project-based learning approach",
    "Personalized learning paths",
    "24/7 support available",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Heading />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 dark:from-teal-800 dark:via-teal-700 dark:to-cyan-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-teal-100 dark:text-teal-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            We're here to help your child unlock their potential through coding. Chat with our friendly team 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-delay-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <CheckCircle className="w-5 h-5 text-teal-200 mr-2" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center group hover:scale-105 border border-teal-100 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{info.title}</h3>
              <p className="text-teal-600 dark:text-teal-400 font-medium mb-1">{info.content}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10 border border-teal-100 dark:border-gray-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Send us a message</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Ready to start your child's coding journey? Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    onChange={handleChange}
                    value={formData.firstName}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.firstName
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    onChange={handleChange}
                    value={formData.lastName}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.lastName
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  onChange={handleChange}
                  value={formData.email}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  onChange={handleChange}
                  value={formData.phone}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.phone
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  maxLength="10"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                {formData.phone && formData.phone.length < 10 && !errors.phone && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{formData.phone.length}/10 digits</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help you..."
                  rows="5"
                  onChange={handleChange}
                  value={formData.message}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.message
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl border border-teal-100 dark:border-teal-700">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-2" />
                <h3 className="font-semibold text-gray-800 dark:text-white">Response Time</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please
                call us directly.
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-teal-100 dark:border-gray-700">
              <div className="p-6 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 text-white">
                <h3 className="text-2xl font-bold mb-2">Visit Our Office</h3>
                <p className="text-teal-100 dark:text-teal-200">
                  Come and meet our team in person. We'd love to show you around and discuss how we can help your child
                  succeed.
                </p>
              </div>
              <div className="h-96 lg:h-[500px]" id="map">
                <iframe
                  title="Google Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31103.368066902996!2d77.751342!3d12.976904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0f89479856cd%3A0x96ea16cfc43a695!2sKidzian%20Pvt%20Ltd!5e0!3m2!1sen!2us!4v1736935942056!5m2!1sen!2us"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter hover:saturate-110 transition-all duration-300"
                />
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-teal-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Why Choose Kidzian?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Expert Instructors</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Founded by senior researcher from IIT Delhi with years of experience in tech education.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Proven Results</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Thousands of students have successfully learned coding and built amazing projects with us.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Flexible Learning</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Online and offline classes available to fit your schedule and learning preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default Contact
