import React from 'react'
import Heading from '../components/Heading'
import { BicepsFlexed, Cpu, Earth, Gamepad2, Heart, MailCheck, Rocket, Send } from 'lucide-react';
import { FaRocket } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import about from '../assets/about-us.jpg';
const About = () => {
  return (
    <div>
      <Heading/>
      <div className='flex w-[100vw] h-[87.5vh] justify-center'>
          
            <div className=' w-[40%] h-full flex flex-col items-start justify-center '>
               <img src={about} alt="" className='h-[80vh] w-[90%] rounded-xl'/>
            </div>

            <div className="w-[40%] h-full flex flex-col items-start justify-center gap-2">
  <h1 className="text-lg font-bold">Our Story</h1>

  <div className="flex  gap-4">
    <FaRocket size={80} className="pb-12 text-[#3b82f6]" />
    <p className="text-sm text-[#4b5462]">
      Kidzian was founded in 2023 by Rashmi Raju, a passionate software engineer and educator with an M.Tech in Computer Science. Having worked in top-tier software companies, Rashmi gained invaluable experience and insights into the tech world. Despite her successful career, she felt a strong desire to inspire the next generation through education.
    </p>
  </div>

  <div className="flex items-start gap-4">
    <FaLightbulb size={60} className="pb-8 text-[#f49e0a]" />
    <p className="text-sm text-[#4b5462]">
      The idea for Kidzian was sparked by a neighborhood coding workshop she organized, where the children’s enthusiasm and excitement were contagious. Rashmi realized the potential of a more engaging approach to tech education and decided to create Kidzian to make learning technology fun, interactive, and impactful.
    </p>
  </div>

  <div className="flex items-start gap-4">
    <FaStar size={80} className="pb-12 text-[#8b5cf6]" />
    <p className="text-sm text-[#4b5462]">
      Starting with a small center and a handful of students, Kidzian has grown into a leading tech school for children aged 7 to 17, offering courses in block-based coding, Python, Java, JavaScript, HTML, CSS, and more. Our gamified, interactive learning platform provides personalized paths and collaborative projects to foster creativity and problem-solving skills.
    </p>
  </div>

  <div className="flex items-start gap-4">
  

  <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill='red'   class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    <p className="text-sm text-[#4b5462]">
      We are committed to continuous innovation, ensuring our students stay ahead in the ever-evolving world of technology. Join us at Kidzian, where learning technology is an exciting adventure!
    </p>
  </div>
</div>



      </div>
      <div className='w-full h-[75vh] flex flex-col items-center justify-center '>
        <h1 className='text-lg font-bold mb-16'>Our Mission</h1>

   <div className='flex gap-2 pl-16 pr-16'>
   <motion.div
  className="flex flex-wrap justify-center gap-8 w-full px-10"
 l
>

    <motion.div
    
      className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer"
    >
      <div className="flex flex-col items-center gap-4 w-full"> 
        <Gamepad2 className="h-16 w-16 text-purple-500" />
        <h1 className="text-black text-lg font-semibold">Make Learning Fun And Accessible</h1>
        <p className="leading-tight text-sm text-left text-gray-500 h-10  w-full">Our gamified learning approach and personalized learning paths ensure that every child can enjoy and succeed in their tech education journey.</p>
      </div>
     
    </motion.div>
 
</motion.div>


<motion.div
  className="flex flex-wrap justify-center gap-8 w-full px-10"
 
>

    <motion.div
    
      className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer"
    >
      <div className="flex flex-col items-center gap-4 w-full"> 
        <Cpu className="h-16 w-16 text-blue-500" />
        <h1 className="text-black text-lg font-semibold">Inspire Creativity Through Technology</h1>
        <p className="leading-tight text-sm text-left text-gray-500 h-10 w-full">We foster creativity through interactive learning that encourages experimentation and innovation.</p>
      </div>
     
    </motion.div>
 
</motion.div>


<motion.div
  className="flex flex-wrap justify-center gap-8 w-full px-10"
 
>

    <motion.div
    
      className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer"
    >
      <div className="flex flex-col items-center gap-4 w-full"> 
        <Earth className="h-16 w-16 text-green-500"/>
        <h1 className="text-black text-lg font-semibold">Promote diversity and inclusion in tech</h1>
        <p className="leading-tight text-sm text-left text-gray-500 h-10 w-full">Our mission is to provide equal opportunities for all children to explore and excel in technology education, regardless of background or gender.</p>
      </div>
     
    </motion.div>
 
</motion.div>


<motion.div
  className="flex flex-wrap justify-center gap-8 w-full px-10"
 
>

    <motion.div
    
      className="bg-white h-[45vh] w-[18vw] rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 text-center cursor-pointer"
    >
      <div className="flex flex-col items-center gap-4 w-full"> 
      <BicepsFlexed className="h-16 w-16 text-orange-500"/>
        <h1 className="text-black text-lg font-semibold">Empower Future Innovators</h1>
        <p className="leading-tight text-sm text-left text-gray-500 h-10 w-full">We aim to equip children with the skills and confidence needed to thrive in a technology-driven world, preparing them to solve real-world problems .</p>
      </div>
     
    </motion.div>
 
</motion.div>

   </div>

      </div>

      <div className='w-full h-[60vh] flex flex-col items-center justify-start '>
        <h1 className='text-lg font-bold mb-16'>Kidzian is Backed By</h1>

        <div className='grid grid-cols-3 w-full items-center justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <div className='bg-gray-100 w-36 h-36 rounded-full flex items-center justify-center'>
            <img src="data:image/jpeg;base64,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" alt="" className='w-[6vw] rounded-lg'/>
          </div>
          <h1 className='font-bold text-lg'>Women Startup Stories</h1>
          <p className='text-[#4b5462] text-sm'>
            Kidzian is featured in WSS
          </p>
        </div>

        <div className='flex flex-col items-center justify-center'>
          <div className='bg-gray-100 w-36 h-36 rounded-full flex items-center justify-center'>
            <img src="https://imgs.search.brave.com/cMeR-TEzSzc3L_T_t4c0ZKSZu5B4BxkMPGrZ48urikE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZ29vZ2xlLXMt/bG9nby8xNTAvR29v/Z2xlX0ljb25zLTA5/LTUxMi5wbmc" alt="" className='w-[8vw]'/>
          </div>
          <h1 className='font-bold text-lg'>Google For Startups</h1>
          <p className='text-[#4b5462] text-sm'>
            Part of Levelup program at Google
          </p>
        </div>

        <div className='flex flex-col items-center justify-center'>
          <div className='bg-[#f9fbfa] w-36 h-36 rounded-full flex items-center justify-center '>
            <img className='w-[6vw] rounded-lg' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABEVBMVEXucQP////8//////35///tcQP///vubgDwcQDscgb//v3//vvsawDxbwDraQD+/v////bpagDwaQDpcwjwaAD6//zoZwDmbQDuZwDrdwr+//X1bgDqcwDqcgz++Oz/+/TrtYbtfRbfcwD86tPskk3wrnr779T99+XphTn34MP1yqr52Lr+9ub338nrfyj758nsnmL1xZ/98ervvpLlfivppHDvsYPnjEDldxrz0a7ll1b8/ev3zqjokFPprG3tu4nlii/RkE/y6NrxomrkoF3328v42rLttHjbhTfupFz0n17x07vjgxvuwaP1xpneeB7fxZngjTbeo2zvkUzxgAjpoFPxgC/tikP7597rqGL53KuufvcmAAAZBUlEQVR4nO1cC1fbSJZWleqhklR6WshYsmz8AIwfQGxjm7iBJTRMkzTZnuxMuvf//5C9JWMwTnr2dDeJffroO2emgy2Eru7ru7dulaYVKFCgQIECBQoUKFCgQIECBQoUKFCgQIECBQoUKFCgQIECBQoUKFCgQIECBQoUKFCgwNchtV2uUaEJSummn+XbIBWOIW07SBqhseln+Tag0h6N6/WzSUmG8NOmH+cbwJ4eZQxjVJmFyd9QPirp+QHCOkKYofmOrMpNP9FrQ9DDzIyQAiOVViLEpp/otcH9GVEaRMjUMR46nG/6iV4ZVFZrFdPVlYyYsf60DK5ovNQjDQ2D8qBUdnYckP8/KpmmaUoh82xTwBpUGHqC+XYecrouRCJ8cT583282+8Oplv7urUAqzqU0DEPK7REx3evhZwlRhJsxDV9GG8MfzD2MLPU9Pvih9J9uB6whjn0b5Pz9F/FdAS/a7q4IiComugjClxc5dxViWXqEAYz0pr97N24709b4cnjZboVyayIWD24igsylhLqLfi6BlT7ZWCqd9qMFA5BpoWFJfMUEpcadwV33zcLkK/0p3xYzBcrWtfQnHTIX3UOoef6e8kGGXqDpQw5dvw0NS1fdt4w8WryL67a2JeGmWk3+y8O6vnwy93pnd1UAIx6SlxLWBtq6hFTjyWkFbLi2vA/JJdwOyNa+Tp60iN3eRMjG89c0vLZeSuhNuFiTUMjwPSamiZcvw6vdOMaW8Hg5aL4UAB0cvkj6gxozX3zPTtZD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" alt="" />
          </div>
          <h1 className='font-bold text-lg'>Cherie Blair Foundation For Women</h1>
          <p className='text-[#4b5462] text-sm'>
           Kidzian is selected for mentor program 
          </p>
        </div>

       
        </div>
      </div>

   

      <div className='h-[40vh] w-full flex flex-col items-center pt-10'>
    <div className='w-[80%] '>
        <h1 className='text-center text-3xl font-bold'>Subscribe to our Newsletter</h1>
        <p className='text-sm mt-5 text-center'>
            Stay updated with the latest in tech education, coding tips, and fun activities from Kidzian by subscribing to our monthly newsletter. Don't miss out on exclusive content and resources designed to enhance your child's learning journey—subscribe today!
        </p>

        <div className='flex items-center justify-center mt-6'>
            <input
                type="email"
                placeholder="Enter your email"
                className="w-[80vh] p-3 border border-gray-300 rounded-lg focus:outline-none mr-1 "
            />
            <button
                type="submit"
                className="bg-blue-500 items-center justify-center hover:bg-blue-600 text-white p-3 rounded-lg transition duration-300 flex gap-1"
            >
                Subscribe
                <MailCheck size={18} className=''/>
            </button>
        </div>
    </div>
</div>


      <Footer/>
    </div>
  )
}

export default About
