import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS, HTTP_STATUS } from '../utils/constants'

// Create axios instance with base configuration
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ============================================
// Request Interceptor
// ============================================
// Add JWT token to Authorization header for all requests

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================
// Response Interceptor
// ============================================
// Handle responses and errors globally

client.interceptors.response.use(
  (response) => {
    // Success response - return data directly
    return response.data
  },
  (error) => {
    // Handle different error types
    const status = error.response?.status

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
    }

    // Return error with response data
    return Promise.reject(error.response?.data || error)
  }
)

export default client
