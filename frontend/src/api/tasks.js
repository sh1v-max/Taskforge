import client from './client'

/**
 * Task API Service
 *
 * Each function calls one backend endpoint.
 * The axios client already:
 * - Adds the JWT token to the Authorization header (request interceptor)
 * - Returns response.data directly (response interceptor)
 */

// GET /api/tasks?status=&sortBy=&page=&limit=
// Returns: { tasks, page, limit, total }
export function getTasks(params = {}) {
  return client.get('/api/tasks', { params })
}

// GET /api/tasks/:id
// Returns: task object
export function getTaskById(id) {
  return client.get(`/api/tasks/${id}`)
}

// POST /api/tasks
// data: { title, description?, status?, dueDate? }
// Returns: created task
export function createTask(data) {
  return client.post('/api/tasks', data)
}

// PUT /api/tasks/:id
// data: any subset of { title, description, status, dueDate }
// Returns: updated task
export function updateTask(id, data) {
  return client.put(`/api/tasks/${id}`, data)
}

// DELETE /api/tasks/:id
// Returns: { message }
export function deleteTask(id) {
  return client.delete(`/api/tasks/${id}`)
}
