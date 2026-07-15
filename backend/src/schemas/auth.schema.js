import { z } from 'zod'

// this schema is used to validate the user registration data
// it is used in the register controller to validate the request body
// if the data is invalid, it will throw an error
// if the data is valid, it will return the data
// this helps in validating the data in user registration and user login
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Invalid email format').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
// it says request body must be an object
// must contain name, email, and password

// registerSchema defines the structure and validation rules for the user registration data

export const loginSchema = z.object({
  email: z.email('Invalid email format').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// loginSchema defines the structure and validation rules for the user login data

// request flow
// Client sends request
//         ↓
// validate(schema)
//         ↓
// Zod checks req.body
//         ↓
// If invalid → 400 response
//         ↓
// If valid → controller runs
// this schema validates profile updates
// all fields are optional (user may update only their name, or only their password)
// but if newPassword is given, currentPassword must also be given
// (we verify the current password before allowing a change)
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    currentPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  })
