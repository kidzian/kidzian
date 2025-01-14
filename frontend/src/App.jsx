
import './App.css'
import Courses from './pages/Courses'
import LandingPage from './pages/LandingPage'
import Landing from './pages/Landing'
import { Routes,Route } from 'react-router-dom'
function App() {
  

  return (
    <>
     <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/courses" element={<Courses/>}/>
     </Routes>
    </>
  )
}

export default App
