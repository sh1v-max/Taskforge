# Schemas

This directory contains Zod validation schemas to ensure data integrity for incoming requests.

## Files

### `auth.schema.js`
Defines validation rules for authentication data.
- **`registerSchema`**: Validates `name` (required), `email` (format), and `password` (min 6 characters).
- **`loginSchema`**: Validates `email` (format) and `password` (min 6 characters).
