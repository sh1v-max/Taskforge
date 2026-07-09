# 🔍 TaskForge API - Quick Reference

One-page quick lookup for common commands, endpoints, error codes, and more.

---

## ⚡ **npm Commands**

```bash
npm run dev          # Start development server (with auto-reload)
npm start            # Start production server
npm test             # Run automated tests (12 tests)
npm install          # Install dependencies
```

---

## 🔌 **Server URLs**

```
Development:  http://localhost:5000
API Docs:     http://localhost:5000/api/docs
Test Data:    POST /api/auth/register or POST /api/auth/login
```

---

## 📡 **API Endpoints Summary**

### Authentication
| Method | Endpoint | Purpose | Auth? |
|--------|----------|---------|-------|
| POST | `/api/auth/register` | Create new user | ❌ |
| POST | `/api/auth/login` | Login & get token | ❌ |

### Tasks (All require JWT token in Authorization header)
| Method | Endpoint | Purpose | Auth? |
|--------|----------|---------|-------|
| POST | `/api/tasks` | Create task | ✅ |
| GET | `/api/tasks` | Get all tasks | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

---

## 🎯 **Query Parameters for GET /api/tasks**

| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| `status` | string | `?status=pending` | Filter by status |
| `sortBy` | string | `?sortBy=dueDate:asc` | Sort by field & direction |
| `page` | number | `?page=1` | Page number (default: 1) |
| `limit` | number | `?limit=10` | Items per page (default: 10) |

### Status Values
```
"pending"       - Task not started
"in-progress"   - Task is being worked on
"completed"     - Task is finished
```

### Sort Examples
```
dueDate:asc     - Sort by due date (earliest first)
dueDate:desc    - Sort by due date (latest first)
createdAt:asc   - Sort by creation date (oldest first)
createdAt:desc  - Sort by creation date (newest first)
status:asc      - Sort by status (alphabetical)
```

---

## 🔑 **Authorization Header**

All protected endpoints require this header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**How to get token:**
```bash
# 1. Register
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass123!"
}
Response: { token: "eyJ...", user: { id: "..." } }

# 2. Or Login
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "Pass123!"
}
Response: { token: "eyJ...", user: { id: "..." } }

# 3. Use token in header
GET /api/tasks
Headers: Authorization: Bearer eyJ...
```

---

## 📝 **Request Body Examples**

### Register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Login
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Create Task
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "dueDate": "2026-12-31T23:59:59Z"
}
```

### Update Task (any combination of these)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "dueDate": "2026-06-30T23:59:59Z"
}
```

---

## ✅ **HTTP Status Codes**

### Success (2xx)
| Code | Meaning | When |
|------|---------|------|
| 200 | OK | GET, PUT, DELETE successful |
| 201 | Created | POST successful, resource created |
| 204 | No Content | Successful with no response body |

### Client Errors (4xx)
| Code | Meaning | When |
|------|---------|------|
| 400 | Bad Request | Invalid data, validation failed |
| 401 | Unauthorized | Missing/invalid token, wrong password |
| 404 | Not Found | Resource doesn't exist or wrong ID |
| 409 | Conflict | Email already exists (registration) |

### Server Errors (5xx)
| Code | Meaning | When |
|------|---------|------|
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Database connection failed |

---

## ❌ **Common Error Responses**

### Missing Authorization Header
```json
{
  "status": "error",
  "message": "No authorization token"
}
// Status: 401 Unauthorized
```

### Invalid Token
```json
{
  "status": "error",
  "message": "Invalid token"
}
// Status: 401 Unauthorized
```

### Validation Error (Missing Field)
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "title is required"
    }
  ]
}
// Status: 400 Bad Request
```

### Invalid Enum Value
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "status",
      "message": "Invalid enum value. Expected 'pending' | 'in-progress' | 'completed'"
    }
  ]
}
// Status: 400 Bad Request
```

### Task Not Found
```json
{
  "error": "Task not found"
}
// Status: 404 Not Found
```

### Email Already Exists
```json
{
  "status": "error",
  "message": "email already exists",
  "field": "email"
}
// Status: 400 Bad Request
```

---

## 🌍 **Environment Variables (.env)**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskforge_db
# For MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/taskforge_db

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=7d

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000
```

### Create .env file
```bash
cp .env.example .env
# Then edit with your values
```

---

## 🧪 **Testing Quick Commands**

### Using curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123!"}'

# Get all tasks (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","status":"pending"}'

# Filter by status
curl "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer TOKEN"

# Pagination
curl "http://localhost:5000/api/tasks?page=1&limit=5" \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Download: https://www.postman.com/downloads/
2. Import: `TaskForge-API-Collection.postman_collection.json`
3. Set environment variable: `BASE_URL=http://localhost:5000`
4. Test: 17 pre-configured requests

### Using Swagger UI
1. Start server: `npm run dev`
2. Visit: `http://localhost:5000/api/docs`
3. Click "Authorize" to add token
4. Click "Try it out" on any endpoint
5. Click "Execute"

---

## 📊 **Data Models Overview**

### User Schema
```javascript
{
  _id: ObjectId,              // Auto-generated
  name: string,               // Required
  email: string,              // Required, unique
  password: string,           // Hashed with bcryptjs
  role: "user" | "admin",     // Default: "user"
  createdAt: ISODate,         // Auto-generated
  updatedAt: ISODate          // Auto-updated
}
```

### Task Schema
```javascript
{
  _id: ObjectId,              // Auto-generated
  title: string,              // Required, min 1 char
  description: string,        // Optional
  status: "pending" | "in-progress" | "completed",  // Required, default: "pending"
  user: ObjectId,             // Required, references User._id
  dueDate: ISODate,          // Optional
  createdAt: ISODate,        // Auto-generated
  updatedAt: ISODate         // Auto-updated
}
```

---

## 🔐 **Security Quick Reference**

### Password Requirements
- Minimum length: Defined by Zod schema
- Hashing: bcryptjs with salt rounds
- Never stored in plain text
- Never returned in responses

### JWT Token
- Format: `eyJhbGc...eyJzdWI...` (3 parts separated by dots)
- Expires: 7 days (configurable)
- Contains: User ID, email, role
- Verified on every protected request

### CORS
- Default: Allow all origins (`*`)
- Production: Set `FRONTEND_URL` environment variable
- Prevents: Cross-origin attacks

### Rate Limiting
- Limit: 100 requests per 15 minutes per IP
- Returns: 429 Too Many Requests
- After: Wait 15 minutes or restart server

---

## 🐛 **Troubleshooting Quick Fixes**

| Problem | Solution |
|---------|----------|
| "Cannot connect to MongoDB" | Start MongoDB, check MONGODB_URI in .env |
| "Port 5000 already in use" | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| "401 Unauthorized" | Get token first, include in Authorization header |
| "400 Validation error" | Check request body matches schema, check field types |
| "404 Task not found" | Task ID is wrong or doesn't belong to your user |
| "Cannot find module" | Run `npm install` |
| "Token expired" | Login again to get new token |
| "Email already exists" | Use different email or login instead |

---

## 📈 **Performance Tips**

```bash
# Use pagination to reduce data transfer
GET /api/tasks?page=1&limit=10

# Filter before sorting for better performance
GET /api/tasks?status=pending&sortBy=dueDate:asc

# Use specific query parameters instead of getting all
GET /api/tasks?limit=5  # Not GET /api/tasks

# Batch operations when possible (use Postman collection)
```

---

## 🔗 **Useful Links**

- **API Docs:** http://localhost:5000/api/docs
- **Postman Collection:** `TaskForge-API-Collection.postman_collection.json`
- **Documentation Index:** [DOCS.md](DOCS.md)
- **Full Documentation:** [README.md](README.md)
- **Technical Reference:** [overview.md](overview.md)
- **Swagger Guide:** [swagger_overview.md](swagger_overview.md)
- **Testing Guide:** [POSTMAN-SETUP-GUIDE.md](POSTMAN-SETUP-GUIDE.md)

---

## ⚡ **30-Second Quick Start**

```bash
# 1. Install
npm install

# 2. Create .env (copy from .env.example)
cp .env.example .env

# 3. Start server
npm run dev

# 4. In browser, visit
http://localhost:5000/api/docs

# 5. Test endpoints in Swagger UI!
```

---

<div align="center">

**Bookmark this page!** Ctrl+D or Cmd+D

**Lost?** See [DOCS.md](DOCS.md) for full documentation index

</div>
