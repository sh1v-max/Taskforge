# TaskForge API - Project Overview

## Project Summary
**TaskForge API** is a Node.js/Express backend for a task management system. Currently, it implements a complete, production-ready authentication system with JWT tokens and secure password hashing. The foundation is in place to extend it into a full task management platform.

## Tech Stack
- **Runtime:** Node.js (ES6 modules)
- **Framework:** Express 5.2.1
- **Database:** MongoDB with Mongoose 9.2.1
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Password Security:** bcryptjs 3.0.3
- **Validation:** Zod 4.3.6
- **Development:** Nodemon for hot-reload

## Architecture Pattern
The project follows the **MVC (Model-View-Controller)** pattern:
- **Models** (`src/models/`) - Database schemas and logic
- **Controllers** (`src/controllers/`) - Business logic for endpoints
- **Routes** (`src/routes/`) - URL mapping to controllers
- **Middleware** (`src/middleware/`) - Request/response interceptors
- **Schemas** (`src/schemas/`) - Zod validation definitions
- **Utils** (`src/utils/`) - Helper functions

## What's Been Built

### 1. **User Model** (`src/models/User.js`)
Defines the database schema for users with:
- **Fields:** name, email, password, role (default: "user")
- **Timestamps:** createdAt, updatedAt (auto-generated)
- **Pre-save Hook:** Automatically hashes passwords using bcryptjs with salt of 10
- **Instance Method:** `comparePassword()` - securely compares plain text password with hashed version

**Example User Document:**
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashed...", // bcrypt hashed
  "role": "user",
  "createdAt": "2026-05-13T06:44:23.280Z",
  "updatedAt": "2026-05-13T06:44:23.280Z"
}
```

### 2. **Authentication Controllers** (`src/controllers/auth.controller.js`)

#### Register Endpoint
- **Route:** `POST /api/auth/register`
- **Validation:** Zod validates name, email, password
- **Logic:**
  1. Check if email already exists
  2. Create new user (password auto-hashed by pre-save hook)
  3. Return 201 with user info (id, name, email, role) - password excluded

#### Login Endpoint
- **Route:** `POST /api/auth/login`
- **Validation:** Zod validates email, password
- **Logic:**
  1. Find user by email
  2. Compare submitted password with stored hash
  3. Generate JWT token (valid for 30 days)
  4. Return 200 with token + user info

**Security:** Uses generic error messages ("Invalid credentials") for both missing users and wrong passwords - prevents email enumeration attacks.

### 3. **Request Validation Middleware** (`src/middleware/validate.js`)
- **Function:** `validate(schema)` - Higher-order middleware
- **Flow:**
  1. Accepts Zod schema as parameter
  2. Returns middleware that validates req.body
  3. Returns 400 with detailed error messages if invalid
  4. Replaces req.body with validated data if valid
  5. Calls next() to proceed

### 4. **Validation Schemas** (`src/schemas/auth.schema.js`)

**registerSchema:**
- `name` - Required, non-empty string
- `email` - Valid email format, trimmed, lowercase
- `password` - Minimum 6 characters

**loginSchema:**
- `email` - Valid email format, trimmed, lowercase
- `password` - Minimum 6 characters

### 5. **JWT Token Generation** (`src/utils/generateToken.js`)
- **Function:** `generateToken(userId)`
- **Returns:** Signed JWT containing user ID
- **Expiration:** 30 days
- **Signing Algorithm:** HS256 (HMAC-SHA256)
- **Secret:** `process.env.JWT_SECRET`

**Token Payload Example:**
```json
{
  "id": "691592a74df2a644e6f0f0e0",
  "iat": 1747163157,
  "exp": 1749755157
}
```

### 6. **Authentication Middleware** (`src/middleware/auth.middleware.js`)
- **Function:** `protect(req, res, next)`
- **Purpose:** Guards protected routes
- **Logic:**
  1. Extracts Bearer token from Authorization header
  2. Verifies token signature using JWT_SECRET
  3. Decodes token to get user ID
  4. Fetches user from database (excludes password)
  5. Attaches user object to `req.user`
  6. Calls next() or returns 401 if token invalid

- **Usage:** Apply to any route that requires authentication:
  ```javascript
  app.get('/api/protected', protect, controllerFunction)
  ```

### 7. **Router Setup** (`src/routes/auth.router.js`)
Defines two routes:
- `POST /register` → validate(registerSchema) → register controller
- `POST /login` → validate(loginSchema) → login controller

### 8. **Express App Setup** (`src/app.js`)
- Configures JSON body parser
- Mounts auth router at `/api/auth`
- Includes test protected route at `/api/protected`
- Main endpoint at `/` returns "TaskForge API is running"

### 9. **Database Connection** (`src/utils/db.js`)
- Connects to MongoDB using mongoose
- Connection string from `process.env.MONGO_URI`
- Handles connection errors with logging

### 10. **Server Entry Point** (`server.js`)
- Loads environment variables from `.env`
- Connects to MongoDB
- Starts Express server on port (default: 3000)

## Complete Request/Response Flow

### Registration Flow
```
1. Client sends POST /api/auth/register
   Body: { name, email, password }
         ↓
2. validate middleware checks against registerSchema
         ↓
3. If invalid → 400 error response
         ↓
4. If valid → register controller executes
         ↓
5. Check if email exists
         ↓
6. User.create() saves to database
         ↓
7. pre('save') hook hashes password
         ↓
8. Document saved in MongoDB
         ↓
9. Return 201 with user info (no password)
```

### Login Flow
```
1. Client sends POST /api/auth/login
   Body: { email, password }
         ↓
2. validate middleware checks against loginSchema
         ↓
3. If invalid → 400 error response
         ↓
4. If valid → login controller executes
         ↓
5. Find user by email
         ↓
6. If not found → 400 "Invalid credentials"
         ↓
7. Compare submitted password with bcrypt hash
         ↓
8. If mismatch → 400 "Invalid credentials"
         ↓
9. Generate JWT token (expires in 30 days)
         ↓
10. Return 200 with token + user info
```

### Protected Route Access Flow
```
1. Client sends request with header:
   Authorization: Bearer <token>
         ↓
2. protect middleware intercepts
         ↓
3. Extract token from "Bearer <token>"
         ↓
4. If missing → 401 "Not authorized, no token"
         ↓
5. Verify token signature with JWT_SECRET
         ↓
6. If invalid → 401 "Not authorized, token failed"
         ↓
7. Decode token to get user ID
         ↓
8. Fetch user from database
         ↓
9. If not found → 401 "User not found"
         ↓
10. Attach user to req.user
         ↓
11. Call next() to proceed to controller
```

## Security Features Implemented

✅ **Password Hashing** - Automatic bcryptjs hashing with salt rounds
✅ **JWT Tokens** - Signed, tamper-proof authentication tokens
✅ **Email Enumeration Prevention** - Generic error messages during login
✅ **Token Expiration** - 30-day token validity period
✅ **Data Validation** - Zod schemas prevent invalid data entry
✅ **Password Exclusion** - Passwords never sent in responses
✅ **Middleware Pattern** - Route protection via middleware

## Environment Variables Required
```
PORT=3000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taskforge
JWT_SECRET=your_super_secret_key_here
```

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/` | No | Health check |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login & get JWT token |
| GET | `/api/protected` | Yes | Test protected route |

## Next Steps (From Learning Plan)
The project has a 20-step learning plan to extend into:
- Task CRUD operations
- Pagination & filtering
- Advanced security features
- Role-based access control (RBAC)
- Email verification
- Password reset functionality

## Key Code Insights

### Why Bcrypt?
- Intentionally slow (prevents brute-force attacks)
- Built-in salt generation
- Adaptive - becomes harder as computers get faster

### Why JWT?
- Stateless - server doesn't need to store sessions
- Scalable - no session storage overhead
- Self-contained - all info in the token

### Why Zod?
- Type-safe validation
- Clear error messages
- Better than manual validation checks

### Architecture Benefits
- **Separation of concerns** - each file has one job
- **Reusability** - middleware/schemas used across routes
- **Testability** - easy to test individual functions
- **Maintainability** - clear structure for adding features
