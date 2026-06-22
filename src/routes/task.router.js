import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateBody, validateQuery } from '../middleware/validate.middleware.js'
import {
  createTaskSchema,
  updateTaskSchema,
  tasksQuerySchema,
} from '../schemas/task.schema.js'

/**
 * Task Router
 *
 * This file defines all task-related HTTP endpoints:
 * - POST /api/tasks → createTask
 * - GET /api/tasks → getTasks
 * - GET /api/tasks/:id → getTaskById
 * - PUT /api/tasks/:id → updateTask
 * - DELETE /api/tasks/:id → deleteTask
 *
 * Router is like a mini Express app for organizing routes
 * We mount it in app.js: app.use('/api/tasks', taskRouter)
 *
 * Express Request Flow:
 * 1. Client sends: POST /api/tasks
 * 2. Express routes to: app.use('/api/tasks', taskRouter)
 * 3. Router matches: router.post('/', handler)
 * 4. Executes middleware chain (if any)
 * 5. Calls controller function: createTask(req, res)
 */

const router = express.Router()

// ============ AUTHENTICATION MIDDLEWARE ============
/**
 * Apply protect middleware to ALL routes in this router
 *
 * router.use(middleware) applies middleware to all routes
 * If we applied it to individual routes:
 * router.post('/', protect, createTask)  ← Repetitive
 * router.get('/', protect, getTasks)
 * router.get('/:id', protect, getTaskById)
 *
 * Instead, apply once to all:
 * router.use(protect)  ← Cleaner, DRY principle
 *
 * What protect does:
 * 1. Checks if Authorization header has a valid JWT token
 * 2. If valid: Decodes token, sets req.user
 * 3. If invalid: Returns 401 Unauthorized
 *
 * Result: Every route below requires authentication
 */
router.use(protect)

// ============ CREATE TASK ============
/**
 * POST /api/tasks
 *
 * Request:
 * {
 *   "title": "Buy milk",
 *   "description": "From supermarket",
 *   "status": "pending",
 *   "dueDate": "2026-06-15"
 * }
 *
 * Response (201 Created):
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "title": "Buy milk",
 *   "user": "607f1f77bcf86cd799439012",
 *   "createdAt": "2026-06-03T10:00:00Z",
 *   "updatedAt": "2026-06-03T10:00:00Z"
 * }
 *
 * Note: No validateBody middleware yet
 * We'll add that in Step 13.5
 */
router.post('/', validateBody(createTaskSchema), createTask)

// ============ GET ALL TASKS ============
/**
 * GET /api/tasks
 * GET /api/tasks?status=pending
 * GET /api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=10
 *
 * Query Parameters (optional):
 * - status: Filter by status (pending, in-progress, completed)
 * - sortBy: Sort field and direction (dueDate:asc, createdAt:desc)
 * - page: Pagination page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 *
 * Response (200 OK):
 * {
 *   "tasks": [
 *     { "_id": "...", "title": "Buy milk", ... },
 *     { "_id": "...", "title": "Finish project", ... }
 *   ],
 *   "page": 1,
 *   "limit": 10,
 *   "total": 23
 * }
 *
 * Validation: validateQuery validates and coerces page/limit to numbers
 */
router.get('/', validateQuery(tasksQuerySchema), getTasks)

// ============ GET SINGLE TASK ============
/**
 * GET /api/tasks/:id
 *
 * URL Parameter:
 * :id = MongoDB ObjectId of the task
 *
 * Response (200 OK):
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "title": "Buy milk",
 *   "user": "607f1f77bcf86cd799439012",
 *   ...
 * }
 *
 * Response (404 Not Found):
 * { "error": "Task not found" }
 *
 * Note: :id in the path becomes req.params.id in controller
 */
router.get('/:id', getTaskById)

// ============ UPDATE TASK ============
/**
 * PUT /api/tasks/:id
 *
 * Request Body (any combination of these):
 * {
 *   "title": "New title",
 *   "description": "New description",
 *   "status": "in-progress",
 *   "dueDate": "2026-07-01"
 * }
 *
 * Response (200 OK):
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "title": "New title",
 *   "status": "in-progress",
 *   ...
 * }
 *
 * Validation: validateBody ensures all fields are valid (if provided)
 */
router.put('/:id', validateBody(updateTaskSchema), updateTask)

// ============ DELETE TASK ============
/**
 * DELETE /api/tasks/:id
 *
 * Response (200 OK):
 * { "message": "Task deleted successfully" }
 *
 * Response (404 Not Found):
 * { "error": "Task not found" }
 */
router.delete('/:id', deleteTask)

// ============ EXPORT ROUTER ============
/**
 * Export the router so it can be mounted in app.js
 *
 * In app.js:
 * import taskRouter from './routes/task.router.js'
 * app.use('/api/tasks', taskRouter)
 *
 * This means:
 * - router.post('/') becomes POST /api/tasks
 * - router.get('/') becomes GET /api/tasks
 * - router.get('/:id') becomes GET /api/tasks/:id
 * etc.
 */
export default router
