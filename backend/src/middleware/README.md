# Middleware

Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application’s request-response cycle.

## Files

### `auth.middleware.js`
Contains logic to protect routes and verify the identity of the requester.
- **`protect`**: 
    - Extracts the JWT from the `Authorization` header (`Bearer <token>`).
    - Verifies the token using the `JWT_SECRET`.
    - Fetches the user from the database (excluding the password) and attaches it to `req.user`.
    - If the token is missing or invalid, it returns a `401 Unauthorized` response.

### `validate.js`
A generic validation middleware that uses Zod schemas.
- **`validate`**:
    - Takes a Zod schema as an argument.
    - Validates `req.body` against that schema.
    - If validation fails, it returns a `400 Bad Request` with detailed error messages.
    - If validation succeeds, it calls `next()`.
