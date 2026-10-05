// Zod 4 reports problems on error.issues (Zod 3 used error.errors)
const toErrors = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }))

// Replaces req.body with the parsed result, so controllers get trimmed,
// defaulted values and unknown fields are dropped.
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ status: 'error', message: 'Validation failed', errors: toErrors(result.error) })
  }
  req.body = result.data
  next()
}

// Express 5 makes req.query read-only, so parsed values live on req.validatedQuery.
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json({ status: 'error', message: 'Invalid query parameters', errors: toErrors(result.error) })
  }
  req.validatedQuery = result.data
  next()
}
