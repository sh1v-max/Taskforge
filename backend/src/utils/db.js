// this file connects node.js application to mongodb
// and export a reusable database connection

import mongoose from 'mongoose'

const connectDB = async () => {
  // creates an async function responsible for connecting to mongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI)
    // this is actual database connection
    // connect to mongoDB atlas
    // creates connection pool
    // keeps the connection alive
    // allows models to start querying the database
    console.log('connected to mongoDB')
  } catch (error) {
    console.error('mongoDB connection failed:', error)
  }
}

export default connectDB
