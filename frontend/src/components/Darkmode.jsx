import { useEffect, useState } from "react"
import { Sun,Moon } from "lucide-react";


function DarkModeToggle()
{
    const [isDark,SetIsDark]=useState(false);
    useEffect(()=>{
        if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
    },[isDark])
    return(
        <div>
            <button onClick={()=>SetIsDark(!isDark)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition duration-300">
                  {isDark ? <Sun size={20} className='text-yellow-400' /> : <Moon size={20} className='text-gray-800' />}
</button>
        </div>
    )
}
export default DarkModeToggle;