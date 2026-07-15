import client from './client'

// GET /api/auth/me — current user's profile
export function getMe() {
  return client.get('/api/auth/me')
}

// PUT /api/auth/me — update name and/or password
// data: { name? } or { currentPassword, newPassword }
export function updateProfile(data) {
  return client.put('/api/auth/me', data)
}
