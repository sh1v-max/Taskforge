import asyncHandler from 'express-async-handler'
import Task from '../models/Task.js'

// Ownership rule for every query below: filter by { _id, user: req.user.id }
// rather than findById. Someone else's task then looks exactly like a missing
// one (404), so the API never confirms that an id exists.

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body

  // user always comes from the token, never from the body
  const task = await Task.create({ title, description, status, dueDate, user: req.user.id })

  res.status(201).json(task)
})

// GET /api/tasks?status=&sortBy=field:asc|desc&page=&limit=
export const getTasks = asyncHandler(async (req, res) => {
  const query = { user: req.user.id }
  // Parsed by validateQuery: sortBy is allow-listed, page/limit are numbers with defaults
  const { status, sortBy, page, limit } = req.validatedQuery

  if (status) {
    query.status = status
  }

  let mongoQuery = Task.find(query)

  if (sortBy) {
    const [field, direction] = sortBy.split(':')
    mongoQuery = mongoQuery.sort({ [field]: direction === 'desc' ? -1 : 1 })
  }

  const tasks = await mongoQuery.skip((page - 1) * limit).limit(limit)
  // Same filter without paging, so the frontend can work out the page count
  const total = await Task.countDocuments(query)

  res.json({ tasks, page, limit, total })
})

// GET /api/tasks/:id
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id })

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  res.json(task)
})

// PUT /api/tasks/:id (partial update: only the fields sent are changed)
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true },
  )

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  res.json(task)
})

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })

  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }

  res.json({ message: 'Task deleted successfully' })
})
