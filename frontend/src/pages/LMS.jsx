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

  const fetchUserInfo = async () => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`;

    try {
      const response = await axios.post(apiUrl, { ...formData });

      if (response.status === 200) {
        Cookies.set('jwt', response.data.token, { expires: 7 });
        setIsModalOpen(false);
        setFormData({ email: '', password: '' });

        await fetchUserInfo();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong! Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className={`${isTokenPresent ? '' : 'filter blur-sm pointer-events-none'} p-4`}>
        <Heading />
        <div className="flex flex-col items-center">
          <UserInfo userInfo={userInfo} />
        </div>
        <Footer />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
