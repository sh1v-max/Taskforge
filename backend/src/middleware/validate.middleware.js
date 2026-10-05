/**
 * Validation Middleware
 *
 * This file creates reusable middleware for validating:
 * 1. Request body (POST/PUT data)
 * 2. Query parameters (GET ?filters=...)
 *
 * Why a middleware?
 * Instead of validating in every controller:
 *
 * ❌ WRONG (Repetitive):
 * export const createTask = (req, res) => {
 *   const result = createTaskSchema.safeParse(req.body)
 *   if (!result.success) {
 *     return res.status(400).json({ error: result.error })
 *   }
 *   // ... rest of logic
 * }
 *
 * ✅ RIGHT (Clean):
 * router.post('/', validateBody(createTaskSchema), createTask)
 *
 * Middleware runs BEFORE controller, validates data, then passes control
 */

/**
 * Turn Zod's error into a list the frontend can show
 *
 * Zod 4 puts the problems on error.issues (Zod 3 called it error.errors).
 * Reading .errors on Zod 4 gives undefined, which is why every error
 * used to come back as field "unknown".
 *
 * Example output:
 * [{ field: "title", message: "Title must be a string" }]
 */
const toErrors = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body', // e.g., "status"; empty path = the whole body
    message: issue.message, // e.g., "Status must be pending, in-progress, or completed"
  }))

/**
 * Validate Request Body
 *
 * Creates middleware that validates req.body using a Zod schema
 *
 * Usage:
 * router.post('/', validateBody(createTaskSchema), createTask)
 *
 * Flow:
 * 1. Client sends: POST /api/tasks { "title": "Buy milk" }
 * 2. validateBody runs: checks { title: "..." } against schema
 * 3. If valid: req.body = validated data, next() calls controller
 * 4. If invalid: Returns 400 Bad Request with error details
 *
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    // safeParse returns: { success: true/false, data?: {...}, error?: {...} }
    const result = schema.safeParse(req.body)

    // If validation failed
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: toErrors(result.error),
      })
    }

    // ✅ Validation passed!
    // Replace req.body with Zod's parsed result, so controllers get the
    // cleaned-up values: trimmed strings, defaults filled in (status: 'pending'),
    // emails lowercased, and unknown fields dropped.
    // (Before this, the parsed data went to req.validatedData, but controllers
    // read req.body, so none of those transforms actually applied.)
    req.body = result.data

    // Call next middleware/controller
    next()
  }
}

/**
 * Validate Query Parameters
 *
 * Creates middleware that validates req.query using a Zod schema
 *
 * Usage:
 * router.get('/', validateQuery(tasksQuerySchema), getTasks)
 *
 * Flow:
 * 1. Client sends: GET /api/tasks?status=pending&page=abc
 * 2. validateQuery runs: checks { status: "pending", page: "abc" } against schema
 * 3. Zod coerces "abc" to number → fails validation
 * 4. Returns 400 Bad Request with error details
 *
 * Query parameter values are always STRINGS in Express:
 * GET /api/tasks?page=1&limit=10
 * req.query = { page: "1", limit: "10" } ← Strings!
 *
 * That's why Zod uses .coerce.number():
 * "1" (string) → 1 (number)
 *
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    // Validate req.query
    const result = schema.safeParse(req.query)

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid query parameters',
        errors: toErrors(result.error),
      })
    }

    // ✅ Validation passed!
    // Store validated query data in req.validatedQuery
    // Controllers can use req.validatedQuery for coerced/validated values
    req.validatedQuery = result.data

    next()
  }
}

/**
 * EXAMPLE USAGE:
 *
 * In task.router.js:
 * ─────────────────────────────────────────────────────────────
 *
 * import { validateBody, validateQuery } from '../middleware/validate.middleware.js'
 * import { createTaskSchema, updateTaskSchema, tasksQuerySchema } from '../schemas/task.schema.js'
 *
 * // Validate request body
 * router.post('/', validateBody(createTaskSchema), createTask)
 * router.put('/:id', validateBody(updateTaskSchema), updateTask)
 *
 * // Validate query parameters
 * router.get('/', validateQuery(tasksQuerySchema), getTasks)
 *
 * ─────────────────────────────────────────────────────────────
 *
 * FLOW EXAMPLE:
 *
 * Request: POST /api/tasks
 * Body: { title: "" }
 *   ↓
 * validateBody(createTaskSchema) runs
 *   ↓
 * Zod validates: title is empty string
 *   ↓
 * Validation FAILS (title must be non-empty)
 *   ↓
 * Returns: 400 Bad Request
 * { status: "error", message: "Validation failed", errors: [...] }
 *   ↓
 * createTask controller NEVER RUNS
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Request: GET /api/tasks?status=pending&page=2&limit=abc
 *   ↓
 * validateQuery(tasksQuerySchema) runs
 *   ↓
 * Zod validates: status is valid, page is 2, limit is "abc"
 *   ↓
 * Validation FAILS (limit must be a number)
 *   ↓
 * Returns: 400 Bad Request
 * { status: "error", message: "Invalid query parameters", errors: [...] }
 *   ↓
 * getTasks controller NEVER RUNS
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Request: POST /api/tasks
 * Body: { title: "Buy milk", status: "pending" }
 *   ↓
 * validateBody(createTaskSchema) runs
 *   ↓
 * Zod validates: PASSES all checks
 *   ↓
 * next() called
 *   ↓
 * createTask controller RUNS
 *   ↓
 * Returns: 201 Created { _id: "...", title: "Buy milk", ... }
 */
