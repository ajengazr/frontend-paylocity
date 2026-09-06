import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PaylocityHomepage from './pages/PaylocityHomepage'
import About from './pages/About'
import Help from './pages/help'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { LoadingProvider } from './contexts/LoadingContext';
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './contexts/ThemeContext'
import ScrollToTop from './components/ScrollToTop'
import NotificationsPage from './pages/NotificationsPage'
import DashboardLayout from './components/dash/DashboardLayout'
import { useAuth } from './contexts/AuthContext'

// Rute dashboard yang membuka tab tertentu dengan layout lengkap
const DashboardTabRoute = ({ tab }) => {
    const { role } = useAuth();
    return <DashboardLayout role={role} initialTab={tab} />;
};

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
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/cuti" element={<DashboardTabRoute tab="Manajemen Cuti" />} />
                    <Route path="/dashboard/my-cuti" element={<DashboardTabRoute tab="Cuti Saya" />} />
                    
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
