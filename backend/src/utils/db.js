import mongoose from 'mongoose'

// Throws if MongoDB is unreachable; server.js decides what to do about it.
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('connected to mongoDB')
}

export default connectDB
