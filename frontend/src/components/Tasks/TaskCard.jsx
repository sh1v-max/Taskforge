import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateTask, deleteTask } from '../../api/tasks'
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../utils/constants'
import { useToast } from '../../context/ToastContext'
import { ConfirmDialog } from '../Common/ConfirmDialog'

export function TaskCard({ task, onTaskUpdated, onTaskDeleted, onEdit }) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { showToast } = useToast()

  const handleStatusChange = async (e) => {
    try {
      setBusy(true)
      const updated = await updateTask(task._id, { status: e.target.value })
      onTaskUpdated(updated)
      showToast(`"${task.title}" moved to ${TASK_STATUS_LABELS[updated.status]}`)
    } catch (error) {
      showToast(error.error || 'Failed to update task', 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    try {
      setBusy(true)
      setConfirmOpen(false)
      await deleteTask(task._id)
      onTaskDeleted(task._id)
      showToast(`"${task.title}" deleted`)
    } catch (error) {
      showToast(error.error || 'Failed to delete task', 'error')
      setBusy(false)
    }
  }

  // Card stacks vertically on phones, side-by-side from sm: up
  return (
    <div className="card p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      {/* Left: title, description, due date */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {/* Title links to the full task detail page */}
            <Link to={`/tasks/${task._id}`} className="hover:underline">
              {task.title}
            </Link>
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

      {/* Right: status select + edit + delete */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
        <button onClick={() => setConfirmOpen(true)} disabled={busy} className="btn-danger btn-sm">
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        message={`"${task.title}" will be permanently deleted. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
