import { useState } from 'react'
import { updateTask, deleteTask } from '../../api/tasks'
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../utils/constants'

export function TaskCard({ task, onTaskUpdated, onTaskDeleted, onEdit }) {
  const [busy, setBusy] = useState(false)

  const handleStatusChange = async (e) => {
    try {
      setBusy(true)
      const updated = await updateTask(task._id, { status: e.target.value })
      onTaskUpdated(updated)
    } catch (error) {
      alert(error.error || 'Failed to update task')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"?`)) return
    try {
      setBusy(true)
      await deleteTask(task._id)
      onTaskDeleted(task._id)
    } catch (error) {
      alert(error.error || 'Failed to delete task')
      setBusy(false)
    }
  }

  return (
    <div className="card p-4 flex items-start justify-between gap-4">
      {/* Left: title, description, due date */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {task.title}
          </h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${TASK_STATUS_COLORS[task.status]}`}>
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </p>
        )}
        {task.dueDate && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Right: status select + delete */}
      <div className="flex items-center gap-2 shrink-0">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={busy}
          className="input-field text-sm py-1 w-auto"
        >
          {Object.values(TASK_STATUS).map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <button onClick={() => onEdit(task)} disabled={busy} className="btn-secondary btn-sm">
          Edit
        </button>
        <button onClick={handleDelete} disabled={busy} className="btn-danger btn-sm">
          Delete
        </button>
      </div>
    </div>
  )
}
