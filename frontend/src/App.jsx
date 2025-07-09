import "./App.css"
import Courses from "./pages/Courses"
import Landing from "./pages/Landing"
import { Routes, Route } from "react-router-dom"
import Contact from "./pages/Contact"
import LMSLogin from "./pages/LMSLogin"
import About from "./pages/About"
import LMSCOURSE from "./pages/LMSCOURSE"
import Events from "./pages/Events"
import Blog from "./pages/Blog"
import BlogDetail from "./components/BlogDetail"
import ViewStory from "./pages/view-story"
import AdminDashboard from "./pages/AdminDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import Chatbot from "./components/Chatbot"
import AdminCourse from "./pages/AdminCourse"
import BatchDetail from "./pages/BatchDetail"
import Students from "./pages/Students"
import Teachers from "./pages/Teachers"
import StudentDetails from "./pages/StudentDetails"
import TeacherDetails from "./pages/TeacherDetails"
import Layout from "./components/Layout"
import SuccessStories from "./pages/Success-Stories"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsAndConditions from "./pages/TermsandCond"
import Projects from "./pages/Projects"
import ProtectedRoute from "./components/ProtectedRoute"
import AddBatchForm from "./components/AddBatchForm"
import AddCourse from "./components/AddCourseForm"
import BatchManagement from "./components/BatchManagements"
import CourseManagement from "./components/CourseManagements"
import DataFixHelper from "./components/Data-fixhelper"
import EnrollmentToolPage from "./pages/EnrollmentToolPage"
import ReturnAndCancellation from "./pages/ReturnAndCancellation"

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/lms" element={<LMSLogin />} />
          <Route path="/:id1/:id2" element={<LMSCOURSE />} />
          <Route path="/About" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/:courseName"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/:courseName/batch/:batchName"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <BatchDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
  path="/admin-dashboard/add-student"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Students />
    </ProtectedRoute>
  }
/>

         <Route
  path="/admin-dashboard/add-course"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AddCourse />
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin-dashboard/add-teacher"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Teachers />
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin-dashboard/add-batch"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AddBatchForm />
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin-dashboard/view-batch"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <BatchManagement />
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin-dashboard/view-course"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CourseManagement />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin-dashboard/teachers/:teacherId"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TeacherDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/data-fix" element={  <ProtectedRoute allowedRoles={["teacher"]}>
                <DataFixHelper/>
              </ProtectedRoute>}
          />

          {/* Protected Teacher Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
              <Route path="/admin-dashboard/enrollmenttool" element={<EnrollmentToolPage />} />
          <Route
            path="/teacher-dashboard/:courseName"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <AdminCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard/:courseName/batch/:batchName"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <BatchDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard/students"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Students />
              </ProtectedRoute>
            }
          />

          {/* Protected Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/course/:courseId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <LMSCOURSE />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                <StudentDetails />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/view-story" element={<ViewStory />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/return-cancellation" element={<ReturnAndCancellation/>} />

        </Routes>
      </Layout>
    </>
  )
}

export default App
