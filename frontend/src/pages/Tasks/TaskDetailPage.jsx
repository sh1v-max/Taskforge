import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTaskById, updateTask, deleteTask } from '../../api/tasks'
import { useToast } from '../../context/ToastContext'
import { ThemeToggle } from '../../components/Common/ThemeToggle'
import { ConfirmDialog } from '../../components/Common/ConfirmDialog'
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../utils/constants'

/**
 * TaskDetailPage — /tasks/:id
 *
 * Full view of a single task:
 * - Fetches the task from GET /api/tasks/:id (ownership enforced by backend)
 * - Change status in place, jump to edit on the dashboard, or delete
 * - Shows metadata the dashboard cards don't (created / last updated)
 */
export function TaskDetailPage() {
  const { id } = useParams() // task id from the URL
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    getTaskById(id)
      .then((data) => setTask(data))
      .catch(() => setNotFound(true)) // 404 or someone else's task
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (e) => {
    try {
      setBusy(true)
      const updated = await updateTask(task._id, { status: e.target.value })
      setTask(updated)
      showToast(`Moved to ${TASK_STATUS_LABELS[updated.status]}`)
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
      showToast(`"${task.title}" deleted`)
      navigate('/dashboard')
    } catch (error) {
      showToast(error.error || 'Failed to delete task', 'error')
      setBusy(false)
    }
  }

  // Opens the dashboard with this task preloaded into the edit form
  const handleEdit = () => navigate('/dashboard', { state: { editTask: task } })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ArrowLeft size={18} />
            <span className="font-bold">Back to Dashboard</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-8 max-w-2xl space-y-6">
        {loading && <p className="text-gray-500">Loading task...</p>}

        {notFound && (
          <div className="card p-8 text-center space-y-2">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Task not found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              It may have been deleted, or the link is wrong.
            </p>
            <Link to="/dashboard" className="btn-primary inline-block mt-2">
              Back to Dashboard
            </Link>
          </div>
        )}

        {task && (
          <>
            {/* Title + status */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words min-w-0">
                {task.title}
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded-full shrink-0 ${TASK_STATUS_COLORS[task.status]}`}
              >
                {TASK_STATUS_LABELS[task.status]}
              </span>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
              {task.description ? (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">No description</p>
              )}
            </div>

            {/* Details */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Due date</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(task.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Last updated</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(task.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            {/* Actions stack on phones, spread out from sm: up */}
            <div className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={busy}
                className="input-field text-sm py-1 w-full sm:w-auto"
              >
                {Object.values(TASK_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button onClick={handleEdit} disabled={busy} className="btn-secondary btn-sm">
                  Edit
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={busy}
                  className="btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <ConfirmDialog
              open={confirmOpen}
              title="Delete task?"
              message={`"${task.title}" will be permanently deleted. This cannot be undone.`}
              onConfirm={handleDelete}
              onCancel={() => setConfirmOpen(false)}
            />
          </>
        )}
      </main>
    </div>
  )
}
