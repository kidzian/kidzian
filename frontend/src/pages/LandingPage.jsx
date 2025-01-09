import React from 'react'
import Heading from '../components/Heading'
import Hero from '../components/Hero'
import Service from '../components/Service'

import GlobalTech from '../components/GlobalTech'

const LandingPage = () => {
  return (
    <div className='w-[100vw] '>
      <Heading/>
      <Hero/>
      <Service/>
      {/* <GlobalTech/> */}
    </div>
  )
}

export default LandingPage
