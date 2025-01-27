import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Ensure you have this library installed

const LLL = () => {
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '',
    age: '',
    phoneNumber: '',
    grade: ''
  });

  useEffect(() => {
    // Check if the JWT token is present in the cookies
    const token = Cookies.get('jwt');
    if (token) {
      setIsTokenPresent(true);
    } else {
      setIsModalOpen(true); // Show modal if token is not present
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming the login/signup is successful for now
    Cookies.set('jwt', 'sample-jwt-token'); // Set JWT token in cookies
    setIsModalOpen(false);
    setIsTokenPresent(true);
  };

  return (
    <div>
      {/* Content section, apply blur if no token */}
      <div className={`${isTokenPresent ? '' : 'filter blur-sm pointer-events-none'} p-4`}>
        <h1 className="text-4xl font-bold text-center">Hyy</h1>
      </div>

      {/* Modal for login/signup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[40vw] text-center">
            <h2 className="text-xl font-semibold mb-4">Login / Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLL;
