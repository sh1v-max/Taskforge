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
// getMe controller, returns the currently logged-in user's profile
// no database query needed here: the protect middleware already
// verified the token and fetched the user (without password) into req.user
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  })
})

// updateMe controller, updates the logged-in user's profile
// supports two things:
// 1. changing the name
// 2. changing the password (only if the current password is correct)
export const updateMe = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body

  // req.user came from protect middleware WITHOUT the password field,
  // but comparePassword needs it — so fetch the full user here
  const user = await User.findById(req.user._id)

  // update name if provided
  if (name) {
    user.name = name
  }

  // change password if requested
  if (newPassword) {
    // verify the current password first
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      })
    }

    // setting user.password triggers the pre('save') hook → hashed automatically
    user.password = newPassword
  }

  await user.save()

  res.status(200).json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// update flow
// Receive name / currentPassword+newPassword
//         ↓
// Fetch full user (with password hash)
//         ↓
// Name given? → update it
//         ↓
// New password given? → verify current password first
//         ↓
// If wrong → 400
//         ↓
// user.save() → pre-save hook re-hashes password
//         ↓
// Return updated user
