import mongoose from 'mongoose'

/**
 * Task Schema - Defines the structure of a Task document in MongoDB
 *
 * A task is a unit of work that belongs to ONE user.
 * For example:
 * {
 *   _id: ObjectId("..."),
 *   title: "Buy groceries",
 *   description: "Buy milk, eggs, bread",
 *   status: "pending",
 *   dueDate: "2026-06-15",
 *   user: ObjectId("..."),  // Reference to the user who owns this task
 *   createdAt: "2026-06-03T10:00:00Z",
 *   updatedAt: "2026-06-03T10:00:00Z"
 * }
 */

const taskSchema = new mongoose.Schema(
  {
    // ============ TITLE ============
    /**
     * The task's title
     * Type: String (text)
     * Required: YES - every task must have a title
     * Trim: YES - removes leading/trailing whitespace
     * Example: "Buy groceries"
     */
    title: {
      type: String,
      required: [true, 'Task title is required'], // Error message if missing
      trim: true,
      minlength: [1, 'Title cannot be empty'],
    },

    // ============ DESCRIPTION ============
    /**
     * Optional detailed description of the task
     * Type: String
     * Required: NO - description is optional
     * Default: empty string
     * Example: "Buy milk, eggs, and bread from the supermarket"
     */
    description: {
      type: String,
      default: '',
    },

    // ============ STATUS ============
    /**
     * Current status of the task
     * Type: String (Enum - only these values allowed)
     * Required: YES
     * Allowed values:
     *   - "pending": Task hasn't started yet
     *   - "in-progress": Currently working on it
     *   - "completed": Task is done
     *
     * Why Enum?
     * Prevents invalid statuses like "flying_unicorn" or "done123"
     * Frontend can only send one of these 3 values
     *
     * Example: "pending"
     */
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed',
      },
      default: 'pending', // New tasks default to pending
    },

    // ============ DUE DATE ============
    /**
     * When the task should be completed
     * Type: Date (ISO format)
     * Required: NO - task might not have a deadline
     * Format: ISO 8601 (e.g., "2026-06-15")
     *
     * Example: "2026-06-15"
     */
    dueDate: {
      type: Date,
      default: null, // No due date by default
    },

    // ============ USER REFERENCE ============
    /**
     * Which user owns this task
     * Type: ObjectId (MongoDB unique identifier)
     * Ref: 'User' - points to the User collection
     * Required: YES - every task must belong to a user
     *
     * This creates a RELATIONSHIP:
     * - One user can have MANY tasks
     * - Each task belongs to ONE user
     *
     * Security: When fetching tasks, we check that req.user.id matches this field
     * This prevents users from seeing other people's tasks
     *
     * Example: ObjectId("507f1f77bcf86cd799439011")
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: [true, 'Task must belong to a user'],
    },
  },

  /**
   * Schema Options
   *
   * timestamps: true
   * Automatically adds two fields:
   *   - createdAt: When the task was created
   *   - updatedAt: When the task was last modified
   *
   * Example:
   * {
   *   createdAt: "2026-06-03T10:00:00Z",
   *   updatedAt: "2026-06-03T10:00:00Z"
   * }
   *
   * These are useful for:
   * - Sorting tasks by "newest first"
   * - Showing "Created 2 hours ago"
   * - Audit trails (who changed what and when)
   */
  {
    timestamps: true,
  }
)

// ============ CREATE AND EXPORT THE MODEL ============
/**
 * mongoose.model(name, schema)
 *
 * 'Task' = The model name (singular, capitalized)
 * Mongoose automatically creates a collection called 'tasks' (plural, lowercase)
 *
 * This model is used to:
 * - Create new tasks: Task.create({ title: "...", user: "..." })
 * - Find tasks: Task.find({ user: userId })
 * - Update tasks: Task.findByIdAndUpdate(id, { status: "completed" })
 * - Delete tasks: Task.findByIdAndDelete(id)
 */
const Task = mongoose.model('Task', taskSchema)

export default Task
