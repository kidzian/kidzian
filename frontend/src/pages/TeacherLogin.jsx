import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const TeacherLogin = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `${import.meta.env.VITE_API_URL}/api/teacher/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Store teacher info in localStorage or state
        localStorage.setItem("teacher", JSON.stringify(data));

        // Redirect to teacher dashboard
        // navigate("/teacher-dashboard");
        
        navigate("/teacher-dashboard", { state: { teacher: data.teacher } });

    
    } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Teacher Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
