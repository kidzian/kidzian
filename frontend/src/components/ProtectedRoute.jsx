"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import axios from "axios"

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setIsAuthenticated(true)
        setUserRole(response.data.role)
      } catch (error) {
        console.error("Authentication verification failed:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/lms" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />
    } else if (userRole === "teacher") {
      return <Navigate to="/teacher-dashboard" replace />
    } else if (userRole === "student") {
      return <Navigate to="/student-dashboard" replace />
    } else {
      return <Navigate to="/lms" replace />
    }
  }

  return children
}
