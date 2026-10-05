import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
})

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'user already exists' })
  }

  // the pre('save') hook in the User model hashes the password
  const user = await User.create({ name, email, password })

  res.status(201).json({
    message: 'user registered successfully',
    token: generateToken(user._id),
    user: publicUser(user),
  })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // Same message for "no such user" and "wrong password", so the response
  // can't be used to find out which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  res.status(200).json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: publicUser(user),
  })
})

// GET /api/auth/me (protect has already loaded req.user, without the password)
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: { ...publicUser(req.user), createdAt: req.user.createdAt },
  })
})

// PUT /api/auth/me: change the name, and/or the password if the current one is right
export const updateMe = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body

  // req.user has no password hash, and comparePassword needs it
  const user = await User.findById(req.user._id)

  if (name) {
    user.name = name
  }

  if (newPassword) {
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword // re-hashed by the pre('save') hook
  }

  await user.save()

  res.status(200).json({
    message: 'Profile updated successfully',
    user: publicUser(user),
  })
})
