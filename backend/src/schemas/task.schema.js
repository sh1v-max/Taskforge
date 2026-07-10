import { z } from 'zod'

/**
 * Zod Schemas for Task Validation
 *
 * Zod validates REQUEST DATA (what comes from the client)
 * Mongoose validates DATABASE DATA (before saving to MongoDB)
 *
 * Why both?
 * - Zod: First line of defense, fast error messages
 * - Mongoose: Second line of defense, database constraints
 *
 * Example request data validation:
 * POST /api/tasks
 * Body: { title: "Buy milk", status: "pending" }
 * Zod checks: ✅ title is string, status is valid enum
 * Then saves to MongoDB
 * Mongoose checks: ✅ user field exists, all required fields present
 */

// ============ CREATE TASK SCHEMA ============
/**
 * Used when: User creates a new task
 * Method: POST /api/tasks
 * Example request body:
 * {
 *   "title": "Buy groceries",
 *   "description": "Buy milk, eggs, bread",
 *   "status": "pending",
 *   "dueDate": "2026-06-15"
 * }
 *
 * Validation rules:
 * - title: required, must be a string, at least 1 character
 * - description: optional, must be a string if provided
 * - status: optional (default: pending), must be one of the allowed values
 * - dueDate: optional, must be a valid date string if provided
 *
 * Zod will reject and show error if:
 * - title is missing ❌
 * - title is empty ❌
 * - status is "flying_unicorn" ❌
 * - dueDate is "purple" ❌
 */
export const createTaskSchema = z.object({
  // ============ TITLE ============
  /**
   * The task's title
   * Type: String
   * Required: YES - .nonempty() makes it required
   * Validation: At least 1 character
   * Error messages: Custom messages shown to user
   */
  title: z
    .string({ message: 'Title must be a string' })
    .nonempty({ message: 'Title cannot be empty' })
    .min(1, { message: 'Title must be at least 1 character' })
    .trim(), // Remove leading/trailing whitespace

  // ============ DESCRIPTION ============
  /**
   * Optional detailed description
   * Type: String
   * Required: NO - .optional() makes it optional
   * If provided, must be a string
   */
  description: z
    .string({ message: 'Description must be a string' })
    .optional(),

  // ============ STATUS ============
  /**
   * Current status of the task
   * Type: String (Enum)
   * Required: NO - but if provided, must be one of these values
   * Allowed values: 'pending', 'in-progress', 'completed'
   * Default: 'pending' (set in database, not here)
   *
   * .enum() ensures only specific values are accepted
   */
  status: z
    .enum(['pending', 'in-progress', 'completed'], {
      message: 'Status must be pending, in-progress, or completed',
    })
    .optional()
    .default('pending'), // Default value if not provided

  // ============ DUE DATE ============
  /**
   * When the task should be completed
   * Type: Date (ISO string format like "2026-06-15")
   * Required: NO - optional
   * Format: Must be a valid date string
   *
   * .string() first converts to string
   * .datetime() ensures ISO 8601 format
   * .optional() makes it optional
   * .nullable() allows null values
   *
   * Valid examples:
   * - "2026-06-15"
   * - "2026-06-15T10:30:00Z"
   *
   * Invalid examples:
   * - "purple" ❌
   * - "32-13-99" ❌
   */
  dueDate: z
    .string({
      message: 'Due date must be a valid date string',
    })
    .datetime({
      message: 'Due date must be in ISO 8601 format (e.g., 2026-06-15)',
    })
    .optional()
    .nullable(),
})

// ============ UPDATE TASK SCHEMA ============
/**
 * Used when: User updates an existing task
 * Method: PUT /api/tasks/:id
 * Example request body:
 * {
 *   "status": "in-progress",
 *   "description": "Updated description"
 * }
 *
 * Key difference from createTaskSchema:
 * ALL FIELDS ARE OPTIONAL
 *
 * Why? Because the user might only update one field:
 * - Update only status ✅
 * - Update only description ✅
 * - Update both ✅
 * - Update nothing (empty object) ← Should still validate
 *
 * Same validation rules as createTaskSchema,
 * but all fields are optional
 */
export const updateTaskSchema = z.object({
  title: z
    .string({ message: 'Title must be a string' })
    .nonempty({ message: 'Title cannot be empty' })
    .min(1, { message: 'Title must be at least 1 character' })
    .trim()
    .optional(),

  description: z
    .string({ message: 'Description must be a string' })
    .optional(),

  status: z
    .enum(['pending', 'in-progress', 'completed'], {
      message: 'Status must be pending, in-progress, or completed',
    })
    .optional(),

  dueDate: z
    .string({
      message: 'Due date must be a valid date string',
    })
    .datetime({
      message: 'Due date must be in ISO 8601 format (e.g., 2026-06-15)',
    })
    .optional()
    .nullable(),
})

// ============ QUERY PARAMETERS SCHEMA ============
/**
 * Used when: User queries tasks with filters, sorting, pagination
 * Method: GET /api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=10
 *
 * Validates URL query parameters:
 * - ?status=pending → Zod checks it's a valid status
 * - ?sortBy=dueDate:asc → Zod checks it's properly formatted
 * - ?page=1 → Zod checks it's a positive integer
 * - ?limit=10 → Zod checks it's a positive integer
 *
 * Why validate query params?
 * Without validation:
 * - GET /api/tasks?page=-5 → Could cause errors
 * - GET /api/tasks?limit=999999 → Could crash server
 * - GET /api/tasks?status=invalid → Wrong data returned
 *
 * With validation:
 * - Negative page → 400 Bad Request
 * - Huge limit → Capped at 100
 * - Invalid status → 400 Bad Request
 */
export const tasksQuerySchema = z.object({
  // ============ STATUS FILTER ============
  /**
   * Filter tasks by status
   * Example: GET /api/tasks?status=pending
   * Returns: Only tasks with status='pending'
   */
  status: z
    .enum(['pending', 'in-progress', 'completed'], {
      message: 'Status must be pending, in-progress, or completed',
    })
    .optional(),

  // ============ SORT BY ============
  /**
   * Sort tasks by a field
   * Format: "field:direction" where direction is 'asc' or 'desc'
   * Examples:
   *   - "dueDate:asc" → sort by due date, earliest first
   *   - "createdAt:desc" → sort by creation date, newest first
   *   - "title:asc" → sort alphabetically
   */
  sortBy: z
    .string({
      message: 'sortBy must be a string',
    })
    .optional(),
  // Note: More detailed validation of sortBy format can be added in controllers

  // ============ PAGINATION: PAGE ============
  /**
   * Which page of results to return
   * Example: GET /api/tasks?page=2&limit=10
   * Returns: Tasks 11-20 (second page of 10 tasks each)
   *
   * .coerce.number() converts string "2" to number 2
   * .min(1) ensures page >= 1 (pages start from 1, not 0)
   * .optional() makes it optional (defaults to 1)
   */
  page: z
    .coerce
    .number({
      message: 'Page must be a number',
    })
    .min(1, { message: 'Page must be at least 1' })
    .optional()
    .default(1), // Default to page 1

  // ============ PAGINATION: LIMIT ============
  /**
   * How many tasks to return per page
   * Example: GET /api/tasks?page=1&limit=5
   * Returns: First 5 tasks
   *
   * .min(1) prevents negative limits
   * .max(100) prevents huge requests (server protection)
   * Default: 10 tasks per page
   *
   * Why max 100?
   * Without max: GET /api/tasks?limit=999999
   * Could return 1 million tasks and crash the server
   * With max: Limited to 100 tasks maximum
   */
  limit: z
    .coerce
    .number({
      message: 'Limit must be a number',
    })
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .optional()
    .default(10), // Default to 10 tasks per page
})

/**
 * SUMMARY OF SCHEMAS:
 *
 * createTaskSchema
 * ├─ Used: POST /api/tasks (creating new task)
 * ├─ title: required
 * ├─ description: optional
 * ├─ status: optional (default pending)
 * └─ dueDate: optional
 *
 * updateTaskSchema
 * ├─ Used: PUT /api/tasks/:id (updating existing task)
 * ├─ All fields optional (might update just one field)
 * └─ Same validation rules as create
 *
 * tasksQuerySchema
 * ├─ Used: GET /api/tasks (fetching tasks)
 * ├─ status: optional filter
 * ├─ sortBy: optional sort field
 * ├─ page: optional pagination page
 * └─ limit: optional pagination limit
 */
