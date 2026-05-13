# Source Directory (`src`)

This is the core of the TaskForge API. All business logic, database models, and route definitions live within this directory.

## Entry Point: `app.js`

The `app.js` file is the heart of the Express application. Its responsibilities include:
- Initializing the Express app.
- Applying global middleware (like `express.json()`).
- Mounting individual routers (e.g., `app.use('/api/auth', authRouter)`).
- Defining basic root routes.
- Setting up the foundation for protected routes.

## Subdirectories

The logic is further divided into specialized folders:
- **`controllers/`**: Logic to handle requests and send responses.
- **`middleware/`**: Functions that run during the request-response cycle (e.g., auth checks).
- **`models/`**: Mongoose schemas and database interaction logic.
- **`routes/`**: Endpoint definitions.
- **`schemas/`**: Zod validation rules.
- **`utils/`**: Helper functions and database connection logic.

For more details on each folder, refer to the individual `README.md` files within them.

## 🚀 Project Architecture & Flow

The TaskForge API follows a clean, layered architecture. Here is how a request travels through the system:

| Layer | Component | Responsibility |
| :--- | :--- | :--- |
| **🚀 Entry** | `server.js` | Starts the server and listens for incoming connections. |
| | ⏬ | |
| **⚙️ App** | `app.js` | Initializes Express, connects middleware, and mounts routers. |
| | ⏬ | |
| **🛣️ Routes** | `auth.router.js` | Defines the API endpoints (e.g., `/api/auth/register`). |
| | ⏬ | |
| **🧠 Logic** | `auth.controller.js` | Orchestrates the request logic and sends responses. |
| | ↙️&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘️ | |
| **📊 Data** | `User.js` | Manages the MongoDB database schema and interactions. |
| **🔑 Security** | `generateToken.js` | Utility for creating secure JSON Web Tokens (JWT). |

---

### 🛣️ Request Lifecycle Summary
1.  **Start**: `server.js` launches the application.
2.  **Config**: `app.js` sets up the environment and global rules.
3.  **Route**: `auth.router.js` captures the specific URL request.
4.  **Action**: `auth.controller.js` performs the needed operations.
5.  **Result**: The user is authenticated, and a secure token is issued.



---

| File | Responsibility |
| :--- | :--- |
| **User.js** | Defines how users are stored in the database. |
| **auth.controller.js** | Contains logic to register and login users. |
| **generateToken.js** | Utility function to create secure JWT tokens. |
| **auth.router.js** | Exposes endpoints like `/register` and `/login`. |
| **app.js** | Configures Express and mounts all API routers. |
| **server.js** | The entry point that starts the server listener. |