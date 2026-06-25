# TaskForge API - Complete Technical Overview

**Status:** Steps 1-13, 17-18, 20 Complete ✅
**All Tests Passing:** 12/12 ✅
**Created:** 2026-06-23
**Last Updated:** 2026-06-25

---

## 🔗 Quick Navigation - Click to View Code

### Core Components
- **Main App:** [src/app.js](src/app.js) | [src/server.js](src/server.js)
- **Models:** [User.js](src/models/User.js) | [Task.js](src/models/Task.js)
- **Schemas:** [task.schema.js](src/schemas/task.schema.js) | [auth.schema.js](src/schemas/auth.schema.js)
- **Controllers:** [auth.controller.js](src/controllers/auth.controller.js) | [task.controller.js](src/controllers/task.controller.js)
- **Routes:** [auth.router.js](src/routes/auth.router.js) | [task.router.js](src/routes/task.router.js)
- **Middleware:** [auth.middleware.js](src/middleware/auth.middleware.js) | [validate.middleware.js](src/middleware/validate.middleware.js) | [error.middleware.js](src/middleware/error.middleware.js)
- **Utils:** [generateToken.js](src/utils/generateToken.js)
- **Config:** [swagger.js](src/config/swagger.js) - OpenAPI/Swagger configuration

### Testing & Documentation
- **Tests:** [test-api.js](test-api.js) - 12 automated tests
- **Test Guide:** [test.md](test.md) - Detailed test documentation
- **Test Action:** [test_action.md](test_action.md) - Step-by-step testing guide

---

## 📚 Table of Contents

1. [Project Architecture](#project-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Flow](#data-flow)
5. [Security Implementation](#security-implementation)
6. [Models & Database](#models--database)
7. [Validation Strategy](#validation-strategy)
8. [Middleware Pipeline](#middleware-pipeline)
9. [Controllers & Business Logic](#controllers--business-logic)
10. [Routes & Endpoints](#routes--endpoints)
11. [Request/Response Examples](#requestresponse-examples)
12. [Error Handling](#error-handling)
13. [Swagger/OpenAPI Documentation](#swaggeropenapi-documentation)
14. [Key Learning Concepts](#key-learning-concepts)

---

## 🏗️ Project Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Request (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Security Middleware                                │  │
│  │    ├─ Helmet (Security Headers)                       │  │
│  │    ├─ CORS (Cross-Origin)                             │  │
│  │    └─ Rate Limiting (100 req/15min)                   │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 2. Body Parser                                        │  │
│  │    └─ Parse JSON request body                         │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 3. Route Matching                                     │  │
│  │    ├─ /api/auth → Auth routes                         │  │
│  │    └─ /api/tasks → Task routes                        │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 4. Authentication Middleware (protect)                │  │
│  │    └─ Verify JWT token, set req.user                 │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 5. Validation Middleware                              │  │
│  │    ├─ validateBody (POST/PUT)                         │  │
│  │    └─ validateQuery (GET with filters)                │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 6. Controller (Business Logic)                        │  │
│  │    ├─ Register/Login                                  │  │
│  │    ├─ Create/Read/Update/Delete Tasks                │  │
│  │    └─ Apply filtering, sorting, pagination           │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 7. Database Interaction                               │  │
│  │    ├─ Mongoose Models                                 │  │
│  │    └─ MongoDB Operations                              │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 8. Response Formatting                                │  │
│  │    └─ Return JSON response                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Response (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js v22+ | JavaScript execution |
| **Framework** | Express.js v5 | HTTP server & routing |
| **Database** | MongoDB Atlas | Cloud NoSQL database |
| **ORM** | Mongoose v9 | MongoDB object modeling |
| **Validation** | Zod v4 | Runtime schema validation |
| **Authentication** | JWT (jsonwebtoken) | Token-based auth |
| **Password Security** | bcryptjs | Password hashing |
| **Security** | Helmet, CORS | HTTP headers & cross-origin |
| **Rate Limiting** | express-rate-limit | Request throttling |
| **Environment** | dotenv | Configuration management |

### Why These Technologies?

**Express.js:**
- Lightweight and flexible
- Large ecosystem of middleware
- Perfect for REST APIs
- Easy routing and middleware chaining

**Mongoose:**
- Schema validation at database level
- Automatic population of references
- Pre/post hooks for data processing
- Type safety for MongoDB documents

**Zod:**
- Runtime validation (catch errors before database)
- Type inference from schemas
- Clear error messages
- Can coerce types (string "5" → number 5)

**JWT:**
- Stateless authentication (no session storage needed)
- Can be verified without database lookup
- Standard for REST APIs
- Works across domains/services

**bcryptjs:**
- One-way hashing (can't decrypt)
- Salting prevents rainbow tables
- Adaptive: slower as computers get faster

---

## 📁 Project Structure

```
TaskForge-API/
├── src/
│   ├── app.js                          # Express app setup
│   ├── server.js                       # Entry point
│   │
│   ├── models/                         # Database schemas
│   │   ├── User.js                     # User model with password hashing
│   │   └── Task.js                     # Task model with user reference
│   │
│   ├── schemas/                        # Zod validation schemas
│   │   └── task.schema.js              # Task input validation
│   │
│   ├── controllers/                    # Business logic
│   │   ├── auth.controller.js          # Register, login logic
│   │   └── task.controller.js          # CRUD operations
│   │
│   ├── routes/                         # HTTP endpoints
│   │   ├── auth.router.js              # Auth endpoints
│   │   └── task.router.js              # Task endpoints
│   │
│   ├── middleware/                     # Middleware functions
│   │   ├── auth.middleware.js          # JWT verification
│   │   ├── validate.middleware.js      # Zod schema validation
│   │   └── error.middleware.js         # Error handling (TODO)
│   │
│   └── utils/                          # Helper functions
│       └── generateToken.js            # JWT token generation
│
├── .env                                # Environment variables
├── package.json                        # Dependencies
├── test-api.js                         # Automated test script
├── test.md                             # Detailed test documentation
├── test_action.md                      # Testing action guide
└── overview.md                         # This file!
```

**Click links below to view source code:**
- **Models:** [User.js](src/models/User.js) | [Task.js](src/models/Task.js)
- **Schemas:** [task.schema.js](src/schemas/task.schema.js)
- **Controllers:** [auth.controller.js](src/controllers/auth.controller.js) | [task.controller.js](src/controllers/task.controller.js)
- **Routes:** [auth.router.js](src/routes/auth.router.js) | [task.router.js](src/routes/task.router.js)
- **Middleware:** [auth.middleware.js](src/middleware/auth.middleware.js) | [validate.middleware.js](src/middleware/validate.middleware.js)
- **Utils:** [generateToken.js](src/utils/generateToken.js)
- **Main:** [app.js](src/app.js) | [server.js](src/server.js)

---

## 🔄 Data Flow

### Complete Request/Response Cycle

Let's trace a request through the entire system:

#### **Example: Create a Task**

```
Step 1: Client sends request
─────────────────────────────────
POST /api/tasks
Headers: {
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}
Body: {
  "title": "Buy groceries",
  "description": "Buy milk, eggs",
  "status": "pending",
  "dueDate": "2026-06-15T00:00:00Z"
}

         ↓ (Request enters Express)

Step 2: Security Middleware (app.js)
─────────────────────────────────
helmet()           → Adds security headers
cors()             → Allows cross-origin
rateLimit()        → Checks 100 req/15min limit
express.json()     → Parses JSON body

         ↓

Step 3: Route Matching (app.js)
─────────────────────────────────
Request path: /api/tasks
Matches: app.use('/api/tasks', taskRouter)
Router: task.router.js
Method: POST /

         ↓

Step 4: Authentication Middleware (task.router.js)
─────────────────────────────────
protect middleware runs
  1. Check Authorization header exists
  2. Extract token from "Bearer {token}"
  3. Verify JWT signature
  4. Decode token → get user ID
  5. Set req.user = { id: "607f...", email: "..." }
  
If fails: Return 401 Unauthorized
If passes: Continue to next middleware

         ↓

Step 5: Validation Middleware (task.router.js)
─────────────────────────────────
validateBody(createTaskSchema) runs

Schema checks:
  ✓ title: must be non-empty string
  ✓ description: optional string
  ✓ status: must be "pending" | "in-progress" | "completed"
  ✓ dueDate: optional ISO 8601 datetime

Result:
  Valid → Store validated data in req.validatedData
  Invalid → Return 400 Bad Request with errors

         ↓

Step 6: Controller Logic (task.controller.js - createTask)
─────────────────────────────────
async function createTask(req, res) {
  // Extract from request
  const { title, description, status, dueDate } = req.body
  const userId = req.user.id              // From JWT token
  
  // Create in database
  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    user: userId                           // SECURITY: Force user ownership
  })
  
  // Return response
  res.status(201).json(task)
}

         ↓ (Task.create calls Mongoose)

Step 7: Mongoose Model (models/Task.js)
─────────────────────────────────
Mongoose validation:
  ✓ Check required fields (title, user)
  ✓ Check enum values (status)
  ✓ Check data types
  
Timestamp creation:
  ✓ Add createdAt: current time
  ✓ Add updatedAt: current time
  
Reference creation:
  ✓ Store user as ObjectId reference

         ↓ (Save to database)

Step 8: MongoDB Save
─────────────────────────────────
Database receives:
{
  _id: ObjectId("..."),
  title: "Buy groceries",
  description: "Buy milk, eggs",
  status: "pending",
  dueDate: ISODate("2026-06-15T00:00:00Z"),
  user: ObjectId("607f..."),
  createdAt: ISODate("2026-06-23T10:00:00Z"),
  updatedAt: ISODate("2026-06-23T10:00:00Z")
}

Save successful → Return document

         ↓

Step 9: Response Formatting (controller)
─────────────────────────────────
res.status(201).json(task)

Sends back:
Status: 201 Created
Body: {
  "_id": "507f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "description": "Buy milk, eggs",
  "status": "pending",
  "dueDate": "2026-06-15T00:00:00Z",
  "user": "607f1f77bcf86cd799439012",
  "createdAt": "2026-06-23T10:00:00Z",
  "updatedAt": "2026-06-23T10:00:00Z"
}

         ↓

Step 10: Client receives response
─────────────────────────────────
Frontend gets task object with ID
Can use ID for future update/delete operations
Displays task in UI
```

---

## 🔐 Security Implementation

### Multi-Layer Security Architecture

#### **Layer 1: Network Security (Helmet)**

**What it does:**
```javascript
app.use(helmet())
```

**Security headers added:**
```
X-Frame-Options: DENY
  └─ Prevents clickjacking attacks
  └─ Prevents embedding your site in iframes

X-Content-Type-Options: nosniff
  └─ Prevents MIME-type sniffing
  └─ Browser can't guess file types

Content-Security-Policy: default-src 'self'
  └─ Only allow resources from your domain
  └─ Blocks external scripts

Strict-Transport-Security: max-age=15552000
  └─ Force HTTPS for all connections
  └─ Prevents man-in-the-middle attacks
```

**Why it matters:**
- Prevents common web vulnerabilities
- Required for production APIs
- Automatic protection without code changes

---

#### **Layer 2: CORS (Cross-Origin Resource Sharing)**

**What it does:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
```

**Problem it solves:**
```
Frontend at: http://localhost:3000
API at:     http://localhost:5000

Without CORS:
  Browser blocks request
  Error: "No 'Access-Control-Allow-Origin' header"

With CORS:
  Server says: "I allow requests from localhost:3000"
  Browser allows request ✅
```

**Configuration:**
```javascript
origin: '*'              // In development: allow all origins
origin: 'yourdomain'     // In production: specific domain
credentials: true        // Allow sending/receiving cookies
```

---

#### **Layer 3: Authentication (JWT)**

**How JWT works:**

```
Registration:
  1. User sends password
  2. Server hashes password with bcrypt + salt
  3. Save hashed password to database (original password discarded)
  4. Generate JWT token
  5. Return token to client

Login:
  1. User sends email + password
  2. Server finds user by email
  3. Compare plaintext password with hashed version
  4. If match: Generate new JWT token
  5. Return token to client

Using token:
  1. Client stores token in localStorage/sessionStorage
  2. Client sends token in Authorization header: "Bearer {token}"
  3. Server verifies token signature (proves it's real)
  4. Server decodes token → get user ID
  5. Set req.user = { id, email }
  6. Controller uses req.user.id for security checks
```

**Token structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2YxZjc3YmNmODZjZDc5OTQzOTAxMiIsImlhdCI6MTYyMzc1MzY0NX0.signature

↑ Header         ↑ Payload            ↑ Signature
Contains algo    Contains data        Verifies authenticity
(HS256)          (user ID, issued at)
```

---

#### **Layer 4: Data Ownership Verification**

**Problem:**
```
What prevents user A from accessing user B's tasks?

Bad approach:
  GET /api/tasks/507f...
  → Find task by ID only
  → Return task (any user can access)

Good approach (what we do):
  GET /api/tasks/507f...
  → Find task by ID AND user
  → Task.findOne({ _id: id, user: req.user.id })
  → If user doesn't own it: return null → 404
```

**Implemented in all endpoints:**
```javascript
// Get task only if user owns it
const task = await Task.findOne({
  _id: req.params.id,
  user: req.user.id  // ← SECURITY CHECK
})

// Update task only if user owns it
const task = await Task.findOneAndUpdate(
  { _id: id, user: req.user.id },  // ← SECURITY CHECK
  updateData,
  { new: true }
)

// Delete task only if user owns it
const task = await Task.findOneAndDelete({
  _id: id,
  user: req.user.id  // ← SECURITY CHECK
})
```

---

#### **Layer 5: Rate Limiting**

**What it does:**
```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // max 100 requests
  message: 'Too many requests'
})
app.use('/api/', apiLimiter)
```

**Protection against:**
```
Brute force attacks:
  User tries 10,000 login attempts/hour
  → Blocked after 100 attempts
  → Must wait 15 minutes to try again

DDoS attacks:
  Bot sends 1,000 requests/second
  → Blocked after 100 requests
  → Server doesn't get overwhelmed

API abuse:
  User scripts hammering endpoints
  → Blocked after 100 requests/15min
  → Prevents resource exhaustion
```

---

## 📊 Models & Database

### User Model ([models/User.js](src/models/User.js))

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,          // Can't have duplicate emails
    lowercase: true,       // Store as lowercase for consistency
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6           // Minimum password length
  },
  role: {
    type: String,
    default: 'user'        // Default role for new users
  }
}, {
  timestamps: true         // Auto createdAt, updatedAt
})

// Pre-save hook: hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Instance method: compare plaintext with hashed
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
```

**Why this approach:**
- Password never stored in plaintext
- Salt prevents rainbow table attacks
- Pre-save hook runs automatically
- comparePassword method called during login

---

### Task Model ([models/Task.js](src/models/Task.js))

```javascript
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,        // Must provide title
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    default: ''            // Optional, defaults to empty
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',    // Defaults to pending
    message: 'Status must be...'  // Validation error message
  },
  dueDate: {
    type: Date,
    default: null          // Optional
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           // Reference to User collection
    required: true         // Must assign to a user
  }
}, {
  timestamps: true         // Auto createdAt, updatedAt
})
```

**Database relationships:**
```
Users Collection          Tasks Collection
┌─────────────────┐       ┌──────────────────┐
│ User 1          │       │ Task 1           │
│ _id: 607f...    │────→  │ user: 607f...    │
│ name: John      │       │ title: Buy milk  │
└─────────────────┘       └──────────────────┘
                          
                          ┌──────────────────┐
                          │ Task 2           │
                          │ user: 607f...    │
                          │ title: Finish... │
                          └──────────────────┘

One user → Many tasks
One task → One user
```

---

## ✔️ Validation Strategy

### Two-Layer Validation Approach

#### **Layer 1: Zod (Request Validation)**

**Location:** [src/schemas/task.schema.js](src/schemas/task.schema.js)

```javascript
// CreateTaskSchema - validates POST /api/tasks body
export const createTaskSchema = z.object({
  title: z
    .string()
    .nonempty()           // Can't be empty
    .min(1),
    
  description: z
    .string()
    .optional(),           // Can be omitted
    
  status: z
    .enum(['pending', 'in-progress', 'completed'])
    .optional()
    .default('pending'),   // Uses pending if not provided
    
  dueDate: z
    .string()
    .datetime()            // Must be ISO 8601 format
    .optional()
    .nullable()            // Can be null
})

// UpdateTaskSchema - allows partial updates
export const updateTaskSchema = z.object({
  title: z.string().nonempty().optional(),
  description: z.string().optional(),
  status: z.enum([...]).optional(),
  dueDate: z.string().datetime().optional().nullable()
})

// QuerySchema - validates GET /api/tasks?status=...&page=...
export const tasksQuerySchema = z.object({
  status: z.enum([...]).optional(),
  sortBy: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10)
})
```

**Why Zod?**
- Catches errors before hitting database
- Type coercion (string "5" → number 5)
- Clear error messages for frontend
- Automatic type inference

---

#### **Layer 2: Mongoose (Database Validation)**

```javascript
// Task model enforces:
// 1. Type validation: title must be String
// 2. Required fields: title, user mandatory
// 3. Enum values: status must be from list
// 4. Custom messages: error messages if validation fails

const task = await Task.create({
  title: 123  // ← MongoDB rejects: not a string
})
// Error: "title" must be a string
```

**Why both?**
```
Zod validation (request):
  ✓ Fast, doesn't touch database
  ✓ Clear error messages
  ✓ Prevents bad data entering system

Mongoose validation (database):
  ✓ Final safety net
  ✓ Protects if data bypasses Zod
  ✓ Enforces schema at storage level
```

---

## 🔄 Middleware Pipeline

**Related Files:**
- [src/app.js](src/app.js) - Main middleware setup
- [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js) - Auth protection
- [src/middleware/validate.middleware.js](src/middleware/validate.middleware.js) - Request validation

### Order of Middleware Execution

```
Request arrives
      ↓
app.use(helmet())
  → Add security headers
      ↓
app.use(cors())
  → Check origin allowed
      ↓
app.use(apiLimiter)
  → Check 100 requests/15 min limit
      ↓
app.use(express.json())
  → Parse JSON body
      ↓
Route matching: /api/tasks
      ↓
router.use(protect)
  → Verify JWT token
  → Set req.user
      ↓
router.post('/', validateBody(schema), createTask)
  → Check request body matches schema
  → Call createTask controller
      ↓
Controller executes
  → Access database
  → Return response
      ↓
Response sent to client
```

### Middleware Chain: Authentication

**Code:** [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js)

```javascript
// In auth.middleware.js
export const protect = (req, res, next) => {
  // 1. Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' })
  }
  
  // 2. Verify token signature
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // 3. Token is valid - set req.user
    req.user = { id: decoded.id }
    // 4. Pass control to next middleware
    next()
  } catch (error) {
    // Token invalid or expired
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

---

## 🎮 Controllers & Business Logic

**Related Files:**
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js) - Auth logic
- [src/controllers/task.controller.js](src/controllers/task.controller.js) - Task CRUD

### Auth Controller ([auth.controller.js](src/controllers/auth.controller.js))

#### **Register Function**

```javascript
export const register = async (req, res) => {
  try {
    // 1. Extract from request
    const { name, email, password } = req.body
    
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'user already exists'
      })
    }
    
    // 3. Create new user
    const user = await User.create({
      name,
      email,
      password
      // Note: password hashed automatically by pre-save hook
    })
    
    // 4. Generate JWT token
    const token = generateToken(user._id)
    
    // 5. Return success response
    res.status(201).json({
      message: 'user registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}
```

**Flow:**
```
Request: POST /api/auth/register
  Body: { name, email, password }
    ↓
Check email not duplicate
    ↓
Hash password with bcrypt
    ↓
Save user to MongoDB
    ↓
Generate JWT token
    ↓
Return token + user info (201)
```

---

#### **Login Function**

```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // 1. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }
    
    // 2. Compare plaintext password with hashed
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      })
    }
    
    // 3. Passwords match - generate token
    const token = generateToken(user._id)
    
    // 4. Return token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}
```

**Flow:**
```
Request: POST /api/auth/login
  Body: { email, password }
    ↓
Find user by email
    ↓
Compare password (plaintext vs hashed)
    ↓
If match: Generate JWT token
    ↓
Return token (200)
    ↓
If no match: Return 400 "Invalid credentials"
```

---

### Task Controller ([task.controller.js](src/controllers/task.controller.js))

#### **Create Task**

```javascript
export const createTask = async (req, res) => {
  // Extract from request
  const { title, description, status, dueDate } = req.body
  // req.user.id comes from JWT token (set by protect middleware)
  const userId = req.user.id
  
  // Create task, forcing user ownership
  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    user: userId  // ← SECURITY: Always use authenticated user's ID
  })
  
  // Return created task
  res.status(201).json(task)
}
```

**Why `user: userId` is critical:**
```
Without it (INSECURE):
  POST /api/tasks
  Body: { title: "...", user: "attacker-id" }
  → Attacker creates task owned by someone else!

With it (SECURE):
  POST /api/tasks
  Body: { title: "...", user: "attacker-id" }
  → We ignore their user field
  → Force: user: req.user.id (actual logged-in user)
  → Task belongs to correct owner
```

---

#### **Get All Tasks**

```javascript
export const getTasks = async (req, res) => {
  // 1. Build base query - only current user's tasks
  const query = { user: req.user.id }
  
  // 2. Apply filtering if provided
  if (req.query.status) {
    query.status = req.query.status
  }
  
  // 3. Start Mongoose query
  let mongoQuery = Task.find(query)
  
  // 4. Apply sorting if provided
  if (req.query.sortBy) {
    const [field, direction] = req.query.sortBy.split(':')
    const sortDirection = direction === 'desc' ? -1 : 1
    mongoQuery = mongoQuery.sort({ [field]: sortDirection })
  }
  
  // 5. Apply pagination
  const validatedQuery = req.validatedQuery || req.query
  const page = validatedQuery.page || 1
  const limit = validatedQuery.limit || 10
  const skip = (page - 1) * limit
  mongoQuery = mongoQuery.skip(skip).limit(limit)
  
  // 6. Execute query
  const tasks = await mongoQuery
  const total = await Task.countDocuments(query)
  
  // 7. Return paginated response
  res.json({
    tasks,
    page,
    limit,
    total
  })
}
```

**Example queries:**
```
GET /api/tasks
→ Returns all user's tasks

GET /api/tasks?status=pending
→ Returns only pending tasks

GET /api/tasks?sortBy=dueDate:asc&page=1&limit=10
→ Returns first 10 tasks, sorted by due date earliest first

GET /api/tasks?status=in-progress&sortBy=createdAt:desc&page=2&limit=5
→ Returns 5 in-progress tasks, newest first, second page (items 6-10)
```

---

#### **Get Task by ID**

```javascript
export const getTaskById = async (req, res) => {
  const { id } = req.params
  
  // Query: task ID AND user ownership
  const task = await Task.findOne({
    _id: id,
    user: req.user.id  // ← Only if user owns it
  })
  
  // If not found or not owned by user
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json(task)
}
```

**Security example:**
```
User A tries: GET /api/tasks/user-b-task-id
  ↓
MongoDB query: { _id: user-b-task-id, user: user-a-id }
  ↓
No match found (task exists but belongs to user B)
  ↓
Return 404 "Task not found"
  ↓
User A doesn't know task exists (security through obscurity)
```

---

#### **Update Task**

```javascript
export const updateTask = async (req, res) => {
  const { id } = req.params
  
  // Only update if user owns it
  const task = await Task.findOneAndUpdate(
    {
      _id: id,
      user: req.user.id  // ← Security check
    },
    req.body,            // Only update sent fields
    {
      new: true,         // Return updated document
      runValidators: true // Re-run Mongoose validators
    }
  )
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json(task)
}
```

**Partial updates example:**
```
PUT /api/tasks/task-id
Body: { status: "completed" }
  ↓
Only status field updated
  ↓
Other fields (title, description) remain unchanged
  ↓
MongoDB validator runs on status field
  ↓
Return updated task with new status
```

---

#### **Delete Task**

```javascript
export const deleteTask = async (req, res) => {
  const { id } = req.params
  
  // Only delete if user owns it
  const task = await Task.findOneAndDelete({
    _id: id,
    user: req.user.id  // ← Security check
  })
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json({ message: 'Task deleted successfully' })
}
```

---

## 🛣️ Routes & Endpoints

**Related Files:**
- [src/routes/auth.router.js](src/routes/auth.router.js) - Auth endpoints
- [src/routes/task.router.js](src/routes/task.router.js) - Task endpoints

### Auth Routes ([auth.router.js](src/routes/auth.router.js))

```javascript
import express from 'express'
import { register, login } from '../controllers/auth.controller.js'

const router = express.Router()

// Public endpoint - anyone can register
router.post('/register', register)

// Public endpoint - anyone can login
router.post('/login', login)

export default router
```

**Usage:**
```
POST /api/auth/register
Body: { name, email, password }
Response: 201 { token, user }

POST /api/auth/login
Body: { email, password }
Response: 200 { token, user }
```

---

### Task Routes ([task.router.js](src/routes/task.router.js))

```javascript
import express from 'express'
import { 
  createTask, getTasks, getTaskById,
  updateTask, deleteTask 
} from '../controllers/task.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateBody, validateQuery } from '../middleware/validate.middleware.js'
import {
  createTaskSchema, updateTaskSchema,
  tasksQuerySchema
} from '../schemas/task.schema.js'

const router = express.Router()

// Apply protect middleware to ALL routes
router.use(protect)

// POST /api/tasks - Create task
router.post('/', validateBody(createTaskSchema), createTask)

// GET /api/tasks - Get all tasks (with filtering, sorting, pagination)
router.get('/', validateQuery(tasksQuerySchema), getTasks)

// GET /api/tasks/:id - Get single task
router.get('/:id', getTaskById)

// PUT /api/tasks/:id - Update task
router.put('/:id', validateBody(updateTaskSchema), updateTask)

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask)

export default router
```

**Endpoint Summary:**
```
POST   /api/tasks                    Create
GET    /api/tasks                    Read all (with filters)
GET    /api/tasks/:id                Read single
PUT    /api/tasks/:id                Update
DELETE /api/tasks/:id                Delete
```

---

## 📤 Request/Response Examples

### Example 1: User Registration

**Request:**
```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "message": "user registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "607f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**What happens:**
1. Validation: name, email, password present ✓
2. Check: email not already registered ✓
3. Hash: password hashed with bcryptjs + salt
4. Save: user saved to MongoDB
5. Generate: JWT token created
6. Return: 201 with token

---

### Example 2: Create Task

**Request:**
```http
POST /api/tasks HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread",
  "status": "pending",
  "dueDate": "2026-06-25T18:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "description": "Buy milk, eggs, bread",
  "status": "pending",
  "dueDate": "2026-06-25T18:00:00Z",
  "user": "607f1f77bcf86cd799439012",
  "createdAt": "2026-06-23T10:00:00Z",
  "updatedAt": "2026-06-23T10:00:00Z"
}
```

**What happens:**
1. Token: JWT verified → req.user.id set
2. Validation: title, description, status, dueDate checked
3. Create: Task.create called with user: req.user.id
4. Mongoose: Runs schema validation
5. MongoDB: Document saved with timestamps
6. Return: 201 with created task

---

### Example 3: Get All Tasks with Filtering

**Request:**
```http
GET /api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=5 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "status": "pending",
      "dueDate": "2026-06-25T18:00:00Z",
      "user": "607f1f77bcf86cd799439012",
      "createdAt": "2026-06-23T10:00:00Z",
      "updatedAt": "2026-06-23T10:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Finish project",
      "status": "pending",
      "dueDate": "2026-06-28T23:59:59Z",
      "user": "607f1f77bcf86cd799439012",
      "createdAt": "2026-06-23T10:00:00Z",
      "updatedAt": "2026-06-23T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 12
}
```

**What happens:**
1. Token: Verified → req.user.id = "607f..."
2. Validation: status="pending" ✓, sortBy format ✓, page=1 ✓, limit=5 ✓
3. Query: Find tasks with { user: "607f...", status: "pending" }
4. Sort: By dueDate ascending (earliest first)
5. Pagination: Skip 0, limit 5 (items 1-5)
6. Count: Total documents matching query = 12
7. Return: 200 with tasks, pagination metadata

---

### Example 4: Error Response

**Request (Bad):**
```http
POST /api/tasks HTTP/1.1
Authorization: Bearer token...
Content-Type: application/json

{
  "description": "No title provided",
  "status": "invalid-value"
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title cannot be empty"
    },
    {
      "field": "status",
      "message": "Status must be pending, in-progress, or completed"
    }
  ]
}
```

**What happens:**
1. Token: Verified ✓
2. Validation: Zod checks against createTaskSchema
3. Fails: title missing, status invalid
4. Format: Errors formatted for frontend
5. Return: 400 with detailed error messages

---

## 🚨 Error Handling

### Error Types & Status Codes

#### **400 Bad Request - Validation Error**

**Cause:** Invalid request data

```javascript
// Example: Missing required field
POST /api/tasks { description: "No title" }
→ 400 Bad Request
→ Error: "title is required"

// Example: Invalid enum value
POST /api/tasks { status: "invalid" }
→ 400 Bad Request
→ Error: "Status must be pending, in-progress, or completed"

// Example: Invalid date format
GET /api/tasks?page=invalid
→ 400 Bad Request
→ Error: "page must be a number"
```

#### **401 Unauthorized - Authentication Error**

**Cause:** Missing or invalid authentication

```javascript
// Missing token
GET /api/tasks (no Authorization header)
→ 401 Unauthorized
→ Error: "Token required"

// Invalid token
GET /api/tasks { Authorization: "Bearer invalid-token" }
→ 401 Unauthorized
→ Error: "Invalid token"

// Expired token
GET /api/tasks { Authorization: "Bearer expired-token" }
→ 401 Unauthorized
→ Error: "Token expired"
```

#### **404 Not Found - Resource Not Found**

**Cause:** Resource doesn't exist or user doesn't own it

```javascript
// Task doesn't exist
GET /api/tasks/nonexistent-id
→ 404 Not Found
→ Error: "Task not found"

// User doesn't own task
GET /api/tasks/other-user-task-id
→ 404 Not Found (doesn't reveal if exists)
→ Error: "Task not found"
```

#### **429 Too Many Requests - Rate Limit**

**Cause:** Exceeded rate limit (100 requests/15 min)

```javascript
// After 100 requests in 15 minutes
POST /api/tasks
→ 429 Too Many Requests
→ Error: "Too many requests, try again later"
```

#### **500 Internal Server Error - Server Error**

**Cause:** Unexpected server error

```javascript
// Database connection lost
POST /api/tasks
→ 500 Internal Server Error
→ Error: "Server error"

// Unhandled exception
GET /api/tasks
→ 500 Internal Server Error
→ Error: "Server error"
```

---

## 🎓 Key Learning Concepts

### 1. **Middleware as a Pipeline**

Middleware runs in order before hitting the controller:
```
Request → Helmet → CORS → RateLimit → BodyParser → Auth → Validation → Controller → Response
```

Each middleware can:
- Inspect request
- Modify request (add req.user)
- Block request (res.status(401).json(...))
- Pass to next (next())

---

### 2. **Async/Await Pattern**

All database operations are async:
```javascript
// Without async/await (callback hell)
User.findOne({ email }, (err, user) => {
  if (err) return res.status(500).json(...)
  bcrypt.compare(password, user.password, (err, match) => {
    if (!match) return res.status(400).json(...)
    jwt.sign(..., (err, token) => {
      res.json({ token })
    })
  })
})

// With async/await (clean!)
const user = await User.findOne({ email })
const match = await user.comparePassword(password)
const token = generateToken(user._id)
res.json({ token })
```

---

### 3. **Security Through Layering**

Multiple layers catch different types of attacks:
- Helmet: XSS, clickjacking
- CORS: Cross-origin attacks
- JWT: Unauthorized access
- User ownership check: Data theft
- Rate limiting: Brute force, DDoS
- Input validation: Injection attacks

No single layer is foolproof, but together they're strong.

---

### 4. **Schema Validation at Two Levels**

```
Zod (Request level)
  ↓
Fast, catches obvious errors
Returns 400 immediately

Mongoose (Database level)
  ↓
Final safety net
Prevents corrupt data in database
```

Both necessary:
- Zod for user experience (fast feedback)
- Mongoose for data integrity (database safety)

---

### 5. **Stateless Authentication**

JWT tokens make authentication stateless:
```
With sessions (stateful):
  1. User logs in
  2. Server creates session in memory
  3. Server stores session ID in cookie
  4. Every request: server looks up session
  5. Scales poorly (sessions take memory)

With JWT (stateless):
  1. User logs in
  2. Server generates token (just a signature)
  3. Server doesn't store anything
  4. Every request: client sends token
  5. Server verifies signature (no database lookup)
  6. Scales perfectly (stateless)
```

---

### 6. **Filtering at Different Stages**

```
URL: /api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=5

Query parsing:
  ↓ req.query = { status: "pending", sortBy: "...", page: "1", limit: "5" }

Validation:
  ↓ Zod coerces: page "1" → 1, limit "5" → 5
  ↓ Validates: status must be enum value

Database query:
  ↓ { user: req.user.id, status: "pending" }
  ↓ .sort({ dueDate: 1 })
  ↓ .skip(0).limit(5)

Response:
  ↓ { tasks: [...], page: 1, limit: 5, total: 23 }
```

---

### 7. **Ownership Verification Pattern**

Whenever accessing user data, always check ownership:

```javascript
// ❌ WRONG - anyone can access
const task = await Task.findById(id)

// ✅ RIGHT - only owner can access
const task = await Task.findOne({
  _id: id,
  user: req.user.id
})

// Apply to all operations
findById      → findOne({ _id, user })
findByIdAndUpdate → findOneAndUpdate({ _id, user }, ...)
findByIdAndDelete → findOneAndDelete({ _id, user })
```

---

## 📈 API Maturity Levels

### Current State (Steps 1-13) ✅

```
Level 1: Basic CRUD
  ✅ Create
  ✅ Read (all, single)
  ✅ Update
  ✅ Delete

Level 2: Query Features
  ✅ Filtering
  ✅ Sorting
  ✅ Pagination

Level 3: Security
  ✅ Authentication (JWT)
  ✅ Authorization (user ownership)
  ✅ Input validation
  ✅ CORS
  ✅ Rate limiting

Level 4: Production Ready
  ⏳ Error handling refinement (Step 17)
  ⏳ Async handler cleanup (Step 18)
  ⏳ API documentation (Step 20)
```

---

## 🔄 Complete Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT                                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Sends: POST /api/tasks                                  │   │
│  │ Headers: { Authorization: "Bearer token" }              │   │
│  │ Body: { title, description, status, dueDate }           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  EXPRESS SERVER                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. helmet() - Add security headers                      │   │
│  │ 2. cors() - Check allowed origins                       │   │
│  │ 3. rateLimit() - Check 100 req/15min limit              │   │
│  │ 4. express.json() - Parse JSON body                     │   │
│  │ 5. Route /api/tasks → taskRouter                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TASK ROUTER                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. protect() - Verify JWT token                         │   │
│  │    └─ req.user = { id: "607f..." }                      │   │
│  │ 2. validateBody(createTaskSchema) - Validate request    │   │
│  │    └─ Check title, status, etc.                         │   │
│  │ 3. createTask() - Call controller                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CONTROLLER (createTask)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Extract: { title, description, status, dueDate }    │   │
│  │ 2. Security: user = req.user.id (force ownership)       │   │
│  │ 3. Database: await Task.create({...})                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  MONGOOSE MODEL                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. Validate types (String, Date, ObjectId)              │   │
│  │ 2. Validate required fields (title, user)               │   │
│  │ 3. Validate enums (status must be valid)                │   │
│  │ 4. Add timestamps (createdAt, updatedAt)                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  MONGODB DATABASE                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ db.tasks.insertOne({                                    │   │
│  │   _id: ObjectId("..."),                                 │   │
│  │   title: "Buy groceries",                               │   │
│  │   status: "pending",                                    │   │
│  │   user: ObjectId("607f..."),                            │   │
│  │   createdAt: ISODate(...),                              │   │
│  │   updatedAt: ISODate(...)                               │   │
│  │ })                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RESPONSE TO CLIENT                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Status: 201 Created                                     │   │
│  │ Body: {                                                 │   │
│  │   _id: "507f1f77bcf86cd799439011",                      │   │
│  │   title: "Buy groceries",                               │   │
│  │   status: "pending",                                    │   │
│  │   user: "607f1f77bcf86cd799439012",                     │   │
│  │   createdAt: "2026-06-23T10:00:00Z",                    │   │
│  │   updatedAt: "2026-06-23T10:00:00Z"                     │   │
│  │ }                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT RECEIVES & PROCESSES                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Check status: 201 ✅                                    │   │
│  │ Parse response body                                     │   │
│  │ Store _id for future updates                            │   │
│  │ Display task in UI                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Testing Coverage

### Test Results: 12/12 Passing ✅

```
Phase 1: Authentication
  ✓ Register (201)
  ✓ Login (200)

Phase 2: CRUD Operations
  ✓ Create Task (201)
  ✓ Get All Tasks (200)
  ✓ Get Task by ID (200)
  ✓ Update Task (200)
  ✓ Delete Task (200)

Phase 3: Advanced Features
  ✓ Filtering by status (200)
  ✓ Pagination (200)

Phase 4: Error Handling
  ✓ No Auth Token (401)
  ✓ Validation Error (400)
  ✓ Invalid Enum (400)
```

---

## 📚 Files Reference

### Configuration Files

**`.env`** - Environment variables
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey123
```

**`package.json`** - Dependencies & scripts
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "test": "node test-api.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.2.1",
    "zod": "^4.3.6",
    "jsonwebtoken": "^9.0.3",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.x.x",
    "express-rate-limit": "^7.x.x"
  }
}
```

### Source Files

**[src/server.js](src/server.js)** - Application entry point
```javascript
import mongoose from 'mongoose'
import app from './app.js'

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log(err))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

**[src/app.js](src/app.js)** - Express setup & middleware
```javascript
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRouter from './routes/auth.router.js'
import taskRouter from './routes/task.router.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)

export default app
```

---

## 🔄 Error Handling Middleware (Step 17)

Global error handler catches and formats all errors consistently.

**File:** [src/middleware/error.middleware.js](src/middleware/error.middleware.js)

### What It Handles:
- **Mongoose Validation Errors** → 400 Bad Request
- **Mongoose Cast Errors** (invalid ObjectId) → 400 Bad Request
- **Duplicate Key Errors** (email exists) → 400 Bad Request
- **JWT Errors** (invalid/expired token) → 401 Unauthorized
- **Custom App Errors** (any error with statusCode property) → custom status
- **Generic Server Errors** → 500 Internal Server Error

### Example:
```javascript
// In middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    })
  }
  // ... handle other error types ...
}
```

### Integration:
- Applied last in [src/app.js](src/app.js) after all routes
- Must be last middleware to catch all errors
- Works with asyncHandler to provide unified error responses

---

## 🎯 Async Handler Refactoring (Step 18)

All controller functions wrapped with `express-async-handler` for automatic error catching.

### What Changed:
- Removed try/catch blocks from all controllers
- Wrapped each function with `asyncHandler`
- Errors automatically forwarded to error middleware
- Cleaner, more readable code

### Before:
```javascript
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ... })
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
```

### After:
```javascript
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ... })
  res.status(201).json(task)
  // Error automatically caught and handled
})
```

### Controllers Updated:
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js): register, login
- [src/controllers/task.controller.js](src/controllers/task.controller.js): createTask, getTasks, getTaskById, updateTask, deleteTask

---

## 📚 Swagger/OpenAPI Documentation (Step 20)

Full interactive API documentation with Swagger UI.

**File:** [src/config/swagger.js](src/config/swagger.js)

### Access Swagger UI:
```
http://localhost:5000/api/docs
```

### Features:
- **Interactive Testing** - Try endpoints directly from the browser
- **Request/Response Examples** - See exactly what to send and expect
- **Authentication** - Enter JWT token to test protected routes
- **Schema Definitions** - Complete data model documentation
- **Error Documentation** - All possible error responses explained

### Swagger Configuration:
```javascript
// src/config/swagger.js
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskForge API',
      version: '1.0.0',
      description: 'Task management API with JWT auth...'
    },
    servers: [
      { url: 'http://localhost:5000' },
      { url: 'https://api.taskforge.com' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' }
      },
      schemas: { /* User, Task, Error schemas */ }
    }
  },
  apis: ['./src/routes/*.js'] // Scan route files for documentation
}
```

### Documentation in Routes:
Each endpoint documented with JSDoc comments in route files:

**Authentication Endpoints:**
- POST /api/auth/register - Create new user account
- POST /api/auth/login - Authenticate and get JWT token

**Task Endpoints:**
- POST /api/tasks - Create a new task
- GET /api/tasks - Get all tasks (with filtering, sorting, pagination)
- GET /api/tasks/:id - Get a specific task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

### Response Schemas:
```javascript
// All responses documented with proper schemas
User: { _id, name, email, role, createdAt, updatedAt }
Task: { _id, title, description, status, user, dueDate, createdAt, updatedAt }
AuthResponse: { message, token, user: { id, name, email, role } }
TasksResponse: { tasks: [], page, limit, total }
Error: { status, message, errors: [] }
```

---

## 🚀 Implementation Summary

**Completed Steps:**
- ✅ Steps 1-13: Core API with auth, CRUD, validation
- ✅ Step 17: Global error handler middleware
- ✅ Step 18: Async handler refactoring
- ✅ Step 20: Swagger/OpenAPI documentation

**Step 19:** Rate Limiting (already implemented in app.js)
- Prevent brute force attacks
- Protect against DoS
- 100 requests per 15 minutes per IP

---

## 📖 Summary

You now have a **production-ready REST API** with:
- ✅ Secure authentication (JWT with token generation)
- ✅ Full CRUD operations for tasks
- ✅ Advanced querying (filter, sort, paginate)
- ✅ Input validation (Zod at entry + Mongoose at database)
- ✅ Security headers (Helmet, CORS)
- ✅ Rate limiting (100 req/15min per IP)
- ✅ User data ownership protection
- ✅ Global error handler with consistent responses
- ✅ Async handler refactoring (clean code)
- ✅ Complete API documentation (Swagger/OpenAPI)
- ✅ Interactive API explorer (Swagger UI at /api/docs)
- ✅ Complete test coverage (12/12 tests passing)

**Architecture Highlights:**
- Middleware pipeline for clean separation of concerns
- Multi-layer validation (Zod → Mongoose)
- Security through multiple layers (JWT + ownership checks)
- Centralized error handling
- Auto-documented API endpoints

**What You Can Do:**
- Register and login users securely with JWT
- Create, read, update, delete tasks
- Filter tasks by status
- Sort tasks by any field
- Paginate results with limit/page
- Test all endpoints via Swagger UI
- See request/response examples
- Try endpoints directly in the browser
- Stateless authentication with JWT
- Ownership verification for all operations
- Async/await for readable code

This foundation is ready for:
- Frontend integration
- Production deployment
- Scaling to more features
- Building full-stack applications

**Well done! You've built a solid backend! 🚀**

