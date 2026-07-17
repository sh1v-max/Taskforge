import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthService } from '../../hooks/useAuthService'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PATTERNS } from '../../utils/constants'
import { PasswordInput } from '../Common/PasswordInput'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export function LoginForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const { loginUser } = useAuthService()
  const { isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const result = await loginUser(data.email, data.password)
    if (result.success) {
      reset()
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Email Field */}
      <div>
        <label className="label">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="input-field"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label className="label">Password</label>
        <PasswordInput
          placeholder="••••••••"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
          Register here
        </a>
      </p>
    </form>
  )
}
