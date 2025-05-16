import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, UserPlus, X, Mail, Phone, MapPin, GraduationCap, Award, Trash2, Edit, ExternalLink } from 'lucide-react';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    grade: "",
    certificates: 0,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/users`)
      .then((response) => {
        setStudents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/student/${studentId}`);
        if (response.status === 200) {
          setStudents((prevStudents) => 
            prevStudents.filter(student => student._id !== studentId)
          );
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Error deleting student");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/create-user`,
        formData
      );
      if (response.status === 201) {
        setStudents([...students, response.data]);
        setIsModalOpen(false);
        setFormData({
          name: "",
          address: "",
          email: "",
          password: "",
          age: "",
          phoneNumber: "",
          grade: "",
          certificates: 0,
        });
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Error creating student");
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "bg-green-100 text-green-800";
    if (performance >= 70) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Student Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <UserPlus size={20} className="mr-2" />
          Add New Student
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Grades</option>
          <option value="12th">12th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="10th">10th Grade</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {student.name}
                  </h3>
                  {student.performance && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(student.performance)}`}>
                      {student.performance}%
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail size={16} className="mr-2" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone size={16} className="mr-2" />
                    <span className="text-sm">{student.phoneNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{student.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <GraduationCap size={16} className="mr-2" />
                    <span className="text-sm">Grade: {student.grade}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Award size={16} className="mr-2" />
                    <span className="text-sm">Certificates: {student.certificates}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/students/${student._id}/edit`)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No students found matching your criteria.</p>
        </div>
      )}

      {/* Create Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Student</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Grade</option>
                      <option value="10th">10th Grade</option>
                      <option value="11th">11th Grade</option>
                      <option value="12th">12th Grade</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full address"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Certificates
                  </label>
                  <input
                    type="number"
                    name="certificates"
                    value={formData.certificates}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of certificates"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
