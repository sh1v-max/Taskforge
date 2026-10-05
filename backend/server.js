// Must be the first import: ES imports run before any code in this file,
// so app.js would otherwise read FRONTEND_URL before .env is loaded.
import 'dotenv/config'
import app from './src/app.js'
import connectDB from './src/utils/db.js'

const PORT = process.env.PORT || 3000

// Without a database every request would 500, so refuse to start instead.
try {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
} catch (error) {
  console.error('MongoDB connection failed, not starting:', error.message)
  process.exit(1)
}
