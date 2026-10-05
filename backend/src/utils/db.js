// this file connects node.js application to mongodb
// and export a reusable database connection

import mongoose from 'mongoose'

const connectDB = async () => {
  // creates an async function responsible for connecting to mongoDB
  //
  // No try/catch here on purpose: if the connection fails, the error is
  // thrown to server.js, which stops the server. (It used to catch and only
  // log the error, so the server started anyway and every request returned 500.)
  await mongoose.connect(process.env.MONGO_URI)
  // this is actual database connection
  // connect to mongoDB atlas
  // creates connection pool
  // keeps the connection alive
  // allows models to start querying the database
  console.log('connected to mongoDB')
}

export default connectDB
