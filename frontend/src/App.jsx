import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { ProfilePage } from './pages/Profile/ProfilePage'
import { TaskDetailPage } from './pages/Tasks/TaskDetailPage'
import { PrivateRoute } from './components/Auth/PrivateRoute'

function App() {
  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Home/Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard (protected) */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
