import { useState } from "react";

export default function AuthModal({ isModalOpen, closeModal }) {
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    grade: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? "Signing Up..." : "Logging In...", formData);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[40vw] text-center">
          {/* Toggle between Sign Up and Login */}
          <div className="flex justify-between mb-4 border-b pb-2">
            <button
              onClick={() => setIsSignUp(false)}
              className={`w-1/2 py-2 ${!isSignUp ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`w-1/2 py-2 ${isSignUp ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                  required
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              required
            />
            {isSignUp && (
              <>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="grade"
                  placeholder="Grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  required
                />
              </>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="mt-3 text-red-500 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}
