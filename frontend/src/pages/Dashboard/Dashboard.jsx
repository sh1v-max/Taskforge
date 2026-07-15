import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../../api/tasks'
import { TaskForm } from '../../components/Tasks/TaskForm'
import { TaskCard } from '../../components/Tasks/TaskCard'
import { TASK_STATUS, TASK_STATUS_LABELS, SORT_OPTIONS } from '../../utils/constants'
import { ThemeToggle } from '../../components/Common/ThemeToggle'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('') // '' = all
  const [sortKey, setSortKey] = useState('RECENT') // key into SORT_OPTIONS
  const [editingTask, setEditingTask] = useState(null) // null = create mode

  // Fetch tasks whenever the filter changes
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        setFetchError(null)
        const params = { limit: 100 }
        if (statusFilter) params.status = statusFilter
        // Backend expects "field:direction" e.g. "dueDate:asc"
        const sort = SORT_OPTIONS[sortKey]
        params.sortBy = `${sort.field}:${sort.direction}`
        const data = await getTasks(params)
        setTasks(data.tasks)
      } catch (error) {
        setFetchError(error.error || 'Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [statusFilter, sortKey])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // List update handlers (keep UI in sync without refetching)
  const handleTaskCreated = (task) => setTasks((prev) => [task, ...prev])
  const handleTaskUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    setEditingTask(null) // Exit edit mode after saving
  }
  const handleTaskDeleted = (id) =>
    setTasks((prev) => prev.filter((t) => t._id !== id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskForge</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8 grid gap-8 lg:grid-cols-3">
        {/* Left: create form */}
        <div className="lg:col-span-1">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            editingTask={editingTask}
            onTaskUpdated={handleTaskUpdated}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>

        {/* Right: task list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Tasks {!loading && `(${tasks.length})`}
            </h2>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="input-field w-auto text-sm py-1"
              >
                {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                  <option key={key} value={key}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-auto text-sm py-1"
              >
                <option value="">All</option>
                {Object.values(TASK_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && <p className="text-gray-500">Loading tasks...</p>}

          {fetchError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {fetchError}
            </div>
          )}

          {!loading && !fetchError && tasks.length === 0 && (
            <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
              No tasks yet. Create your first one! 👈
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
