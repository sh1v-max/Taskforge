# TaskForge API

TaskForge API is a robust, modular backend built with Node.js, Express, and MongoDB. It currently implements a secure authentication system and is designed to be extended into a full-featured task management platform.

## Current Progress

So far, we have implemented:
- **Secure Authentication**: JWT-based login and registration.
- **Password Protection**: Automatic hashing using `bcryptjs`.
- **Data Validation**: Strict request validation using `Zod`.
- **Modular Architecture**: Clean separation of concerns (MVC pattern).

## Getting Started

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

## Project Roadmap

We are following a **20-step learning plan** to build out the rest of the application, including task CRUD, pagination, filtering, and advanced security. You can find the detailed roadmap in [20_steps_learning_plan.md](./20_steps_learning_plan.md).

## Project Structure

For a deep dive into how each part of the application works, check the README files in the `src/` subdirectories:
- [Controllers](./src/controllers/README.md)
- [Middleware](./src/middleware/README.md)
- [Models](./src/models/README.md)
- [Routes](./src/routes/README.md)
- [Schemas](./src/schemas/README.md)
- [Utils](./src/utils/README.md)
