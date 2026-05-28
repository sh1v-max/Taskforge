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

**Step 1: Codebase Review & Package Installation (Security)**
*   **What to work on:** Review existing `package.json` and install security dependencies.
*   **How to implement:** Run `npm i cors helmet express-rate-limit`.
*   **Why:** These packages are crucial for security (CORS protects frontend communication, Helmet prevents XSS attacks, Rate Limiting prevents brute-force attacks).
*   **Note:** We'll install `express-async-handler` later (Step 17.1) when we need to refactor controllers. This follows "just-in-time dependency installation"—only install when you're ready to use it.

**Step 2: Setup Global App Security Basics**
*   **What to work on:** Update `src/app.js` to include basic security middleware.
*   **How to implement:** Import and apply `cors()` and `helmet()` before defining any routes. Example:
     ```javascript
     const cors = require('cors');
     const helmet = require('helmet');
     
     app.use(helmet());
     app.use(cors());
     ```
*   **Why:** Protects against Cross-Site Scripting (XSS) and allows the frontend to communicate with your API.

### Testing Checkpoint: Phase 1
**After Step 2, test that the server runs:**
1. Run `npm run dev`
2. You should see: `Server running on port 5000` (or your configured port)
3. **Quick curl test:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   You should get a response (if you have a health endpoint) or a 404 (which is fine—proves the server is running)
4. **In Postman:**
   - Click "Health Check" request
   - Send it
   - You should get a response (200 or 404, both mean the server is working)
5. Commit: `git commit -m "Step 1-2: Add security middleware (CORS, Helmet)"`

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
Never trust data coming from the client. We will use Zod to validate **both** request bodies AND query parameters before they hit our database.

**Step 5: Create Zod Schema for Task Creation**
*   **What to work on:** Create `src/schemas/task.schema.js`.
*   **How to implement:** Define `createTaskSchema` validating:
     - `title` (String, min length 1)
     - `description` (String, optional)
     - `status` (Enum: "pending" | "in-progress" | "completed")
     - `dueDate` (Date, optional)
*   **Why:** Validates the request body so controllers only deal with guaranteed clean data.

**Step 6: Create Zod Schema for Task Update**
*   **What to work on:** Add `updateTaskSchema` to `src/schemas/task.schema.js`.
*   **How to implement:** Similar to creation, but using `.optional()` for fields since a user might only update the title or only the status.
*   **Why:** Partial updates should validate only the fields being changed.

**Step 6.5: Create Zod Schema for Query Parameters**
*   **What to work on:** Add `tasksQuerySchema` to `src/schemas/task.schema.js`.
*   **How to implement:** Define a schema for `/api/tasks` query parameters:
     ```javascript
     const tasksQuerySchema = z.object({
       status: z.enum(['pending', 'in-progress', 'completed']).optional(),
       sortBy: z.string().optional(), // e.g., "dueDate:asc"
       page: z.coerce.number().min(1).optional(),
       limit: z.coerce.number().min(1).max(100).optional(),
     });
     ```
*   **Why:** Validates query strings like `/api/tasks?status=completed&page=1&limit=10`. Without validation, a malicious user could send invalid values that crash your server.

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
*   **How to implement:** Create an Express router and map the GET, POST, PUT, DELETE HTTP methods to their respective controller functions:
     ```javascript
     const express = require('express');
     const router = express.Router();
     const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/task.controller');
     
     router.post('/', createTask);
     router.get('/', getTasks);
     router.get('/:id', getTaskById);
     router.put('/:id', updateTask);
     router.delete('/:id', deleteTask);
     
     module.exports = router;
     ```

**Step 13: Create Validation Middleware**
*   **What to work on:** Create `src/middleware/validate.middleware.js`.
*   **How to implement:** Write a reusable validation middleware that takes a Zod schema and validates request body or query params:
     ```javascript
     const validateBody = (schema) => (req, res, next) => {
       const result = schema.safeParse(req.body);
       if (!result.success) {
         return res.status(400).json({ error: result.error.errors });
       }
       req.validatedData = result.data;
       next();
     };
     
     const validateQuery = (schema) => (req, res, next) => {
       const result = schema.safeParse(req.query);
       if (!result.success) {
         return res.status(400).json({ error: result.error.errors });
       }
       req.query = result.data;
       next();
     };
     
     module.exports = { validateBody, validateQuery };
     ```
*   **Why:** Centralizes validation logic. You can reuse `validateBody()` and `validateQuery()` across all routes without repeating code.

**Step 13.5: Apply Auth & Validation Middleware**
*   **What to work on:** Update `src/routes/task.router.js` and `app.js`.
*   **How to implement:** Import the `protect` middleware and validation middleware, then apply them:
     ```javascript
     const { protect } = require('../middleware/auth.middleware');
     const { validateBody, validateQuery } = require('../middleware/validate.middleware');
     const { createTaskSchema, updateTaskSchema, tasksQuerySchema } = require('../schemas/task.schema');
     
     // Protect all task routes
     router.use(protect);
     
     // Apply validation to specific routes
     router.post('/', validateBody(createTaskSchema), createTask);
     router.get('/', validateQuery(tasksQuerySchema), getTasks);
     router.put('/:id', validateBody(updateTaskSchema), updateTask);
     
     // Link in app.js
     app.use('/api/tasks', router);
     ```
*   **Why:** Ensures users must be logged in (protect middleware) AND send valid data (validate middleware). This creates multiple layers of security.

### Testing Checkpoint: Phase 5 (After Step 13.5)
**Now we can test CRUD operations! Here's what to verify in Postman:**

1. **Auth Flow:**
   - Click "Register" → Send (should get 201 + token)
   - Copy the token from response
   - Click Variables → Set `authToken` to your token

2. **Create Task (POST /api/tasks):**
   - Click "Create Task" → Send
   - Expected: 201 status + response shows `_id`, `user`, `title`, `status`, etc.
   - ❌ Error? Check validation schema, controller logic

3. **Get All Tasks (GET /api/tasks):**
   - Click "Get All Tasks" → Send
   - Expected: 200 status + returns an array (even if empty)
   - Verify: Only YOUR tasks are returned (check user ID matches)

4. **Get Task by ID (GET /api/tasks/:id):**
   - First, create a task and copy its `_id`
   - Update the request URL to use that ID
   - Click "Get Task by ID" → Send
   - Expected: 200 + returns that specific task

5. **Unauthorized Access Test:**
   - Clear the `authToken` variable (set to empty string)
   - Try "Create Task" again → Send
   - Expected: 401 Unauthorized ✅ (proves auth middleware works)

6. **Invalid Data Test:**
   - In "Create Task" body, remove the `title` field
   - Click Send
   - Expected: 400 Bad Request with error message ✅ (proves validation works)

**Commit after passing all tests:**
```bash
git commit -m "Step 12-13: Create task routes with auth and validation middleware"
```

---

### Phase 6: Advanced API Features
Making the API robust enough for real-world scenarios where users have hundreds of tasks.

**Step 14: Implement Filtering in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller.
*   **How to implement:** Read `req.query.status` (already validated by the `validateQuery` middleware from Step 13.5). Add it to the Mongoose `find()` query object if it exists:
     ```javascript
     const getTasks = async (req, res) => {
       const query = { user: req.user.id };
       
       if (req.query.status) {
         query.status = req.query.status;
       }
       
       const tasks = await Task.find(query);
       res.json(tasks);
     };
     ```
*   **Why:** Allows clients to request `/api/tasks?status=completed` and receive only completed tasks. The validation middleware ensures `status` is one of the allowed values.

**Step 15: Implement Sorting in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller to add sorting.
*   **How to implement:** Read `req.query.sortBy` (e.g., `dueDate:asc` or `createdAt:desc`). Parse it and apply Mongoose's `.sort()` method:
     ```javascript
     let query = Task.find(baseQuery);
     
     if (req.query.sortBy) {
       const [field, direction] = req.query.sortBy.split(':');
       query = query.sort({ [field]: direction === 'desc' ? -1 : 1 });
     }
     ```
*   **Why:** Allows ordering tasks by date, name, or creation time. A frontend can let users click a header to sort.

**Step 16: Implement Pagination in `getTasks`**
*   **What to work on:** Modify the `getTasks` controller to add pagination.
*   **How to implement:** Extract `page` and `limit` from `req.query` (already validated). Calculate skip and apply to the query:
     ```javascript
     const page = req.query.page || 1;
     const limit = req.query.limit || 10;
     const skip = (page - 1) * limit;
     
     const tasks = await Task.find(query)
       .skip(skip)
       .limit(limit);
     
     res.json({ tasks, page, limit, total: await Task.countDocuments(query) });
     ```
*   **Why:** Prevents the server from sending massive payloads. If a user has 10,000 tasks, we send them 10 at a time. Always include `total` count so the frontend knows how many pages exist.

### Testing Checkpoint: Phase 6 (After Step 16)
**Test advanced features in Postman:**

1. **Create 5+ test tasks** with different statuses:
   - "Buy groceries" → status: "pending"
   - "Finish project" → status: "in-progress"
   - "Deploy API" → status: "completed"
   - etc.

2. **Test Filtering:**
   - Click "Get All Tasks - With Filter"
   - Send (should only return pending tasks)
   - In Postman, manually change `?status=in-progress` and test
   - ✅ Verify: Only tasks with that status are returned

3. **Test Sorting:**
   - Click "Get All Tasks - With Sorting"
   - Send (should return tasks sorted by dueDate ascending)
   - Manually test `?sortBy=createdAt:desc` (reverse order)
   - ✅ Verify: Tasks are in the correct order

4. **Test Pagination:**
   - Click "Get All Tasks - With Pagination"
   - Send with `?page=1&limit=5` (should return first 5 tasks)
   - Change to `?page=2&limit=5` (should return next 5 tasks)
   - ✅ Verify: Response includes `page`, `limit`, `total`, and correct number of tasks

5. **Combined Test:**
   - Try `/api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=10`
   - All three features should work together
   - ✅ Verify: Tasks are filtered, sorted, AND paginated

6. **Update Task:**
   - Click "Update Task"
   - Change status from "pending" to "completed"
   - Send
   - Expected: 200 + updated task returned

7. **Delete Task:**
   - Click "Delete Task"
   - Send
   - Expected: 200 or 204 (no content)
   - Then click "Get All Tasks" and verify the task is gone

**Commit after all tests pass:**
```bash
git commit -m "Step 14-16: Add filtering, sorting, pagination to getTasks"
```

---

### Phase 7: Refactoring & Error Handling
Cleaning up our code and making error responses consistent.

**Step 17: Create Global Error Handler Middleware**
*   **What to work on:** Create `src/middleware/error.middleware.js`.
*   **How to implement:** Write an Express error-handling middleware function that catches all thrown errors:
     ```javascript
     const errorHandler = (err, req, res, next) => {
       // Format Mongoose validation errors
       if (err.name === 'ValidationError') {
         return res.status(400).json({
           status: 'error',
           message: 'Validation Error',
           errors: Object.values(err.errors).map(e => e.message)
         });
       }
       
       // Format Mongoose cast errors (invalid ID)
       if (err.name === 'CastError') {
         return res.status(400).json({
           status: 'error',
           message: 'Invalid ID format'
         });
       }
       
       // Generic error
       return res.status(500).json({
         status: 'error',
         message: err.message || 'Server Error'
       });
     };
     
     // Add at the VERY END of app.js
     app.use(errorHandler);
     ```
*   **Why:** Centralizes error handling. Instead of catching errors in every controller, you throw them and this middleware formats them consistently.

**Step 17.5: Install Express Async Handler**
*   **What to work on:** Install the async handler package.
*   **How to implement:** Run `npm i express-async-handler`.
*   **Why:** This is a "just-in-time" install—we install when we're ready to use it, not at the beginning. This keeps your dependencies clean.

**Step 18: Refactor Controllers with Async Handler**
*   **What to work on:** Update all controllers (`auth.controller.js` and `task.controller.js`).
*   **How to implement:** Wrap all controller functions in `express-async-handler`:
     ```javascript
     const asyncHandler = require('express-async-handler');
     
     const createTask = asyncHandler(async (req, res) => {
       // No try/catch needed! Errors are automatically caught
       const task = await Task.create({
         ...req.body,
         user: req.user.id
       });
       res.status(201).json(task);
     });
     ```
   Delete all `try/catch` blocks from existing controllers.
*   **Why:** Dramatically cleans up the codebase. Any thrown errors (from Mongoose, Zod, or anywhere else) are automatically passed to the Global Error Handler you created in Step 17.

**Step 18.5: (Optional) Add Unit Tests**
*   **What to work on:** Create `src/tests/` or `__tests__/` folder with test files.
*   **How to implement:** Write tests for:
     - Task schema validation (does Zod reject invalid data?)
     - Task model (does Task.create() work? Does it assign the user correctly?)
     - Controller logic (does getTasks() return only the user's tasks?)
   Use a testing framework like Jest or Mocha + Chai.
*   **Why:** Unit tests catch bugs early and give you confidence when refactoring. They also document expected behavior.

---

### Phase 8: Production Readiness
Final touches to secure the application and document your API.

**Step 19: Apply Rate Limiting**
*   **What to work on:** Update `src/app.js` to add rate limiting.
*   **How to implement:** Use `express-rate-limit` to limit requests to `/api`:
     ```javascript
     const rateLimit = require('express-rate-limit');
     
     const apiLimiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // max 100 requests per windowMs
       message: 'Too many requests from this IP, please try again later.',
       standardHeaders: true,
       legacyHeaders: false,
     });
     
     app.use('/api/', apiLimiter);
     ```
*   **Why:** Prevents brute-force attacks on login, DoS attacks, and protects your database from being hammered.

**Step 19.5: Final Testing & Walkthrough**
*   **What to work on:** Complete lifecycle testing using Postman.
*   **How to implement:** Test the entire user journey from registration to deletion:
     
     1. **Register** → Create a new user
        - Click "Register" in Postman
        - Expected: 201 + receives `token`
        - Copy token to `authToken` variable
     
     2. **Login** → Verify you can log in
        - Click "Login" in Postman
        - Expected: 200 + `token` returned
     
     3. **Create Multiple Tasks** → Add 5+ tasks with different statuses
        - Click "Create Task" multiple times
        - Change title/status/dueDate each time
        - Expected: Each returns 201 + the created task
     
     4. **Test Full Query String** → Advanced filtering
        - Click "Get All Tasks - With Filter"
        - Try: `/api/tasks?status=pending&sortBy=dueDate:asc&page=1&limit=5`
        - Expected: 200 + filtered, sorted, paginated results
     
     5. **Update a Task** → Modify a task
        - Click "Update Task"
        - Change status or description
        - Expected: 200 + returns updated task with new values
     
     6. **Delete a Task** → Remove a task
        - Click "Delete Task"
        - Expected: 200 or 204
        - Verify: "Get All Tasks" no longer shows this task
     
     7. **Verify Error Handling** → Test auth and validation
        - Clear `authToken` (set to empty)
        - Try "Create Task" → Expected: 401 Unauthorized
        - Try "Get Tasks" → Expected: 401 Unauthorized
     
     8. **Verify Rate Limiting** (if Step 19 is done)
        - Send "Create Task" rapidly 100+ times in quick succession
        - After hitting the limit → Expected: 429 Too Many Requests

*   **Why:** Validates that all pieces work together seamlessly. If all tests pass, your API is production-ready.

### Testing Checklist: Phase 7-8 (After Step 19.5)

Before moving to Step 20, ensure all these pass in Postman:

- ✅ Register endpoint (201, returns token)
- ✅ Login endpoint (200, returns token)
- ✅ Create Task (201, validates required fields, assigns to current user)
- ✅ Get All Tasks (200, returns only current user's tasks)
- ✅ Get Task by ID (200, validates user ownership, returns 404 if not found)
- ✅ Update Task (200, validates user ownership, only updates sent fields)
- ✅ Delete Task (200/204, validates user ownership, task is removed)
- ✅ Filtering (returns only tasks matching status)
- ✅ Sorting (tasks are in correct order)
- ✅ Pagination (returns correct number of items, includes total count)
- ✅ Auth (401 when no token, 401 when invalid token)
- ✅ Validation (400 when required fields missing)
- ✅ Error Response Format (all errors return consistent JSON)

**Commit when all tests pass:**
```bash
git commit -m "Step 17-19: Add error handling, async handler, rate limiting"
```

**Step 20: API Documentation (Swagger/OpenAPI)**
*   **What to work on:** Create comprehensive API documentation using Swagger/OpenAPI.
*   **How to implement:** 
     1. Install the package: `npm i swagger-ui-express swagger-jsdoc`
     2. Create `src/config/swagger.js` with your API definition:
        ```javascript
        const swaggerJsdoc = require('swagger-jsdoc');
        
        const options = {
          definition: {
            openapi: '3.0.0',
            info: {
              title: 'TaskForge API',
              version: '1.0.0',
              description: 'A task management REST API'
            },
            servers: [
              { url: 'http://localhost:5000', description: 'Development server' }
            ]
          },
          apis: ['./src/routes/*.js'], // Scan route files for JSDoc comments
        };
        
        module.exports = swaggerJsdoc(options);
        ```
     3. Add Swagger UI to `app.js`:
        ```javascript
        const swaggerUi = require('swagger-ui-express');
        const swaggerSpec = require('./config/swagger');
        
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        ```
     4. Document each route with JSDoc comments in your route files:
        ```javascript
        /**
         * @openapi
         * /api/tasks:
         *   post:
         *     summary: Create a new task
         *     tags: [Tasks]
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               title: { type: string }
         *               description: { type: string }
         *               status: { type: string, enum: [pending, in-progress, completed] }
         *     responses:
         *       201:
         *         description: Task created successfully
         */
        router.post('/', createTask);
        ```
*   **Why:** API documentation is **not optional**. Frontend developers need to understand:
     - What endpoints exist
     - What data each endpoint expects
     - What data it returns
     - Which endpoints require authentication
     
   Swagger generates **interactive documentation** at `/api-docs` where developers can test endpoints without Postman. This is how you'll share your API with frontend teams or employers.

## 📋 Verification Plan

After completing each phase, you'll verify using the **Postman Collection** you imported in Step 0:

**Phase 1 (Security):** Verify CORS and Helmet are working
- Access API from different origins
- Check response headers for security headers

**Phase 2-3 (Models & Validation):** Verify schema creation
- Check MongoDB shows the Task collection
- Test creating an invalid task (should fail validation)

**Phases 4-6 (CRUD & Advanced Features):** Verify each endpoint
- ✅ Status codes: 200, 201, 400, 401, 404, 500 (as appropriate)
- ✅ Response bodies match expected structure
- ✅ Auth blocks unauthorized requests (401 without token)
- ✅ Data relationships work (tasks belong to the logged-in user only)
- ✅ Filtering works (`?status=completed` returns only completed tasks)
- ✅ Sorting works (`?sortBy=dueDate:asc` orders by due date)
- ✅ Pagination works (returns correct number of items with page/limit)

**Phase 7-8 (Error Handling & Production):** Verify robustness
- Test error responses are consistent JSON format
- Test rate limiting (send 100+ requests, should get 429 Too Many Requests)
- Test with edge cases (empty fields, very long strings, special characters)

**Step 20 (Documentation):** Verify Swagger UI
- Navigate to `http://localhost:5000/api-docs`
- Try executing requests directly from Swagger UI
- Verify all endpoints are documented

---

## 🎓 Learning Outcomes

After completing this 20-step plan, you'll understand:

1. **Security First** — CORS, Helmet, authentication, rate limiting
2. **Data Validation** — Zod schemas for both body and query parameters
3. **Database Design** — User-Task relationships, indexing for performance
4. **Clean Architecture** — MVC pattern, middleware, separation of concerns
5. **Error Handling** — Centralized error middleware, consistent error responses
6. **Advanced Querying** — Filtering, sorting, pagination (real-world requirements)
7. **API Documentation** — Swagger/OpenAPI (essential for frontend integration)
8. **Production Readiness** — Rate limiting, logging, error tracking

---

## 🚀 Phase 9: Frontend Integration & Portfolio Project (Future)

After completing Steps 1-20, you'll have a **production-ready REST API**. The next phase will be building a React/Vue/Next.js frontend that consumes this API. This transforms TaskForge into a **full-stack portfolio project** ready for your resume.

**Frontend Phase Goals:**
- Build a responsive task management UI with React/Vue
- Implement login, registration, and task CRUD flows
- Integrate filtering, sorting, and pagination into the UI
- Handle authentication (store JWT, refresh tokens, logout)
- Add real-time features (optional: WebSockets for live updates)
- Deploy both backend and frontend to production (Heroku, Vercel, AWS, etc.)
- Document the entire project for potential employers

**Why This Matters:** This demonstrates end-to-end thinking—you understand API design from the **consumer's perspective**, state management on the client side, error handling, deployment, and how to build products that work in the real world. That's what employers want to see.

---

## 📖 Commit Message Format

After completing each step, commit with clear messages:

```bash
# Format
git commit -m "Step X: [Brief Description]"

# Examples
git commit -m "Step 2: Add CORS and Helmet security middleware"
git commit -m "Step 7: Implement createTask controller"
git commit -m "Step 16: Add pagination to getTasks"
git commit -m "Step 20: Add Swagger API documentation"
```

This creates a clean history where you (or employers) can see exactly what was implemented when.
