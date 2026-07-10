import app from './src/app.js'
import dotenv from 'dotenv'
import connectDB from './src/utils/db.js'

dotenv.config()

const PORT = process.env.PORT || 3000

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
