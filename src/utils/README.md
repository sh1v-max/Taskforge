# Utils

This directory contains utility functions and configuration helpers.

## Files

### `db.js`
Handles the connection to the MongoDB database using Mongoose.
- Exports a `connectDB` function that connects to the URI provided in `.env`.

### `generateToken.js`
Helper function to generate JSON Web Tokens (JWT).
- Takes a `user.id` and signs it with the `JWT_SECRET`.
- Sets an expiration period (e.g., 30 days).
