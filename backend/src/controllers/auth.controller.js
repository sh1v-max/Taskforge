import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// auth.controller.js file defines the business logic for user authentication
// for example: registration, login, logout, etc.

// this is register controller, it handles user registration
// it takes the name, email, and password from the request body
// it checks if a user with the same email already exists in the database
// if a user already exists, it returns a 400 status code with an error message
// if the user does not exist, it creates a new user in the database
// after creating the user, it returns a 201 status code with a success message and the user details (excluding the password)

export const register = asyncHandler(async (req, res) => {
  // extract data from req.body
  const { name, email, password } = req.body

  // check if user already exists
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({
      message: 'user already exists',
    })
  }

  // create user if not exists
  const user = await User.create({
    name,
    email,
    password,
  })

  // Generate token for newly registered user
  const token = generateToken(user._id)

  res.status(201).json({
    message: 'user registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// registration flow
// Receive name/email/password
//         ↓
// Check if email exists
//         ↓
// If yes → 400 error
//         ↓
// Create user
//         ↓
// Password hashed automatically
//         ↓
// Save to MongoDB
//         ↓
// Return 201 response

// login controller, it handles user login
// it takes the email and password from the request body
// it checks if a user with the provided email exists in the database
// if the user does not exist, it returns a 400 status code with an error message
// if the user exists, it checks if the password is correct
// if the password is incorrect, it returns a 400 status code with an error message
// if the password is correct, it returns a 200 status code with a success message and the user details (excluding the password)
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // find user by email
  const user = await User.findOne({ email })

  // if user not found, return error
  if (!user) {
    return res.status(400).json({
      message: 'Invalid credentials',
    })
  }

  // compare password
  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    return res.status(400).json({
      message: 'Invalid credentials',
    })
  }

  // generate JWT token, and send success response
  const token = generateToken(user._id)

  // sending user info, and token to frontend
  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// simple login response
// {
//   "message": "Login successful",
//   "token": "eyJhbGciOiJIUzI1NiIs...",
//   "user": {
//     "id": "...",
//     "name": "Wazir",
//     "email": "wazir@gmail.com"
//   }
// }

// login flow
// Receive email/password
//         ↓
// Find user by email
//         ↓
// If not found → 400
//         ↓
// Compare passwords
//         ↓
// If mismatch → 400
//         ↓
// Generate JWT
//         ↓
// Return token + user