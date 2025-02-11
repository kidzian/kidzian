import React, { useState, useEffect } from 'react';
import { Gamepad2, Laptop, Code, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Make sure axios is imported
import { toast } from 'react-toastify'; // You can use this for success/error notifications

const Service = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    email:''
  });
  const [loading, setLoading] = useState(false); // For managing loading state

  const cardData = [
    {
      title: 'Learn from Industry Experts',
      paragraph: 'Gain knowledge from industry experts with real-world experience.',
      image: <Award className="h-16 w-16 text-orange-500" />,
      buttonText: 'Book a Free Demo',
    },
    {
      title: 'Learn at Your Own Speed And Pace',
      paragraph: 'Learn at your own pace with our flexible self-paced programs.',
      image: <Laptop className="h-16 w-16 text-blue-500" />,
      buttonText: 'View Courses',
      redirectLink: '/courses',
    },
    {
      title: 'Learn the Latest Technology',
      paragraph: 'Stay updated by learning the latest technology trends and tools.',
      image: <Code className="h-16 w-16 text-green-500" />,
      buttonText: 'Get Started',
      redirectLink: '/courses',
    },
    {
      title: 'Learn with a Gamified Approach',
      paragraph: 'Enjoy learning with our fun and engaging methods that make education exciting.',
      image: <Gamepad2 className="h-16 w-16 text-purple-500" />,
      buttonText: 'Enroll Now',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scrollPosition > windowHeight / 1.4) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCardClick = (buttonText) => {
    if (buttonText === 'Enroll Now' || buttonText === 'Book a Free Demo') {
      handleModalOpen();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = { ...formData, grade: selectedGrade };
    console.log(dataToSend);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-form`,
        dataToSend,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success('Demo booked successfully!');
        setShowModal(false);
        setFormData({ name: '', phone: '', course: '' , email:''});
        setSelectedGrade(null);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error('Failed to book a demo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] min-h-[100vh] bg-[#FFFFFF] flex flex-col items-center justify-start gap-16 p-24">
      {/* Section Title and Description */}
      <div className="flex items-center justify-center flex-col w-[60vw] leading-tight gap-4 ">
        <h1 className="text-4xl font-bold text-center">Why Kidzian is for you?</h1>
        <p className="text-center text-gray-600 text-lg">
          If you are planning for a year, sow rice. If you are planning for a decade, plant trees. If you are planning for a lifetime, educate people.
        </p>
      </div>

      {/* Cards Section */}
      <motion.div
        className="sm:block md:flex lg:flex xl:flex flex-wrap  gap-8 w-full items-center justify-center "
        initial={{ opacity: 0, y: 50 }}
        animate={hasScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {cardData.map((card, index) => (
          <div key={index}>
            <motion.div
              className="bg-white h-[48vh] xl:w-[18vw] sm:w-[80%] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer sm:pl-10 md:pl-0 lg:pl-0 xl:pl-0 2xl:pl-0 "
              whileHover={{ scale: 1.1, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' }}
            >
              <div className="flex flex-col items-center gap-4 w-full">
                {card.image}
                <h1 className="text-black text-lg font-semibold">{card.title}</h1>
                <p className="leading-tight text-sm text-left text-gray-500 h-10 truncate w-full">{card.paragraph}</p>
              </div>
              <a
                href={card.redirectLink}
                onClick={() => handleCardClick(card.buttonText)}
              >
                <button className="mt-auto bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-4 py-2 rounded-lg hover:opacity-90">
                  {card.buttonText}
                </button>
              </a>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90vw] max-w-md">
            <h2 className="text-2xl font-bold mb-4">Book a Free Demo</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full border cursor-pointer rounded-md p-2"
                  required
                >
                  <option value="" disabled>Select a course</option>
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

              <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Grade</label>
                <select
                  name="grade"
                  value={selectedGrade || ''}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full border cursor-pointer rounded-md p-2"
                  required
                >
                  <option value="" disabled>Select a grade</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {loading ? 'Booking...' : 'Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
