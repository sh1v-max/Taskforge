# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

### Development
- **Start dev server**: `npm run dev` (uses nodemon for auto-reload on file changes)
- **Install dependencies**: `npm install`

### Environment Setup
1. Create `.env` file in the root (see `.env.example` for template)
2. Required variables: `PORT`, `MONGO_URI`, `JWT_SECRET`

## Project Overview

TaskForge API is a Node.js/Express backend for a task management platform. Currently implements JWT-based authentication with password hashing and request validation. Designed to extend into a full task management system following a 20-step learning plan (see `20_steps_learning_plan.md`).

## Architecture

The project follows the **MVC pattern** with a modular structure:

```
src/
├── routes/          → Define API endpoints (calls controllers)
├── controllers/     → Business logic for authentication
├── models/          → Mongoose schemas and database operations
├── middleware/      → Validation and authentication checks
├── schemas/         → Zod validation schemas
├── utils/           → Helper functions (DB connection, JWT generation)
└── app.js           → Express app setup
server.js            → Entry point (load env, connect DB, start server)
```

### Request Flow

1. **Request arrives** at route handler (e.g., `POST /api/auth/register`)
2. **Validation middleware** runs first: `validate(schema)` checks request body against Zod schema, returns 400 if invalid
3. **Controller function** executes business logic (create user, compare password, etc.)
4. **Model operations** interact with MongoDB (User.create(), User.findOne(), etc.)
5. **Response sent** with appropriate status code and data

### Key Modules

#### Authentication Flow (Complete)

**Registration**:
- Route: `POST /api/auth/register`
- Validates name, email, password with `registerSchema`
- Creates user if email doesn't exist
- Mongoose `pre('save')` hook auto-hashes password with bcryptjs
- Returns 201 with user (excluding password)

**Login**:
- Route: `POST /api/auth/login`
- Validates email, password with `loginSchema`
- Finds user by email, compares password with bcryptjs
- Generates JWT token via `generateToken(userId)`
- Returns 200 with token and user data

**Protected Routes**:
- Use `protect` middleware to verify JWT from `Authorization: Bearer <token>` header
- Decodes token, fetches user, attaches to `req.user`
- Returns 401 if token missing/invalid/expired

#### User Model

- **Schema fields**: name, email, password, role (default: "user"), timestamps (createdAt, updatedAt)
- **Pre-save hook**: Hashes password automatically before saving
- **Method `comparePassword(plainPassword)`**: Uses bcryptjs to compare entered password with hashed version
- **Validation**: Email unique & lowercase, password minlength 6

#### Validation Pattern

- Uses Zod for schema-based validation
- `validate(schema)` middleware validates `req.body`, returns errors as array or proceeds
- Schemas defined in `src/schemas/auth.schema.js`
- Returns 400 with error details if validation fails

## Database

- **MongoDB** with Mongoose ODM
- Connection initialized in `src/utils/db.js` (called in server.js at startup)
- User model defined with auto-timestamps
- Connection string from `MONGO_URI` env variable

## Security Notes

- Passwords hashed with bcrypt (salt rounds: 10) before storage
- JWT secret from env variable
- Protected routes require Bearer token in Authorization header
- Generic error messages for login to prevent email enumeration

## Extending the API

When adding new features (e.g., task CRUD):
1. Define Mongoose schema in `src/models/`
2. Create controller with business logic in `src/controllers/`
3. Define Zod validation in `src/schemas/`
4. Create routes that use `validate(schema)` middleware in `src/routes/`
5. Export router and mount in `src/app.js` with `app.use('/api/<resource>', router)`

## Key Dependencies

- **Express 5.2**: HTTP server framework
- **Mongoose 9.2**: MongoDB ODM
- **JWT (jsonwebtoken 9.0)**: Token generation and verification
- **Zod 4.3**: Runtime validation schemas
- **bcryptjs 3.0**: Password hashing
- **dotenv 17.3**: Environment variables
- **nodemon 3.1**: Dev server auto-reload
