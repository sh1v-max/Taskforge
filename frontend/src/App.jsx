import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginPage } from './pages/Auth/LoginPage'
import { RegisterPage } from './pages/Auth/RegisterPage'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { PrivateRoute } from './components/Auth/PrivateRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Home/Landing */}
          <Route path="/" element={<div className="flex-center min-h-screen"><h1>TaskForge Frontend 🚀</h1></div>} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard (protected) */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
