import React from 'react'
import Heading from '../components/Heading'
import Hero2 from '../components/Hero2'
import Hero3 from '../components/Hero3'
import ChooseGrade from '../components/ChooseGrade'
import Service from '../components/Service'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import GlobalTech from '../components/GlobalTech'
import Feature1 from '../components/Feature1'
import Gamified from '../components/Gamified'
import Faq from '../components/Faq'
import Testimonials from '../components/Testimonials'
import Chatbot from '../components/Chatbot'
const Landing = () => {
  return (
    <div className="w-[100vw] h-auto">
      {/* <Heading/> */}
      <Hero3/>
     
      <Service/>
      <GlobalTech/>
      <Feature1/>
      <Gamified/>
      <Testimonials/>
      <Faq/>
      <Footer/>
      <Chatbot className="z-40"/>
    </div>
  )
}

export default Landing
