import { z } from 'zod'

// trim first: z.email() alone would reject ' asha@example.com '
const email = z.string().trim().toLowerCase().pipe(z.email('Invalid email format'))
const password = z.string().min(6, 'Password must be at least 6 characters')

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email,
  password,
})

export const loginSchema = z.object({
  email,
  password,
})

// Name and password can be changed independently, but a new password
// needs the current one (the controller checks it against the hash).
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    currentPassword: password.optional(),
    newPassword: password.optional(),
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  })
