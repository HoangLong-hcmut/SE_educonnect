import React, { Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./stores/useAuthStore"

// Import các trang
import Login from "./pages/Auth/Login"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Lazy imports
const Help = React.lazy(() => import("./pages/Auth/Help"))
const About = React.lazy(() => import("./pages/Auth/About"))
const Signup = React.lazy(() => import("./pages/Auth/Signup"))
const Terms = React.lazy(() => import("./pages/Auth/Terms"))
const Privacy = React.lazy(() => import("./pages/Auth/Privacy"))
const SsoCallbackPage = React.lazy(() => import('./pages/Auth/SsoCallbackPage'))

const StudentDashboard = React.lazy(() => import("./pages/Student/Dashboard"))
const TutorDashboard = React.lazy(() => import("./pages/Tutor/Dashboard"))
const AdminDashboard = React.lazy(() => import("./pages/Admin/Dashboard"))

const StudentResources = React.lazy(() => import("./pages/Student/Resources"))
const TutorResources = React.lazy(() => import("./pages/Tutor/Resources"))
const AdminResources = React.lazy(() => import("./pages/Admin/Resources"))

const StudentSession = React.lazy(() => import("./pages/Student/MySession"))
const TutorSchedule = React.lazy(() => import("./pages/Tutor/Schedule"))

const FindTutor = React.lazy(() => import("./pages/Student/FindTutor"))
const StudentFeedbackPage = React.lazy(() => import("./pages/Student/FeedbackPage"));

const TutorProfile = React.lazy(() => import("./pages/Tutor/Profile"))
const TutorMentee = React.lazy(() => import("./pages/Tutor/Mentee"))

const AdminStatistics = React.lazy(() => import("./pages/Admin/Statistics"))
const AdminTutorPerformance = React.lazy(() => import("./pages/Admin/TutorPerformance"))
// [NEW] Thêm dòng này: Import trang Duyệt hồ sơ (TutorApproval)
const AdminTutorApproval = React.lazy(() => import("./pages/Admin/TutorApproval"))
const AdminTutorResources = React.lazy(() => import("./pages/Admin/Resources"))

// Loader
const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>
)

// Wrapper: dashboard theo role
const DashboardWrapper = () => {
  // const user = useAuthStore((s) => s.user)
  // const role = user?.role

  // if (!role) return <Navigate to="/login" replace />

  // if (role === "student") return <StudentDashboard />
  // if (role === "tutor") return <TutorDashboard />
  // if (role === "admin") return <AdminDashboard />
  // ĐỌC activeRole THAY VÌ user.role
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!activeRole) return <Navigate to='/login' replace />;

  if (activeRole === 'student') return <StudentDashboard />;
  if (activeRole === 'tutor') return <TutorDashboard />;
  if (activeRole === 'admin') return <AdminDashboard />;

  return <Navigate to="/login" replace />
}

// Wrapper: calendar theo role
const CalendarWrapper = () => {
  // ĐỌC activeRole THAY VÌ user.role
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!activeRole) return <Navigate to='/login' replace />;

  if (activeRole === 'student') return <StudentSession />;
  if (activeRole === 'tutor') return <TutorSchedule />;

  return <Navigate to="/login" replace />
  // const user = useAuthStore((s) => s.user)
  // const role = user?.role

  // if (!role) return <Navigate to="/login" replace />

  // if (role === "student") return <StudentSession />
  // if (role === "tutor") return <TutorSchedule />

  // return <Navigate to="/login" replace />
}

// Wrapper: resources theo role
const ResourcesWrapper = () => {
  // ĐỌC activeRole THAY VÌ user.role
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!activeRole) return <Navigate to='/login' replace />;

  if (activeRole === 'student') return <StudentResources />;
  if (activeRole === 'tutor') return <TutorResources />;
  if (activeRole === 'admin') return <AdminResources />;

  return <Navigate to="/login" replace />
  // const user = useAuthStore((s) => s.user)
  // const role = user?.role

  // if (!role) return <Navigate to="/login" replace />

  // if (role === "student") return <StudentResources />
  // if (role === "tutor") return <TutorResources />
  // if (role === "admin") return <AdminResources />

  // return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirect mặc định */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/policy" element={<Privacy />} />
          <Route path="/auth/sso/finalize" element={<SsoCallbackPage />} />
          
          <Route element={<ProtectedRoute />}>
            {/* Auto Route */}
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/calendar" element={<CalendarWrapper />} />
            <Route path="/resources" element={<ResourcesWrapper />} />

            {/* DIRECT DEV URL FOR ADMIN */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/statistics" element={<AdminStatistics />} />
            <Route path="/admin/tutorperformance" element={<AdminTutorPerformance />} />
            
            {/* [NEW] Thêm Route cho trang Profile Approval */}
            <Route path="/admin/approval" element={<AdminTutorApproval />} />
          
            {/* [NEW] Thêm Route cho trang Profile Approval */}
            <Route path="/admin/resources" element={<AdminTutorResources />} />

            {/* Student */}
            <Route path="/findtutor" element={<FindTutor />} />
            <Route path="/feedback/:sessionId" element={<StudentFeedbackPage />} />

            {/* Tutor */}
            <Route path="/profile" element={<TutorProfile />} />
            <Route path="/students" element={<TutorMentee />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}