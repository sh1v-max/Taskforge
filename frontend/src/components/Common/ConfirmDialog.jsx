import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

/**
 * ConfirmDialog — accessible confirmation modal (Headless UI).
 *
 * Headless UI handles the hard parts for free:
 * focus trapping, Escape to close, click-outside to close, screen readers.
 * We only supply the styling.
 */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Centered panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="card p-6 w-full max-w-sm">
          <DialogTitle className="font-bold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-danger btn-sm">
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
