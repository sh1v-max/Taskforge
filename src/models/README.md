# Models

This directory defines the Mongoose schemas for the application's data.

## Files

### `User.js`
Defines the `User` schema and associated logic.
- **Schema Fields**: `name`, `email`, `password` (hashed), `role` (defaults to 'user').
- **Timestamps**: Automatically adds `createdAt` and `updatedAt`.
- **Pre-save Hook**: Uses `bcryptjs` to hash the password before saving if it has been modified.
- **Methods**:
    - `comparePassword(enteredPassword)`: Compares a plain-text password with the stored hash using `bcrypt.compare()`.
