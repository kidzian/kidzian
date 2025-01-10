import React from 'react'
import Heading from '../components/Heading'
import Hero from '../components/Hero'
import Service from '../components/Service'

import GlobalTech from '../components/GlobalTech'
import Footer from '../components/Footer'
import Feature1 from '../components/Feature1'

const LandingPage = () => {
  return (
    <div className='w-[100vw] '>
      <Heading/>
      <Hero/>
      <Service/>
      <Feature1/>
      <Footer/>
      {/* <GlobalTech/> */}
    </div>
  )
}

export default LandingPage
