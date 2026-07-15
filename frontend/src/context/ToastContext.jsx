import { createContext, useContext, useState, useCallback } from 'react'
import { DELAYS } from '../utils/constants'

/**
 * ToastContext — app-wide notifications.
 *
 * Same pattern as AuthContext: a Provider holds the state,
 * a custom hook (useToast) gives any component access to it.
 *
 * Usage anywhere in the app:
 *   const { showToast } = useToast()
 *   showToast('Task created!', 'success')
 */
const ToastContext = createContext()

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-remove after a few seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, DELAYS.TOAST_DURATION)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — fixed to bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`fade-in px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
