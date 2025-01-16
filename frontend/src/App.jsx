
import './App.css'
import Courses from './pages/Courses'
import LandingPage from './pages/LandingPage'
import Landing from './pages/Landing'
import { Routes,Route } from 'react-router-dom'
import Contact from './pages/Contact'
import LMS from './pages/LMS'
import LMSCOURSE from './pages/LMSCOURSE'
function App() {
  

  return (
    <>
     <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/contact-us" element={<Contact/>}/>
      <Route path="/lms" element={<LMS/>}/>
      <Route path="/:id1/:id2" element={<LMSCOURSE/>}/>
     </Routes>
    </>
  )
}

export default App
