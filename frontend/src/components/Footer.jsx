import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube, Star, Copyright } from 'lucide-react';

const Footer = () => {
  return (
    <div className="h-[100vh]  w-full py-[12.5vh]  px-5 md:px-10">
      <div className="grid grid-cols-1 pt-12.5 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Section 1 */}
        <div className="flex flex-col">
          <p className="text-sm text-[#636363]">
            Kidzian unlocks the exciting world of coding and technology for children, empowering them to explore, create, and approach learning with confidence in today's digital age.
          </p>
          <div className="md:mt-[30vh] lg:mt-[30vh] xl:mt-[30vh] mt-12">
            <h1 className="text-[18px] font-bold mb-2">Legal</h1>
            <ul className="text-sm text-[#636363] flex flex-col gap-3">
              <li className='cursor-pointer hover:text-black transition-transform'>Privacy Policy</li>
              <li className='cursor-pointer hover:text-black transition-transform'>Terms & Conditions</li>
              <li className='cursor-pointer hover:text-black transition-transform'>Refund/Cancellation Policy</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold mb-2">Company</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            {['Home', 'Courses', 'LMS', 'Blog', 'Events', 'About', 'Contact Us'].map((item) => (
              <a href={`/${item.toLowerCase().replace(' ', '-')}`} key={item}>
                <li className="hover:text-black cursor-pointer">{item}</li>
              </a>
            ))}
          </ul>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold mb-2">Follow Us</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            {[
              { name: 'Instagram', icon: <Instagram size={15} />, link: 'https://www.instagram.com/kidzians/' },
              { name: 'Facebook', icon: <Facebook size={15} />, link: 'https://www.facebook.com/people/Kidzian/100090913967070/' },
              { name: 'Linkedin', icon: <Linkedin size={15} />, link: 'https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name' },
              { name: 'Youtube', icon: <Youtube size={15} />, link: 'https://www.youtube.com/@kidzian-n4y' },
              { name: 'Google', icon: <Star size={15} />, link: 'https://maps.app.goo.gl/PEhEBVdNzC44nVY47' }
            ].map(({ name, icon, link }) => (
              <a href={link} target="_blank" rel="noopener noreferrer" key={name}>
                <li className="flex items-center gap-4 hover:text-black cursor-pointer">{icon} {name}</li>
              </a>
            ))}
          </ul>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold mb-2">Contact Us</h1>
          <ul className="flex flex-col gap-3 text-sm text-[#636363]">
            <li className="flex gap-4 items-center hover:text-black cursor-pointer">
              <Phone size={15} /> +91 9599-860-105
            </li>
            <li className="flex gap-4 items-center hover:text-black cursor-pointer">
              <Mail size={15} /> info@kidzians.com
            </li>
            <li className="flex gap-4 items-center hover:text-black cursor-pointer">
              <MapPin size={15} /> India
            </li>
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <div className="flex flex-col items-center mt-10">
        <span className="w-full md:w-[90%] border-t border-gray-300 mb-4"></span>
        <div className="text-sm text-[#636363] flex items-center gap-1">Copyright <Copyright size={12}/> 2025 Kidzian</div>
      </div>
    </div>
  );
};

export default Footer;















// import React from 'react';
// import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube, Star } from 'lucide-react';
// import { Copyright } from 'lucide-react';
// const Footer = () => {
//   return (
//     <div className="h-[100vh] w-[100vw]">
//       <div className="grid grid-cols-4 pl-10 pt-[12.5vh] justify-center items-start gap-12">
//         {/* Section 1 */}
//         <div className="flex items-start justify-center flex-col">
//           <div className="h-[40vh]">
           
//             <p className="text-sm text-[#636363]">
//             Kidzian unlocks the exciting world of coding and technology for children, empowering them to explore, create, and approach learning with confidence in today's digital age
//             </p>
//           </div>
//           <div className="h-[30vh]">
//             <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Legal</h1>
//             <ul className="text-sm text-[#636363] flex flex-col gap-3">
//               <li className='cursor-pointer hover:text-black transition-transform'>Privacy Policy</li>
//               <li className='cursor-pointer hover:text-black transition-transform'>Terms & Conditions</li>
//               <li className='cursor-pointer hover:text-black transition-transform'>Refund/Cancellation Policy</li>
//             </ul>
//           </div>
//         </div>

//         {/* Section 2 */}
//         <div className="flex items-start justify-center flex-col">
//           <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Company</h1>
//           <ul className="flex flex-col gap-3 text-sm text-[#636363]">
//            <a href="/">
//   <li className="hover:text-black cursor-pointer">Home</li>
// </a>
// <a href="/courses">
//   <li className="hover:text-black cursor-pointer">Courses</li>
// </a>
// <a href="/lms">
//   <li className="hover:text-black cursor-pointer">LMS</li>
// </a>
// <a href="/blogs">
//   <li className="hover:text-black cursor-pointer">Blog</li>
// </a>
// <a href="/events">
//   <li className="hover:text-black cursor-pointer">Events</li>
// </a>
// <a href="/about-us">
//   <li className="hover:text-black cursor-pointer">About</li>
// </a>
// <a href="/contact-us">
//   <li className="hover:text-black cursor-pointer">Contact Us</li>
// </a>
//           </ul>
//         </div>

//         {/* Section 3 */}
//         <div className="flex items-start justify-center flex-col">
//           <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Follow Us</h1>
//           <ul className="flex flex-col gap-3 text-sm text-[#636363]">
//           <a href="https://www.instagram.com/kidzians/" target="_blank" rel="noopener noreferrer">
//   <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
//     <Instagram size={15} />
//     Instagram
//   </li>
// </a>
// <a href="https://www.facebook.com/people/Kidzian/100090913967070/" target="_blank" rel="noopener noreferrer">
//   <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
//     <Facebook size={15} />
//     Facebook
//   </li>
// </a>
// <a href="https://in.linkedin.com/company/kidzian?trk=public_post_feed-actor-name" target="_blank" rel="noopener noreferrer">
//   <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
//     <Linkedin size={15} />
//     Linkedin
//   </li>
// </a>
// <a href="https://www.youtube.com/@kidzian-n4y" target="_blank" rel="noopener noreferrer">
//   <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
//     <Youtube size={15} />
//     Youtube
//   </li>
// </a>
// <a href="https://maps.app.goo.gl/PEhEBVdNzC44nVY47" target="_blank" rel="noopener noreferrer">
//   <li className="flex items-center justify-start gap-4 hover:text-black cursor-pointer">
//     <Star size={15} />
//     Google
//   </li>
// </a>
//           </ul>
//         </div>

//         {/* Section 4 */}
//         <div className="flex items-start justify-center flex-col">
//           <h1 className="text-[18px] tracking-tighter leading-[32px] font-bold mb-2">Contact Us</h1>
//           <ul className="flex flex-col gap-3 text-sm text-[#636363]">
//             <li className="flex gap-4 items-center justify-start hover:text-black cursor-pointer">
//               <Phone size={15} />
//               +91 9599-860-105
//             </li>
//             <li className="flex gap-4 items-center justify-center hover:text-black cursor-pointer">
//               <Mail size={15} />
//               info@kidzians.com
//             </li>
//             <li className="flex gap-4 items-center justify-start hover:text-black cursor-pointer">
//               <MapPin size={15} />
//               India
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Divider Line */}
//       <div className="flex flex-col items-center">
//         <span className="w-[90%] border-t border-gray-300 mb-4"></span>
//         <div className="text-sm text-[#636363] gap-1 flex items-center justify-center">Copyright <Copyright size={12}/> 2025 Kidzian</div>
//       </div>
//     </div>
//   );
// };

// export default Footer;
