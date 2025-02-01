
import './App.css'
import Courses from './pages/Courses'
import LandingPage from './pages/LandingPage'
import Landing from './pages/Landing'
import { Routes,Route } from 'react-router-dom'
import Contact from './pages/Contact'
import LMS from './pages/LMS'
import About from './pages/About'
import LMSCOURSE from './pages/LMSCOURSE'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogDetail from './components/BlogDetail'

import { useState } from 'react'


import BatchList from './components/BatchList';
import StudentList from './components/StudentList';
import SearchBar from './components/SearchBar';
import Admin from './pages/Admin'
import BatchDetails from './pages/BatchDetails'

function App() {

 
  const [searchType, setSearchType] = useState('batch');
  return (
    <>
     <Routes>
      <Route path="/" element={<Landing />} />
     
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/contact-us" element={<Contact/>}/>
      {/* <Route path="/admin" element={<Admin/>}/>
      <Route path="/admin/:courseId" element={<CourseDetail />} /> */}

<Route path="/batches" element={<BatchList />} />
<Route path="/students" element={<StudentList />} />

<Route path="/admin" element={<Admin/>}/>
<Route path="/admin/batch/:batchId" element={<BatchDetails />} />

      <Route path="/lms" element={<LMS/>}/>
      <Route path="/:id1/:id2" element={<LMSCOURSE/>}/>
      <Route path="/about-us" element={<About/>}/>
      <Route path="/events" element={<Events/>}/>
      <Route path="/blogs" element={<Blog/>}/>
      <Route path="/blog/:id" element={<BlogDetail/>}/>
     </Routes>
    </>
  )
}

export default App

