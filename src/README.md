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
