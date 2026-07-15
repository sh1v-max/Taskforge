# TaskForge — Frontend

React web client for the TaskForge task management API. Built with **React 19**, **Vite**, and **Tailwind CSS 4**, featuring JWT-based authentication, a task dashboard with filtering/sorting, dark mode, and toast notifications.

---

## ✨ Features

- **Authentication** — register and login pages backed by the TaskForge API, with JWT stored client-side and protected routes via a `PrivateRoute` wrapper
- **Task Dashboard** — create, edit, and delete tasks with task cards, an edit form, and a delete confirmation dialog
- **Filtering & Sorting** — browse tasks by status (`pending`, `in-progress`, `completed`) and sort results
- **Dark Mode** — theme toggle persisted through a dedicated `ThemeContext`
- **Toast Notifications** — global success/error feedback via `ToastContext`
- **Form Validation** — React Hook Form + Zod resolvers for type-safe client-side validation (mirrors the backend's Zod schemas)
- **Responsive UI** — Tailwind utility classes, Headless UI primitives, and Lucide icons

---

## 🛠️ Tech Stack

| Category     | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React 19 (JSX, functional components)   |
| Build Tool   | Vite 8                                  |
| Styling      | Tailwind CSS 4 + PostCSS                |
| Routing      | React Router v7                         |
| State        | React Context API (Auth, Theme, Toast)  |
| Forms        | React Hook Form + Zod (`@hookform/resolvers`) |
| HTTP Client  | Axios (central client with JWT header)  |
| UI Utilities | Headless UI, Lucide icons, clsx, date-fns |
| Linting      | Oxlint                                  |

---

## 📂 Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx               # App bootstrap — providers & router
    ├── App.jsx                # Route definitions
    ├── api/
    │   ├── client.js          # Axios instance (base URL, JWT header)
    │   ├── auth.js            # Auth API calls (register, login, me)
    │   └── tasks.js           # Task CRUD API calls
    ├── context/
    │   ├── AuthContext.jsx    # Auth state — user, token, login/logout
    │   ├── ThemeContext.jsx   # Dark/light mode state
    │   └── ToastContext.jsx   # Global toast notifications
    ├── hooks/
    │   └── useAuthService.js  # Auth logic hook
    ├── components/
    │   ├── Auth/              # LoginForm, RegisterForm, PrivateRoute
    │   ├── Tasks/             # TaskCard, TaskForm
    │   └── Common/            # ConfirmDialog, ThemeToggle
    ├── pages/
    │   ├── LandingPage.jsx    # Public home page
    │   ├── Auth/              # LoginPage, RegisterPage
    │   ├── Dashboard/         # Dashboard (task management)
    │   └── Profile/           # ProfilePage
    └── utils/
        └── constants.js       # Shared constants
```

---

## 🗺️ Routes

| Path         | Page          | Access                        |
| ------------ | ------------- | ----------------------------- |
| `/`          | Landing page  | Public                        |
| `/login`     | Login         | Public                        |
| `/register`  | Register      | Public                        |
| `/dashboard` | Task dashboard | 🔒 Protected (requires login) |
| `/profile`   | User profile  | 🔒 Protected (requires login) |
| `*`          | —             | Redirects to `/`              |

Protected routes are wrapped in `PrivateRoute`, which redirects unauthenticated users to the login page.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- The [TaskForge backend](../backend/README.md) running (default: `http://localhost:5000`)

### Installation

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
```

### Environment Variables

| Variable                | Description                        | Default                 |
| ----------------------- | ---------------------------------- | ----------------------- |
| `VITE_API_URL`          | Base URL of the TaskForge API      | `http://localhost:5000` |
| `VITE_API_TIMEOUT`      | Axios request timeout (ms)         | `10000`                 |
| `VITE_APP_NAME`         | Application display name           | `TaskForge`             |
| `VITE_APP_VERSION`      | Application version                | `1.0.0`                 |
| `VITE_ENABLE_DARK_MODE` | Enable the dark mode toggle        | `true`                  |
| `VITE_ENABLE_ANALYTICS` | Enable analytics                   | `false`                 |
| `VITE_DEBUG`            | Enable debug logging               | `false`                 |

### Run

```bash
# Development server with HMR
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

The dev server runs at the URL Vite prints (typically `http://localhost:5173`).

---

## 🔌 How It Talks to the Backend

All HTTP requests go through the shared Axios instance in `src/api/client.js`, which:

1. Reads the API base URL from `VITE_API_URL`
2. Attaches the JWT as an `Authorization: Bearer <token>` header on authenticated requests
3. Feeds responses/errors to the calling context so toasts and auth state stay in sync

The API modules map directly to backend endpoints:

- `api/auth.js` → `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/auth/me`
- `api/tasks.js` → `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:id`

See the [backend README](../backend/README.md) for full endpoint documentation, or browse the interactive Swagger docs at `http://localhost:5000/api/docs` while the backend is running.

---

## 🎨 State Management

Global state lives in three lightweight React Contexts instead of an external state library:

- **AuthContext** — current user, JWT token, login/logout actions; consumed by `PrivateRoute` and the auth pages
- **ThemeContext** — dark/light preference with a `ThemeToggle` component
- **ToastContext** — app-wide notification queue for success and error messages

Component-local state (forms, dialogs) is handled with React Hook Form and `useState`.
