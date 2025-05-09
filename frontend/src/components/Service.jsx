// import React, { useState, useEffect } from 'react';
// import { Gamepad2, Laptop, Code, Award } from 'lucide-react';
// import { motion } from 'framer-motion';
// import axios from 'axios'; // Make sure axios is imported
// import { toast } from 'react-toastify'; // You can use this for success/error notifications

// const Service = () => {
//   const [hasScrolled, setHasScrolled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedGrade, setSelectedGrade] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     course: '',
//     email:''
//   });
//   const [loading, setLoading] = useState(false); // For managing loading state

//   const cardData = [
//     {
//       title: 'Learn from Industry Experts',
//       paragraph: 'Gain knowledge from industry experts with real-world experience.',
//       image: <Award className="h-16 w-16 text-orange-500" />,
//       buttonText: 'Book a Free Demo',
//     },
//     {
//       title: 'Learn at Your Own Speed And Pace',
//       paragraph: 'Learn at your own pace with our flexible self-paced programs.',
//       image: <Laptop className="h-16 w-16 text-blue-500" />,
//       buttonText: 'View Courses',
//       redirectLink: '/courses',
//     },
//     {
//       title: 'Learn the Latest Technology',
//       paragraph: 'Stay updated by learning the latest technology trends and tools.',
//       image: <Code className="h-16 w-16 text-green-500" />,
//       buttonText: 'Get Started',
//       redirectLink: '/courses',
//     },
//     {
//       title: 'Learn with a Gamified Approach',
//       paragraph: 'Enjoy learning with our fun and engaging methods that make education exciting.',
//       image: <Gamepad2 className="h-16 w-16 text-purple-500" />,
//       buttonText: 'Enroll Now',
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       const windowHeight = window.innerHeight;
//       if (scrollPosition > windowHeight / 1.4) {
//         setHasScrolled(true);
//       } else {
//         setHasScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const handleModalOpen = () => {
//     setShowModal(true);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//   };

//   const handleCardClick = (buttonText) => {
//     if (buttonText === 'Enroll Now' || buttonText === 'Book a Free Demo') {
//       handleModalOpen();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const dataToSend = { ...formData, grade: selectedGrade };
//     console.log(dataToSend);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/submit-form`,
//         dataToSend,
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         toast.success('Demo booked successfully!');
//         setShowModal(false);
//         setFormData({ name: '', phone: '', course: '' , email:''});
//         setSelectedGrade(null);
//       }
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//       toast.error('Failed to book a demo. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-[100vw] min-h-[100vh] bg-[#FFFFFF] flex flex-col items-center justify-start gap-16 p-24">
//       {/* Section Title and Description */}
//       <div className="flex items-center justify-center flex-col leading-tight gap-4 ">
//         <h1 className="text-4xl font-bold text-center">Why Kidzian is for you?</h1>
//         <p className="text-center text-gray-600 text-lg">
//           If you are planning for a year, sow rice. If you are planning for a decade, plant trees. If you are planning for a lifetime, educate people.
//         </p>
//       </div>

//       {/* Cards Section */}
//       <motion.div
//         className="sm:block md:flex lg:flex xl:flex flex-wrap  gap-8  items-center justify-center w-full"
//         initial={{ opacity: 0, y: 50 }}
//         animate={hasScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//         transition={{ duration: 0.5, type: 'spring' }}
//       >
//         {cardData.map((card, index) => (
//           <div key={index}>
//             <motion.div
//               className="bg-white h-[48vh] xl:w-[18vw] w-[100%] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer mb-8 "
//               whileHover={{ scale: 1.1, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' }}
//             >
//               <div className="flex flex-col items-center gap-4 w-full">
//                 {card.image}
//                 <h1 className="text-black text-lg font-semibold">{card.title}</h1>
//                 <p className="leading-tight text-sm text-left text-gray-500 h-10 truncate w-full">{card.paragraph}</p>
//               </div>
//               <a
//                 href={card.redirectLink}
//                 onClick={() => handleCardClick(card.buttonText)}
//               >
//                 <button className="mt-auto bg-gradient-to-r from-[#b21adf] to-[#f34e3e] text-white px-4 py-2 rounded-lg hover:opacity-90">
//                   {card.buttonText}
//                 </button>
//               </a>
//             </motion.div>
//           </div>
//         ))}
//       </motion.div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-[90vw] max-w-md">
//             <h2 className="text-2xl font-bold mb-4">Book a Free Demo</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Phone</label>
//                 <input
//                   type="text"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full border rounded-md p-2"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Course</label>
//                 <select
//                   value={formData.course}
//                   onChange={(e) => setFormData({ ...formData, course: e.target.value })}
//                   className="w-full border cursor-pointer rounded-md p-2"
//                   required
//                 >
//                   <option value="" disabled>Select a course</option>
//                   <option value="Little Innovators">Little Innovators</option>
//                       <option value="Junior Innovators">Junior Innovators</option>
//                       <option value="Senior Innovators">Senior Innovators</option>
//                       <option value="Artificial Intelligence">Artificial Intelligence</option>
//                       <option value="Web Development Course">Web Development Course</option>
//                       <option value="App Development Course (Junior)">App Development Course (Junior)</option>
//                       <option value="App Development Course (Senior)">App Development Course (Senior)</option>
//                       <option value="Java Course">Java Course</option>
//                 </select>
//               </div>

//               <div className='mb-4'>
//                 <label className='block text-sm font-medium mb-1'>Grade</label>
//                 <select
//                   name="grade"
//                   value={selectedGrade || ''}
//                   onChange={(e) => setSelectedGrade(e.target.value)}
//                   className="w-full border cursor-pointer rounded-md p-2"
//                   required
//                 >
//                   <option value="" disabled>Select a grade</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {i + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={handleModalClose}
//                   className="bg-gray-400 text-white px-4 py-2 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                 >
//                   {loading ? 'Booking...' : 'Book'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Service;



import { useState, useEffect } from "react"
import { Gamepad2, Laptop, Code, Award, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { toast } from "react-toastify"

const Service = () => {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const cardData = [
    {
      title: "Learn from Industry Experts",
      paragraph: "Gain knowledge from industry experts with real-world experience.",
      image: <Award className="h-16 w-16 text-orange-500" />,
      buttonText: "Book a Free Demo",
      color: "from-orange-400 to-orange-600",
      hoverColor: "group-hover:from-orange-500 group-hover:to-orange-700",
      iconBg: "bg-orange-100",
    },
    {
      title: "Learn at Your Own Speed And Pace",
      paragraph: "Learn at your own pace with our flexible self-paced programs.",
      image: <Laptop className="h-16 w-16 text-blue-500" />,
      buttonText: "View Courses",
      redirectLink: "/courses",
      color: "from-blue-400 to-blue-600",
      hoverColor: "group-hover:from-blue-500 group-hover:to-blue-700",
      iconBg: "bg-blue-100",
    },
    {
      title: "Learn the Latest Technology",
      paragraph: "Stay updated by learning the latest technology trends and tools.",
      image: <Code className="h-16 w-16 text-green-500" />,
      buttonText: "Explore Now",
      redirectLink: "/courses",
      color: "from-green-400 to-green-600",
      hoverColor: "group-hover:from-green-500 group-hover:to-green-700",
      iconBg: "bg-green-100",
    },
    {
      title: "Learn with a Gamified Approach",
      paragraph: "Experience interactive and project-based learning that keeps kids engaged and excited about technology!",
      image: <Gamepad2 className="h-16 w-16 text-purple-500" />,
      buttonText: "Enroll Now",
      color: "from-purple-400 to-purple-600",
      hoverColor: "group-hover:from-purple-500 group-hover:to-purple-700",
      iconBg: "bg-purple-100",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      setHasScrolled(scrollPosition > windowHeight / 1.4)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleModalOpen = () => setShowModal(true)
  const handleModalClose = () => setShowModal(false)

  const handleCardClick = (buttonText) => {
    if (buttonText === "Enroll Now" || buttonText === "Book a Free Demo") {
      handleModalOpen()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const dataToSend = { ...formData, grade: selectedGrade }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-form`,
        dataToSend,
        { withCredentials: true }
      )
      if (response.status === 200) {
        toast.success("Demo booked successfully!")
        setShowModal(false)
        setFormData({ name: "", phone: "", course: "", email: "" })
        setSelectedGrade(null)
      }
    } catch (error) {
      toast.error("Failed to book a demo. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center gap-16 p-6 md:p-16 pt-[16vh] pb-[16vh]">
      {/* Section Title */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
        <motion.h1
          className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose Kidzian?
        </motion.h1>
        <motion.p
          className="text-gray-600 text-base md:text-xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        Empowering kids aged 7–17 through fun, gamified coding experiences.
        </motion.p>
      </div>

      {/* Service Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl"
        initial={{ opacity: 0, y: 50 }}
        animate={hasScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, type: "spring", staggerChildren: 0.1 }}
      >
        {cardData.map((card, index) => (
  <motion.div
    key={index}
    className="group bg-white h-auto rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer border border-gray-100"
    whileHover={{ y: -10 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
  >
    <div className={`${card.iconBg} p-4 rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300`}>
      {card.image}
    </div>
    <h2 className="text-gray-800 text-xl font-bold mb-3">{card.title}</h2>
    <p className="text-gray-600 mb-6 flex-grow">{card.paragraph}</p>
    <a href={card.redirectLink} onClick={() => handleCardClick(card.buttonText)} className="mt-auto w-full">
      <button
        className={`w-full bg-gradient-to-r ${card.color} ${card.hoverColor} text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
      >
        {card.buttonText}
      </button>
    </a>
  </motion.div>
))}

      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Book a Free Demo</h2>
                <button onClick={handleModalClose} className="text-white hover:bg-white/20 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {["name", "phone", "email"].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace("email", "Email Address").replace("name", "Full Name").replace("phone", "Phone Number")}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={`Enter your ${field}`}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                    required
                  >
                    <option value="" disabled>Select a course</option>
                    {[
                      "Little Innovators", "Junior Innovators", "Senior Innovators", "Artificial Intelligence",
                      "Web Development Course", "App Development Course (Junior)", "App Development Course (Senior)", "Java Course"
                    ].map((course, idx) => (
                      <option key={idx} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    value={selectedGrade || ""}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                    required
                  >
                    <option value="" disabled>Select a grade</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4">
                  <button type="button" onClick={handleModalClose} className="px-5 py-2.5 border rounded-lg text-gray-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? "Booking..." : "Book Demo"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Service
