
import './App.css'
import Courses from './pages/Courses'

import Landing from './pages/Landing'
import { Routes,Route } from 'react-router-dom'
import Contact from './pages/Contact'
import LMS from './pages/LMS'
import About from './pages/About'
import LMSCOURSE from './pages/LMSCOURSE'
import Events from './pages/Events'
import Blog from './pages/Blog'
import BlogDetail from './components/BlogDetail'


import AdminDashboard from './components/AdminDashboard'
import CourseBatches from './components/CourseBatches'

import Chatbot from './components/Chatbot'
import AdminLogin from './pages/AdminLogin'
import AdminCourse from './pages/AdminCourse'
import BatchDetail from './pages/BatchDetail'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import StudentDetails from './pages/StudentDetails'
import TeacherDetails from './pages/TeacherDetails'
import TeacherLogin from './pages/TeacherLogin'
import TeacherDashboard from './components/TeacherDashboard'

function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chatbot" element={<Chatbot/>} />
     
      <Route path="/courses" element={<Courses/>}/>
      <Route path="/contact-us" element={<Contact/>}/>
     
      <Route path="/lms" element={<LMS/>}/>
      <Route path="/:id1/:id2" element={<LMSCOURSE/>}/>
      <Route path="/about-us" element={<About/>}/>
      <Route path="/events" element={<Events/>}/>
      <Route path="/blogs" element={<Blog/>}/>
      <Route path="/blog/:id" element={<BlogDetail/>}/>
      
      <Route path="/login/admin" element={<AdminLogin/>} />
      <Route path="/login/teacher" element={<TeacherLogin/>} /> 

      <Route path="/admin-dashboard" element={<AdminDashboard/>} />
      teacher-dashboard
      <Route path="/teacher-dashboard" element={<TeacherDashboard/>} />

      <Route path="/teacher-dashboard/:courseName" element={<AdminCourse/>} />
      <Route path="/admin-dashboard/:courseName" element={<AdminCourse/>} />

      <Route path="/teacher-dashboard/:courseName/batch/:batchName" element={<BatchDetail />} />
      <Route path="/admin-dashboard/:courseName/batch/:batchName" element={<BatchDetail />} />
      
      <Route path="/teacher-dashboard/students" element={<Students />} />
      <Route path="/admin-dashboard/students" element={<Students />} />

     
      <Route path="/admin-dashboard/teachers" element={<Teachers />} />

      <Route path="/students/:id" element={<StudentDetails />} />
      <Route path="/admin-dashboard/teachers/:teacherId" element={<TeacherDetails />} />
     </Routes>
    </>
  )
}

export default App

