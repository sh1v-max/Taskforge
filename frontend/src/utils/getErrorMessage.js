// The API sends validation failures as { errors: [{ field, message }] } and
// everything else as { message } (or { error } for 404s on tasks).
export const getErrorMessage = (error, fallback) => {
  const first = error?.errors?.[0]
  return first?.message || first || error?.message || error?.error || fallback
}
