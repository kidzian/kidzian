import React from 'react'
import Heading from '../components/Heading'
import { Clock } from 'lucide-react'
import Minecraft from '../assets/Minecraft.jpg';
import Roblox from '../assets/Roblox.jpg';
import Webd from '../assets/Webd.jpg';


const courseData = [
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft },
  { title: 'Minecraft Coding', image: Minecraft },
  { title: 'Roblox Development', image: Roblox },
  { title: 'Web Development', image: Webd },
  { title: 'Python For Beginners', image: Minecraft } // Replace with another image if needed
  // Add more courses here
];
const LMSCOURSE = () => {
  return (
    <div>
      <Heading/>

      <div className="flex flex-col items-center">
        <div className="w-[80vw] p-1 ">
          <div className='w-[18vw] h-[25vh] flex flex-col items-center rounded-lg border border-gray-200 gap-4 justify-center'>
            <h1 className='text-xl font-semibold'>Attendance</h1>
            <div className='flex gap-2 text-3xl items-center justify-center'>
              <Clock className='text-blue-500' size={40}/>
              19/20
            </div>
            <h1 className='text-gray-500 text-sm '>Keep attending classes </h1>
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default LMSCOURSE
