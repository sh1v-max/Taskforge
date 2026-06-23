import Task from '../models/Task.js'

/**
 * Task Controller
 *
 * Controllers handle the business logic for each endpoint.
 * They receive requests, validate data, interact with the database,
 * and send responses back to the client.
 *
 * Each function:
 * 1. Receives (req, res) from Express
 * 2. Accesses data from request (body, params, query)
 * 3. Queries the database
 * 4. Sends back a response (JSON or error)
 *
 * NOTE: These are wrapped in async/await naturally.
 * Later (Step 18), we'll wrap them with express-async-handler
 * to automatically catch errors and send them to the error middleware.
 */

// ============ CREATE TASK (POST /api/tasks) ============
/**
 * Creates a new task for the authenticated user
 *
 * Request:
 * POST /api/tasks
 * Authorization: Bearer <token>
 * Body: { title: "Buy milk", description: "...", status: "pending" }
 *
 * Response (Success):
 * 201 Created
 * { _id: "...", title: "Buy milk", user: "...", createdAt: "..." }
 *
 * Response (Error):
 * 400 Bad Request - validation failed
 * 401 Unauthorized - no token
 * 500 Internal Server Error - database error
 *
 * Security:
 * - req.user.id comes from auth middleware (protected route)
 * - We FORCE user: req.user.id to prevent users from creating tasks for others
 * - This ensures req.body.user is IGNORED; we always use the logged-in user's ID
 */
export const createTask = async (req, res) => {
  // req.user is set by the protect middleware in auth.middleware.js
  // It contains the decoded JWT token info: { id: "...", email: "..." }

  // Extract task data from request body
  // At this point, Zod already validated it in validateBody middleware
  const { title, description, status, dueDate } = req.body

  // Create the task in MongoDB
  // We FORCE user: req.user.id for security
  // This prevents: POST /api/tasks with { user: "someone_else_id" }
  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    user: req.user.id, // ← SECURITY: Always use logged-in user, ignore req.body.user
  })

  // Send response to client
  // 201 = Created (new resource was created)
  res.status(201).json(task)
}

// ============ GET ALL TASKS (GET /api/tasks) ============
/**
 * Fetches all tasks for the authenticated user
 * Supports filtering, sorting, and pagination
 *
 * Request:
 * GET /api/tasks
 * GET /api/tasks?status=pending
 * GET /api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=10
 * Authorization: Bearer <token>
 *
 * Response:
 * 200 OK
 * {
 *   tasks: [{ _id: "...", title: "...", user: "..." }, ...],
 *   page: 1,
 *   limit: 10,
 *   total: 23
 * }
 *
 * Security:
 * - Only returns tasks where user === req.user.id
 * - User cannot see other people's tasks
 *
 * Features:
 * - Filtering: ?status=pending → only pending tasks
 * - Sorting: ?sortBy=dueDate:asc → earliest due dates first
 * - Pagination: ?page=2&limit=5 → tasks 6-10
 */
export const getTasks = async (req, res) => {
  // ============ BUILD BASE QUERY ============
  // Start with: find all tasks for this user
  // This is the security check - user can only see their own tasks
  const query = { user: req.user.id }

  // ============ APPLY FILTERING ============
  // If client sent ?status=pending, add it to the query
  // req.query is already validated by validateQuery middleware
  if (req.query.status) {
    query.status = req.query.status
    // Now query is: { user: "...", status: "pending" }
  }

  // ============ EXECUTE QUERY WITH SORTING & PAGINATION ============
  let mongoQuery = Task.find(query)

  // ============ APPLY SORTING ============
  // Format: "field:direction" (e.g., "dueDate:asc" or "createdAt:desc")
  if (req.query.sortBy) {
    const [field, direction] = req.query.sortBy.split(':')
    // Convert "asc" to 1, "desc" to -1
    const sortDirection = direction === 'desc' ? -1 : 1
    mongoQuery = mongoQuery.sort({ [field]: sortDirection })
  }

  // ============ APPLY PAGINATION ============
  // Use validatedQuery for coerced numeric values, with fallback to req.query
  const validatedQuery = req.validatedQuery || req.query
  const page = validatedQuery.page || 1
  const limit = validatedQuery.limit || 10
  const skip = (page - 1) * limit

  mongoQuery = mongoQuery.skip(skip).limit(limit)

  // ============ EXECUTE QUERY & GET TOTAL COUNT ============
  // Execute the query to get paginated results
  const tasks = await mongoQuery

  // Count total tasks (for frontend pagination)
  // Uses same query (user + filters) but no pagination
  const total = await Task.countDocuments(query)

  // ============ SEND RESPONSE ============
  res.json({
    tasks,
    page,
    limit,
    total, // Frontend uses this to calculate total pages
  })
}

// ============ GET SINGLE TASK (GET /api/tasks/:id) ============
/**
 * Fetches a single task by ID
 * Only returns if the user owns it
 *
 * Request:
 * GET /api/tasks/507f1f77bcf86cd799439011
 * Authorization: Bearer <token>
 *
 * Response (Success):
 * 200 OK
 * { _id: "507f1f77bcf86cd799439011", title: "...", user: "..." }
 *
 * Response (Not Found):
 * 404 Not Found
 * { error: "Task not found" }
 *
 * Response (Not Authorized):
 * 403 Forbidden
 * { error: "Not authorized to access this task" }
 *
 * Security:
 * - Query: { _id: req.params.id, user: req.user.id }
 * - If user doesn't own the task, findOne returns null
 * - We return 404 (user doesn't know it exists)
 */
export const getTaskById = async (req, res) => {
  // req.params.id comes from the URL path: /api/tasks/:id
  const { id } = req.params

  // Security: Check both task ID AND user ownership
  // If user doesn't own this task, findOne returns null
  const task = await Task.findOne({
    _id: id,
    user: req.user.id, // ← SECURITY: User must own the task
  })

  // If task not found or user doesn't own it
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  // Task found and user owns it
  res.json(task)
}

// ============ UPDATE TASK (PUT /api/tasks/:id) ============
/**
 * Updates a task (partial update - only sends changed fields)
 *
 * Request:
 * PUT /api/tasks/507f1f77bcf86cd799439011
 * Authorization: Bearer <token>
 * Body: { status: "in-progress" }
 * OR
 * Body: { status: "completed", description: "Finished!" }
 *
 * Response (Success):
 * 200 OK
 * { _id: "...", title: "...", status: "in-progress", user: "..." }
 *
 * Response (Not Found):
 * 404 Not Found
 *
 * Security:
 * - Checks user owns the task
 * - Only updates if user is authorized
 *
 * Options:
 * - new: true → Returns updated document (not the old one)
 * - runValidators: true → Runs Mongoose schema validation
 */
export const updateTask = async (req, res) => {
  const { id } = req.params

  // findOneAndUpdate:
  // 1. Find task where _id=id AND user=req.user.id (security)
  // 2. Update with new data from req.body
  // 3. Return updated document
  const task = await Task.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id, // ← SECURITY: User must own the task
    },
    req.body, // Only sends fields that changed (Zod validates these)
    {
      new: true, // Return updated document, not old one
      runValidators: true, // Run Mongoose schema validation on new data
    }
  )

  // If task not found or user doesn't own it
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  res.json(task)
}

// ============ DELETE TASK (DELETE /api/tasks/:id) ============
/**
 * Deletes a task permanently
 *
 * Request:
 * DELETE /api/tasks/507f1f77bcf86cd799439011
 * Authorization: Bearer <token>
 *
 * Response (Success):
 * 200 OK
 * { message: "Task deleted successfully" }
 * OR
 * 204 No Content (no body)
 *
 * Response (Not Found):
 * 404 Not Found
 *
 * Security:
 * - Checks user owns the task
 * - Can't delete someone else's tasks
 */
export const deleteTask = async (req, res) => {
  const { id } = req.params

  // findOneAndDelete:
  // 1. Find task where _id=id AND user=req.user.id (security)
  // 2. Delete it from database
  // 3. Return the deleted document
  const task = await Task.findOneAndDelete({
    _id: id,
    user: req.user.id, // ← SECURITY: User must own the task
  })

  // If task not found or user doesn't own it
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  // Return 200 with success message
  res.json({ message: 'Task deleted successfully' })
}

/**
 * SUMMARY OF CONTROLLERS:
 *
 * createTask (POST)
 * ├─ Creates new task
 * ├─ Forces user: req.user.id for security
 * └─ Returns 201 Created
 *
 * getTasks (GET)
 * ├─ Returns user's tasks
 * ├─ Supports filtering, sorting, pagination
 * └─ Returns 200 OK with { tasks, page, limit, total }
 *
 * getTaskById (GET :id)
 * ├─ Returns single task
 * ├─ Checks user owns it
 * └─ Returns 404 if not found or not authorized
 *
 * updateTask (PUT :id)
 * ├─ Updates task fields
 * ├─ Checks user owns it
 * └─ Returns updated document
 *
 * deleteTask (DELETE :id)
 * ├─ Deletes task permanently
 * ├─ Checks user owns it
 * └─ Returns 404 if not found or not authorized
 *
 * SECURITY PATTERN IN ALL:
 * Instead of: Task.findById(id)
 * Use: Task.findOne({ _id: id, user: req.user.id })
 *
 * This ensures the user owns the resource before returning/modifying it.
 */
