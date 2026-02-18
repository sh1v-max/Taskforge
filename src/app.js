import express from 'express'
// import User from './models/User.js'
import authRouter from './routes/auth.router.js'
import { protect } from './middleware/auth.middleware.js'

const app = express()

app.use(express.json())
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
