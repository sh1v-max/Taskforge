# Controllers

This directory contains the business logic for the TaskForge API. Controllers are responsible for processing incoming requests, interacting with models, and returning appropriate responses to the client.

## Files

### `auth.controller.js`
Handles user authentication logic, including registration and login.
- **`register`**: 
    - Takes `name`, `email`, and `password` from `req.body`.
    - Checks if a user already exists with that email.
    - Creates a new user in MongoDB.
    - Returns the created user details (excluding password).
- **`login`**:
    - Takes `email` and `password` from `req.body`.
    - Validates the user exists.
    - Compares the provided password with the hashed password in the database using `user.comparePassword()`.
    - Generates a JWT token if successful.
    - Returns the user info and the token.
