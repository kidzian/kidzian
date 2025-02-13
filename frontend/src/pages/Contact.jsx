import React, { useState } from 'react';
import Heading from '../components/Heading';
import { LinkedinIcon, Send, Phone } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, message } = formData;
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
        setFormData({ firstName: '', lastName: '', email: '', phone: '', category: '', message: '' });
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
      {/* <div className="w-full flex flex-col lg:flex-row gap-6 px-4 lg:px-20 py-12">
        <div className="w-full lg:w-1/2 h-[300px] lg:h-[87.5vh]">
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

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-5xl font-bold">Get In Touch</h1>
          <p className="text-gray-700">We're here to help. Chat to our friendly team 24/7.</p>
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center text-[#6e2cf6] font-semibold text-sm">
              <Phone size={15} className="mr-1" /> +91-9599-860-105
            </h1>
            <h1 className="flex items-center text-[#6e2cf6] font-semibold text-sm">
              <Send size={15} className="mr-1" /> info@kidzians.com
            </h1>
            <a href='https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name' className="text-[#6e2cf6] font-semibold text-sm">
              <LinkedinIcon size={15} className="mr-1" /> Message us on LinkedIn
            </a>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="p-2 border rounded-md w-full" required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="p-2 border rounded-md w-full" required />
            </div>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="p-2 border rounded-md w-full" required />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="p-2 border rounded-md w-full" required />
            <textarea name="message" placeholder="Message" rows="5" onChange={handleChange} value={formData.message} className="p-2 border rounded-md w-full"></textarea>
            <button type="submit" className="w-full py-2 bg-[#6e2cf6] text-white font-semibold rounded-md hover:bg-blue-600">Submit</button>
          </form>
        </div>
      </div> */}


<div className="w-full flex flex-col-reverse lg:flex-row gap-6 px-4 lg:px-20 py-12">
  {/* Form Section */}
  <div className="w-full lg:w-1/2 flex flex-col gap-6">
    <h1 className="text-5xl font-bold">Get In Touch</h1>
    <p className="text-gray-700">We're here to help. Chat to our friendly team 24/7.</p>
    <div className="flex flex-col gap-2">
      <h1 className="flex items-center text-[#6e2cf6] font-semibold text-sm">
        <Phone size={15} className="mr-1" /> +91-9599-860-105
      </h1>
      <h1 className="flex items-center text-[#6e2cf6] font-semibold text-sm">
        <Send size={15} className="mr-1" /> info@kidzians.com
      </h1>
      <a href='https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name' className="text-[#6e2cf6] font-semibold text-sm">
        <LinkedinIcon size={15} className="mr-1" /> Message us on LinkedIn
      </a>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} className="p-2 border rounded-md w-full" required />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} className="p-2 border rounded-md w-full" required />
      </div>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="p-2 border rounded-md w-full" required />
      <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="p-2 border rounded-md w-full" required />
      <textarea name="message" placeholder="Message" rows="5" onChange={handleChange} value={formData.message} className="p-2 border rounded-md w-full"></textarea>
      <button type="submit" className="w-full py-2 bg-[#6e2cf6] text-white font-semibold rounded-md hover:bg-blue-600">Submit</button>
    </form>
  </div>

  {/* Map Section */}
  <div className="w-full lg:w-1/2 h-[300px] lg:h-[87.5vh]">
    <iframe
      title="Google Map Location"
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31103.368066902996!2d77.751342!3d12.976904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae0f89479856cd%3A0x96ea16cfc43a695!2sKidzian%20Pvt%20Ltd!5e0!3m2!1sen!2us!4v1736935942056!5m2!1sen!2us"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>



      <Footer />
    </div>
  );
};

export default Contact;