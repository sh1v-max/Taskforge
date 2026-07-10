import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages (to be created in Step 4)
// import LandingPage from './pages/LandingPage'
// import LoginPage from './pages/Auth/LoginPage'
// import RegisterPage from './pages/Auth/RegisterPage'
// import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Temporary landing page */}
          <Route path="/" element={<div className="flex-center min-h-screen"><h1>TaskForge Frontend - Coming Soon 🚀</h1></div>} />

          {/* Auth Routes (to be added in Step 4) */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
