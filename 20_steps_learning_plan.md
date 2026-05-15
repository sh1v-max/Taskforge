# TaskForge API - 20-Step Implementation & Learning Plan

This document outlines a structured, 20-step curriculum to build the remainder of your TaskForge API. By following these steps sequentially, you will learn how to implement core business logic, handle advanced data querying, refactor for cleaner code, and secure a production-ready Node.js backend.


## The 20-Step Roadmap

---

### Phase 0: API Testing Setup
Before we start implementing features, we need tools to test our API endpoints as we build them. This ensures we catch issues early and verify each step works correctly.

**Step 0: Setup API Testing Tools**
*   **What to work on:** Install and configure an API testing client.
*   **How to implement:** Download either Thunder Client (VS Code extension) or Postman (standalone). Create a collection for TaskForge API with organized folders for Auth, Tasks, and Utilities. Set up environment variables for `baseURL` (http://localhost:5000) and `authToken` (will be populated after login).
*   **Why:** Manual testing with curl is tedious. A visual client lets you quickly test endpoints, save requests, and debug responses. Environment variables let you reuse the JWT token across requests without copy-pasting.
*   **Testing Checklist:** After each phase, we'll verify:
    - Status codes are correct (200, 201, 400, 401, 404, 500)
    - Response bodies contain expected data
    - Authentication blocks unauthorized requests
    - Data relationships are maintained (tasks belong to correct users)

---

### Phase 1: Environment & Setup Review
Before writing new features, we will ensure our environment is ready and install the necessary tools to level up our application.

**Step 1: Codebase Review & Package Installation**
*   **What to work on:** Review existing `package.json` and install new dependencies.
*   **How to implement:** Run `npm i cors helmet express-rate-limit express-async-handler`.
*   **Why:** These packages are crucial for security (CORS, Helmet, Rate Limiting) and keeping our controllers clean (Async Handler).

**Step 2: Setup Global App Security Basics**
*   **What to work on:** Update `src/app.js` to include basic security middleware.
*   **How to implement:** Import and apply `cors()` and `helmet()` before defining any routes.
*   **Why:** Protects against Cross-Site Scripting (XSS) and allows the frontend to communicate with your API.

---

### Phase 2: Task Model & Database Relationship
We need a place to store tasks in the database and tie them securely to individual users.

**Step 3: Define the Task Mongoose Schema**
*   **What to work on:** Create `src/models/Task.js`.
*   **How to implement:** Define a Mongoose schema with `title` (String, required), `description` (String), `status` (Enum: pending, in-progress, completed), and `dueDate` (Date).
*   **Why:** Tells MongoDB exactly how task data should be structured.

**Step 4: Establish the User-Task Database Relationship**
*   **What to work on:** Update `src/models/Task.js` to link tasks to users.
*   **How to implement:** Add a `user` field of type `mongoose.Schema.Types.ObjectId` with `ref: 'User'` and `required: true`.
*   **Why:** Ensures every task is owned by a specific user, preventing users from viewing other people's data.

---

### Phase 3: Data Validation
Never trust data coming from the client. We will use Zod to validate data before it hits our database.

**Step 5: Create Zod Schema for Task Creation**
*   **What to work on:** Create `src/schemas/task.schema.js`.
*   **How to implement:** Define `createTaskSchema` validating `title` (min length), `status`, and `dueDate`.
*   **Why:** Validates the request body so controllers only deal with guaranteed clean data.

**Step 6: Create Zod Schema for Task Update**
*   **What to work on:** Add `updateTaskSchema` to `src/schemas/task.schema.js`.
*   **How to implement:** Similar to creation, but using `.optional()` for fields since a user might only update the title or only the status.

---

### Phase 4: Core Task Controllers (CRUD Operations)
This is the heart of the API where the business logic lives.

**Step 7: Implement `createTask` Controller**
*   **What to work on:** Create `src/controllers/task.controller.js` and write the `createTask` function.
*   **How to implement:** Extract `req.body` and attach `user: req.user.id` (which comes from the auth middleware). Save using `Task.create()`.
*   **Why:** Allows users to add new tasks.

**Step 8: Implement `getTasks` Controller (Read All)**
*   **What to work on:** Add `getTasks` function in the controller.
*   **How to implement:** Use `Task.find({ user: req.user.id })`.
*   **Why:** Fetches all tasks belonging **only** to the currently logged-in user.

**Step 9: Implement `getTaskById` Controller (Read Single)**
*   **What to work on:** Add `getTaskById` function.
*   **How to implement:** Use `Task.findOne({ _id: req.params.id, user: req.user.id })`. 
*   **Why:** Retrieves a specific task, ensuring the user actually owns it before returning it.

**Step 10: Implement `updateTask` Controller**
*   **What to work on:** Add `updateTask` function.
*   **How to implement:** Use `Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true })`.
*   **Why:** Updates a task and returns the newly updated document.

**Step 11: Implement `deleteTask` Controller**
*   **What to work on:** Add `deleteTask` function.
*   **How to implement:** Use `Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })`.
*   **Why:** Safely removes a task from the database.

---

### Phase 5: Routing & Protection
Connecting our controllers to actual HTTP endpoints and protecting them.

**Step 12: Wire up Task Routes**
*   **What to work on:** Create `src/routes/task.router.js`.
*   **How to implement:** Create an Express router and map the GET, POST, PUT, DELETE HTTP methods to their respective controller functions.

**Step 13: Apply Auth & Validation Middleware**
*   **What to work on:** Update `src/routes/task.router.js` and `app.js`.
*   **How to implement:** Apply the `protect` middleware to all routes in `task.router.js`. Apply the Zod validation middleware to POST and PUT routes. Link the router in `app.js` as `/api/tasks`.
*   **Why:** Ensures users must be logged in and send valid data to use the task endpoints.

---

### Phase 6: Advanced API Features
Making the API robust enough for real-world scenarios where users have hundreds of tasks.

**Step 14: Implement Filtering in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller.
*   **How to implement:** Read `req.query.status`. If it exists, add it to the Mongoose `find()` query object.
*   **Why:** Allows clients to request `/api/tasks?status=completed`.

**Step 15: Implement Sorting in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller.
*   **How to implement:** Read `req.query.sortBy` (e.g., `dueDate:asc`). Split the string and apply it using Mongoose's `.sort()` method.
*   **Why:** Allows ordering tasks by date or creation time.

**Step 16: Implement Pagination in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller.
*   **How to implement:** Extract `page` and `limit` from `req.query`. Calculate `skip = (page - 1) * limit`. Apply `.skip()` and `.limit()` to the Mongoose query.
*   **Why:** Prevents the server from sending massive payloads. If a user has 10,000 tasks, we send them 10 at a time.

---

### Phase 7: Refactoring & Error Handling
Cleaning up our code and making error responses consistent.

**Step 17: Create Global Error Handler Middleware**
*   **What to work on:** Create `src/middleware/error.middleware.js`.
*   **How to implement:** Write an Express error-handling middleware function `(err, req, res, next)`. Format Mongoose errors (duplicate keys, cast errors) into a standard JSON response. Include this at the very end of `app.js`.

**Step 18: Refactor Controllers with Async Handler**
*   **What to work on:** Update all controllers (`auth.controller.js` and `task.controller.js`).
*   **How to implement:** Wrap all controller functions in `express-async-handler`. Delete all `try/catch` blocks.
*   **Why:** Dramatically cleans up the codebase. Any thrown errors will automatically be passed to our new Global Error Handler.

---

### Phase 8: Production Readiness
Final touches to secure the application.

**Step 19: Apply Rate Limiting**
*   **What to work on:** Update `src/app.js`.
*   **How to implement:** Use `express-rate-limit` to limit requests to `/api` (e.g., max 100 requests per 15 minutes per IP).
*   **Why:** Prevents brute-force attacks and Denial of Service (DoS) attempts.

**Step 20: Final Testing & Walkthrough**
*   **What to work on:** API Testing.
*   **How to implement:** We will manually test the complete lifecycle: Register -> Login -> Create Task -> Get Tasks (with pagination/filters) -> Update -> Delete.
*   **Why:** Validates that all pieces of the architecture work together seamlessly.

## Verification Plan

We will verify our progress periodically during the execution phase by testing the API endpoints using Thunder Client, Postman, or cURL to ensure that:
1. Data is accurately inserted and fetched from the MongoDB database.
2. The authentication system successfully blocks unauthorized access to tasks.
3. Pagination and filtering logic successfully manipulate the returned data.

---

## Phase 9: Frontend Integration & Portfolio Project (Future)

After completing Steps 1-20, the next phase will be building a React/Vue frontend that consumes this REST API. This transforms TaskForge from a backend exercise into a **full-stack portfolio project** ready for your resume.

**Frontend Phase Goals:**
- Build a task management UI with login, registration, and task CRUD
- Integrate filtering, sorting, and pagination into the UI
- Handle authentication (store JWT, refresh tokens, logout)
- Deploy both backend and frontend
- Document the entire project for potential employers

This will demonstrate end-to-end thinking: API design from the consumer's perspective, state management, error handling on the client side, and production deployment.
