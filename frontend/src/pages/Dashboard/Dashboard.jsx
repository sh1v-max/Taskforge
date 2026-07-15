import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { getTasks } from '../../api/tasks'
import { TaskForm } from '../../components/Tasks/TaskForm'
import { TaskCard } from '../../components/Tasks/TaskCard'
import { TASK_STATUS, TASK_STATUS_LABELS, SORT_OPTIONS, PAGINATION } from '../../utils/constants'
import { ThemeToggle } from '../../components/Common/ThemeToggle'
import { Pagination } from '../../components/Common/Pagination'

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('') // '' = all
  const [sortKey, setSortKey] = useState('RECENT') // key into SORT_OPTIONS
  const [editingTask, setEditingTask] = useState(null) // null = create mode
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)
  const [total, setTotal] = useState(0) // total tasks across all pages
  const [refreshKey, setRefreshKey] = useState(0) // bump to force a refetch

  // Fetch tasks whenever the filter, sort, or page changes
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        setFetchError(null)
        const params = { page, limit: PAGINATION.DEFAULT_LIMIT }
        if (statusFilter) params.status = statusFilter
        // Backend expects "field:direction" e.g. "dueDate:asc"
        const sort = SORT_OPTIONS[sortKey]
        params.sortBy = `${sort.field}:${sort.direction}`
        const data = await getTasks(params)
        // If a delete emptied this page (e.g. last task on page 3),
        // step back one page instead of showing an empty list
        if (data.tasks.length === 0 && page > 1) {
          setPage((p) => p - 1)
          return
        }
        setTasks(data.tasks)
        setTotal(data.total)
      } catch (error) {
        setFetchError(error.error || 'Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [statusFilter, sortKey, page, refreshKey])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // List update handlers
  // Create/delete change the total count, so we refetch from the server
  // to keep the page contents and pagination info accurate
  const handleTaskCreated = () => {
    setPage(PAGINATION.DEFAULT_PAGE) // new task appears on page 1 (recent first)
    setRefreshKey((k) => k + 1)
  }
  const handleTaskUpdated = (updated) => {
    // An edit doesn't move tasks between pages — update it in place
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    setEditingTask(null) // Exit edit mode after saving
  }
  const handleTaskDeleted = () => setRefreshKey((k) => k + 1)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TaskForge</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/profile"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              {user?.name}
            </Link>
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
              Your Tasks {!loading && `(${total})`}
            </h2>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value)
                  setPage(PAGINATION.DEFAULT_PAGE) // new ordering → back to page 1
                }}
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
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(PAGINATION.DEFAULT_PAGE) // new filter → back to page 1
                }}
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

          <Pagination
            page={page}
            limit={PAGINATION.DEFAULT_LIMIT}
            total={total}
            onChange={setPage}
          />
        </div>
      </main>
    </div>
  )
}
