// Turns errors thrown anywhere in a route into consistent JSON.
// Must be registered last in app.js.
export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return res.status(400).json({ status: 'error', message: 'Validation error', errors })
  }

  // Malformed ObjectId in the URL, e.g. /api/tasks/not-an-id
  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'Invalid ID format', field: err.path })
  }

  // Unique index violation; the email check in register can lose a race
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({ status: 'error', message: `${field} already exists`, field })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'error', message: 'Invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'error', message: 'Token expired' })
  }

  // Errors thrown on purpose with err.statusCode set
  if (err.statusCode) {
    return res.status(err.statusCode).json({ status: 'error', message: err.message })
  }

  console.error('Unexpected error:', err)

  res.status(500).json({
    status: 'error',
    message: 'Server error',
    // Never expose internals outside development
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  })
}
