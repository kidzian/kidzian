
import React, { useState } from 'react';
import Heading from '../components/Heading';
import { LinkedinIcon, Send } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Phone } from 'lucide-react';
import Footer from '../components/Footer';
const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { firstName, lastName, email, phone, message } = formData;

  //   // Check if all required fields are filled
  //   if (!firstName || !lastName || !email || !phone || !message) {
  //     toast.error('Please fill in all fields!');
  //   } else {
  //     console.log('Form submitted:', formData);
  //     toast.success('Message is sent!');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, message } = formData;
  
    // Check if all required fields are filled
    if (!firstName || !lastName || !email || !phone || !message) {
      toast.error('Please fill in all fields!');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          category: '',
          message: '',
        });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };
  

  return (
    <div>
      <Heading />
      <ToastContainer />
      <div className="w-[100vw] h-auto flex gap-1 pl-20 pr-16 pt-12 pb-10">
        <div className="w-[100vw] flex flex-col items-start justify-center gap-4">
          <h1 className="text-5xl font-bold">Get In Touch</h1>
          <p className="w-[28vw]">
            We're here to help. Chat to our friendly team 24/7 and get set up and ready to go in just 5 minutes.
          </p>

          <div className="flex flex-col gap-2">
          <h1 className="flex gap-1 items-center text-[#6e2cf6] font-semibold tracking-tighter text-[14px] cursor-pointer">
              <Phone size={15} /> +91-9599-860-105
            </h1>
           <div className="flex gap-10">
           <h1 className="flex gap-1 items-center text-[#6e2cf6] font-semibold tracking-tighter text-[14px] cursor-pointer">
              <Send size={15} /> info@kidzians.com
            </h1>
            <a href='https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name'>
            <h1 className="flex gap-1 items-center text-[#6e2cf6] font-semibold tracking-tighter text-[14px] cursor-pointer">
              <LinkedinIcon size={15} /> Message us on LinkedIn
            </h1>
            </a>
           </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="max-w-lg rounded-lg">
              <div className="mb-4 flex gap-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#6e2cf6] text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className=" w-[100vw] h-[87.5vh]">
          <iframe
            title="Google Map Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31103.368066902996!2d77.751342!3d12.976904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0f89479856cd%3A0x96ea16cfc43a695!2sKidzian%20Pvt%20Ltd!5e0!3m2!1sen!2sus!4v1736935942056!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

<Footer/>
    </div>
  );
};

export default Contact;
