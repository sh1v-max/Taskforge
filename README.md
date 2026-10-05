# TaskForge — Full-Stack Task Manager

[![CI](https://github.com/sh1v-max/Taskforge/actions/workflows/ci.yml/badge.svg)](https://github.com/sh1v-max/Taskforge/actions/workflows/ci.yml)

> A complete, deployed full-stack task management application: Express + MongoDB REST API, React frontend, and a CI/CD pipeline that ships every push.

**Status:** 🚀 Live in Production

## 🔗 Live Links

| | URL |
|---|---|
| **App (frontend)** | https://taskforge-eight-xi.vercel.app |
| **API (backend)** | https://taskforge-api-e2g9.onrender.com |
| **API Docs (Swagger)** | https://taskforge-api-e2g9.onrender.com/api/docs |
| **Source** | https://github.com/sh1v-max/Taskforge |

> ⚠️ Free-tier note: the API sleeps after 15 minutes of inactivity — the first request (e.g. login) can take ~30–50 seconds to wake it up.

---

## 🎯 What is TaskForge?

TaskForge lets users:

- ✅ Register and log in securely (JWT authentication)
- ✅ Create, view, edit, and delete tasks
- ✅ Track status: pending → in progress → completed
- ✅ Filter by status, sort by date/title, paginate through results
- ✅ See dashboard stats with overall progress
- ✅ Manage their profile (name, password)
- ✅ Use light or dark mode — remembered across visits
- ✅ Enjoy a fully responsive UI on any device

---

## 🏗️ Architecture

```
git push → GitHub
  ├─ GitHub Actions  → CI: lint, syntax check, production build
  ├─ Render          → auto-deploys backend   (health-checked at /health)
  └─ Vercel          → auto-deploys frontend  (SPA rewrites via vercel.json)
                              ↓
                        MongoDB Atlas
```

### Backend (`backend/`)
- **Express 5** REST API, MVC structure (routes → middleware → controllers → models)
- **MongoDB + Mongoose** with ownership checks on every task query
- **JWT auth** (jsonwebtoken) with bcryptjs password hashing
- **Zod validation** on every request body and query string
- **Security:** Helmet headers, CORS locked to the frontend origin, per-IP rate limiting (100 req/15 min, `trust proxy` aware)
- **Swagger/OpenAPI** docs generated from JSDoc comments at `/api/docs`

### Frontend (`frontend/`)
- **React 18 + Vite** with React Router v6 (protected routes)
- **Tailwind CSS v4** with class-based dark mode
- **Context API + useReducer** for auth, theme, and toast state
- **React Hook Form + Zod** for form validation
- **Axios** client with interceptors: auto-attaches the JWT, auto-logs out on 401
- Server-side pagination, filtering, and sorting wired to the API

---

## 📂 Repository Structure

```
TaskForge/
├── backend/                # Express.js REST API
│   ├── src/
│   │   ├── routes/         # Endpoint definitions (+ Swagger docs)
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── schemas/        # Zod validation schemas
│   │   └── config/         # Swagger setup
│   ├── tests/              # Vitest + Supertest integration tests
│   └── server.js           # Entry point
│
├── frontend/               # React application
│   └── src/
│       ├── api/            # Axios client + API services
│       ├── components/     # Reusable UI (tasks, auth, common)
│       ├── context/        # Auth, Theme, Toast providers
│       ├── pages/          # Landing, auth, dashboard, profile, task detail
│       └── utils/          # Constants and helpers
│
├── .github/workflows/      # CI pipeline (tests, lint, build on every push/PR)
├── render.yaml             # Render blueprint (backend infra as code)
└── README.md               # You are here
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB database (local or free [Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Clone

```bash
git clone https://github.com/sh1v-max/Taskforge.git
cd Taskforge
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev            # http://localhost:5000
```

### 3. Frontend

```bash
cd ../frontend
cp .env.example .env   # defaults point at http://localhost:5000
npm install
npm run dev            # http://localhost:5173
```

Open http://localhost:5173, register an account, and start forging.

---

## 🔌 API Overview

Full interactive docs (with "Try it out"): **[/api/docs](https://taskforge-api-e2g9.onrender.com/api/docs)**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Log in, returns JWT |
| GET | `/api/auth/me` | 🔒 | Current user's profile |
| PUT | `/api/auth/me` | 🔒 | Update name / change password |
| POST | `/api/tasks` | 🔒 | Create task |
| GET | `/api/tasks` | 🔒 | List tasks — supports `?status=`, `?sortBy=field:direction`, `?page=`, `?limit=` |
| GET | `/api/tasks/:id` | 🔒 | Get one task |
| PUT | `/api/tasks/:id` | 🔒 | Update task |
| DELETE | `/api/tasks/:id` | 🔒 | Delete task |
| GET | `/health` | — | Uptime check (unthrottled) |

🔒 = requires `Authorization: Bearer <token>` header. Users can only ever see and modify their own tasks.

---

## ⚙️ CI/CD

Every push to `main`:

1. **GitHub Actions** ([ci.yml](.github/workflows/ci.yml)) runs two parallel jobs — backend install + the integration test suite; frontend install + oxlint + production build
2. **Render** auto-deploys the backend (configured via [render.yaml](render.yaml))
3. **Vercel** auto-deploys the frontend (root directory `frontend`, `VITE_API_URL` injected at build time)

Environment configuration lives outside the code: local `.env` files for development, platform dashboards for production.

---

## 🧪 Testing

`cd backend && npm test` runs the integration suite: Vitest and Supertest against a real MongoDB running in memory (mongodb-memory-server), so it needs no database or `.env`. CI runs it on every push.

- **Auth** — registration hashes passwords with bcrypt and never returns them, duplicate emails are rejected, emails are normalised, every invalid field is reported by name, wrong password and unknown email get the same response, forged tokens are rejected, a password change requires the current password.
- **Tasks** — create with defaults and trimming, a `user` id in the body is ignored, validation errors name the field, filtering, an allow-listed `sortBy`, paging limits, full read/update/delete, users get 404 on each other's tasks, malformed ids return 400 instead of crashing.

---

## 📚 More Documentation

- [backend/README.md](backend/README.md) — API reference, environment variables, security
- [backend/POSTMAN-SETUP-GUIDE.md](backend/POSTMAN-SETUP-GUIDE.md) — manual testing with Postman

---

## 🗺️ Roadmap

- [x] Automated integration tests (Vitest + Supertest) wired into CI
- [ ] Task search
- [ ] Tags / priority levels
- [ ] Password reset via email
- [ ] Admin dashboard (role-based)

---

## 👨‍💻 Author

**Shiv** — [github.com/sh1v-max](https://github.com/sh1v-max)

Built as a full-stack learning project: every layer hand-written and understood, from Mongoose ownership queries to CORS behind a reverse proxy.

---

<div align="center">

**[Try the live app →](https://taskforge-eight-xi.vercel.app)**

</div>
