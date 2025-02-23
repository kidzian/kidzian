import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const AdminLogin = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    address: "",
    age: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup
   
      ? `${import.meta.env.VITE_API_URL}/api/admin/signup`
      : `${import.meta.env.VITE_API_URL}/api/admin/login`;

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
       
        // Store admin info in localStorage or state
        localStorage.setItem("admin", JSON.stringify(data));

        // Redirect to dashboard and pass admin info
        navigate("/admin-dashboard", { state: { admin: data } });
      } else {
        alert((isSignup ? "Signup" : "Login") + " failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          {isSignup ? "Admin Signup" : "Admin Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">Phone Number:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}
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
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsSignup(!isSignup)} className="text-blue-600 hover:underline ml-1">
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
