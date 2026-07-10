// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TaskForge'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Task Status Enums
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed'
}

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme'
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already exists.',
  VALIDATION_ERROR: 'Please fix the validation errors.',
  TASK_NOT_FOUND: 'Task not found.',
  UNKNOWN_ERROR: 'An unknown error occurred.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

// Sorting
export const SORT_OPTIONS = {
  RECENT: { field: 'createdAt', direction: 'desc', label: 'Recent' },
  OLDEST: { field: 'createdAt', direction: 'asc', label: 'Oldest' },
  DUE_DATE_ASC: { field: 'dueDate', direction: 'asc', label: 'Due Date (Earliest)' },
  DUE_DATE_DESC: { field: 'dueDate', direction: 'desc', label: 'Due Date (Latest)' },
  TITLE_ASC: { field: 'title', direction: 'asc', label: 'Title (A-Z)' },
  TITLE_DESC: { field: 'title', direction: 'desc', label: 'Title (Z-A)' }
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:id',
  TASK_EDIT: '/tasks/:id/edit',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGOUT: '/logout',
  NOT_FOUND: '*'
}

// Features
export const FEATURES = {
  DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
}

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/.+/
}

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
}

// Delays (in milliseconds)
export const DELAYS = {
  TOAST_DURATION: 3000,
  MODAL_ANIMATION: 300,
  DEBOUNCE: 500,
  THROTTLE: 1000
}
