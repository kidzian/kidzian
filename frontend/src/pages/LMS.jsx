"use client"

import { useState, useEffect } from "react"
import Heading from "../components/Heading"
import Footer from "../components/Footer"
import axios from "axios"
import Cookies from "js-cookie"
import UserInfo from "../components/UserInfo"
import ReCAPTCHA from "react-google-recaptcha"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const LMS = () => {
  const [isTokenPresent, setIsTokenPresent] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [errors, setErrors] = useState({})
  const [selectedRole, setSelectedRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  })

  const fetchUserInfo = async () => {
    const token = Cookies.get("jwt")
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserInfo(response.data)
        setIsTokenPresent(true)
      } catch (error) {
        console.error("Error fetching user info:", error)
        setIsTokenPresent(false)
        Cookies.remove("jwt")
      }
    } else {
      setIsTokenPresent(false)
    }
  }

  useEffect(() => {
    const token = Cookies.get("jwt")
    if (token) {
      fetchUserInfo()
    } else {
      setIsModalOpen(true)
    }
  }, [])

  const validateForm = () => {
    const formErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      formErrors.email = "Invalid email format"
    }
    if (formData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters"
    }
    if (!captchaVerified) {
      formErrors.captcha = "Please verify you are not a robot"
    }
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleRoleChange = (role) => {
    setSelectedRole(role)
    setFormData((prevData) => ({ ...prevData, role }))
  }

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`

    try {
      const response = await axios.post(apiUrl, {
        ...formData,
        role: selectedRole,
      })

      if (response.status === 200) {
        Cookies.set("jwt", response.data.token, { expires: 7 })
        Cookies.set("role", selectedRole, { expires: 7 })
        setIsModalOpen(false)
        setFormData({ email: "", password: "", role: "student" })
        await fetchUserInfo()
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong! Please try again."
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className={`${isTokenPresent ? "" : "filter blur-sm pointer-events-none"} p-4`}>
        <Heading />
        <div className="flex flex-col items-center">
          <UserInfo userInfo={userInfo} />
        </div>
        <Footer />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to LMS</h2>

            {/* Role Selection Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleRoleChange("student")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedRole === "student" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleChange("teacher")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedRole === "teacher" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Teacher
              </button>
              <button
                onClick={() => handleRoleChange("admin")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedRole === "admin" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Admin
              </button>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your actual site key
                  onChange={handleCaptchaChange}
                />
              </div>
              {errors.captcha && <p className="text-red-500 text-sm text-center">{errors.captcha}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading
                  ? "Logging in..."
                  : `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
              </button>

              <div className="text-center mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LMS
