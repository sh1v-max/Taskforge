import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination
 *
 * Renders "Prev / page numbers / Next" controls under a paginated list.
 *
 * Props:
 * - page:     current page (1-based, matches the backend's ?page= param)
 * - limit:    items per page (matches the backend's ?limit= param)
 * - total:    total number of items across ALL pages (from the API response)
 * - onChange: called with the new page number when the user navigates
 *
 * The component is "dumb" on purpose: it holds no state of its own.
 * The parent owns the page state and refetches when it changes.
 */
export function Pagination({ page, limit, total, onChange }) {
  const totalPages = Math.ceil(total / limit)

  // Nothing to paginate — don't render any controls
  if (totalPages <= 1) return null

  // Which item numbers are visible on this page? (e.g. "11-20 of 23")
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  // Show at most 5 page buttons, keeping the current page centered
  // when possible (e.g. page 7 of 20 → [5, 6, 7, 8, 9])
  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  const end = Math.min(totalPages, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  const pages = []
  for (let p = start; p <= end; p++) pages.push(p)

  // Info text on top, controls below on phones; one row from sm: up
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      {/* Info text: "Showing 11-20 of 23" */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {from}-{to} of {total}
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={
              p === page
                ? 'btn-primary btn-sm min-w-8'
                : 'btn-secondary btn-sm min-w-8'
            }
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
