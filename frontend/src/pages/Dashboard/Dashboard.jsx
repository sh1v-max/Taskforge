import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Hammer,
  LogOut,
  ListTodo,
  Clock,
  Loader,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react'
import { getTasks } from '../../api/tasks'
import { TaskForm } from '../../components/Tasks/TaskForm'
import { TaskCard } from '../../components/Tasks/TaskCard'
import { TASK_STATUS, TASK_STATUS_LABELS, SORT_OPTIONS, PAGINATION } from '../../utils/constants'
import { ThemeToggle } from '../../components/Common/ThemeToggle'
import { Pagination } from '../../components/Common/Pagination'

// Time-aware greeting: "Good morning" / "Good afternoon" / "Good evening"
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Status filter pills shown above the task list ('' = all)
const FILTERS = [
  { value: '', label: 'All' },
  { value: TASK_STATUS.PENDING, label: TASK_STATUS_LABELS[TASK_STATUS.PENDING] },
  { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
  { value: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS[TASK_STATUS.COMPLETED] },
]

export function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // The task detail page's "Edit" button navigates here with the task in
  // router state — preload it into the edit form, then clear the state so
  // a page refresh doesn't reopen edit mode
  useEffect(() => {
    if (location.state?.editTask) {
      setEditingTask(location.state.editTask)
      navigate('.', { replace: true, state: null })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('') // '' = all
  const [sortKey, setSortKey] = useState('RECENT') // key into SORT_OPTIONS
  const [editingTask, setEditingTask] = useState(null) // null = create mode
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE)
  const [total, setTotal] = useState(0) // total tasks across all pages
  const [refreshKey, setRefreshKey] = useState(0) // bump to force a refetch

  // Per-status counts for the stats row (independent of current filter)
  const [stats, setStats] = useState(null)
  const [statsKey, setStatsKey] = useState(0) // bump to recount

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

  // Fetch per-status totals for the stat cards.
  // limit: 1 keeps the responses tiny — we only need each `total`.
  useEffect(() => {
    async function fetchStats() {
      try {
        const [p, i, c] = await Promise.all([
          getTasks({ status: TASK_STATUS.PENDING, limit: 1 }),
          getTasks({ status: TASK_STATUS.IN_PROGRESS, limit: 1 }),
          getTasks({ status: TASK_STATUS.COMPLETED, limit: 1 }),
        ])
        setStats({
          pending: p.total,
          inProgress: i.total,
          completed: c.total,
          total: p.total + i.total + c.total,
        })
      } catch {
        // Stats are decorative — never block the dashboard over them
      }
    }
    fetchStats()
  }, [statsKey])

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
    setStatsKey((k) => k + 1)
  }
  const handleTaskUpdated = (updated) => {
    // An edit doesn't move tasks between pages — update it in place
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
    setEditingTask(null) // Exit edit mode after saving
    setStatsKey((k) => k + 1) // status may have changed → recount
  }
  const handleTaskDeleted = () => {
    setRefreshKey((k) => k + 1)
    setStatsKey((k) => k + 1)
  }

  const completionPct = stats && stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  const statCards = [
    { label: 'Total Tasks', value: stats?.total, icon: ListTodo, tile: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
    { label: 'Pending', value: stats?.pending, icon: Clock, tile: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400' },
    { label: 'In Progress', value: stats?.inProgress, icon: Loader, tile: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400' },
    { label: 'Completed', value: stats?.completed, icon: CheckCircle2, tile: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="container flex items-center justify-between gap-2 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex-center w-8 h-8 rounded-lg bg-blue-600 text-white">
              <Hammer size={16} />
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:inline">
              TaskForge
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThemeToggle />

            {/* Avatar + name → profile */}
            <Link
              to="/profile"
              title="Your profile"
              className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 py-1 pl-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="flex-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-24 sm:max-w-none">
                {user?.name}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="flex-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* ============ GREETING ============ */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
            {stats && stats.total > 0 && (
              <> · {stats.pending + stats.inProgress} open task{stats.pending + stats.inProgress === 1 ? '' : 's'}</>
            )}
          </p>
        </div>

        {/* ============ STATS ROW ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, tile }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className={`flex-center w-9 h-9 rounded-lg ${tile}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {value ?? '–'}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Completion progress bar */}
        {stats && stats.total > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">Overall progress</span>
              <span className="font-bold text-slate-900 dark:text-white">{completionPct}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* ============ FORM + LIST ============ */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left: create/edit form — sticks below the header while scrolling */}
          <div className="lg:col-span-1 lg:sticky lg:top-20">
            <TaskForm
              onTaskCreated={handleTaskCreated}
              editingTask={editingTask}
              onTaskUpdated={handleTaskUpdated}
              onCancelEdit={() => setEditingTask(null)}
            />
          </div>

          {/* Right: task list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar: filter pills + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Status filter — segmented pills */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 overflow-x-auto scrollbar-hide">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setStatusFilter(f.value)
                      setPage(PAGINATION.DEFAULT_PAGE) // new filter → back to page 1
                    }}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      statusFilter === f.value
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value)
                  setPage(PAGINATION.DEFAULT_PAGE) // new ordering → back to page 1
                }}
                className="w-full sm:w-auto sm:shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
                  <option key={key} value={key}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                  >
                    <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                ))}
              </div>
            )}

            {fetchError && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {fetchError}
              </div>
            )}

            {/* Empty state */}
            {!loading && !fetchError && tasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
                <span className="flex-center mx-auto w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <ClipboardList size={24} />
                </span>
                <p className="mt-4 font-medium text-slate-900 dark:text-white">
                  {statusFilter ? `No ${TASK_STATUS_LABELS[statusFilter].toLowerCase()} tasks` : 'No tasks yet'}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {statusFilter
                    ? 'Try a different filter, or add something new.'
                    : 'Create your first task with the form and start forging.'}
                </p>
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
        </div>
      </main>
    </div>
  )
}
