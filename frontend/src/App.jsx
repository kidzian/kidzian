
import './App.css'
import Courses from './pages/Courses'
import LandingPage from './pages/LandingPage'
import { Routes,Route } from 'react-router-dom'
function App() {
  

  return (
    <>
     <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<Courses/>}/>
     </Routes>
    </>
  )
}

export default App
