import { z } from 'zod'

const STATUSES = ['pending', 'in-progress', 'completed']
const statusMessage = 'Status must be pending, in-progress, or completed'

const title = z
  .string({ message: 'Title must be a string' })
  .min(1, { message: 'Title cannot be empty' })
  .trim()

const description = z.string({ message: 'Description must be a string' })

const status = z.enum(STATUSES, { message: statusMessage })

// The frontend sends new Date(input).toISOString(); null clears the date
const dueDate = z
  .string({ message: 'Due date must be a valid date string' })
  .datetime({ message: 'Due date must be in ISO 8601 format (e.g., 2026-06-15T00:00:00Z)' })
  .nullable()
  .optional()

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  status: status.optional().default('pending'),
  dueDate,
})

// Every field optional: PUT is a partial update
export const updateTaskSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  status: status.optional(),
  dueDate,
})

export const tasksQuerySchema = z.object({
  status: status.optional(),

  // Allow-list: the value goes straight into .sort(), so arbitrary fields
  // (user, __v, ...) must not be sortable.
  sortBy: z
    .enum(
      ['createdAt:asc', 'createdAt:desc', 'dueDate:asc', 'dueDate:desc',
        'title:asc', 'title:desc', 'status:asc', 'status:desc'],
      { message: 'sortBy must be createdAt, dueDate, title or status, followed by :asc or :desc' },
    )
    .optional(),

  // Query values arrive as strings, hence coerce
  page: z.coerce
    .number({ message: 'Page must be a number' })
    .min(1, { message: 'Page must be at least 1' })
    .optional()
    .default(1),

  limit: z.coerce
    .number({ message: 'Limit must be a number' })
    .min(1, { message: 'Limit must be at least 1' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .optional()
    .default(10),
})
