import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CheckInProvider } from "./context/CheckInContext";
import { LogsProvider } from "./context/LogsContext";
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
      <CheckInProvider>
        <LogsProvider>
          <BrowserRouter>
          <Routes>
            {/* Login route - outside MainLayout */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* All other routes - inside MainLayout */}
            <Route element={<MainLayout />}>
              {/* Student routes */}
              <Route path="/home" element={<StudentHome />} />
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
            </Route>
          </Routes>
          </BrowserRouter>
        </LogsProvider>
      </CheckInProvider>
    </AuthProvider>
  );
}

export default App;
