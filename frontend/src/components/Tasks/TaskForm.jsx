import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTask, updateTask } from '../../api/tasks'
import { TASK_STATUS, TASK_STATUS_LABELS } from '../../utils/constants'
import { useToast } from '../../context/ToastContext'
import { Plus, PencilLine } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED]),
  dueDate: z.string().optional()
})

const emptyValues = { title: '', description: '', status: TASK_STATUS.PENDING, dueDate: '' }

/**
 * TaskForm — handles BOTH create and edit.
 *
 * Create mode: no editingTask prop → submits POST /api/tasks
 * Edit mode: editingTask passed → form prefills, submits PUT /api/tasks/:id
 */
export function TaskForm({ onTaskCreated, editingTask, onTaskUpdated, onCancelEdit }) {
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const { showToast } = useToast()

  const isEditing = Boolean(editingTask)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: emptyValues
  })

  // When editingTask changes, prefill the form (or clear it when edit is cancelled)
  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
        // <input type="date"> needs "YYYY-MM-DD" format
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : ''
      })
    } else {
      reset(emptyValues)
    }
  }, [editingTask, reset])

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      setServerError(null)

      // Build payload — skip empty optional fields
      const payload = { title: data.title, status: data.status }
      if (data.description) payload.description = data.description
      if (data.dueDate) payload.dueDate = new Date(data.dueDate).toISOString()

      if (isEditing) {
        const updated = await updateTask(editingTask._id, payload)
        onTaskUpdated(updated)
        showToast(`"${updated.title}" updated`)
      } else {
        const task = await createTask(payload)
        onTaskCreated(task)
        showToast(`"${task.title}" created`)
      }
      reset(emptyValues)
    } catch (error) {
      setServerError(error.errors?.[0] || error.error || 'Failed to save task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex-center w-9 h-9 rounded-lg ${isEditing ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
          {isEditing ? <PencilLine size={18} /> : <Plus size={18} />}
        </span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
          {isEditing ? `Edit: ${editingTask.title}` : 'New Task'}
        </h3>
      </div>

      {/* Title */}
      <div>
        <label className="label">Title *</label>
        <input
          type="text"
          placeholder="e.g. Buy groceries"
          className="input-field"
          {...register('title')}
          disabled={submitting}
        />
        {errors.title && <p className="error-text">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description</label>
        <textarea
          rows="2"
          placeholder="Optional details..."
          className="input-field"
          {...register('description')}
          disabled={submitting}
        />
      </div>

      {/* Status + Due Date: stacked on phones, side by side from sm: up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input-field" {...register('status')} disabled={submitting}>
            {Object.values(TASK_STATUS).map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input-field" {...register('dueDate')} disabled={submitting} />
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {serverError}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting
          ? (isEditing ? 'Saving...' : 'Creating...')
          : (isEditing ? 'Save Changes' : 'Add Task')}
      </button>

      {/* Cancel button only in edit mode */}
      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={submitting}
          className="btn-secondary w-full"
        >
          Cancel
        </button>
      )}
    </form>
  )
}
