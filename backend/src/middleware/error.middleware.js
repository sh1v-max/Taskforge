/**
 * Global Error Handler Middleware
 *
 * This middleware catches ALL errors from anywhere in the application
 * and formats them into consistent JSON responses.
 *
 * How it works:
 * 1. Any error thrown in a controller or middleware reaches here
 * 2. We check the error type
 * 3. Format appropriate error response
 * 4. Send to client with correct status code
 *
 * Order matters: This MUST be the last middleware in app.js
 * so it catches all errors from previous middleware/routes
 *
 * Usage in app.js:
 *   app.use(errorHandler)  // Add at the very end, after all routes
 */

export const errorHandler = (err, req, res, next) => {
  // ============ MONGODB/MONGOOSE ERRORS ============

  // Mongoose Validation Error
  // Example: title required but not provided
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }))

    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors
    })
  }

  // Mongoose Cast Error
  // Example: Invalid ObjectId in URL parameter
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
      field: err.path
    })
  }

  // Mongoose Duplicate Key Error
  // Example: Trying to create user with email that already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`,
      field
    })
  }

  // ============ JWT ERRORS ============

  // JWT Verification Errors
  // Example: Token signature doesn't match
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    })
  }

  // JWT Expiration Error
  // Example: Token is expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    })
  }

  // ============ CUSTOM APP ERRORS ============

  // If error has custom status code (we throw these in controllers)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  // ============ GENERIC SERVER ERROR ============

  // Catch-all for unexpected errors
  console.error('Unexpected error:', err)

  res.status(500).json({
    status: 'error',
    message: 'Server error',
    // In production, don't expose error details
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  })
}

/**
 * Example error types handled:
 *
 * 1. Mongoose Validation Error
 *    const user = await User.create({ email: 'invalid' })
 *    → 400 with field-specific errors
 *
 * 2. Duplicate Key Error
 *    const user = await User.create({ email: 'existing@email.com' })
 *    → 400 "email already exists"
 *
 * 3. Cast Error
 *    GET /api/tasks/invalid-id
 *    → 400 "Invalid ID format"
 *
 * 4. JWT Errors
 *    GET /api/tasks (with invalid token)
 *    → 401 "Invalid token"
 *
 * 5. Generic Server Errors
 *    Unexpected error in any middleware/controller
 *    → 500 "Server error"
 *
 * How to throw custom errors in controllers:
 *   const error = new Error('Custom message')
 *   error.statusCode = 400  // or 401, 403, etc
 *   throw error
 */
