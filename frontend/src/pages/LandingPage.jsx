import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, Zap, Shield } from 'lucide-react'

export function LandingPage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskForge</h1>
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary btn-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Forge your day, one task at a time. 🔨
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-gray-600 dark:text-gray-400">
          TaskForge is a simple, fast task manager. Create tasks, track progress,
          and get things done — without the clutter.
        </p>
        <div className="mt-8 flex-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Welcome back, {user?.name?.split(' ')[0]} →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20 grid gap-6 md:grid-cols-3">
        <div className="card p-6 text-center">
          <CheckCircle className="mx-auto text-blue-600" size={32} />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Simple Tracking</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Pending, in progress, completed — three statuses, zero confusion.
          </p>
        </div>
        <div className="card p-6 text-center">
          <Zap className="mx-auto text-blue-600" size={32} />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Fast & Lightweight</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Built with React and Vite. No bloat, instant updates.
          </p>
        </div>
        <div className="card p-6 text-center">
          <Shield className="mx-auto text-blue-600" size={32} />
          <h3 className="mt-4 font-bold text-gray-900 dark:text-white">Private & Secure</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            JWT-secured API. Your tasks are yours — nobody else can see them.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-gray-500">
        TaskForge — a full-stack learning project
      </footer>
    </div>
  )
}
