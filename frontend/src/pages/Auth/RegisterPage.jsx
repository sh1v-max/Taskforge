import { RegisterForm } from '../../components/Auth/RegisterForm'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export function RegisterPage() {
  const { isAuthenticated } = useAuth()

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join TaskForge and start managing tasks
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
