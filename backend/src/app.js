import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'

import authRouter from './routes/auth.router.js'
import taskRouter from './routes/task.router.js'
import { protect } from './middleware/auth.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'
import swaggerSpec from './config/swagger.js'

const app = express()

// Render sits behind a proxy, so the visitor's IP arrives in X-Forwarded-For.
// Without this the rate limiter sees every user as the proxy's IP and one
// person could lock everyone out.
app.set('trust proxy', 1)

// Outside /api so Render's frequent uptime pings never hit the rate limiter
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // set FRONTEND_URL in production
  credentials: true,
}))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Vitest sets VITEST; the suite fires far more than 100 requests in seconds
  skip: () => Boolean(process.env.VITEST),
})
app.use('/api/', apiLimiter)

app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

// Last, so it catches errors from everything above
app.use(errorHandler)

export default app
