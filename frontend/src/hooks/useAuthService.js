import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

export function useAuthService() {
  const { login, setError, setLoading, clearError } = useAuth()

  const register = async (name, email, password) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.post('/api/auth/register', {
        name,
        email,
        password
      })

      if (response.token && response.user) {
        login(response.user, response.token)
        return { success: true, message: 'Registration successful!' }
      }
    } catch (error) {
      const errorMsg = error.errors?.[0] || error.message || ERROR_MESSAGES.UNKNOWN_ERROR
      setError(errorMsg)
      return { success: false, message: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async (email, password) => {
    try {
      setLoading(true)
      clearError()

      const response = await client.post('/api/auth/login', {
        email,
        password
      })

      if (response.token && response.user) {
        login(response.user, response.token)
        return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS }
      }
    } catch (error) {
      const errorMsg = error.errors?.[0] || error.message || ERROR_MESSAGES.INVALID_CREDENTIALS
      setError(errorMsg)
      return { success: false, message: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return { register, loginUser }
}
