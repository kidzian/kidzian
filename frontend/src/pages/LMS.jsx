import React, { useState, useEffect } from 'react';
import Heading from '../components/Heading';
import Footer from '../components/Footer';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserInfo from '../components/UserInfo';

const LMS = () => {
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Fetch user information using JWT token
  const fetchUserInfo = async () => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setUserInfo(response.data);
        setIsTokenPresent(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsTokenPresent(false);
      }
    } else {
      setIsTokenPresent(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      fetchUserInfo();
    } else {
      setIsModalOpen(true);
    }
  }, []);

  // Validation Function
  const validateForm = () => {
    let errors = {};
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`;  // Login API URL

    try {
      console.log('Logging in...');
      const response = await axios.post(apiUrl, {
        ...formData,
      });

      if (response.status === 200) {
        Cookies.set('jwt', response.data.token, { expires: 7 });
        setIsModalOpen(false);
        setFormData({
          email: '',
          password: '',
        });

        await fetchUserInfo();
        console.log(userInfo)
      }
    } catch (error) {
      console.error('Authentication failed:', error.response?.data?.message || error.message);

      // Show a user-friendly error message if it's available from the backend
      const errorMessage = error.response?.data?.message || 'Something went wrong! Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <div className={`${isTokenPresent ? '' : 'filter blur-sm pointer-events-none'} p-4`}>
        <Heading />
        <div className="flex flex-col items-center">
          <UserInfo userInfo={userInfo}/>
        </div>
        <Footer />
      </div>

      {/* Modal for login */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[40vw] text-center">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LMS;
