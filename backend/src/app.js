// this file creates the express application
// configure middleware
// mount routes
// define endpoints
// export the app

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

// import User from './models/User.js'
import authRouter from './routes/auth.router.js'
import taskRouter from './routes/task.router.js'
import { protect } from './middleware/auth.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'
import swaggerSpec from './config/swagger.js'

const app = express()

// Behind a reverse proxy (Render, Railway, etc.) the client's real IP
// arrives in the X-Forwarded-For header. trust proxy tells Express to
// use it, so req.ip is the visitor — not the proxy. Without this, the
// rate limiter would count ALL users as one IP and block everyone.
app.set('trust proxy', 1)

// ============ HEALTH CHECK ============
// Lightweight endpoint for uptime checks (Render pings this often).
// Deliberately OUTSIDE /api so the rate limiter never blocks it.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

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

// ============ SWAGGER DOCUMENTATION ============
// Serve OpenAPI/Swagger documentation at /api/docs
// Interactive UI allows testing API endpoints
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ============ ROUTES ============
app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)

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

// ============ ERROR HANDLER MIDDLEWARE ============
// MUST be last - catches all errors from routes and middleware above
app.use(errorHandler)

export default app
