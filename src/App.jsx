import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
// Student pages
import StudentHome from './pages/student/StudentHome'
import CheckIn from './pages/student/CheckIn'
import Logs from './pages/student/Logs'
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminInternships from './pages/admin/AdminInternships'
// Mentor pages
import MentorDashboard from './pages/mentor/MentorDashboard'
import MentorStudents from './pages/mentor/MentorStudents'
// Shared
import Profile from './pages/shared/Profile'
import Login from './pages/auth/Login'
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Student routes */}
            <Route path="/" element={<StudentHome />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/logs" element={<Logs />} />

            {/* Mentor routes */}
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/students" element={<MentorStudents />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/internships" element={<AdminInternships />} />

            {/* Shared */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
