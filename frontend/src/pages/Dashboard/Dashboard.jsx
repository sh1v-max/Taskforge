import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskForge</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8">
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}! 🎉
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You are logged in as <strong>{user?.email}</strong> (role: {user?.role})
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Task management coming in the next steps...
          </p>
        </div>
      </main>
    </div>
  )
}
