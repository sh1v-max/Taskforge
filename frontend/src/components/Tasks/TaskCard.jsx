import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilLine, Trash2, CalendarDays } from 'lucide-react'
import { updateTask, deleteTask } from '../../api/tasks'
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../utils/constants'
import { useToast } from '../../context/ToastContext'
import { ConfirmDialog } from '../Common/ConfirmDialog'

// Colored accent bar on the card's left edge, keyed by status
const ACCENT = {
  [TASK_STATUS.PENDING]: 'before:bg-yellow-400',
  [TASK_STATUS.IN_PROGRESS]: 'before:bg-blue-500',
  [TASK_STATUS.COMPLETED]: 'before:bg-green-500',
}

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

  const isOverdue =
    task.dueDate &&
    task.status !== TASK_STATUS.COMPLETED &&
    new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 pl-5 transition-shadow hover:shadow-md
        before:absolute before:inset-y-0 before:left-0 before:w-1 ${ACCENT[task.status]}
        flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4`}
    >
      {/* Left: title, description, due date */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`font-semibold truncate ${
              task.status === TASK_STATUS.COMPLETED
                ? 'text-slate-400 dark:text-slate-500 line-through'
                : 'text-slate-900 dark:text-white'
            }`}
          >
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <p
            className={`inline-flex items-center gap-1.5 text-xs mt-2 ${
              isOverdue
                ? 'font-medium text-red-600 dark:text-red-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <CalendarDays size={13} />
            {isOverdue && 'Overdue · '}
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Right: status select + icon actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={busy}
          className="w-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(TASK_STATUS).map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <button
          onClick={() => onEdit(task)}
          disabled={busy}
          title="Edit task"
          className="flex-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
        >
          <PencilLine size={16} />
        </button>

        <button
          onClick={() => setConfirmOpen(true)}
          disabled={busy}
          title="Delete task"
          className="flex-center w-9 h-9 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
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
