import { email, z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// registerSchema defines the structure and validation rules for the user registration data

export const loginSchema = z.object({
  email: z.string().email('invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// loginSchema defines the structure and validation rules for the user login data