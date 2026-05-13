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