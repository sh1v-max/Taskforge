# TaskForge API — Backend

REST API for TaskForge, a task management application. Built with **Express 5**, **MongoDB (Mongoose)**, and **JWT authentication**, with multi-layer validation (Zod + Mongoose) and interactive Swagger documentation.

---

## ✨ Features

- **JWT Authentication** — register, login, and protected routes with `Bearer` tokens; passwords hashed with bcryptjs
- **Task CRUD** — create, read, update, and delete tasks scoped to the logged-in user
- **Advanced Querying** — filter tasks by status, sort by any field, and paginate results
- **Multi-layer Validation** — Zod schemas validate request bodies/queries before Mongoose schema validation at the database layer
- **Global Error Handling** — centralized error middleware with consistent JSON error responses
- **Security Hardening** — Helmet security headers, CORS, and rate limiting (100 requests / 15 min per IP)
- **Interactive API Docs** — Swagger UI served at `/api/docs`
- **Postman Collection** — ready-to-import collection for manual testing

---

## 🛠️ Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Runtime        | Node.js (ES Modules)                |
| Framework      | Express 5                           |
| Database       | MongoDB with Mongoose ODM           |
| Authentication | jsonwebtoken + bcryptjs             |
| Validation     | Zod (request layer) + Mongoose (DB layer) |
| Security       | helmet, cors, express-rate-limit    |
| API Docs       | swagger-jsdoc + swagger-ui-express  |
| Dev Tooling    | nodemon                             |

---

## 📂 Project Structure

```
backend/
├── server.js                  # Entry point — connects DB, starts server
├── src/
│   ├── app.js                 # Express app — middleware & route mounting
│   ├── config/
│   │   └── swagger.js         # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Register, login, profile handlers
│   │   └── task.controller.js # Task CRUD handlers
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification (protect)
│   │   ├── error.middleware.js# Global error handler
│   │   └── validate.middleware.js # Zod validation wrappers
│   ├── models/
│   │   ├── User.js            # User schema (hashed password)
│   │   └── Task.js            # Task schema (title, status, dueDate…)
│   ├── routes/
│   │   ├── auth.router.js     # /api/auth routes
│   │   └── task.router.js     # /api/tasks routes
│   ├── schemas/
│   │   ├── auth.schema.js     # Zod schemas for auth requests
│   │   └── task.schema.js     # Zod schemas for task requests & queries
│   └── utils/
│       ├── db.js              # MongoDB connection helper
│       └── generateToken.js   # JWT signing helper
└── TaskForge-API-Collection.postman_collection.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### Installation

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
```

### Environment Variables

Edit `.env` with your values:

| Variable     | Description                                  | Example                              |
| ------------ | -------------------------------------------- | ------------------------------------ |
| `PORT`       | Port the API listens on                      | `5000`                               |
| `MONGO_URI`  | MongoDB connection string                    | `mongodb://localhost:27017/taskforge` |
| `JWT_SECRET` | Secret used to sign JWTs (use a long random string) | `super-secret-key`             |

### Run

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

The API runs at `http://localhost:5000` (or your configured `PORT`).

---

## 📖 API Reference

Base URL: `http://localhost:5000`

Interactive documentation with "try it out" support is available at **`/api/docs`** while the server is running.

### Auth — `/api/auth`

| Method | Endpoint             | Auth | Description                       |
| ------ | -------------------- | ---- | --------------------------------- |
| POST   | `/api/auth/register` | ❌   | Register a new user, returns JWT  |
| POST   | `/api/auth/login`    | ❌   | Login with credentials, returns JWT |
| GET    | `/api/auth/me`       | ✅   | Get the logged-in user's profile  |
| PUT    | `/api/auth/me`       | ✅   | Update the logged-in user's profile |

### Tasks — `/api/tasks` (all require authentication)

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/api/tasks`     | Create a task                        |
| GET    | `/api/tasks`     | List tasks (filter, sort, paginate)  |
| GET    | `/api/tasks/:id` | Get a single task by ID              |
| PUT    | `/api/tasks/:id` | Update a task                        |
| DELETE | `/api/tasks/:id` | Delete a task                        |

### Query Parameters for `GET /api/tasks`

| Param    | Description                                       | Example              |
| -------- | ------------------------------------------------- | -------------------- |
| `status` | Filter by status: `pending`, `in-progress`, `completed` | `?status=pending` |
| `sortBy` | Field to sort by (prefix with `-` for descending) | `?sortBy=-createdAt` |
| `page`   | Page number for pagination                        | `?page=2`            |
| `limit`  | Results per page                                  | `?limit=10`          |

### Task Model

| Field         | Type     | Notes                                             |
| ------------- | -------- | ------------------------------------------------- |
| `title`       | String   | **Required**                                      |
| `description` | String   | Optional, defaults to `""`                        |
| `status`      | String   | `pending` (default) \| `in-progress` \| `completed` |
| `dueDate`     | Date     | Optional, defaults to `null`                      |
| `user`        | ObjectId | Owner reference — set automatically from the JWT  |

### Authentication

Send the JWT returned by register/login in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

### Example Requests

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Shiv","email":"shiv@example.com","password":"secret123"}'

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Learn Express 5","status":"in-progress"}'

# List pending tasks, newest first, 10 per page
curl "http://localhost:5000/api/tasks?status=pending&sortBy=-createdAt&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 Security

- **Helmet** — sets secure HTTP response headers
- **CORS** — cross-origin access configured in `src/app.js`
- **Rate limiting** — 100 requests per 15 minutes per IP on all `/api/` routes
- **Password hashing** — bcryptjs with salt; plaintext passwords are never stored
- **Ownership checks** — users can only read/modify their own tasks

---

## 🧪 Testing

- **Swagger UI** — `http://localhost:5000/api/docs` (browser-based, no setup)
- **Postman** — import `TaskForge-API-Collection.postman_collection.json`; see [POSTMAN-SETUP-GUIDE.md](POSTMAN-SETUP-GUIDE.md)
- **Test script** — `node test-api.js` runs the automated endpoint tests (see [TESTING-GUIDE.md](TESTING-GUIDE.md))

---

## 📚 Additional Documentation

- [overview.md](overview.md) — complete technical reference
- [swagger_overview.md](swagger_overview.md) — Swagger/OpenAPI guide
- [POSTMAN-SETUP-GUIDE.md](POSTMAN-SETUP-GUIDE.md) — Postman testing walkthrough
- [TESTING-GUIDE.md](TESTING-GUIDE.md) — testing guide
- Per-folder READMEs inside `src/` explain each layer (routes, controllers, models, middleware, schemas, utils)
