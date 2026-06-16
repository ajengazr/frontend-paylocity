import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PaylocityHomepage from './pages/PaylocityHomepage'
import About from './pages/About'
import Help from './pages/help'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { LoadingProvider } from './contexts/LoadingContext';
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './contexts/ThemeContext'
import ScrollToTop from './components/ScrollToTop'
import NotificationsPage from './pages/NotificationsPage'
import LeaveRequests from './components/admin/LeaveRequests'
import MyLeaveRequests from './components/employee/MyLeaveRequests'

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <LoadingProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<PaylocityHomepage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/cuti" element={<LeaveRequests />} />
                    <Route path="/dashboard/my-cuti" element={<MyLeaveRequests />} />
                    
                  </Route>
                </Routes>
              </BrowserRouter>
            </LoadingProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App
