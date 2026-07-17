import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getMe, updateProfile } from '../../api/auth'
import { ThemeToggle } from '../../components/Common/ThemeToggle'
import { PasswordInput } from '../../components/Common/PasswordInput'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const { showToast } = useToast()

  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Load fresh profile from the API (not just localStorage)
  useEffect(() => {
    getMe()
      .then((data) => {
        setProfile(data.user)
        setName(data.user.name)
      })
      .catch(() => showToast('Failed to load profile', 'error'))
  }, [])

  const handleNameSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return showToast('Name cannot be empty', 'error')

    try {
      setSavingName(true)
      const data = await updateProfile({ name: name.trim() })
      setProfile(data.user)
      setUser({ ...user, name: data.user.name }) // Sync AuthContext + localStorage
      showToast('Name updated')
    } catch (error) {
      showToast(error.message || 'Failed to update name', 'error')
    } finally {
      setSavingName(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      return showToast('New password must be at least 6 characters', 'error')
    }

    try {
      setSavingPassword(true)
      await updateProfile({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      showToast('Password changed')
    } catch (error) {
      showToast(error.message || error.errors?.[0] || 'Failed to change password', 'error')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ArrowLeft size={18} />
            <span className="font-bold">Back to Dashboard</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-8 max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h2>

        {/* Account info */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account</h3>
          {profile ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="text-gray-900 dark:text-white">{profile.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Role</dt>
                <dd className="text-gray-900 dark:text-white">{profile.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Member since</dt>
                <dd className="text-gray-900 dark:text-white">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>

        {/* Update name */}
        <form onSubmit={handleNameSave} className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Display Name</h3>
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={savingName}
            />
          </div>
          <button type="submit" disabled={savingName} className="btn-primary">
            {savingName ? 'Saving...' : 'Save Name'}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePasswordSave} className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
          <div>
            <label className="label">Current Password</label>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={savingPassword}
              required
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={savingPassword}
              required
            />
          </div>
          <button type="submit" disabled={savingPassword} className="btn-primary">
            {savingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </main>
    </div>
  )
}
