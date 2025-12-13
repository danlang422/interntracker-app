import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CheckInProvider } from "./context/CheckInContext";
import { LogsProvider } from "./context/LogsContext";
import { InternshipsProvider } from "./context/InternshipsContext";
import { StudentsProvider } from "./context/StudentsContext";
import { AssignmentsProvider } from "./context/AssignmentsContext";
import { BlockTypesProvider } from "./context/BlockTypesContext";
import { ScheduleTemplatesProvider } from "./context/ScheduleTemplatesContext";
import { SectionsProvider } from "./context/SectionsContext";
import MainLayout from "./components/layout/MainLayout";

// Student pages
import StudentHome from "./pages/student/StudentHome";
import CheckIn from "./pages/student/CheckIn";
import Logs from "./pages/student/Logs";

// Advisor pages
import AdvisorDashboard from "./pages/advisor/AdvisorDashboard";
import Students from "./pages/advisor/Students";
import CheckIns from "./pages/advisor/CheckIns";
import AdvisorLogs from "./pages/advisor/AdvisorLogs";

// Admin pages (system management)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminInternships from "./pages/admin/AdminInternships";
import AdminBlockTypes from "./pages/admin/AdminBlockTypes";
import AdminScheduleTemplates from "./pages/admin/AdminScheduleTemplates";
import AdminCompetencies from "./pages/admin/AdminCompetencies";
import AdminSections from "./pages/admin/AdminSections";

// Mentor pages
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorStudents from "./pages/mentor/MentorStudents";

// Shared pages
import Profile from "./pages/shared/Profile";
import CreatePage from "./pages/shared/CreatePage";
import NotificationsPage from "./pages/shared/NotificationsPage";
import Login from "./pages/auth/Login";

function App() {
  return (
    <AuthProvider>
      <SectionsProvider>
        <ScheduleTemplatesProvider>
          <BlockTypesProvider>
            <InternshipsProvider>
              <StudentsProvider>
                <AssignmentsProvider>
                  <CheckInProvider>
                    <LogsProvider>
                      <BrowserRouter>
                        <Routes>
                          {/* Login route - outside MainLayout */}
                          <Route path="/" element={<Login />} />
                          <Route path="/login" element={<Login />} />

                          {/* All other routes - inside MainLayout */}
                          <Route element={<MainLayout />}>
                            {/* Shared routes (all roles) */}
                            <Route path="/create" element={<CreatePage />} />
                            <Route
                              path="/notifications"
                              element={<NotificationsPage />}
                            />
                            <Route path="/profile" element={<Profile />} />

                            {/* Student routes */}
                            <Route path="/home" element={<StudentHome />} />
                            <Route path="/checkin" element={<CheckIn />} />
                            <Route path="/logs" element={<Logs />} />

                            {/* Advisor routes */}
                            <Route
                              path="/dashboard"
                              element={<AdvisorDashboard />}
                            />
                            <Route path="/students" element={<Students />} />
                            <Route path="/checkins" element={<CheckIns />} />
                            <Route
                              path="/advisorlogs"
                              element={<AdvisorLogs />}
                            />

                            {/* Admin routes (system management) */}
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route
                              path="/admin/students"
                              element={<AdminStudents />}
                            />
                            <Route
                              path="/admin/internships"
                              element={<AdminInternships />}
                            />
                            <Route
                              path="/admin/block-types"
                              element={<AdminBlockTypes />}
                            />
                            <Route
                              path="/admin/schedule-templates"
                              element={<AdminScheduleTemplates />}
                            />
                            <Route
                              path="/admin/competencies"
                              element={<AdminCompetencies />}
                            />
                            <Route
                              path="/admin/sections"
                              element={<AdminSections />}
                            />

                            {/* Mentor routes */}
                            <Route
                              path="/mentor"
                              element={<MentorDashboard />}
                            />
                            <Route
                              path="/mentor/students"
                              element={<MentorStudents />}
                            />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                    </LogsProvider>
                  </CheckInProvider>
                </AssignmentsProvider>
              </StudentsProvider>
            </InternshipsProvider>
          </BlockTypesProvider>
        </ScheduleTemplatesProvider>
      </SectionsProvider>
    </AuthProvider>
  );
}

export default App;
