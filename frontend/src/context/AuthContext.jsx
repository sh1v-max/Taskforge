import { createContext, useContext, useReducer, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

// Create Auth Context
const AuthContext = createContext()

// Auth Actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER'
}

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      }

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload }

    default:
      return state
  }
}

// Provider Component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const user = localStorage.getItem(STORAGE_KEYS.USER)

    if (token && user) {
      try {
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: {
            token,
            user: JSON.parse(user)
          }
        })
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }
  }, [])

  // Auth Methods
  const login = (user, token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

    dispatch({
      type: ACTIONS.LOGIN_SUCCESS,
      payload: { user, token }
    })
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    dispatch({ type: ACTIONS.LOGOUT })
  }

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error })
  }

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR })
  }

  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading })
  }

  const setUser = (user) => {
    dispatch({ type: ACTIONS.SET_USER, payload: user })
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }

  const value = {
    ...state,
    login,
    logout,
    setError,
    clearError,
    setLoading,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
