import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube, Star } from 'lucide-react';
import { Copyright } from 'lucide-react';
const Footer = () => {
  return (
    <div className="h-[100vh] w-[100vw]">
      <div className="grid grid-cols-4 pl-10 pt-[12.5vh] justify-center items-start gap-12">
        {/* Section 1 */}
        <div className="flex items-start justify-center flex-col">
          <div className="h-[40vh]">
           
            <p className="text-sm text-[#636363]">
            Kidzian unlocks the exciting world of coding and technology for children, empowering them to explore, create, and approach learning with confidence in today's digital age
            </p>
          </div>
          <div className="h-[30vh]">
            <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Legal</h1>
            <ul className="text-sm text-[#636363] flex flex-col gap-3">
              <li className='cursor-pointer hover:text-black transition-transform'>Privacy Policy</li>
              <li className='cursor-pointer hover:text-black transition-transform'>Terms & Conditions</li>
              <li className='cursor-pointer hover:text-black transition-transform'>Refund/Cancellation Policy</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex items-start justify-center flex-col">
          <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Company</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">Courses</li>
            <li className="hover:text-black cursor-pointer">LMS</li>
            <li className="hover:text-black cursor-pointer">Blog</li>
            <li className="hover:text-black cursor-pointer">Events</li>
            <li className="hover:text-black cursor-pointer">About</li>
            <li className="hover:text-black cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="flex items-start justify-center flex-col">
          <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Follow Us</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
              <Instagram size={15} />
              Instagram
            </li>
            <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
              <Facebook size={15} />
              Facebook
            </li>
            <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
              <Linkedin size={15} />
              Linkedin
            </li>
            <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
              <Youtube size={15} />
              Youtube
            </li>
            <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
              <Star size={15} />
              Google
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="flex items-start justify-center flex-col">
          <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Contact Us</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            <li className="flex gap-4 items-center justify-start hover:text-black cursor-pointer">
              <Phone size={15} />
              +91 9599-860-105
            </li>
            <li className="flex gap-4 items-center justify-center hover:text-black cursor-pointer">
              <Mail size={15} />
              info@kidzians.com
            </li>
            <li className="flex gap-4 items-center justify-start hover:text-black cursor-pointer">
              <MapPin size={15} />
              India
            </li>
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <div className="flex flex-col items-center">
        <span className="w-[90%] border-t border-gray-300 mb-4"></span>
        <div className="text-sm text-[#636363] gap-1 flex items-center justify-center">Copyright <Copyright size={12}/> 2025 Kidzian</div>
      </div>
    </div>
  );
};

export default Footer;
