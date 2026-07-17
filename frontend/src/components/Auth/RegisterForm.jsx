import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthService } from '../../hooks/useAuthService'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PATTERNS } from '../../utils/constants'
import { PasswordInput } from '../Common/PasswordInput'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[@$!%*?&]/, 'Password must contain a special character (@$!%*?&)'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  const { register: registerUser } = useAuthService()
  const { isLoading, error } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password)
    if (result.success) {
      reset()
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Name Field */}
      <div>
        <label className="label">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="input-field"
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>

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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Must contain: uppercase, lowercase, number, special character (@$!%*?&)
        </p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="label">Confirm Password</label>
        <PasswordInput
          placeholder="••••••••"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
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
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Sign in here
        </a>
      </p>
    </form>
  )
}
