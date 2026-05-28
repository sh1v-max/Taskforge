# TaskForge API

TaskForge API is a robust, modular backend built with Node.js, Express, and MongoDB. It currently implements a secure authentication system and is designed to be extended into a full-featured task management platform.

## 🎯 Mission

Build a **production-ready REST API** following best practices in:
- Security (authentication, CORS, rate limiting, helmet)
- Data validation (Zod schemas for body + query params)
- Clean architecture (MVC pattern with separation of concerns)
- Error handling (centralized error middleware)
- API documentation (Swagger/OpenAPI for frontend integration)

## ✅ Current Progress

So far, we have implemented:
- **Secure Authentication**: JWT-based login and registration.
- **Password Protection**: Automatic hashing using `bcryptjs`.
- **Data Validation**: Strict request validation using `Zod`.
- **Modular Architecture**: Clean separation of concerns (MVC pattern).

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas)

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your credentials (see `.env.example`).
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Implementation Strategy

We follow a **20-step structured learning plan** that builds skills progressively:

1. **Testing First** (Step 0): Set up Postman to validate each feature as we build
2. **Security Early** (Steps 1-2): CORS, Helmet, and auth middleware foundation
3. **Data Layer** (Steps 3-4): Task model with user relationships
4. **Validation** (Steps 5-6): Zod schemas for request body AND query parameters
5. **Business Logic** (Steps 7-11): Core CRUD controllers
6. **Routing** (Steps 12-13): Wire up endpoints with middleware protection
7. **Advanced Queries** (Steps 14-16): Filtering, sorting, pagination
8. **Error Handling** (Steps 17-18): Centralized error middleware + async handler refactor
9. **Production Ready** (Steps 19): Rate limiting
10. **Documentation** (Step 20): Swagger/OpenAPI API docs for frontend developers

### Key Learning Principles

- **Just-In-Time Installation**: Install dependencies only when you need them (e.g., `express-async-handler` before Step 17)
- **Test After Each Step**: Use Postman collection to verify status codes, responses, and data relationships
- **Validation at Boundaries**: Validate user input (both body and query params), trust internal code
- **Unit Testing**: Write tests for models, schemas, and controller logic as you build
- **Documentation Matters**: API docs are not optional—they're how frontend devs understand your API

### Commit Strategy

After completing **each step**, create a git commit with a clear message:
```bash
git add .
git commit -m "Step X: [Brief description]"
```

This creates a clean history where you can see exactly what was implemented when.

## 📚 Full Roadmap

Follow the **[20-Step Implementation & Learning Plan](./20_steps_learning_plan.md)** for detailed instructions on each phase, including:
- What to build
- How to implement it
- Why it matters
- How to test it

## 📁 Project Structure

For a deep dive into how each part of the application works, check the README files in the `src/` subdirectories:
- [Controllers](./src/controllers/README.md) — Business logic for each endpoint
- [Middleware](./src/middleware/README.md) — Auth protection, validation, error handling
- [Models](./src/models/README.md) — Database schemas (User, Task)
- [Routes](./src/routes/README.md) — HTTP endpoint definitions
- [Schemas](./src/schemas/README.md) — Zod validation schemas
- [Utils](./src/utils/README.md) — Helper functions and utilities

## 🔗 API Testing

We use **three complementary testing approaches** to verify the API works:

1. **Postman Collection** — Interactive testing with detailed inspection
   - Download and import `TaskForge-API-Collection.json`
   - Organized by phase with detailed testing notes
   - Environment variables (`baseURL`, `authToken`) for easy reuse

2. **Automated Test Script** — Quick verification after each phase
   - Run `node test-api.js` to test all critical endpoints
   - Pass/fail output tells you exactly what's working
   - Run after implementing each phase

3. **Manual curl Testing** — Ad-hoc quick checks
   - Simple commands to verify endpoints
   - Useful for debugging specific issues

👉 **See [TESTING-GUIDE.md](./TESTING-GUIDE.md) for detailed testing instructions by phase.**

## 🎓 What You'll Learn

By completing this plan, you'll understand:
- How to structure a professional Node.js backend
- Authentication and authorization patterns
- Data validation (both input and output)
- Database relationships and Mongoose best practices
- Error handling strategies
- API versioning and documentation
- Security best practices (CORS, helmet, rate limiting, XSS prevention)
- How to prepare an API for frontend integration
