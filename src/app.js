// this file creates the express application
// configure middleware
// mount routes
// define endpoints
// export the app

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// import User from './models/User.js'
import authRouter from './routes/auth.router.js'
import { protect } from './middleware/auth.middleware.js'

const app = express()

// ============ SECURITY MIDDLEWARE ============
// Apply security headers (helmet) FIRST - protects all responses
app.use(helmet())

// Allow frontend to communicate with this API (CORS)
// In development: allow all origins. In production: restrict to your domain
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // '*' = allow all (dev only)
  credentials: true, // Allow cookies to be sent
}))

// Rate limiting - max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
})

// Apply rate limiting to all /api routes
app.use('/api/', apiLimiter)

// ============ BODY PARSER MIDDLEWARE ============
// Parse incoming JSON bodies
app.use(express.json())

// ============ ROUTES ============
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('TaskForge API is running')
})

app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user,
  })
})

// testing user creation
// app.get('/test-user', async (req, res) => {
//   try {
//     const user = await User.create({
//       name: 'john',
//       email: 'john@test.com',
//       password: '124567',
//     })
//     res.json(user)
//   } catch (error) {
//     console.error('Error creating user:', error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// })

export default app
