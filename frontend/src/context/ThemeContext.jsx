import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

/**
 * ThemeContext — light/dark mode.
 *
 * How it works:
 * 1. Tailwind's dark: styles apply when <html> has class="dark"
 *    (set up via @custom-variant in globals.css)
 * 2. We toggle that class here and remember the choice in localStorage
 * 3. First visit: respect the OS preference (prefers-color-scheme)
 */
const ThemeContext = createContext()

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME)
  if (saved === 'dark' || saved === 'light') return saved
  // No saved preference — follow the OS setting
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Whenever theme changes: update <html> class + save to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
