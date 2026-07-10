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
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task for the authenticated user. User ID is automatically set from the JWT token.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy milk
 *               description:
 *                 type: string
 *                 example: Get milk from the grocery store
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T23:59:59Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateBody(createTaskSchema), createTask)

// ============ GET ALL TASKS ============
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     description: Retrieve all tasks with support for filtering, sorting, and pagination
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter by task status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - name: sortBy
 *         in: query
 *         description: Sort field and direction (e.g., "dueDate:asc" or "createdAt:desc")
 *         schema:
 *           type: string
 *           example: dueDate:asc
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of tasks per page (default 10)
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', validateQuery(tasksQuerySchema), getTasks)

// ============ GET SINGLE TASK ============
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     description: Retrieve a specific task by its ID. User can only access their own tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the task
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found or user does not have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getTaskById)

// ============ UPDATE TASK ============
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update one or more fields of a task. User can only update their own tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the task
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               description:
 *                 type: string
 *                 example: Updated description
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation failed or invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found or user does not have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', validateBody(updateTaskSchema), updateTask)

// ============ DELETE TASK ============
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Permanently delete a task. User can only delete their own tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the task
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found or user does not have access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
