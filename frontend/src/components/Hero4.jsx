import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import hero4 from "../assets/hero4.png"

const Hero4 = () => {
  const navigate = useNavigate()
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      console.error("Error submitting the form:", error)
      toast.error("Failed to book a demo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[110vh] pb-4 flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-cyan-200 via-red-100 to-cyan-200">
      <div className="sm:w-full md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw] gap-8 md:pt-32 lg:pt-32 xl:pt-32 2xl:pt-32 sm:pt-0 flex flex-col items-center justify-center md:pl-12 lg:pl-12 xl:pl-12 2xl:pl-12">
        {/* Heading Section */}
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          className="text-4xl md:text-5xl lg:text-5xl xl:text-[47px] 2xl:text-5xl font-extrabold mt-10 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 ml-8"
        >
          <h1>
            Empowering <span className="text-[#3a84f6]">Young Minds</span>
          </h1>

          <h1 className="mt-1">
            <span className="text-[#3a84f6]">With</span> Future-Ready <span className="text-[#3a84f6]">Skills</span>
          </h1>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col gap-2 ml-8 mt-2 mb-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
            <p className="text-gray-700">Expert-led interactive classes</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
            <p className="text-gray-700">Project-based learning approach</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
            <p className="text-gray-700">Personalized learning path</p>
          </div>
        </motion.div>

        {/* Primary CTA Button */}
        <motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.7, duration: 0.5 }}
  className="w-full flex justify-center mb-6"
>
  <button
    onClick={() => setShowModal(true)}
    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg w-fit max-w-[90%]"
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      <Sparkles className="h-5 w-5" />
      START YOUR FREE TRIAL 
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </span>
    <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
  </button>
</motion.div>


        {/* Grade Selection Buttons */}
        <div className="flex flex-col items-center lg:-mt-3 justify-center gap-6 md:pr-8 lg:pr-8 xl:pr-8 2xl:pr-8">
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="font-bold text-gray-600">Choose your grade</h1>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.button
                  key={i + 1}
                  onClick={() => handleGradeSelect(i + 1)}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeInOut" },
                  }}
                  className={`${
                    selectedGrade === i + 1 ? "bg-blue-500" : "bg-gray-700"
                  } text-white w-[4rem] h-[4rem] rounded-2xl shadow-lg flex items-center justify-center text-lg font-semibold`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
         

          {/* Secondary CTA Buttons */}
          <div className="flex gap-6">
            <motion.button
              onClick={() => navigate("/courses")}
              className="bg-gray-700 text-white rounded-md shadow-md h-12 w-40 flex items-center justify-center transform transition-transform hover:scale-105"
            >
              View all courses
            </motion.button>
          </div>
        </div>
        
      </div>

      {/* Hero Image */}
      <motion.div
        className="sm:w-full md:w-[50vw] lg:w-[50vw] xl:w-[50vw] 2xl:w-[50vw] flex items-center justify-center md:h-auto lg:h-auto xl:h-auto 2xl:h-auto sm:h-[80vh] xl:pb-16 md:pb-16 lg:pb-16 2xl:pb-16 sm:pb-0 sm:pt-10 md:pt-0 lg:pt-0 xl:pt-0 2xl:pt-0 sm:mt-10 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 order-first md:order-last"
        initial={{ x: "100vw" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <img src={hero4 || "/placeholder.svg"} className="max-w-full h-auto" alt="Students learning coding" />
      </motion.div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white p-6 rounded-xl shadow-2xl w-[90vw] max-w-[400px] max-h-[90vh] overflow-y-auto relative"
          >
            <div className="sticky top-0 bg-white pt-8 pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Book Your Free Trial Class
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  <ArrowRight className="h-5 w-5 rotate-45" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Select a course
                  </option>
                  <option value="Little Innovators">Little Innovators</option>
                  <option value="Junior Innovators">Junior Innovators</option>
                  <option value="Senior Innovators">Senior Innovators</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Web Development Course">Web Development Course</option>
                  <option value="App Development Course (Junior)">App Development Course (Junior)</option>
                  <option value="App Development Course (Senior)">App Development Course (Senior)</option>
                  <option value="Java Course">Java Course</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Grade</label>
                <select
                  name="grade"
                  value={selectedGrade || ""}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
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

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Booking Your Trial...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      BOOK MY FREE TRIAL NOW
                    </span>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">No credit card required. Cancel anytime.</p>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default Hero4